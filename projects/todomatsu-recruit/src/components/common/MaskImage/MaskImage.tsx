"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MaskImage.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type MaskImageProps = {
  pcSrc: string;
  spSrc: string;
  alt: string;
  className?: string;
  panPercent?: number;
};

export default function MaskImage({ pcSrc, spSrc, alt, className = "", panPercent = 6 }: MaskImageProps) {
  const maskRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLImageElement>(null);
  const curtainLeftRef = useRef<HTMLSpanElement>(null);
  const curtainRightRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!innerRef.current) return;

      // 継続的な視差パン＋ズームアウト（参考サイトの.c-maskImgパン演出）
      gsap.fromTo(
        innerRef.current,
        { xPercent: -panPercent / 2, scale: 1.1 },
        {
          xPercent: panPercent / 2,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: maskRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 初回登場時のカーテンワイプリビール（重ねているためパン演出とは競合しない）
      if (curtainLeftRef.current && curtainRightRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: maskRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }).to(
          [curtainLeftRef.current, curtainRightRef.current],
          {
            xPercent: (i) => (i === 0 ? -100 : 100),
            duration: 1,
            ease: "power3.inOut",
          },
          0
        );
      }
    },
    { scope: maskRef }
  );

  return (
    <div ref={maskRef} className={`${styles.mask} ${className}`}>
      <picture>
        <source media="(min-width: 1024px)" srcSet={pcSrc} />
        <img ref={innerRef} src={spSrc} alt={alt} className={styles.inner} />
      </picture>
      <span ref={curtainLeftRef} className={styles.curtainLeft} aria-hidden="true" />
      <span ref={curtainRightRef} className={styles.curtainRight} aria-hidden="true" />
    </div>
  );
}
