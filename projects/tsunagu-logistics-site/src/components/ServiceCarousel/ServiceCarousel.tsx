"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/site";
import styles from "./ServiceCarousel.module.css";

const AUTOPLAY_MS = 5200;

export default function ServiceCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex((next + services.length) % services.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setIndex((current) => (current + 1) % services.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  const active = services[index];

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>OUR BUSINESS</p>
        <h2 className={styles.title}>事業紹介</h2>
      </div>

      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className={styles.slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 0.7, 0.3, 1] }}
          >
            <div className={styles.image}>
              <picture>
                <source media="(min-width: 1024px)" srcSet={active.image} />
                <img src={active.imageSp} alt={active.title} />
              </picture>
            </div>
            <div className={styles.copy}>
              <span className={styles.number}>{active.number}</span>
              <h3>{active.title}</h3>
              <p className={styles.lead}>{active.lead}</p>
              <p className={styles.description}>{active.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => goTo(index - 1)}
          aria-label="前のスライド"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => goTo(index + 1)}
          aria-label="次のスライド"
        >
          ›
        </button>
      </div>

      <div className={styles.pagination} role="tablist">
        {services.map((service, i) => (
          <button
            key={service.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${service.title}を表示`}
            className={styles.dot}
            onClick={() => goTo(i)}
          >
            {i < index ? (
              <span className={styles.dotFill} style={{ width: "100%" }} />
            ) : i > index ? (
              <span className={styles.dotFill} style={{ width: 0 }} />
            ) : (
              <span
                key={`${service.id}-${index}`}
                className={`${styles.dotFill} ${styles.dotFillActive}`}
                style={{
                  animationDuration: `${AUTOPLAY_MS}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
