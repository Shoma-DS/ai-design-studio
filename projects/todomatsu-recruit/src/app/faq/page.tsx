import type { Metadata } from "next";
import Faq from "@/components/Faq/Faq";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "よくある質問 | トドマツ 新卒採用サイト",
  description: "株式会社トドマツの新卒採用に関するよくある質問。転勤・配属・研修・休暇などについてお答えします。",
};

export default function FaqPage() {
  return (
    <main>
      <Faq />
      <EntryCta />
    </main>
  );
}
