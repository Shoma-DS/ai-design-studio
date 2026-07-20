import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import { cases, services, stats } from "@/data/site";
import styles from "./page.module.css";

const problems = [
  "DPFやインジェクター交換の費用が重い",
  "修理に出すと車両が何日も戻らない",
  "黒煙・白煙・DPF再生の頻度が気になる",
  "代理店として信頼できる商材を増やしたい",
];

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Reveal>
            <span className={styles.heroLabel}>ERC日本輸入総代理店 / 特許技術 / 全国ネットワーク</span>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleSupport}>
                <span>業務車両の稼働を</span>
                <span>止めない。</span>
              </span>
              <span className={styles.heroTitleMain}>
                <span>次世代</span>
                <span className={styles.heroTitleOutline}>クリーニング</span>
                <span>エンジン。</span>
              </span>
            </h1>
            <p className={styles.heroLead}>
              DPFアッシュクリーニングと水素カーボンクリーニングを軸に、運送・建設・整備の現場が抱える
              コスト、時間、黒煙対策を一体で支援します。
            </p>
            <div className={styles.heroActions}>
              <a className="button buttonPrimary" href="/contact">
                無料相談する <ArrowRight size={18} />
              </a>
              <a className="button buttonSecondary" href="/services">
                サービスを見る
              </a>
            </div>
          </Reveal>
          <Reveal className={styles.heroCard} delay={0.18}>
            <b>Before 39kPa</b>
            <b>After 6kPa</b>
            <span>DPF最大排気差圧の改善事例を、数値で見える化。</span>
          </Reveal>
        </div>
      </section>

      <section className={styles.stats} aria-label="主要な実績指標">
        {stats.map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <b>{stat.value}</b>
            <strong>{stat.label}</strong>
            <span>{stat.note}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className={`container ${styles.grid2}`}>
          <Reveal className={styles.imagePanel}>
            <Image src="/images/diagnostic-pc.png" alt="車両メンテナンスの診断イメージ" width={1100} height={820} />
          </Reveal>
          <Reveal delay={0.12}>
            <span className="eyebrow">Problem</span>
            <h2 className="sectionTitle">交換か、長期停止か。現場の悩みを施工前に整理する。</h2>
            <ul className={styles.problemList}>
              {problems.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Services</span>
            <h2 className="sectionTitle">施工・製品供給・代理店支援をひとつの体系に。</h2>
          </Reveal>
          <div className={styles.cards}>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal className={styles.card} delay={index * 0.06} key={service.title}>
                  <span className={styles.cardIcon}>
                    <Icon size={24} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Process</span>
            <h2 className="sectionTitle">問い合わせから施工・導入まで迷わない流れ。</h2>
          </Reveal>
          <div className={styles.flow}>
            {["相談", "車両確認", "施工計画", "クリーニング", "定期運用"].map((item, index) => (
              <Reveal className={styles.flowStep} delay={index * 0.05} key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Works</span>
            <h2 className="sectionTitle">運送・建設・整備の現場に合わせた導入事例。</h2>
          </Reveal>
          <div className={styles.caseGrid}>
            {cases.map((item, index) => (
              <Reveal className={styles.caseCard} delay={index * 0.08} key={item.title}>
                <Image
                  src={`/images/case-${index + 1}.png`}
                  alt={`${item.category}の導入イメージ`}
                  width={900}
                  height={560}
                />
                <div className={styles.caseBody}>
                  <small>{item.category}</small>
                  <h3>{item.title}</h3>
                  <p>{item.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div>
            <span className="eyebrow">Contact</span>
            <h2>交換の前に、まずは車両状態をご相談ください。</h2>
          </div>
          <a className="button buttonPrimary" href="/contact">
            お問い合わせへ
          </a>
        </div>
      </section>
    </main>
  );
}
