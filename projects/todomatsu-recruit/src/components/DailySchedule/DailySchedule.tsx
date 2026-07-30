import { dailySchedule } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./DailySchedule.module.css";

export default function DailySchedule() {
  return (
    <section className={styles.section}>
      <DecorationText text="Schedule" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          A Day In The Store
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          店舗スタッフの1日
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          ある1日の店舗スタッフのスケジュールをご紹介します。
        </Reveal>

        <RevealGroup className={styles.list} stagger={0.05}>
          {dailySchedule.map((item) => (
            <div key={item.time} className={styles.row}>
              <p className={styles.time}>{item.time}</p>
              <div className={styles.rowText}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.description}>{item.description}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
