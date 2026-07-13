"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { topics } from "@/data/site";
import styles from "./Hero.module.css";

export default function Hero() {
  const [isMovieOpen, setIsMovieOpen] = useState(false);

  useEffect(() => {
    if (!isMovieOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMovieOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMovieOpen]);

  return (
    <section className={styles.hero}>
      <div className={styles.bgWrap}>
        <video
          className={styles.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-pc.png"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <picture className={styles.bgImageFallback}>
          <source media="(min-width: 1024px)" srcSet="/images/hero-pc.png" />
          <img src="/images/hero-sp.png" alt="前を見据えるツナグ物流のドライバー" />
        </picture>
        <div className={styles.overlay} />
      </div>

      <div className={styles.accentStripe} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.textBlock}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.7, 0.3, 1] }}
          >
            TSUNAGU LOGISTICS
          </motion.p>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 0.7, 0.3, 1] }}
          >
            <span>運ぶ、</span>
            <span>その先へ。</span>
          </motion.h1>

          <motion.p
            className={styles.subcopy}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 0.7, 0.3, 1] }}
          >
            TSUNAGU CONNECTS WHAT MATTERS.
          </motion.p>
        </div>

        <motion.button
          type="button"
          className={styles.movie}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 0.7, 0.3, 1] }}
          onClick={() => setIsMovieOpen(true)}
        >
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/control-room-pc.png" />
            <img src="/images/control-room-sp.png" alt="ツナグ物流の紹介動画サムネイル" />
          </picture>
          <span className={styles.playButton} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 2.5L13.5 8L4 13.5V2.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.movieLabel}>
            会社紹介動画を見る
            <br />
            30 sec.
          </span>
        </motion.button>
      </div>

      <div className={styles.topicsBar}>
        <span className={styles.topicsLabel}>Topics</span>
        <span className={styles.topicsDivider} aria-hidden="true" />
        <span className={styles.topicsDate}>{topics.date}</span>
        <span className={styles.topicsText}>{topics.text}</span>
        <span className={styles.topicsArrow} aria-hidden="true">
          →
        </span>
      </div>

      <AnimatePresence>
        {isMovieOpen ? (
          <motion.div
            className={styles.movieModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsMovieOpen(false)}
          >
            <motion.div
              className={styles.movieModal}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 0.7, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.movieModalClose}
                aria-label="閉じる"
                onClick={() => setIsMovieOpen(false)}
              >
                ×
              </button>
              <video
                className={styles.movieModalVideo}
                src="/videos/company-intro.mp4"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
