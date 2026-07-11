"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/site";
import Counter from "./Counter";
import styles from "./NumbersSection.module.css";

const barHeights = [38, 62, 46, 80, 54, 70];

export default function NumbersSection() {
  return (
    <section className={styles.numbers} id="numbers">
      <div className={styles.header}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 0.7, 0.3, 1] }}
        >
          TSUNAGU&apos;S NUMBERS
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 0.7, 0.3, 1] }}
        >
          数字で見る
          <br />
          ツナグ物流
        </motion.h2>

        <svg className={styles.chart} viewBox="0 0 220 100" aria-hidden="true">
          {barHeights.map((h, i) => (
            <rect
              key={i}
              x={i * 34 + 6}
              y={100 - h}
              width="20"
              height={h}
              rx="3"
              fill={i % 2 === 0 ? "var(--color-amber-500)" : "var(--color-green-500)"}
              opacity="0.85"
            />
          ))}
          <polyline
            points="6,70 40,40 74,58 108,20 142,46 176,14 210,30"
            fill="none"
            stroke="var(--color-navy-700)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      </div>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            className={styles.card}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 0.7, 0.3, 1] } },
            }}
          >
            <p className={styles.value}>
              <Counter value={stat.value} />
              <span className={styles.suffix}>{stat.suffix}</span>
            </p>
            <p className={styles.label}>{stat.label}</p>
            <p className={styles.detail}>{stat.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
