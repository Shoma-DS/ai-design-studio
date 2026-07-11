"use client";

import { motion } from "framer-motion";
import { services } from "@/data/site";
import styles from "./ServiceList.module.css";

export default function ServiceList() {
  return (
    <section className={styles.serviceList} id="service">
      <div className={styles.header}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 0.7, 0.3, 1] }}
        >
          OUR SERVICE
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 0.7, 0.3, 1] }}
        >
          事業内容
        </motion.h2>
      </div>

      <ul className={styles.list}>
        {services.map((service, index) => (
          <motion.li
            key={service.id}
            className={styles.row}
            data-reverse={index % 2 === 1}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 0.7, 0.3, 1] }}
          >
            <div className={styles.image}>
              <picture>
                <source media="(min-width: 1024px)" srcSet={service.image} />
                <img src={service.imageSp} alt={service.title} loading="lazy" />
              </picture>
            </div>
            <div className={styles.copy}>
              <span className={styles.number}>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
