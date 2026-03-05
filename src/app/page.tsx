import { Header } from "@/components/Header";
import { QuizLoader } from "@/components/QuizLoader";

export default function HomePage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-4">
      <Header />
      <QuizLoader />
    </main>
  );
}
