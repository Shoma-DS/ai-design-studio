import { recruitmentGroups } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./RecruitmentInfo.module.css";

export default function RecruitmentInfo() {
  return (
    <section id="recruitment" className={styles.section}>
      <DecorationText text="Recruit" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Recruitment
        </Reveal>
        <Reveal as="h1" className={styles.heading} delay={0.1}>
          募集要項
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          2027年3月卒業見込みの方を対象とした、新卒採用の募集要項です。
        </Reveal>

        {recruitmentGroups.map((group) => (
          <div key={group.title} className={styles.group}>
            <Reveal as="h2" className={styles.groupTitle}>
              {group.title}
            </Reveal>
            <RevealGroup className={styles.table} stagger={0.05}>
              {group.items.map((row) => (
                <div key={row.label} className={styles.row}>
                  <p className={styles.label}>{row.label}</p>
                  <p className={styles.value}>{row.value}</p>
                </div>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </section>
  );
}
