import MaskImage from "@/components/common/MaskImage/MaskImage";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import styles from "./FloorIntro.module.css";

export default function FloorIntro() {
  return (
    <section id="floor" className={styles.section}>
      <DecorationText text="Training" speed={-1.1} className={styles.decoTop} />

      <div className={styles.copy}>
        <Reveal as="p" className={styles.eyebrow}>
          Step 02
        </Reveal>
        <Reveal as="h2" className={styles.heading} delay={0.1}>
          現場を知る
        </Reveal>
      </div>

      <div className={styles.visual}>
        <MaskImage
          pcSrc="/images/floor-pc.png"
          spSrc="/images/floor-sp.png"
          alt="トドマツの店内通路を俯瞰したイラスト"
        />
      </div>

      <div className={styles.detail}>
        <Reveal as="p" className={styles.subLabel} delay={0.1}>
          ○ 配属までの流れ
        </Reveal>
        <Reveal as="p" className={styles.lead} delay={0.2}>
          新卒入社後は、まず店舗の売場に立ちます。品出し・発注・接客など、日々の業務を通して
          「お客さまにとっての使いやすさ」を体で覚える期間です。ここで見えてきた課題感が、
          将来どの専門分野に進むかを考えるヒントになります。
        </Reveal>
      </div>
    </section>
  );
}
