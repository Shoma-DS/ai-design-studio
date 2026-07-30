import type { Metadata } from "next";
import Voices from "@/components/Voices/Voices";
import EntryCta from "@/components/EntryCta/EntryCta";

export const metadata: Metadata = {
  title: "先輩の声（Step 04） | トドマツ 新卒採用サイト",
  description: "トドマツで働く先輩社員のリアルな声を紹介します。店舗スタッフ、バイヤー、エリアマネージャーなど、それぞれのキャリアの歩み方。",
};

export default function VoicesPage() {
  return (
    <main>
      <Voices />
      <EntryCta />
    </main>
  );
}
