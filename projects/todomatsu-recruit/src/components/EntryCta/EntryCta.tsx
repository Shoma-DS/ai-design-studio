import { entry } from "@/data/site";
import MaskImage from "@/components/common/MaskImage/MaskImage";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./EntryCta.module.css";

export default function EntryCta() {
  return (
    <section id="entry" className={styles.section}>
      <DecorationText text="Entry" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <div className={styles.content}>
          <Reveal as="p" className={styles.eyebrow}>
            Join Us
          </Reveal>

          <RevealGroup className={styles.badgeRow} stagger={0.1}>
            {entry.badges.map((badge) => (
              <span key={badge.id} className={styles.badge}>
                {badge.label}
              </span>
            ))}
          </RevealGroup>

          <Reveal as="h2" className={styles.heading} delay={0.1}>
            {entry.title}
          </Reveal>
          <Reveal as="p" className={styles.lead} delay={0.2}>
            {entry.lead}
          </Reveal>

          <Reveal as="a" href="#" className={styles.button} delay={0.3} y={16}>
            {entry.buttonLabel}
            <span aria-hidden="true">＋</span>
          </Reveal>
        </div>

        <div className={styles.visual}>
          <MaskImage
            pcSrc="/images/entry-pc.png"
            spSrc="/images/entry-sp.png"
            alt="夕暮れの店の入口でスタッフが手を振って迎えるイラスト"
          />
        </div>
      </div>
    </section>
  );
}
