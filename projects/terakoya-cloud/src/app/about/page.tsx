import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal/Reveal";
import { aboutPainPoints, useCases, siteMeta } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: `寺子屋クラウドとは｜${siteMeta.serviceName}`,
  description: "個人講師・コーチ・士業のための「集客」「学び」「コミュニティ運営」オールインワンプラットフォーム、寺子屋クラウドについてご紹介します。",
};

const useCaseImages = [
  { src: "/images/usecase-online-school.jpg", alt: "オンラインスクールで学ぶ受講生のイメージ" },
  { src: "/images/usecase-coaching.jpg", alt: "コーチングセッションのイメージ" },
  { src: "/images/usecase-advisory.jpg", alt: "士業の相談対応のイメージ" },
  { src: "/images/usecase-corporate.jpg", alt: "企業研修のイメージ" },
];

export default function AboutPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <Reveal>
            <h1 className={styles.pageTitle}>オンライン教育プラットフォーム&ldquo;寺子屋クラウド&rdquo;とは？</h1>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal>
              <p className={styles.introEyebrow}>導入実績3,200件突破！</p>
              <p className={styles.introLogo}>
                <span className={styles.introLogoMark} />
                寺子屋クラウド
              </p>
              <p className={styles.introDesc}>
                {"「集客」「学び」「コミュニティ運営」の\nすべてができる\nオールインワンプラットフォーム"}
              </p>
              <Link href="#signup" className={`btn btnPrimary ${styles.introCta}`}>
                まずは無料ではじめる
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              <div className={styles.introVisual}>
                <video
                  className={styles.introVideo}
                  src="/videos/terakoya-intro.mp4"
                  poster="/videos/terakoya-intro-poster.jpg"
                  controls
                  preload="metadata"
                  playsInline
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.pain}>
        <div className={styles.painShape}>
          <div className="container">
            <Reveal>
              <div className={styles.painHead}>
                <h2 className={styles.painHeadTitle}>
                  {"オンライン講座の提供でよくあるお悩み\n寺子屋クラウドで解決しませんか？"}
                </h2>
              </div>
            </Reveal>

            <Reveal>
              <div className={styles.painStage}>
                {aboutPainPoints.map((point) => (
                  <div key={point.title}>
                    <div
                      className={styles.painCard}
                      style={{ top: `${point.pos.top}%`, left: `${point.pos.left}%` }}
                    >
                      {point.title}
                    </div>
                    {point.dots.map((dot, dotIndex) => (
                      <span
                        key={dotIndex}
                        className={styles.painDot}
                        style={{
                          top: `${dot.top}%`,
                          left: `${dot.left}%`,
                          width: dot.size,
                          height: dot.size,
                        }}
                      />
                    ))}
                  </div>
                ))}

                <div className={styles.painCharacter}>
                  <Image
                    src="/images/about-character.png"
                    alt="講座運営に悩む個人講師のイラスト"
                    fill
                    sizes="(max-width: 900px) 200px, 320px"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className={styles.solution}>
          <div className="container">
            <Reveal>
              <p className={styles.solutionLead}>寺子屋クラウドなら</p>
              <h2 className={styles.solutionTitle}>
                <span className="marker markerInView">カンタン操作で&ldquo;続けられる&rdquo;講座運営</span>ができます！
              </h2>
              <div className={styles.solutionCta}>
                <Link href="/features" className="btn btnDark">
                  寺子屋クラウドの機能を詳しく見る
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHead}>
              <span className="sectionLabel">Use Cases</span>
              <h2 style={{ marginTop: 12 }}>導入事例</h2>
              <span className="underlineAccent" />
            </div>
          </Reveal>

          <RevealGroup className={styles.useCaseGrid}>
            {useCases.map((useCase, index) => (
              <RevealItem key={useCase.title} className={styles.useCaseCard}>
                <div className={styles.useCaseImage}>
                  <Image
                    src={useCaseImages[index].src}
                    alt={useCaseImages[index].alt}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.useCaseBody}>
                  <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
                  <p className={styles.useCaseDesc}>{useCase.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </main>
  );
}
