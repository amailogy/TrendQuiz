"use client";

import type { DailyQuiz } from "@/types/quiz";

interface ResultsPageProps {
  quiz: DailyQuiz;
  answers: (number | null)[];
  score: number;
  onRetry: () => void;
  onBack?: () => void;
}

function getScoreRank(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return { rank: "S", text: "Perfect!" };
  if (ratio >= 0.8) return { rank: "A", text: "Excellent!" };
  if (ratio >= 0.6) return { rank: "B", text: "Great job!" };
  if (ratio >= 0.4) return { rank: "C", text: "Not bad!" };
  return { rank: "D", text: "Keep trying!" };
}

export function ResultsPage({ quiz, answers, score, onRetry, onBack }: ResultsPageProps) {
  const total = quiz.questions.length;
  const result = getScoreRank(score, total);
  const accuracy = Math.round((score / total) * 100);

  const shareText = encodeURIComponent(
    `TREND QUIZ: Scored ${score}/${total} (Rank ${result.rank}) #TrendQuiz`
  );

  return (
    <div className="animate-slideUp">
      {/* Score Section */}
      <div className="text-center mb-8">
        <p className="text-xs text-neutral-400 uppercase tracking-[0.2em] mb-4">
          Your Result
        </p>
        <div className="text-8xl font-black text-black leading-none mb-2">
          {result.rank}
        </div>
        <p className="text-neutral-500 text-lg font-medium mb-4">
          {result.text}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div>
            <span className="text-3xl font-black text-black">{score}</span>
            <span className="text-neutral-400 ml-1">/ {total}</span>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div>
            <span className="text-3xl font-black text-black">{accuracy}</span>
            <span className="text-neutral-400 ml-1">%</span>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="space-y-2 mb-8 max-h-96 overflow-y-auto pr-1">
        {quiz.questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctIndex;
          return (
            <div
              key={q.id}
              className={`p-3 rounded-lg text-sm border-l-[3px] ${
                isCorrect
                  ? "border-l-neutral-800 bg-neutral-50"
                  : "border-l-neutral-300 bg-neutral-50"
              }`}
            >
              <p className="font-medium text-neutral-700 mb-1">
                <span className="text-neutral-400 mr-1">Q{q.id}.</span>
                {q.question}
              </p>
              <p className="text-xs">
                {isCorrect ? (
                  <span className="text-neutral-600">{q.choices[q.correctIndex]}</span>
                ) : (
                  <>
                    <span className="text-neutral-400 line-through mr-2">
                      {q.choices[answers[i]!]}
                    </span>
                    <span className="text-neutral-700 font-medium">
                      {q.choices[q.correctIndex]}
                    </span>
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-black text-white font-bold text-center hover:bg-neutral-800 transition-colors active:scale-[0.98]"
        >
          Share on X
        </a>
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
        >
          Try Again
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-xl text-neutral-400 font-medium hover:text-neutral-600 transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
