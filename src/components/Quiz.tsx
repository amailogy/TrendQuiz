"use client";

import { useState } from "react";
import type { DailyQuiz, QuizState } from "@/types/quiz";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsPage } from "./ResultsPage";

interface QuizProps {
  quiz: DailyQuiz;
}

export function Quiz({ quiz }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quiz.questions.length).fill(null),
    showResult: false,
    isComplete: false,
    score: 0,
  });

  const currentQuestion = quiz.questions[state.currentQuestionIndex];

  function handleAnswer(index: number) {
    if (state.showResult) return;

    const isCorrect = index === currentQuestion.correctIndex;
    setState((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) =>
        i === prev.currentQuestionIndex ? index : a
      ),
      showResult: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  }

  function handleNext() {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= quiz.questions.length) {
      setState((prev) => ({ ...prev, isComplete: true }));
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        showResult: false,
      }));
    }
  }

  function handleRetry() {
    setState({
      currentQuestionIndex: 0,
      answers: Array(quiz.questions.length).fill(null),
      showResult: false,
      isComplete: false,
      score: 0,
    });
  }

  if (state.isComplete) {
    return (
      <ResultsPage
        quiz={quiz}
        answers={state.answers}
        score={state.score}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div>
      <ProgressBar
        current={state.currentQuestionIndex}
        total={quiz.questions.length}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={state.answers[state.currentQuestionIndex]}
          showResult={state.showResult}
          onAnswer={handleAnswer}
        />

        {state.showResult && (
          <button
            onClick={handleNext}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors active:scale-[0.98]"
          >
            {state.currentQuestionIndex < quiz.questions.length - 1
              ? "次の問題へ"
              : "結果を見る"}
          </button>
        )}
      </div>
    </div>
  );
}
