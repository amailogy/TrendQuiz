import { put, list } from "@vercel/blob";
import type { DailyQuiz } from "@/types/quiz";

export async function saveQuiz(quiz: DailyQuiz): Promise<void> {
  const data = JSON.stringify(quiz);
  await put(`quizzes/${quiz.date}.json`, data, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function loadQuiz(date: string): Promise<DailyQuiz | null> {
  try {
    const result = await list({ prefix: `quizzes/${date}.json` });
    if (result.blobs.length === 0) return null;
    const response = await fetch(result.blobs[0].url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as DailyQuiz;
  } catch (error) {
    console.error("Failed to load quiz:", error);
    return null;
  }
}
