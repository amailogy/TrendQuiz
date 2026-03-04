export interface TrendItem {
  title: string;
  approxTraffic: string;
  pubDate: string;
  picture: string;
  newsItems: TrendNewsItem[];
}

export interface TrendNewsItem {
  title: string;
  url: string;
  source: string;
}

export interface QuizQuestion {
  id: number;
  trendKeyword: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyQuiz {
  date: string;
  generatedAt: string;
  questions: QuizQuestion[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  showResult: boolean;
  isComplete: boolean;
  score: number;
}
