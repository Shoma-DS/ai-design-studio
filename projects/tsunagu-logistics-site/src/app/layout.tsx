import type { Metadata } from "next";
import { Noto_Sans_JP, Archivo } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TSUNAGU LOGISTICS | ツナグ物流株式会社",
  description:
    "運ぶ、その先へ。ツナグ物流株式会社は、幹線輸送・地域配送・倉庫保管・物流DXソリューションを通じて、人と人、地域と地域、そして未来をつなぐ総合物流企業です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
