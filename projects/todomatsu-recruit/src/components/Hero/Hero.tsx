import Link from "next/link";
import { companyInfo, steps } from "@/data/site";
import MaskImage from "@/components/common/MaskImage/MaskImage";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <DecorationText text="Growth" speed={1.2} className={styles.decoTop} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{companyInfo.nameEn}</p>
          <h1 className={styles.heading}>
            根を張り、
            <br />
            育っていく。
          </h1>
          <p className={styles.lead}>{companyInfo.lead}</p>

          <ol className={styles.stepList}>
            {steps.map((step) => (
              <li key={step.id}>
                <Link href={step.href}>
                  <span className={styles.stepNumber}>Step {step.number}</span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.visual}>
          <MaskImage
            pcSrc="/images/hero-pc.png"
            spSrc="/images/hero-sp.png"
            alt="トドマツでのキャリアの成長を表す丘のイラスト"
          />
        </div>
      </div>

      <div className={styles.pagination} aria-hidden="true">
        <span className={styles.paginationDotActive} />
        {steps.map((step) => (
          <span key={step.id} className={styles.paginationDot} />
        ))}
      </div>
    </section>
  );
}
