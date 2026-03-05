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
    "w-full text-left py-2.5 px-3 rounded-lg border transition-all duration-300 flex items-center gap-2.5 ";

  if (isRevealed) {
    if (isCorrect) {
      className +=
        "border-neutral-800 bg-neutral-900 text-white";
    } else if (isSelected) {
      className +=
        "border-neutral-300 bg-neutral-100 text-neutral-400 line-through";
    } else {
      className +=
        "border-neutral-100 bg-neutral-50 text-neutral-300";
    }
  } else {
    className +=
      "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer active:scale-[0.98]";
  }

  return (
    <button onClick={onClick} disabled={isRevealed} className={className}>
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold flex-shrink-0 ${
          isRevealed && isCorrect
            ? "bg-white text-black"
            : isRevealed && isSelected
              ? "bg-neutral-300 text-neutral-500"
              : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {prefixes[index]}
      </span>
      <span className="text-sm font-medium leading-snug">{label}</span>
    </button>
  );
}
