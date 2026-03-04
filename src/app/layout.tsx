import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "トレンドクイズ | 今日のトレンドをテストしよう",
  description:
    "毎日更新！Googleトレンドから出題される4択クイズに挑戦しよう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} antialiased min-h-screen bg-gradient-to-b from-blue-50 to-white`}
      >
        {children}
      </body>
    </html>
  );
}
