import { Reveal } from "@/components/Reveal/Reveal";
import styles from "./LegalPage.module.css";

export type LegalRow = { label: string; value: string };
export type LegalSection = { title: string; body: string };

export default function LegalPage({
  title,
  rows,
  sections,
}: {
  title: string;
  rows?: LegalRow[];
  sections?: LegalSection[];
}) {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <Reveal>
            <h1 className={styles.title}>{title}</h1>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <div className={styles.body}>
            {rows && (
              <Reveal>
                <div>
                  {rows.map((row) => (
                    <div className={styles.row} key={row.label}>
                      <span className={styles.rowLabel}>{row.label}</span>
                      <span className={styles.rowValue}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {sections?.map((section) => (
              <Reveal key={section.title}>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <p className={styles.sectionBody}>{section.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
