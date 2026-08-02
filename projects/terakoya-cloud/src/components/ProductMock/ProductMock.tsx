import type { LucideIcon } from "lucide-react";
import styles from "./ProductMock.module.css";

export function LearningDashboardMock() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>寺子屋クラウド</div>
        <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>Webライティング講座</div>
        <div className={styles.sidebarItem}>基礎編</div>
        <div className={styles.sidebarItem}>実践編</div>
        <div className={styles.sidebarItem}>添削・質問</div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <span style={{ fontWeight: 700, color: "var(--text-heading)" }}>実践編・第3章</span>
          <span className={styles.chip}>学習中</span>
        </div>
        <div className={styles.progressCard}>
          <span style={{ fontWeight: 700 }}>コース進捗 68%</span>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: "68%" }} />
          </div>
        </div>
        <div className={styles.lessonRow}>
          <span>1. 読まれる見出しの作り方</span>
          <span className={styles.lessonDone}>✓ 完了</span>
        </div>
        <div className={styles.lessonRow}>
          <span>2. 構成のテンプレート</span>
          <span className={styles.lessonDone}>✓ 完了</span>
        </div>
        <div className={styles.lessonRow}>
          <span>3. 感想文を提出する</span>
          <span style={{ color: "var(--accent-600)", fontWeight: 700 }}>学習中</span>
        </div>
      </div>
    </div>
  );
}

export function CommunityChatMock() {
  return (
    <div className={styles.chat}>
      <div className={styles.chatSidebar}>
        <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>チャンネル</div>
        <div className={styles.sidebarItem}># 全体連絡</div>
        <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}># 質問・相談</div>
        <div className={styles.sidebarItem}># 雑談</div>
      </div>
      <div className={styles.chatMain}>
        <div className={styles.chatHeader}># 質問・相談</div>
        <div className={styles.bubble}>
          <div className={styles.bubbleName}>受講生 A</div>
          先生、第3章の課題で質問があります！
        </div>
        <div className={`${styles.bubble} ${styles.bubbleSelf}`}>
          <div className={styles.bubbleName}>講師</div>
          いいですね、一緒に見ていきましょう！
        </div>
        <div className={styles.bubble}>
          <div className={styles.bubbleName}>受講生 B</div>
          私も同じところで悩んでました🙋
        </div>
      </div>
    </div>
  );
}

export function AbstractFeatureCard({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className={styles.abstract}>
      <div className={styles.abstractIconPanel}>
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <span className={styles.abstractLabel}>{label}</span>
    </div>
  );
}
