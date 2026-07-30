import type { Metadata } from "next";
import FloorIntro from "@/components/FloorIntro/FloorIntro";
import DailySchedule from "@/components/DailySchedule/DailySchedule";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "現場を知る（Step 02） | トドマツ 新卒採用サイト",
  description:
    "新卒入社後は、まず店舗の売場に立ちます。品出し・発注・接客など、日々の業務を通してお客さまにとっての使いやすさを体で覚える期間です。",
};

export default function FloorPage() {
  return (
    <main>
      <FloorIntro />
      <DailySchedule />
      <EntryCta />
    </main>
  );
}
