"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-300 tracking-wide">
          Q{current + 1}
        </span>
        <span className="text-sm text-slate-500 tabular-nums">
          {current + 1} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          }}
        />
      </div>
    </div>
  );
}
