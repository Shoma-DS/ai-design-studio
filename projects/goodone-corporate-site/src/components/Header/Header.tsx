"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="GOOD ONE トップへ">
          <span className={styles.logoMark}>G1</span>
          <span>
            <strong>{site.name}</strong>
            <small>{site.legalName}</small>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="メインナビゲーション">
          {nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className={styles.phone} href={`tel:${site.phone}`}>
          <Phone size={17} />
          <span>{site.phone}</span>
        </a>
        <button className={styles.menuButton} onClick={() => setOpen((value) => !value)} aria-label="メニュー">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      {open && (
        <div className={styles.drawer}>
          {nav.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className={styles.drawerCta} href="/contact" onClick={() => setOpen(false)}>
            無料相談・資料請求
          </a>
        </div>
      )}
    </header>
  );
}
