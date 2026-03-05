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
    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ";

  if (isRevealed) {
    if (isCorrect) {
      className +=
        "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
    } else if (isSelected) {
      className +=
        "border-red-500/50 bg-red-500/10 text-red-300";
    } else {
      className +=
        "border-white/5 bg-white/[0.02] text-slate-600";
    }
  } else {
    className +=
      "border-white/10 bg-white/[0.03] text-slate-200 hover:border-blue-400/40 hover:bg-white/[0.06] cursor-pointer active:scale-[0.98]";
  }

  return (
    <button onClick={onClick} disabled={isRevealed} className={className}>
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0 ${
          isRevealed && isCorrect
            ? "bg-emerald-500 text-white"
            : isRevealed && isSelected
              ? "bg-red-500 text-white"
              : "bg-white/10 text-slate-400"
        }`}
      >
        {prefixes[index]}
      </span>
      <span className="font-medium leading-relaxed">{label}</span>
      {isRevealed && isCorrect && (
        <span className="ml-auto text-sm font-bold text-emerald-400 tracking-wide">
          CORRECT
        </span>
      )}
      {isRevealed && isSelected && !isCorrect && (
        <span className="ml-auto text-sm font-bold text-red-400 tracking-wide">
          WRONG
        </span>
      )}
    </button>
  );
}
