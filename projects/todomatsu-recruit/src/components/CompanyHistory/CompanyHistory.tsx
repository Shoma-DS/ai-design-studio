import { companyHistory } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./CompanyHistory.module.css";

export default function CompanyHistory() {
  return (
    <section className={styles.section}>
      <DecorationText text="History" speed={-1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Our History
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          沿革
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          1968年の創業から56年。地域とともに歩んできた歴史をご紹介します。
        </Reveal>

        <RevealGroup className={styles.list} stagger={0.04}>
          {companyHistory.map((item) => (
            <div key={item.year} className={styles.row}>
              <p className={styles.year}>{item.year}</p>
              <p className={styles.event}>{item.event}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
