import styles from "./MarqueeBand.module.css";

const PHRASE = "CONNECT PEOPLE. CONNECT REGIONS. CONNECT THE FUTURE.";

export default function MarqueeBand() {
  const words = new Array(6).fill(PHRASE);

  return (
    <section className={styles.marquee} aria-hidden="false">
      <div className={styles.bgWrap}>
        <picture>
          <source media="(min-width: 1024px)" srcSet="/images/driver-cabin-pc.png" />
          <img src="/images/driver-cabin-sp.png" alt="" aria-hidden="true" />
        </picture>
        <div className={styles.overlay} />
      </div>
      <div className={styles.track}>
        <div className={styles.group}>
          {words.map((word, i) => (
            <span key={`a-${i}`}>{word}</span>
          ))}
        </div>
        <div className={styles.group} aria-hidden="true">
          {words.map((word, i) => (
            <span key={`b-${i}`}>{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
