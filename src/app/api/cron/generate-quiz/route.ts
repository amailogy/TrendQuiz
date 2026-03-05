import { NextRequest, NextResponse } from "next/server";
import { fetchTrends } from "@/lib/trends";
import { generateQuiz } from "@/lib/quiz-generator";
import { saveQuiz, loadQuiz } from "@/lib/storage";
import { getTodayJST } from "@/lib/utils";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayJST();
  const force = request.nextUrl.searchParams.get("force") === "1";

  try {
    // Check if already generated (skip if force)
    if (!force) {
      const existing = await loadQuiz(today);
      if (existing) {
        return NextResponse.json({
          message: "Quiz already exists",
          date: today,
          questions: existing.questions.length,
        });
      }
    }

    // Generate new quiz
    const trends = await fetchTrends();
    if (trends.length < 5) {
      return NextResponse.json(
        { error: "Not enough trends available" },
        { status: 500 }
      );
    }

    const quiz = await generateQuiz(trends);
    await saveQuiz(quiz);

    return NextResponse.json({
      message: "Quiz generated and saved",
      date: today,
      questions: quiz.questions.length,
    });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return NextResponse.json(
      { error: `Quiz generation failed: ${error}` },
      { status: 500 }
    );
  }
}
