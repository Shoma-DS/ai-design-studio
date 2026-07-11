"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./Intro.module.css";

const photos = [
  {
    pc: "/images/handoff-pc.png",
    sp: "/images/handoff-sp.png",
    alt: "配達員が地域の商店主に荷物を手渡す様子",
    caption: "人をつなぐ",
  },
  {
    pc: "/images/warehouse-pc.png",
    sp: "/images/warehouse-sp.png",
    alt: "倉庫で連携しながら仕分け作業をするスタッフ",
    caption: "拠点をつなぐ",
  },
  {
    pc: "/images/highway-pc.png",
    sp: "/images/highway-sp.png",
    alt: "夕暮れの幹線道路を走るツナグ物流のトラック",
    caption: "地域をつなぐ",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.7, 0.3, 1] } },
};

export default function Intro() {
  return (
    <section className={styles.intro} id="intro">
      <motion.div
        className={styles.lead}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 0.7, 0.3, 1] }}
      >
        <p className={styles.leadEyebrow}>WHAT WE CARRY</p>
        <h2 className={styles.leadTitle}>
          荷物だけを運んでいるのではない。
          <br />
          そのひとつ先にある景色を運んでいる。
        </h2>
      </motion.div>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        {photos.map((photo) => (
          <motion.figure className={styles.card} key={photo.alt} variants={item}>
            <picture>
              <source media="(min-width: 1024px)" srcSet={photo.pc} />
              <img src={photo.sp} alt={photo.alt} loading="lazy" />
            </picture>
            <figcaption>{photo.caption}</figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
