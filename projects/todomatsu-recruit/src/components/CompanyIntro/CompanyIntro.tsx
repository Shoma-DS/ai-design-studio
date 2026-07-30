"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { companyInfo, stats } from "@/data/site";
import MaskImage from "@/components/common/MaskImage/MaskImage";
import DecorationText from "@/components/common/DecorationText/DecorationText";
import Reveal from "@/components/common/Reveal/Reveal";
import RevealGroup from "@/components/common/RevealGroup/RevealGroup";
import styles from "./CompanyIntro.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function StatValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const counter = { value: 0 };
      gsap.to(counter, {
        value,
        duration: 1.4,
        ease: "power1.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(counter.value).toLocaleString("ja-JP");
        },
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: [value] }
  );

  return <span ref={ref}>0</span>;
}

export default function CompanyIntro() {
  return (
    <section id="company" className={styles.section}>
      <DecorationText text="History" speed={1} className={styles.decoTop} />

      <div className={styles.top}>
        <div className={styles.copy}>
          <Reveal as="p" className={styles.eyebrow}>
            Step 01
          </Reveal>
          <Reveal as="h2" className={styles.heading} delay={0.1}>
            トドマツを知る
          </Reveal>
        </div>

        <div className={styles.visual}>
          <MaskImage
            pcSrc="/images/company-pc.png"
            spSrc="/images/company-sp.png"
            alt="トドマツの本社・1号店の外観イラスト"
          />
        </div>

        <div className={styles.detail}>
          <Reveal as="p" className={styles.subLabel} delay={0.1}>
            ○ トドマツの歩み
          </Reveal>
          <Reveal as="p" className={styles.lead} delay={0.2}>
            {companyInfo.founded}、小さな一軒の店から始まりました。
            規模の大きさよりも、地域との距離の近さを大切に。
          </Reveal>
        </div>
      </div>

      <RevealGroup className={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <p className={styles.statValue}>
              <StatValue value={stat.value} />
              <span className={styles.statSuffix}>{stat.suffix}</span>
            </p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}
