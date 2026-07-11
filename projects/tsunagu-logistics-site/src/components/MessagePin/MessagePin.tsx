"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MessagePin.module.css";

const messages = [
  {
    title: "人をつなぐ。",
    body: "受け取る人の顔を思い浮かべながら、荷物を運ぶ。ひとつの配達の先に、誰かの日常がある。",
  },
  {
    title: "地域をつなぐ。",
    body: "都市と郊外、拠点と拠点。離れた場所を、確かな時間でつなぐことが、暮らしを支える力になる。",
  },
  {
    title: "未来をつなぐ。",
    body: "今日届けたものが、次の仕事につながり、次の暮らしにつながっていく。ツナグ物流は、その先へ運び続ける。",
  },
];

export default function MessagePin() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      if (!lines.length || !wrapperRef.current) return;

      gsap.set(lines, { opacity: 0, y: 32 });

      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: `+=${lines.length * 480}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const segment = 1 / lines.length;
          lines.forEach((line, i) => {
            const segStart = i * segment;
            const segEnd = segStart + segment * 0.72;
            const local = gsap.utils.clamp(0, 1, (progress - segStart) / (segEnd - segStart));
            gsap.set(line, {
              opacity: local,
              y: 32 * (1 - local),
            });
          });
        },
      });

      return () => trigger.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.message} ref={wrapperRef}>
      <div className={styles.inner}>
        <div className={styles.bgWrap}>
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/driver-cabin-pc.png" />
            <img src="/images/driver-cabin-sp.png" alt="運転席でルートを確認するドライバー" />
          </picture>
          <div className={styles.overlay} />
        </div>

        <div className={styles.textCol}>
          {messages.map((message, index) => (
            <div
              key={message.title}
              className={styles.line}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
            >
              <h3>{message.title}</h3>
              <p>{message.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
