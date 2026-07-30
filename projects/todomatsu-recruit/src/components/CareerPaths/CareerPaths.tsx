import { careers } from "@/data/site";
import CareerIcon from "./CareerIcon";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./CareerPaths.module.css";

const blobClasses = [styles.blob1, styles.blob2, styles.blob3];

export default function CareerPaths() {
  return (
    <section id="career" className={styles.section}>
      <DecorationText text="Career" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Step 03
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          専門性を磨く
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          店舗経験を積んだあとは、適性と希望に応じて8つの専門分野へ。
          どの道に進んでも、現場で得た感覚が土台になります。
        </Reveal>

        <Reveal as="p" className={styles.jobsLabel} delay={0.25}>
          Jobs
        </Reveal>

        <RevealGroup className={styles.list} stagger={0.08}>
          {careers.map((career, index) => (
            <div key={career.id} className={styles.row}>
              <span className={`${styles.iconBlob} ${blobClasses[index % blobClasses.length]}`}>
                <CareerIcon id={career.id} />
              </span>
              <div className={styles.rowText}>
                <p className={styles.cardNumber}>{career.number}</p>
                <h3 className={styles.cardTitle}>{career.title}</h3>
                <p className={styles.cardCatch}>{career.catchphrase}</p>
                <p className={styles.cardDescription}>{career.description}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
