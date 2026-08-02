import type { Metadata } from "next";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal/Reveal";
import { testimonials, siteMeta } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: `お客様の声｜${siteMeta.serviceName}`,
  description: "寺子屋クラウドを導入したお客様の声をご紹介します。",
};

export default function CasePage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <Reveal>
            <h1 className={styles.pageTitle}>お客様の声</h1>
            <p className={styles.pageSubtitle}>寺子屋クラウドを導入したお客様の声をご紹介します。</p>
          </Reveal>
        </div>
      </section>

      <section className={styles.grid}>
        <div className="container">
          <RevealGroup className={styles.cardGrid}>
            {testimonials.map((testimonial) => (
              <RevealItem key={testimonial.name} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.avatar}>{testimonial.name.slice(0, 1)}</span>
                  <h2 className={styles.headline}>{testimonial.headline}</h2>
                </div>
                <p className={styles.body}>{testimonial.body}</p>
                <p className={styles.name}>{testimonial.name}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </main>
  );
}
