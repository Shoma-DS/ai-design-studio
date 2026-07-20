import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import { cases, stats } from "@/data/site";
import styles from "../page.module.css";

export default function WorksPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <span className="eyebrow">Works</span>
          <h1>実績紹介</h1>
          <p className="lead">数値・導入シーン・業種を分けて、信頼性が伝わる実績ページにしています。</p>
        </div>
      </section>
      <section className={styles.stats}>
        {stats.map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <b>{stat.value}</b>
            <strong>{stat.label}</strong>
            <span>{stat.note}</span>
          </div>
        ))}
      </section>
      <section className="section sectionAlt">
        <div className="container">
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
    </main>
  );
}
