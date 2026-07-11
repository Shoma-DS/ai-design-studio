"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/data/site";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header
      id="top"
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${
        menuOpen ? styles.headerMenuOpen : ""
      }`}
    >
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="TSUNAGU LOGISTICS トップへ">
          <span className={styles.logoMark} aria-hidden="true" />
          <span className={styles.logoText}>
            TSUNAGU
            <span className={styles.logoSub}>ツナグ物流株式会社</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="メインナビゲーション">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href="#recruit" className={styles.buttonOutline}>
            採用情報
          </a>
          <a href="#contact" className={styles.buttonFilled}>
            お問い合わせ
          </a>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 0.7, 0.3, 1] }}
          >
            <motion.nav
              className={styles.mobileNav}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 0.7, 0.3, 1] }}
              aria-label="モバイルナビゲーション"
            >
              <ul>
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.06, duration: 0.5, ease: [0.16, 0.7, 0.3, 1] }}
                  >
                    <a href={link.href} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className={styles.mobileActions}>
                <a href="#recruit" className={styles.buttonOutline} onClick={() => setMenuOpen(false)}>
                  採用情報
                </a>
                <a href="#contact" className={styles.buttonFilled} onClick={() => setMenuOpen(false)}>
                  お問い合わせ
                </a>
              </div>
            </motion.nav>
            <button
              type="button"
              className={styles.backdrop}
              aria-label="メニューを閉じる"
              onClick={() => setMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
