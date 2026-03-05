"use client";

import { useState } from "react";
import type { DailyQuiz, QuizState } from "@/types/quiz";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsPage } from "./ResultsPage";

const CHECKPOINT_INTERVAL = 5;

interface QuizProps {
  quiz: DailyQuiz;
  onBack?: () => void;
}

export function Quiz({ quiz, onBack }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quiz.questions.length).fill(null),
    showResult: false,
    isComplete: false,
    score: 0,
  });
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const total = quiz.questions.length;

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

    if (nextIndex >= total) {
      setState((prev) => ({ ...prev, isComplete: true }));
      return;
    }

    // Show checkpoint every 5 questions
    if (nextIndex % CHECKPOINT_INTERVAL === 0) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        showResult: false,
      }));
      setShowCheckpoint(true);
      return;
    }

    setState((prev) => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      showResult: false,
    }));
  }

  function handleContinue() {
    setShowCheckpoint(false);
  }

  function handleFinishEarly() {
    setState((prev) => ({ ...prev, isComplete: true }));
  }

  function handleRetry() {
    setState({
      currentQuestionIndex: 0,
      answers: Array(total).fill(null),
      showResult: false,
      isComplete: false,
      score: 0,
    });
    setShowCheckpoint(false);
  }

  if (state.isComplete) {
    const answered = state.currentQuestionIndex;
    const quizSlice: DailyQuiz = {
      ...quiz,
      questions: quiz.questions.slice(0, answered),
    };
    return (
      <ResultsPage
        quiz={quizSlice}
        answers={state.answers.slice(0, answered)}
        score={state.score}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  // Checkpoint screen
  if (showCheckpoint) {
    const answered = state.currentQuestionIndex;
    return (
      <div className="animate-fadeIn text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-4xl mb-4">{"\u{1F3C3}"}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {answered}問 完了！
          </h2>
          <p className="text-gray-500 mb-2">
            現在のスコア:{" "}
            <span className="font-bold text-blue-600">
              {state.score} / {answered}
            </span>
          </p>
          <p className="text-gray-400 text-sm mb-6">
            残り {total - answered} 問
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors active:scale-[0.98]"
            >
              続ける
            </button>
            <button
              onClick={handleFinishEarly}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              ここで終了して結果を見る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar current={state.currentQuestionIndex} total={total} />

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
            {state.currentQuestionIndex < total - 1
              ? "次の問題へ"
              : "結果を見る"}
          </button>
        )}
      </div>
    </div>
  );
}
