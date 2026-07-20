import { nav, site } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>GOOD ONE</p>
          <p className={styles.copy}>
            ERC日本輸入総代理店として、業務車両の稼働を止めないメンテナンスを全国へ広げます。
          </p>
        </div>
        <nav className={styles.links} aria-label="フッターナビゲーション">
          {nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <address className={styles.address}>
          {site.legalName}
          <br />
          {site.address}
          <br />
          TEL {site.phone}
        </address>
      </div>
    </footer>
  );
}
