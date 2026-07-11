"use client";

import { motion } from "framer-motion";
import styles from "./CtaBand.module.css";

export default function CtaBand() {
  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 0.7, 0.3, 1] }}
      >
        <p className={styles.text}>
          ツナグ物流の仕事や現場を、
          <br />
          もっと詳しく知りたい方へ。
        </p>
        <a href="#recruit" className={styles.pill}>
          採用情報を見る
          <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </section>
  );
}
