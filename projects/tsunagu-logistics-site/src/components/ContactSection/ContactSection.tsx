"use client";

import { motion } from "framer-motion";
import { companyInfo } from "@/data/site";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section className={styles.contact} id="contact">
      <motion.div
        className={styles.copy}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 0.7, 0.3, 1] }}
      >
        <p className={styles.eyebrow}>CONTACT</p>
        <h2 className={styles.title}>お問い合わせ</h2>
        <p className={styles.lead}>
          配送のご相談、お見積り、採用に関するお問い合わせなど、
          お気軽にご連絡ください。
        </p>

        <div className={styles.buttons}>
          <a href="mailto:info@tsunagu-logistics.example.co.jp" className={styles.buttonPrimary}>
            メールでのお問い合わせ
          </a>
          <a href={`tel:${companyInfo.tel.replace(/-/g, "")}`} className={styles.buttonSecondary}>
            お電話でのお問い合わせ（{companyInfo.tel}）
          </a>
        </div>
      </motion.div>

      <motion.div
        className={styles.image}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 0.7, 0.3, 1] }}
      >
        <picture>
          <source media="(min-width: 1024px)" srcSet="/images/meeting-pc.png" />
          <img src="/images/meeting-sp.png" alt="オフィスでミーティングをするツナグ物流のスタッフ" />
        </picture>
      </motion.div>
    </section>
  );
}
