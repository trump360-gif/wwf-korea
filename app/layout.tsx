import type { Metadata } from "next";
import { Noto_Serif_KR, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import DonateModalLoader from "@/components/donate/DonateModalLoader";

const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WWF-Korea | 세계자연기금 한국본부",
  description:
    "사람과 자연이 조화로운 미래를 만들어갑니다. WWF-Korea 기부 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${notoSerifKR.variable} ${playfairDisplay.variable} antialiased`}
        style={{ fontFamily: "Pretendard Variable, sans-serif" }}
        suppressHydrationWarning
      >
        <Navigation transparent />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <DonateModalLoader />
      </body>
    </html>
  );
}
