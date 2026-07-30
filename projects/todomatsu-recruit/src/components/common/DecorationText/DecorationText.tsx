"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./DecorationText.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type DecorationTextProps = {
  text: string;
  speed?: number;
  className?: string;
};

export default function DecorationText({ text, speed = 1, className = "" }: DecorationTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const trigger = ref.current.closest("section") ?? ref.current.parentElement;
      gsap.to(ref.current, {
        yPercent: speed * 18,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`${styles.decorationText} ${className}`} aria-hidden="true">
      {text}
    </span>
  );
}
