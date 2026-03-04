"use client";

import type { DailyQuiz } from "@/types/quiz";

interface ResultsPageProps {
  quiz: DailyQuiz;
  answers: (number | null)[];
  score: number;
  onRetry: () => void;
}

function getScoreMessage(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return { text: "パーフェクト! すごい!", emoji: "crown" };
  if (ratio >= 0.8) return { text: "素晴らしい!", emoji: "star" };
  if (ratio >= 0.6) return { text: "なかなかの成績!", emoji: "thumbsup" };
  if (ratio >= 0.4) return { text: "まずまず!", emoji: "muscle" };
  return { text: "次回はがんばろう!", emoji: "fire" };
}

export function ResultsPage({ quiz, answers, score, onRetry }: ResultsPageProps) {
  const total = quiz.questions.length;
  const message = getScoreMessage(score, total);

  const shareText = encodeURIComponent(
    `トレンドクイズで ${score}/${total} 問正解しました! #トレンドクイズ`
  );

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {message.emoji === "crown" && "\u{1F451}"}
          {message.emoji === "star" && "\u{2B50}"}
          {message.emoji === "thumbsup" && "\u{1F44D}"}
          {message.emoji === "muscle" && "\u{1F4AA}"}
          {message.emoji === "fire" && "\u{1F525}"}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {message.text}
        </h2>
        <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {score} / {total}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {quiz.questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctIndex;
          return (
            <div
              key={q.id}
              className={`p-3 rounded-lg border text-sm ${
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{isCorrect ? "\u2705" : "\u274C"}</span>
                <div>
                  <p className="font-medium text-gray-800">
                    Q{q.id}. {q.question}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {isCorrect
                      ? `\u2192 ${q.choices[q.correctIndex]}`
                      : `\u00D7 ${q.choices[answers[i]!]} \u2192 \u25CB ${q.choices[q.correctIndex]}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-black text-white font-bold text-center hover:bg-gray-800 transition-colors"
        >
          X(Twitter)で共有する
        </a>
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
        >
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}
