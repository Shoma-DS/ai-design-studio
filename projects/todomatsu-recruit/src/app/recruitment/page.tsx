import type { Metadata } from "next";
import RecruitmentInfo from "@/components/RecruitmentInfo/RecruitmentInfo";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "募集要項 | トドマツ 新卒採用サイト",
  description: "株式会社トドマツの新卒採用 募集要項。募集職種・勤務条件・休日休暇・福利厚生・選考フローをご案内します。",
};

export default function RecruitmentPage() {
  return (
    <main>
      <RecruitmentInfo />
      <EntryCta />
    </main>
  );
}
