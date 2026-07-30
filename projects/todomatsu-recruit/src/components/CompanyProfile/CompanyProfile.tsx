import { companyProfile } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./CompanyProfile.module.css";

export default function CompanyProfile() {
  return (
    <section id="about" className={styles.section}>
      <DecorationText text="About" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Company
        </Reveal>
        <Reveal as="h1" className={styles.heading} delay={0.1}>
          会社概要
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          北海道・東北で暮らしを支えて56年。トドマツという会社について、数字と概要でご紹介します。
        </Reveal>

        <RevealGroup className={styles.table} stagger={0.05}>
          {companyProfile.map((row) => (
            <div key={row.label} className={styles.row}>
              <p className={styles.label}>{row.label}</p>
              <p className={styles.value}>{row.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
