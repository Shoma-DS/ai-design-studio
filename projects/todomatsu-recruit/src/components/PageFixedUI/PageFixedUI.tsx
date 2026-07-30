"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { entry } from "@/data/site";
import styles from "./PageFixedUI.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PageFixedUI() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!rootRef.current) return;
      // ルート遷移(App Routerではlayoutが再マウントされないため)ごとに
      // 前ページのtoggleClass状態を持ち越さないようリセットしてから再構築する
      rootRef.current.classList.remove(styles.visible, styles.nearFooter);

      const heroEl = document.querySelector("#hero");
      const entryEl = document.querySelector("#entry");
      const footerEl = document.querySelector("footer");

      if (heroEl) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: "bottom top",
          end: 100000,
          toggleClass: { targets: rootRef.current, className: styles.visible },
        });
      } else {
        // Heroを持たない下層ページでは巨大な導入部がないため、最初から表示する
        rootRef.current.classList.add(styles.visible);
      }

      // EntryCta自体に本CTAボタンがあるため、そこに入った時点で固定CTAは隠す
      // (フッターだけをトリガーにすると、EntryCtaの本ボタンと固定CTAが重なって見える)
      if (entryEl) {
        ScrollTrigger.create({
          trigger: entryEl,
          start: "top bottom",
          endTrigger: footerEl || entryEl,
          end: footerEl ? "bottom bottom" : "bottom top",
          toggleClass: { targets: rootRef.current, className: styles.nearFooter },
        });
      } else if (footerEl) {
        ScrollTrigger.create({
          trigger: footerEl,
          start: "top bottom",
          end: "bottom bottom",
          toggleClass: { targets: rootRef.current, className: styles.nearFooter },
        });
      }
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className={styles.root}>
      <a href="#entry" className={styles.entryPill}>
        {entry.buttonLabel}
        <span aria-hidden="true">＋</span>
      </a>

      <div className={styles.scrollBadge} aria-hidden="true">
        <svg viewBox="0 0 120 120" className={styles.scrollBadgeRing}>
          <defs>
            <path id="pageScrollCircle" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
          </defs>
          <text>
            <textPath href="#pageScrollCircle" startOffset="0%">
              Scroll ・ Scroll ・ Scroll ・
            </textPath>
          </text>
        </svg>
        <span className={styles.scrollBadgeDot} />
      </div>
    </div>
  );
}
