import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage/LegalPage";
import { legalCompany, siteMeta } from "@/data/site";

export const metadata: Metadata = {
  title: `プライバシーポリシー｜${siteMeta.serviceName}`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      sections={[
        {
          title: "1. 個人情報の取得",
          body: `${legalCompany.name}（以下「当社」といいます）は、本サービス「寺子屋クラウド」のご利用にあたり、氏名、メールアドレス、決済情報、講座・コミュニティ上でのご投稿内容など、適法かつ公正な手段によって個人情報を取得します。`,
        },
        {
          title: "2. 利用目的",
          body: "取得した個人情報は、本サービスの提供・運営、本人確認、お問い合わせへの対応、料金の請求、サービス改善のための分析、重要なお知らせの送付のために利用します。",
        },
        {
          title: "3. 第三者提供",
          body: "当社は、法令に基づく場合を除き、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。決済代行事業者など業務委託先へ必要な範囲で提供する場合を除きます。",
        },
        {
          title: "4. 安全管理措置",
          body: "当社は、取得した個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために、必要かつ適切な措置を講じます。",
        },
        {
          title: "5. 開示・訂正・削除等の請求",
          body: "ユーザーは、当社の定める手続きにより、当社に対して自己の個人情報の開示、訂正、追加、削除、利用停止を請求することができます。",
        },
        {
          title: "6. Cookie等の利用",
          body: "本サービスでは、利便性向上やアクセス解析のためにCookieおよび類似の技術を利用する場合があります。ブラウザの設定によりCookieの利用を制限することが可能です。",
        },
        {
          title: "7. プライバシーポリシーの変更",
          body: "当社は、必要に応じて本ポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、本ウェブサイトに掲示した時点から効力を生じるものとします。",
        },
        {
          title: "8. お問い合わせ窓口",
          body: legalCompany.contactNote,
        },
      ]}
    />
  );
}
