"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryNav, siteMeta } from "@/data/site";
import MobileNav from "@/components/MobileNav/MobileNav";
import styles from "./Header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark} />
          {siteMeta.serviceName}
        </Link>

        <nav className={styles.nav}>
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="#login" className={styles.loginLink}>
            ログイン
          </Link>
          <Link href="#signup" className={`btn btnDark ${styles.ctaBtn}`}>
            無料登録して使う
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
