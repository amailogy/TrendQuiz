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
    const accuracy = Math.round((state.score / answered) * 100);
    return (
      <div className="animate-fadeIn text-center">
        <div className="card rounded-2xl p-8">
          <p className="text-xs text-neutral-400 uppercase tracking-widest mb-3">
            Checkpoint
          </p>
          <div className="text-5xl font-black text-black mb-2">
            {state.score}/{answered}
          </div>
          <p className="text-neutral-500 text-sm mb-1">
            Accuracy: {accuracy}%
          </p>
          <p className="text-neutral-400 text-xs mb-8">
            {total - answered} questions remaining
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 transition-colors active:scale-[0.98]"
            >
              Continue
            </button>
            <button
              onClick={handleFinishEarly}
              className="w-full py-3 px-4 rounded-xl border border-neutral-200 text-neutral-500 font-bold hover:bg-neutral-50 transition-colors"
            >
              Finish &amp; View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar current={state.currentQuestionIndex} total={total} />

      <div className="card rounded-2xl p-5">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={state.answers[state.currentQuestionIndex]}
          showResult={state.showResult}
          onAnswer={handleAnswer}
        />

        {state.showResult && (
          <button
            onClick={handleNext}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 transition-colors active:scale-[0.98]"
          >
            {state.currentQuestionIndex < total - 1
              ? "Next Question"
              : "View Results"}
          </button>
        )}
      </div>
    </div>
  );
}
