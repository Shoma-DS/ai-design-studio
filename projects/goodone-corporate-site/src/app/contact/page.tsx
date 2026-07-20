import { Mail, Phone } from "lucide-react";
import Reveal from "@/components/Reveal/Reveal";
import { site } from "@/data/site";
import styles from "../page.module.css";

export default function ContactPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>お問い合わせ</h1>
          <p className="lead">施工相談、資料請求、代理店導入のご相談を受け付けます。</p>
        </div>
      </section>
      <section className="section">
        <div className={`container ${styles.contactBox}`}>
          <Reveal>
            <span className="eyebrow">First Action</span>
            <h2 className="sectionTitle">車両の症状や導入目的をお聞かせください。</h2>
            <p className="lead">
              電話・メール・フォームの3つの導線を明確にし、スマホでも迷わず問い合わせできる構成です。
            </p>
            <p className="lead">
              <Phone size={18} /> {site.phone}
              <br />
              <Mail size={18} /> {site.email}
            </p>
          </Reveal>
          <Reveal className={styles.form} delay={0.12}>
            <label>
              会社名
              <input type="text" placeholder="例）株式会社サンプル運輸" />
            </label>
            <label>
              お名前
              <input type="text" placeholder="例）山田 太郎" />
            </label>
            <label>
              メールアドレス
              <input type="email" placeholder="example@example.com" />
            </label>
            <label>
              ご相談内容
              <textarea placeholder="車両の症状、台数、導入検討内容など" />
            </label>
            <button className="button buttonPrimary" type="button">
              送信内容を確認する
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
