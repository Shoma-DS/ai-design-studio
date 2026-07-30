"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./RevealGroup.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export default function RevealGroup({ children, className = "", stagger = 0.12 }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const items = gsap.utils.toArray<HTMLElement>(ref.current.children);
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`${styles.group} ${className}`}>
      {children}
    </div>
  );
}
