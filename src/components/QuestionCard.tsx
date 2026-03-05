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
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200">
          #{question.trendKeyword}
        </span>
      </div>

      <h2 className="text-[15px] font-bold text-black mb-4 leading-relaxed">
        Q{question.id}. {question.question}
      </h2>

      <div className="space-y-2">
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
          className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
            selectedAnswer === question.correctIndex
              ? "bg-neutral-900 border-neutral-800 text-white"
              : "bg-neutral-100 border-neutral-200 text-neutral-600"
          }`}
        >
          <p className="font-bold mb-0.5">
            {selectedAnswer === question.correctIndex
              ? "Correct!"
              : "Incorrect..."}
          </p>
          <p className={selectedAnswer === question.correctIndex ? "text-neutral-400" : "text-neutral-500"}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
