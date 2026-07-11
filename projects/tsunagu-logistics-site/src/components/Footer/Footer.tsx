import { companyInfo, navLinks } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logoMark} aria-hidden="true" />
          <div>
            <p className={styles.logoText}>TSUNAGU</p>
            <p className={styles.companyName}>{companyInfo.name}</p>
          </div>
        </div>

        <div className={styles.address}>
          <p>
            〒{companyInfo.postalCode}　{companyInfo.address}
          </p>
          <p>
            TEL：{companyInfo.tel}　FAX：{companyInfo.fax}
          </p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="フッターナビゲーション">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <p className={styles.copyright}>© {companyInfo.nameEn} ALL RIGHTS RESERVED.</p>
    </footer>
  );
}
