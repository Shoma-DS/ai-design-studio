import { ceoMessage } from "@/data/site";
import MaskImage from "@/components/common/MaskImage/MaskImage";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import styles from "./CeoMessage.module.css";

export default function CeoMessage() {
  return (
    <section id="message" className={styles.section}>
      <DecorationText text="Message" speed={-1} className={styles.decoTop} />

      <div className={styles.inner}>
        <div className={styles.visual}>
          <MaskImage
            pcSrc={ceoMessage.image}
            spSrc={ceoMessage.image}
            alt={`${ceoMessage.name}（${ceoMessage.role}）の肖像イラスト`}
            panPercent={2}
          />
        </div>

        <div className={styles.content}>
          <Reveal as="p" className={styles.eyebrow}>
            Message
          </Reveal>
          <Reveal as="h2" className={styles.heading} delay={0.1}>
            {ceoMessage.title}
          </Reveal>

          {ceoMessage.body.map((paragraph, index) => (
            <Reveal as="p" key={paragraph.slice(0, 10)} className={styles.paragraph} delay={0.15 + index * 0.05}>
              {paragraph}
            </Reveal>
          ))}

          <Reveal as="p" className={styles.signature} delay={0.35}>
            {ceoMessage.role}　{ceoMessage.name}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
