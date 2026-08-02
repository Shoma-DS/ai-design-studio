import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal/Reveal";
import { pricingPlans, pricingMatrix, siteMeta } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: `料金プラン｜${siteMeta.serviceName}`,
  description: "お試しで導入したい方から数百名の受講生を抱える方まで、柔軟にプランを選択できます。",
};

const ctaClassMap: Record<string, string> = {
  outline: "btn btnOutline",
  dark: "btn btnDark",
  sage: "btn btnSage",
};

export default function PricePage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <Reveal>
            <h1 className={styles.pageTitle}>料金プラン</h1>
            <p className={styles.pageSubtitle}>
              お試しで導入したい方から数百名の受講生を抱える方まで、柔軟にプランを選択できます。
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.plansSection}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHead}>
              <span className="sectionLabel">Pricing</span>
              <h2 style={{ marginTop: 8 }}>寺子屋クラウドの料金プラン</h2>
              <span className="underlineAccent" />
            </div>
          </Reveal>

          <RevealGroup className={styles.planGrid}>
            {pricingPlans.map((plan) => (
              <RevealItem key={plan.name} className={styles.planCard}>
                <div className={styles.planTopBar} style={{ background: plan.accent }} />
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planTagline}>{plan.tagline}</p>
                <Link
                  href="#signup"
                  className={`${ctaClassMap[plan.cta.variant]} ${styles.planCta}`}
                >
                  {plan.cta.label}
                </Link>
                <div className={styles.planPrice}>{plan.price}</div>
                {plan.priceNote && <div className={styles.planPriceNote}>{plan.priceNote}</div>}

                <div className={styles.planMeta}>
                  <div>
                    <span className={styles.planMetaLabel}>受講生</span>
                    {plan.students}
                  </div>
                  <div>
                    <span className={styles.planMetaLabel}>コース数</span>
                    {plan.courses}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className={styles.matrixSection}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHead}>
              <span className="sectionLabel">Feature Matrix</span>
              <h2 style={{ marginTop: 8 }}>プラン別 機能比較</h2>
              <span className="underlineAccent" />
            </div>
          </Reveal>

          <Reveal className={styles.tableScroll}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>フリー</th>
                  <th>スタンダード</th>
                  <th>プロ</th>
                  <th>プロプラス</th>
                  <th>エンタープライズ</th>
                </tr>
              </thead>
              <tbody>
                {pricingMatrix.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>{row.free ? <span className={styles.check}>✓</span> : <span className={styles.dash}>—</span>}</td>
                    <td>{row.standard ? <span className={styles.check}>✓</span> : <span className={styles.dash}>—</span>}</td>
                    <td>{row.pro ? <span className={styles.check}>✓</span> : <span className={styles.dash}>—</span>}</td>
                    <td>{row.proPlus ? <span className={styles.check}>✓</span> : <span className={styles.dash}>—</span>}</td>
                    <td>{row.enterprise ? <span className={styles.check}>✓</span> : <span className={styles.dash}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
