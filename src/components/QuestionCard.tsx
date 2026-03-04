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
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          #{question.trendKeyword}
        </span>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
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
          className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${
            selectedAnswer === question.correctIndex
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="font-bold mb-1">
            {selectedAnswer === question.correctIndex
              ? "正解!"
              : "不正解..."}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
