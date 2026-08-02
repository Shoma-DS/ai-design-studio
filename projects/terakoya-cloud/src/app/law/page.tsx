import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage/LegalPage";
import { legalCompany, siteMeta } from "@/data/site";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表示｜${siteMeta.serviceName}`,
};

export default function LawPage() {
  return (
    <LegalPage
      title="特定商取引法に基づく表示"
      rows={[
        { label: "販売業者", value: legalCompany.name },
        { label: "運営責任者", value: legalCompany.representative },
        { label: "所在地", value: legalCompany.address },
        { label: "お問い合わせ", value: legalCompany.contactNote },
        { label: "販売価格", value: "各プランのページに記載する月額料金（消費税込）のとおりです。" },
        {
          label: "お支払い方法",
          value: "クレジットカード決済（月次自動決済）。対応ブランドは決済ページに記載します。",
        },
        { label: "お支払い時期", value: "ご登録日を起算日として、月次で自動決済されます。" },
        {
          label: "サービス提供時期",
          value: "お申し込み手続き完了後、直ちにご利用いただけます。",
        },
        {
          label: "返品・キャンセルについて",
          value:
            "デジタルサービスの性質上、購入後のご返金は原則承っておりません。プランの解約はマイページよりいつでも手続き可能です。",
        },
        { label: "動作環境", value: "最新版のGoogle Chrome、Safari、Microsoft Edge にて動作確認しています。" },
      ]}
    />
  );
}
