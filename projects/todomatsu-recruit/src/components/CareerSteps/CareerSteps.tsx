import { careerSteps } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./CareerSteps.module.css";

export default function CareerSteps() {
  return (
    <section className={styles.section}>
      <DecorationText text="Future" speed={-1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Career Path
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          入社後のキャリアステップ
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          専門分野に進んだあとも、道は一つではありません。一例をご紹介します。
        </Reveal>

        <RevealGroup className={styles.list} stagger={0.06}>
          {careerSteps.map((step) => (
            <div key={step.year} className={styles.row}>
              <p className={styles.year}>{step.year}</p>
              <div className={styles.rowText}>
                <p className={styles.title}>{step.title}</p>
                <p className={styles.description}>{step.description}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
