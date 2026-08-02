import type { Metadata } from "next";
import Link from "next/link";
import {
  Send,
  LayoutTemplate,
  TrendingUp,
  PenLine,
  ListOrdered,
  Gauge,
  Palette,
  Hash,
  Mail,
  Users,
  FileSpreadsheet,
  ClipboardList,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal/Reveal";
import { LaptopFrame } from "@/components/DeviceFrame/DeviceFrame";
import { LearningDashboardMock, CommunityChatMock, AbstractFeatureCard } from "@/components/ProductMock/ProductMock";
import { featureGroups, siteMeta } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: `特徴・機能｜${siteMeta.serviceName}`,
  description: "寺子屋クラウドの集客・学習・コミュニティ・管理機能をカテゴリ別にご紹介します。",
};

const iconMap: Record<string, LucideIcon> = {
  LINEステップ配信: Send,
  LPテンプレート機能: LayoutTemplate,
  流入経路分析: TrendingUp,
  感想文機能: PenLine,
  順番学習: ListOrdered,
  進捗ダッシュボード: Gauge,
  学習画面カラーカスタム: Palette,
  チャンネル掲示板: Hash,
  ダイレクトメッセージ: Mail,
  オンラインサロン運営: Users,
  受講生CSVインポート: FileSpreadsheet,
  アンケート機能: ClipboardList,
  "決済・請求管理": CreditCard,
};

function FeatureVisual({ title }: { title: string }) {
  if (title === "進捗ダッシュボード") {
    return (
      <LaptopFrame>
        <LearningDashboardMock />
      </LaptopFrame>
    );
  }
  if (title === "チャンネル掲示板") {
    return (
      <LaptopFrame>
        <CommunityChatMock />
      </LaptopFrame>
    );
  }
  const Icon = iconMap[title] ?? Send;
  return (
    <div className={styles.mockCard}>
      <AbstractFeatureCard icon={Icon} label={title} />
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <Reveal>
            <h1 className={styles.pageTitle}>寺子屋クラウドの特徴・機能</h1>
            <p className={styles.pageSubtitle}>
              機能はどれもシンプルで使いやすく、どなたでも使いこなせます。
            </p>
            <Link href="#signup" className="btn btnPrimary">
              まずは無料ではじめる
            </Link>
          </Reveal>
        </div>
      </section>

      {featureGroups.map((group) => (
        <section className={styles.categorySection} key={group.category}>
          <div className="container">
            <Reveal>
              <div className={styles.categoryHead}>
                <span className="sectionLabel">{group.category}</span>
                <h2 className={styles.categoryTitle} style={{ marginTop: 8 }}>
                  {group.category}
                </h2>
                <span className="underlineAccent" />
              </div>
            </Reveal>

            {group.items.map((item) => (
              <Reveal key={item.title}>
                <div className={styles.featureRow}>
                  <div>
                    <div className={styles.featureIconRow}>
                      <span className={styles.featureIcon}>
                        {(() => {
                          const Icon = iconMap[item.title] ?? Send;
                          return <Icon size={20} strokeWidth={1.75} />;
                        })()}
                      </span>
                      <h3 className={styles.featureTitle}>{item.title}</h3>
                    </div>
                    <p className={styles.featureDesc}>{item.description}</p>
                  </div>
                  <div className={styles.featureVisual}>
                    <FeatureVisual title={item.title} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
