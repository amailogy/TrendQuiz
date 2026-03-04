import { NextRequest, NextResponse } from "next/server";
import { loadQuiz } from "@/lib/storage";
import { getTodayJST } from "@/lib/utils";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayJST();

  try {
    const quiz = await loadQuiz(today);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz generation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Quiz ready",
      date: today,
      questions: quiz.questions.length,
    });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return NextResponse.json(
      { error: "Quiz generation failed" },
      { status: 500 }
    );
  }
}
