import { getTodayJST } from "@/lib/utils";

export function Header() {
  const today = getTodayJST();
  const [year, month, day] = today.split("-");

  return (
    <header className="text-center mb-4">
      <h1 className="text-2xl font-black text-black tracking-tight">
        トレンドクイズ
      </h1>
      <p className="text-neutral-400 text-xs tracking-widest mt-1">
        {year}.{month}.{day}
      </p>
    </header>
  );
}
