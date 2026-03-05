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
  if (ratio === 1) return { rank: "S", text: "Perfect!", color: "from-yellow-400 to-amber-500" };
  if (ratio >= 0.8) return { rank: "A", text: "Excellent!", color: "from-blue-400 to-cyan-400" };
  if (ratio >= 0.6) return { rank: "B", text: "Great job!", color: "from-emerald-400 to-green-400" };
  if (ratio >= 0.4) return { rank: "C", text: "Not bad!", color: "from-purple-400 to-violet-400" };
  return { rank: "D", text: "Keep trying!", color: "from-slate-400 to-slate-500" };
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
        <p className="text-sm text-slate-500 uppercase tracking-[0.2em] mb-4">
          Your Result
        </p>
        <div
          className={`text-8xl font-black bg-gradient-to-br ${result.color} bg-clip-text text-transparent leading-none mb-2`}
        >
          {result.rank}
        </div>
        <p className="text-slate-300 text-lg font-medium mb-4">
          {result.text}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div>
            <span className="text-3xl font-black text-accent">{score}</span>
            <span className="text-slate-500 ml-1">/ {total}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-3xl font-black text-slate-200">{accuracy}</span>
            <span className="text-slate-500 ml-1">%</span>
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
                  ? "border-l-emerald-500 bg-emerald-500/5"
                  : "border-l-red-500 bg-red-500/5"
              }`}
            >
              <p className="font-medium text-slate-200 mb-1">
                <span className="text-slate-500 mr-1">Q{q.id}.</span>
                {q.question}
              </p>
              <p className="text-slate-500 text-xs">
                {isCorrect ? (
                  <span className="text-emerald-400">{q.choices[q.correctIndex]}</span>
                ) : (
                  <>
                    <span className="text-red-400 line-through mr-2">
                      {q.choices[answers[i]!]}
                    </span>
                    <span className="text-emerald-400">
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
          className="w-full py-3 px-4 rounded-xl font-bold text-center transition-all duration-300 active:scale-[0.98] text-white"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          }}
        >
          Share on X
        </a>
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 rounded-xl border border-white/10 text-slate-300 font-bold hover:bg-white/5 transition-colors"
        >
          Try Again
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-xl text-slate-600 font-medium hover:text-slate-400 transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
