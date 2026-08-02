"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Accordion.module.css";

export default function Accordion({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className={styles.item} key={item.q}>
            <button
              className={styles.question}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className={styles.answerWrap}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className={styles.answer}>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
