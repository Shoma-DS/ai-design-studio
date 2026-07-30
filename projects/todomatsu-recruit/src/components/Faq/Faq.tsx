import { faqs } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <section id="faq" className={styles.section}>
      <DecorationText text="FAQ" speed={1} className={styles.decoTop} />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          FAQ
        </Reveal>
        <Reveal as="h1" className={styles.heading} delay={0.1}>
          よくある質問
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          学生の皆さまからよくいただくご質問をまとめました。
        </Reveal>

        <RevealGroup className={styles.list} stagger={0.06}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.item}>
              <p className={styles.question}>
                <span className={styles.mark} aria-hidden="true">
                  Q
                </span>
                {faq.question}
              </p>
              <p className={styles.answer}>
                <span className={styles.mark} aria-hidden="true">
                  A
                </span>
                {faq.answer}
              </p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
