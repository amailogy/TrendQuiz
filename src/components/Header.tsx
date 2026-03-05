import { getTodayJST } from "@/lib/utils";

export function Header() {
  const today = getTodayJST();
  const [year, month, day] = today.split("-");

  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl font-bold text-accent tracking-tight">
        TREND QUIZ
      </h1>
      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-white/20" />
        <p className="text-slate-400 text-sm tracking-widest">
          {year}.{month}.{day}
        </p>
        <span className="h-px w-8 bg-white/20" />
      </div>
    </header>
  );
}
