"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { footerNav, legalNav, siteMeta } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const bandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <>
      <section className={styles.ctaBand} ref={bandRef}>
        <motion.div className={styles.ctaBandBg} style={{ y }} />
        <div className="container">
          <div className={styles.ctaBandInner}>
            <div className={styles.ctaBlock}>
              <span className={styles.ctaCaption}>＼ 実際の画面を見てみたい ／</span>
              <Link href="#signup" className="btn btnPrimary">
                まずは無料ではじめる
              </Link>
            </div>
            <div className={styles.ctaBlock}>
              <span className={styles.ctaCaption}>＼ 料金や機能などが知りたい ／</span>
              <Link href="#line" className="btn btnSage">
                公式LINEで相談する
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.top}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark} />
              {siteMeta.serviceName}
            </Link>

            <nav className={styles.navRow}>
              {footerNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.divider} />

            <nav className={styles.legalRow}>
              {legalNav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className={styles.copyright}>Copyright © {siteMeta.operatorName} All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
