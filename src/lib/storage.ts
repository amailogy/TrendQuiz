import { unstable_cache } from "next/cache";
import { fetchTrends } from "./trends";
import { generateQuiz } from "./quiz-generator";
import type { DailyQuiz } from "@/types/quiz";

async function generateQuizForDate(date: string): Promise<DailyQuiz> {
  const trends = await fetchTrends();
  const quiz = await generateQuiz(trends);
  return { ...quiz, date };
}

export async function loadQuiz(date: string): Promise<DailyQuiz | null> {
  try {
    const getCached = unstable_cache(
      async () => generateQuizForDate(date),
      [`quiz-v3-${date}`],
      { revalidate: false, tags: [`quiz-v3-${date}`] }
    );
    return await getCached();
  } catch (error) {
    console.error("Failed to load/generate quiz:", error);
    return null;
  }
}
