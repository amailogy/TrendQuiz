"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
            i < current
              ? "bg-blue-500"
              : i === current
                ? "bg-blue-300"
                : "bg-gray-200"
          }`}
        />
      ))}
      <span className="text-sm text-gray-500 ml-2 whitespace-nowrap">
        {current + 1} / {total}
      </span>
    </div>
  );
}
