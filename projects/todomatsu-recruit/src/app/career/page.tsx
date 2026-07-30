import type { Metadata } from "next";
import CareerPaths from "@/components/CareerPaths/CareerPaths";
import CareerSteps from "@/components/CareerSteps/CareerSteps";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "専門性を磨く（Step 03） | トドマツ 新卒採用サイト",
  description:
    "店舗経験を積んだあとは、適性と希望に応じて8つの専門分野へ。バイヤー、エリアマネージャー、商品開発など、トドマツのキャリアパスを紹介します。",
};

export default function CareerPage() {
  return (
    <main>
      <CareerPaths />
      <CareerSteps />
      <EntryCta />
    </main>
  );
}
