import Reveal from "@/components/Reveal/Reveal";
import { company } from "@/data/site";
import styles from "../page.module.css";

export default function AboutPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>会社概要</h1>
          <p className="lead">
            日本総代理店、特許技術、全国ネットワークという強みを明確に伝える企業ページです。
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Profile</span>
            <h2 className="sectionTitle">現場品質を全国へ広げる専門企業。</h2>
            <p className="lead">
              株式会社グッドワンは、ERC製カーボンクリーニングシステムの日本輸入総代理店として、
              業務車両向けメンテナンス、DPFアッシュクリーニング、水素カーボンクリーニングを展開しています。
            </p>
          </Reveal>
          <table className={styles.table}>
            <tbody>
              {company.map(([head, body]) => (
                <tr key={head}>
                  <th>{head}</th>
                  <td>{body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
