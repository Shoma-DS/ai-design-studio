import type { Metadata } from "next";
import CompanyProfile from "@/components/CompanyProfile/CompanyProfile";
import CompanyHistory from "@/components/CompanyHistory/CompanyHistory";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "会社概要 | トドマツ 新卒採用サイト",
  description: "株式会社トドマツの会社概要。設立・資本金・事業内容・店舗数・従業員数など、会社の基本情報をご紹介します。",
};

export default function AboutPage() {
  return (
    <main>
      <CompanyProfile />
      <CompanyHistory />
      <EntryCta />
    </main>
  );
}
