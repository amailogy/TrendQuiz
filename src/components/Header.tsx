import { getTodayJST } from "@/lib/utils";

export function Header() {
  const today = getTodayJST();
  const [year, month, day] = today.split("-");

  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        トレンドクイズ
      </h1>
      <p className="text-gray-500 mt-2 text-sm">
        {year}年{parseInt(month)}月{parseInt(day)}日のトレンド
      </p>
    </header>
  );
}
