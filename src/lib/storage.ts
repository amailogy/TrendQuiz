import { promises as fs } from "fs";
import path from "path";
import type { DailyQuiz } from "@/types/quiz";

function getQuizPath(date: string): string {
  return path.join(process.cwd(), "data", "quizzes", `${date}.json`);
}

export async function saveQuiz(quiz: DailyQuiz): Promise<void> {
  const filePath = getQuizPath(quiz.date);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(quiz, null, 2), "utf-8");
}

export async function loadQuiz(date: string): Promise<DailyQuiz | null> {
  try {
    const filePath = getQuizPath(date);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as DailyQuiz;
  } catch {
    return null;
  }
}
