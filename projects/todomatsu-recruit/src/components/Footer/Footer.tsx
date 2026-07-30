import Link from "next/link";
import { companyInfo, navLinks } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.name}>{companyInfo.name}</p>
          <p className={styles.address}>
            〒{companyInfo.postalCode} {companyInfo.address}
          </p>
          <p className={styles.tel}>TEL {companyInfo.tel}</p>
        </div>

        <nav aria-label="フッターナビゲーション">
          <ul className={styles.nav}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className={styles.copyright}>&copy; {companyInfo.name}</p>
    </footer>
  );
}
