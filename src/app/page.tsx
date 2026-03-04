import { loadQuiz } from "@/lib/storage";
import { getTodayJST } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Quiz } from "@/components/Quiz";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const today = getTodayJST();
  const quiz = await loadQuiz(today);

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <Header />
      {quiz ? (
        <Quiz quiz={quiz} />
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{"\u{23F3}"}</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            本日のクイズを準備中です
          </h2>
          <p className="text-gray-500 text-sm">
            毎日0時に新しいクイズが生成されます。
            <br />
            しばらくお待ちください。
          </p>
        </div>
      )}
    </main>
  );
}
