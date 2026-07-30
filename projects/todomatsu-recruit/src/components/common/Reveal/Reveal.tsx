"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Reveal.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  [key: string]: unknown;
};

export default function Reveal({ children, as: Tag = "div", className = "", delay = 0, y = 24, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      style={{ "--reveal-y": `${y}px` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
