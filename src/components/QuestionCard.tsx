"use client";

import type { QuizQuestion } from "@/types/quiz";
import { AnswerButton } from "./AnswerButton";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswer: (index: number) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  showResult,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
          #{question.trendKeyword}
        </span>
      </div>

      <h2 className="text-lg font-bold text-slate-100 mb-6 leading-relaxed">
        Q{question.id}. {question.question}
      </h2>

      <div className="space-y-3">
        {question.choices.map((choice, i) => (
          <AnswerButton
            key={i}
            label={choice}
            index={i}
            isSelected={selectedAnswer === i}
            isCorrect={i === question.correctIndex}
            isRevealed={showResult}
            onClick={() => onAnswer(i)}
          />
        ))}
      </div>

      {showResult && (
        <div
          className={`mt-4 p-4 rounded-xl text-sm leading-relaxed border ${
            selectedAnswer === question.correctIndex
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          <p className="font-bold mb-1">
            {selectedAnswer === question.correctIndex
              ? "Correct!"
              : "Incorrect..."}
          </p>
          <p className="text-slate-400">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
