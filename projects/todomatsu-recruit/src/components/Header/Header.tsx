"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, companyInfo } from "@/data/site";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Headerはrootレイアウトにあり画面遷移で再マウントされないため、
    // pathnameが変わるたびに新しいページの実際のスクロール位置へ再同期する
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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
    <header id="top" className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${companyInfo.name} トップへ`}>
          <span className={styles.logoMark} aria-hidden="true">
            戸
          </span>
          <span className={styles.logoText}>
            トドマツ
            <span className={styles.logoSub}>Recruit Site</span>
          </span>
        </Link>

        <a href="#entry" className={styles.entryButton}>
          エントリーする
          <span aria-hidden="true">＋</span>
        </a>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="site-menu"
                className={styles.menuOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 0.7, 0.3, 1] }}
              >
                <motion.nav
                  className={styles.menuPanel}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.4, ease: [0.16, 0.7, 0.3, 1] }}
                  aria-label="サイト内ナビゲーション"
                >
                  <ul>
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.06, duration: 0.5, ease: [0.16, 0.7, 0.3, 1] }}
                      >
                        <Link href={link.href} onClick={() => setMenuOpen(false)}>
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>
                <button
                  type="button"
                  className={styles.backdrop}
                  aria-label="メニューを閉じる"
                  onClick={() => setMenuOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
