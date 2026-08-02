"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { primaryNav } from "@/data/site";
import styles from "./MobileNav.module.css";

export default function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.panel}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.closeRow}>
              <button className={styles.closeBtn} onClick={onClose} aria-label="メニューを閉じる">
                ×
              </button>
            </div>
            <nav className={styles.navList}>
              {primaryNav.map((item) => (
                <Link key={item.href} href={item.href} className={styles.navLink} onClick={onClose}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className={styles.ctaWrap}>
              <Link href="#signup" className="btn btnOutline" onClick={onClose}>
                ログイン
              </Link>
              <Link href="#signup" className="btn btnPrimary" onClick={onClose}>
                無料ではじめる
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
