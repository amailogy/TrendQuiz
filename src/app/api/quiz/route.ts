import { NextResponse } from "next/server";
import { loadQuiz } from "@/lib/storage";
import { getTodayJST } from "@/lib/utils";

export const maxDuration = 60;

export async function GET() {
  const today = getTodayJST();
  const quiz = await loadQuiz(today);

  if (!quiz) {
    return NextResponse.json(
      { error: "本日のクイズはまだ準備されていません" },
      { status: 404 }
    );
  }

  return NextResponse.json(quiz, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
