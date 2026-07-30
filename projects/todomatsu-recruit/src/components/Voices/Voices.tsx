import { voices } from "@/data/site";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./Voices.module.css";

export default function Voices() {
  return (
    <section id="voices" className={styles.section}>
      <DecorationText text="Voice" speed={-1} className={styles.decoTop} />
      <span className={styles.bgBlob} aria-hidden="true" />

      <div className={styles.inner}>
        <Reveal as="p" className={styles.eyebrow}>
          Step 04
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          先輩の声
        </Reveal>

        <RevealGroup className={styles.grid}>
          {voices.map((voice) => (
            <article key={voice.id} className={styles.card}>
              <img className={styles.portrait} src={voice.image} alt={`${voice.name}さんのポートレートイラスト`} />
              <p className={styles.quote}>「{voice.quote}」</p>
              <p className={styles.body}>{voice.body}</p>
              <div className={styles.meta}>
                <p className={styles.name}>{voice.name}</p>
                <p className={styles.role}>
                  {voice.role}・{voice.years}
                </p>
              </div>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
