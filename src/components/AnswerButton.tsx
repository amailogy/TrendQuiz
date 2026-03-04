"use client";

interface AnswerButtonProps {
  label: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onClick: () => void;
}

const prefixes = ["A", "B", "C", "D"];

export function AnswerButton({
  label,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
}: AnswerButtonProps) {
  let className =
    "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 ";

  if (isRevealed) {
    if (isCorrect) {
      className += "border-green-500 bg-green-50 text-green-800";
    } else if (isSelected) {
      className += "border-red-500 bg-red-50 text-red-800";
    } else {
      className += "border-gray-200 bg-gray-50 text-gray-400";
    }
  } else {
    className +=
      "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer active:scale-[0.98]";
  }

  return (
    <button onClick={onClick} disabled={isRevealed} className={className}>
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold flex-shrink-0 ${
          isRevealed && isCorrect
            ? "bg-green-500 text-white"
            : isRevealed && isSelected
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        {prefixes[index]}
      </span>
      <span className="font-medium leading-relaxed">{label}</span>
      {isRevealed && isCorrect && <span className="ml-auto text-xl">&#10003;</span>}
      {isRevealed && isSelected && !isCorrect && (
        <span className="ml-auto text-xl">&#10007;</span>
      )}
    </button>
  );
}
