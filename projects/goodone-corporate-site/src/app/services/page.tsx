import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import { services } from "@/data/site";
import styles from "../page.module.css";

export default function ServicesPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <span className="eyebrow">Services</span>
          <h1>サービス紹介</h1>
          <p className="lead">施工内容を「何をするか」だけでなく「どんな現場課題に効くか」で整理しました。</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className={styles.cards}>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal className={styles.card} delay={index * 0.07} key={service.title}>
                  <span className={styles.cardIcon}>
                    <Icon size={24} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.lead}</p>
                  <p>{service.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section sectionAlt">
        <div className={`container ${styles.grid2}`}>
          <Reveal>
            <span className="eyebrow">Difference</span>
            <h2 className="sectionTitle">分解を前提にしない短時間施工と、導入後の運用支援。</h2>
            <p className="lead">
              参考サイトの「短時間」「非分解」「幅広いエンジン対応」という訴求を、法人が比較検討しやすい説明へ再構成しています。
            </p>
          </Reveal>
          <Reveal className={styles.imagePanel} delay={0.12}>
            <Image src="/images/service-pc.png" alt="クリーニング工程のイメージ" width={1100} height={820} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
