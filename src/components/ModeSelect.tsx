"use client";

interface ModeSelectProps {
  totalQuestions: number;
  onSelectMode: (count: number) => void;
}

const modes = [
  {
    count: 10,
    label: "10問モード",
    description: "サクッと挑戦",
    time: "約3分",
    color: "from-green-500 to-emerald-600",
  },
  {
    count: 100,
    label: "100問モード",
    description: "全問制覇に挑戦！",
    time: "約30分",
    color: "from-orange-500 to-red-600",
  },
];

export function ModeSelect({ totalQuestions, onSelectMode }: ModeSelectProps) {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm">
          本日のトレンドから{totalQuestions}問出題中
        </p>
      </div>

      <div className="space-y-4">
        {modes.map((mode) => (
          <button
            key={mode.count}
            onClick={() => onSelectMode(mode.count)}
            disabled={totalQuestions < mode.count}
            className={`w-full p-5 rounded-2xl bg-gradient-to-r ${mode.color} text-white text-left transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{mode.label}</h3>
                <p className="text-white/80 text-sm mt-1">
                  {mode.description}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{mode.count}</span>
                <p className="text-white/70 text-xs">{mode.time}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
