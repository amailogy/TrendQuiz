"use client";

import { useEffect, useState } from "react";
import type { DailyQuiz } from "@/types/quiz";
import { Quiz } from "./Quiz";

export function QuizLoader() {
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch("/api/quiz");
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 mt-4 text-sm">
          クイズを読み込んでいます...
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">{"\u{23F3}"}</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          本日のクイズを準備中です
        </h2>
        <p className="text-gray-500 text-sm">
          毎日0時に新しいクイズが生成されます。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    );
  }

  return <Quiz quiz={quiz} />;
}
