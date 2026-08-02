import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal/Reveal";
import CountUp from "@/components/CountUp/CountUp";
import Accordion from "@/components/Accordion/Accordion";
import { LaptopFrame, PhoneFrame } from "@/components/DeviceFrame/DeviceFrame";
import { LearningDashboardMock, CommunityChatMock } from "@/components/ProductMock/ProductMock";
import {
  hero,
  highlightSections,
  marketingFeature,
  reasons,
  onboardingSteps,
  faqItems,
} from "@/data/site";
import styles from "./page.module.css";

const deviceContent = [LearningDashboardMock, CommunityChatMock];

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <Reveal>
              <span className={styles.heroEyebrow}>{hero.eyebrow}</span>
              <h1 className={styles.heroTitle}>{hero.title}</h1>
              <p className={styles.heroSubtitle}>{hero.subtitle}</p>
              <div className={styles.heroCtas}>
                <Link href={hero.primaryCta.href} className="btn btnPrimary">
                  {hero.primaryCta.label}
                </Link>
                <Link href={hero.secondaryCta.href} className="btn btnOutline">
                  {hero.secondaryCta.label}
                </Link>
              </div>

              <div className={styles.heroStatBar}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>
                    <CountUp value={3200} suffix="件+" />
                  </div>
                  <div className={styles.statLabel}>導入実績</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>
                    <CountUp value={98} suffix="%" />
                  </div>
                  <div className={styles.statLabel}>継続利用率</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>
                    <CountUp value={4} suffix="分" />
                  </div>
                  <div className={styles.statLabel}>最短開設時間</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className={styles.heroVisual}>
                <Image
                  src="/images/hero-pc.jpg"
                  alt="寺子屋クラウドで講座を届ける講師のイメージ"
                  fill
                  priority
                  className={styles.heroVisualPc}
                  sizes="(max-width: 640px) 0px, 560px"
                />
                <Image
                  src="/images/hero-sp.jpg"
                  alt="寺子屋クラウドで講座を届ける講師のイメージ（スマホ版）"
                  fill
                  priority
                  className={styles.heroVisualSp}
                  sizes="(max-width: 640px) 340px, 0px"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {highlightSections.map((section, index) => {
        const DeviceContent = deviceContent[index];
        return (
          <section
            className={`${styles.highlight} ${index % 2 === 1 ? styles.highlightAlt : ""}`}
            key={section.title}
          >
            <div className="container">
              <Reveal>
                <div className={styles.highlightHead}>
                  <span className={styles.badge}>{section.badge}</span>
                  <h2 className={styles.highlightTitle}>{section.title}</h2>
                  <p className={styles.highlightSubtitle}>{section.subtitle}</p>
                </div>
              </Reveal>

              <div className={styles.highlightBody}>
                <Reveal className={styles.deviceCol} delay={0.1}>
                  {index === 0 ? (
                    <LaptopFrame label="PC版">
                      <DeviceContent />
                    </LaptopFrame>
                  ) : (
                    <PhoneFrame label="スマホ版">
                      <DeviceContent />
                    </PhoneFrame>
                  )}
                </Reveal>

                <RevealGroup className={styles.pointList}>
                  {section.points.map((point) => (
                    <RevealItem key={point.title}>
                      <span className={styles.pointLabel}>{point.label}</span>
                      <h3 className={styles.pointTitle}>{point.title}</h3>
                      {"note" in point && point.note ? (
                        <p className={styles.pointNote}>{point.note}</p>
                      ) : null}
                      <p className={styles.pointDesc}>{point.description}</p>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>

              <Reveal>
                <div className={styles.highlightCta}>
                  <span className={styles.highlightCtaLabel}>{section.cta.label}</span>
                  <Link href={section.cta.href} className="btn btnPrimary">
                    まずは無料ではじめる
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className={styles.marketing}>
        <div className="container">
          <Reveal>
            <div className={styles.highlightHead}>
              <span className={styles.badge}>{marketingFeature.badge}</span>
              <h2 className={styles.highlightTitle} style={{ whiteSpace: "pre-line" }}>
                {marketingFeature.title}
              </h2>
            </div>
          </Reveal>

          <RevealGroup className={styles.marketingGrid}>
            {marketingFeature.items.map((item) => (
              <RevealItem key={item.title} className={styles.marketingCard}>
                <h3 className={styles.marketingCardTitle}>{item.title}</h3>
                <p className={styles.marketingCardNote}>{item.note}</p>
                <p className={styles.marketingCardDesc}>{item.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <div className={styles.highlightCta}>
              <span className={styles.highlightCtaLabel}>{marketingFeature.cta.label}</span>
              <Link href={marketingFeature.cta.href} className="btn btnPrimary">
                まずは無料ではじめる
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.reasons}>
        <div className="container">
          <Reveal>
            <div className={styles.highlightHead}>
              <span className="sectionLabel" style={{ color: "var(--accent-400)" }}>
                Why Terakoya Cloud
              </span>
              <h2>寺子屋クラウドで、一歩先の講座提供を。</h2>
            </div>
          </Reveal>

          <RevealGroup>
            {reasons.map((reason) => (
              <RevealItem key={reason.number} className={styles.reasonRow}>
                <span className={styles.reasonNumber}>{reason.number}</span>
                <div>
                  <h3 className={styles.reasonTitle}>{reason.title}</h3>
                  <p className={styles.reasonDesc}>{reason.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className={styles.steps}>
        <div className="container">
          <Reveal>
            <div className={styles.highlightHead}>
              <span className="sectionLabel">Getting Started</span>
              <h2 className={styles.highlightTitle}>利用開始までの簡単ステップ</h2>
              <p className={styles.highlightSubtitle}>あなただけの講座を、最短1ヶ月でリリース。</p>
            </div>
          </Reveal>

          <RevealGroup className={styles.stepGrid}>
            {onboardingSteps.map((step) => (
              <RevealItem key={step.step} className={styles.stepCard}>
                <div className={styles.stepBadge}>{step.step.replace("Step ", "")}</div>
                <p className={styles.stepTitle}>{step.title}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className={styles.faq}>
        <div className="container">
          <Reveal>
            <div className={styles.highlightHead}>
              <span className="sectionLabel">FAQ</span>
              <h2 className={styles.highlightTitle}>よくある質問</h2>
            </div>
          </Reveal>
          <Reveal className={styles.faqInner}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
