import Anthropic from "@anthropic-ai/sdk";
import type { TrendItem, DailyQuiz, QuizQuestion } from "@/types/quiz";
import { getTodayJST } from "./utils";

const QUESTIONS_PER_BATCH = 10;
const TOTAL_QUESTIONS = 100;

function shuffleChoices(q: QuizQuestion): QuizQuestion {
  const correctAnswer = q.choices[q.correctIndex];
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledChoices = indices.map((i) => q.choices[i]);
  const newCorrectIndex = shuffledChoices.indexOf(correctAnswer);
  return { ...q, choices: shuffledChoices, correctIndex: newCorrectIndex };
}

function parseQuizResponse(text: string): QuizQuestion[] {
  let jsonText = text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(jsonText) as { questions: QuizQuestion[] };
    return parsed.questions;
  } catch {
    // Try to find valid JSON object
    const startIdx = jsonText.indexOf("{");
    if (startIdx >= 0) {
      for (let i = jsonText.length - 1; i >= startIdx; i--) {
        if (jsonText[i] === "}") {
          try {
            const parsed = JSON.parse(jsonText.substring(startIdx, i + 1)) as { questions: QuizQuestion[] };
            return parsed.questions;
          } catch {
            continue;
          }
        }
      }
    }
    throw new Error("Failed to parse quiz response JSON");
  }
}

// Attach source URLs from trend data based on trendKeyword match
function attachSourceUrls(
  questions: QuizQuestion[],
  trends: TrendItem[]
): QuizQuestion[] {
  return questions.map((q) => {
    const trend = trends.find((t) => t.title === q.trendKeyword);
    if (trend && trend.newsItems.length > 0) {
      const news = trend.newsItems[0];
      return { ...q, sourceUrl: news.url, sourceTitle: news.title };
    }
    return q;
  });
}

async function generateBatch(
  client: Anthropic,
  trends: TrendItem[],
  batchIndex: number,
  questionsPerBatch: number,
  today: string,
  previousQuestions: string[]
): Promise<QuizQuestion[]> {
  const startId = batchIndex * questionsPerBatch + 1;

  const trendContext = trends
    .map((t, i) => {
      const newsContext =
        t.newsItems.length > 0
          ? t.newsItems.map((n) => `  - ${n.title} (${n.source})`).join("\n")
          : "  - 関連ニュースなし";
      return `${i + 1}. キーワード: ${t.title}\n  検索ボリューム: ${t.approxTraffic}\n  関連ニュース:\n${newsContext}`;
    })
    .join("\n\n");

  // Build compact list of already-asked questions (last 50)
  let previousContext = "";
  if (previousQuestions.length > 0) {
    const recent = previousQuestions.slice(-50);
    previousContext = `\n\n【重要】以下はすでに出題済みです。同じ・類似の質問は避けてください:\n${recent.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;
  }

  const prompt = `あなたは日本のトレンドクイズ作成者です。
以下の本日(${today})のトレンドキーワードと関連ニュースに基づいて、4択クイズを${questionsPerBatch}問作成してください。

${trendContext}${previousContext}

以下のJSON形式で回答してください（JSONのみ、余分なテキストやマークダウンは不要）:
{
  "questions": [
    {
      "id": ${startId},
      "trendKeyword": "トレンドキーワード",
      "question": "クイズの質問文",
      "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "correctIndex": 0,
      "explanation": "正解の解説"
    }
  ]
}

ルール:
- 各トレンドキーワードから複数の異なる角度で出題すること
- 質問は日本語で作成すること
- 4つの選択肢のうち1つだけが正解であること
- 不正解の選択肢もそれらしいものにすること
- 解説は簡潔で分かりやすいこと
- 必ず${questionsPerBatch}問作成すること
- idは${startId}から連番にすること
- すでに出題済みの問題と同じ内容・同じ質問文は絶対に作らないこと`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  const questions = parseQuizResponse(content.text);
  return questions.map((q, i) => shuffleChoices({ ...q, id: startId + i }));
}

export async function generateQuiz(
  trends: TrendItem[]
): Promise<DailyQuiz> {
  const client = new Anthropic();
  const today = getTodayJST();
  const totalBatches = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_BATCH);

  const allQuestions: QuizQuestion[] = [];
  const askedQuestions: string[] = [];

  // Generate batches sequentially to pass previous questions for deduplication
  for (let i = 0; i < totalBatches; i++) {
    let batch: QuizQuestion[] | null = null;
    let retries = 0;
    while (!batch && retries < 3) {
      try {
        batch = await generateBatch(
          client,
          trends,
          i,
          QUESTIONS_PER_BATCH,
          today,
          askedQuestions
        );
      } catch (error) {
        retries++;
        console.error(`Batch ${i} attempt ${retries} failed:`, error);
        if (retries >= 3) throw error;
      }
    }
    if (batch) {
      allQuestions.push(...batch);
      askedQuestions.push(...batch.map((q) => q.question));
    }
  }

  // Attach source URLs from trend data
  const withSources = attachSourceUrls(allQuestions, trends);

  // Renumber all questions sequentially
  const numberedQuestions = withSources.map((q, i) => ({ ...q, id: i + 1 }));

  return {
    date: today,
    generatedAt: new Date().toISOString(),
    questions: numberedQuestions.slice(0, TOTAL_QUESTIONS),
  };
}
