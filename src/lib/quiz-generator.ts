import Anthropic from "@anthropic-ai/sdk";
import type { TrendItem, DailyQuiz, QuizQuestion } from "@/types/quiz";
import { getTodayJST } from "./utils";

export async function generateQuiz(trends: TrendItem[]): Promise<DailyQuiz> {
  const client = new Anthropic();
  const today = getTodayJST();
  const selectedTrends = trends.slice(0, 5);

  const trendContext = selectedTrends
    .map((t, i) => {
      const newsContext =
        t.newsItems.length > 0
          ? t.newsItems.map((n) => `  - ${n.title} (${n.source})`).join("\n")
          : "  - 関連ニュースなし";
      return `${i + 1}. キーワード: ${t.title}\n  検索ボリューム: ${t.approxTraffic}\n  関連ニュース:\n${newsContext}`;
    })
    .join("\n\n");

  const prompt = `あなたは日本のトレンドクイズ作成者です。
以下の本日(${today})のトレンドキーワードと関連ニュースに基づいて、4択クイズを5問作成してください。

${trendContext}

以下のJSON形式で回答してください（JSONのみ、余分なテキストやマークダウンは不要）:
{
  "questions": [
    {
      "id": 1,
      "trendKeyword": "トレンドキーワード",
      "question": "クイズの質問文",
      "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
      "correctIndex": 0,
      "explanation": "正解の解説"
    }
  ]
}

ルール:
- 各質問は対応するトレンドキーワードと関連ニュースに基づくこと
- 質問は日本語で作成すること
- 4つの選択肢のうち1つだけが正解であること
- 不正解の選択肢もそれらしいものにすること
- 解説は簡潔で分かりやすいこと
- 必ず5問作成すること`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  // Strip markdown code fences if present
  let jsonText = content.text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText) as { questions: QuizQuestion[] };

  // Shuffle choices so the correct answer isn't always A
  const shuffledQuestions = parsed.questions.map((q) => {
    const correctAnswer = q.choices[q.correctIndex];
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const shuffledChoices = indices.map((i) => q.choices[i]);
    const newCorrectIndex = shuffledChoices.indexOf(correctAnswer);
    return { ...q, choices: shuffledChoices, correctIndex: newCorrectIndex };
  });

  return {
    date: today,
    generatedAt: new Date().toISOString(),
    questions: shuffledQuestions,
  };
}
