import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic, Anton } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import PageFixedUI from "@/components/PageFixedUI/PageFixedUI";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "トドマツ 新卒採用サイト | 株式会社トドマツ",
  description:
    "北海道・東北で暮らしを支えるスーパーマーケット、株式会社トドマツの新卒採用サイト。トドマツを知る、現場を知る、専門性を磨く、先輩の声の4ステップでキャリアを紹介します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${zenMaru.variable} ${anton.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <PageFixedUI />
      </body>
    </html>
  );
}
