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
      <div className="text-center py-20">
        <div className="inline-block w-10 h-10 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <p className="text-neutral-400 mt-5 text-sm tracking-wide">
          Loading...
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-20">
        <div className="card rounded-2xl p-10">
          <div className="text-4xl font-black text-black mb-3">---</div>
          <h2 className="text-lg font-bold text-neutral-700 mb-2">
            Preparing Today&apos;s Quiz
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Every day at midnight, a new quiz is generated.
            <br />
            Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return <Quiz quiz={quiz} />;
}
