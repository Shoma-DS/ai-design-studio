import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "./theme";
import { BrandMark, Headline, MockCard, SceneLabel, SubCopy, useRise } from "./ui";

const SceneShell: React.FC<{ children: React.ReactNode; background?: string }> = ({
  children,
  background = colors.bgCanvas,
}) => (
  <AbsoluteFill style={{ background }}>
    {/* 背景の淡い光暈。サイトのヒーローと同じ雰囲気に揃える */}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 85% 12%, rgba(201,122,69,0.10), transparent 45%), radial-gradient(circle at 2% 95%, rgba(124,154,135,0.12), transparent 50%)",
      }}
    />
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 130px",
        gap: 70,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const TextCol: React.FC<{
  number: string;
  label: string;
  headline: string;
  sub: string;
}> = ({ number, label, headline, sub }) => (
  <div style={{ flex: "0 0 42%" }}>
    <SceneLabel number={number} label={label} />
    <Headline text={headline} />
    <SubCopy text={sub} />
  </div>
);

/* ---------- 01 集客：LINEステップ配信のシナリオが組み上がる ---------- */

const StepNode: React.FC<{ text: string; delay: number; tone: "start" | "msg" | "branch" }> = ({
  text,
  delay,
  tone,
}) => {
  const rise = useRise(delay);
  const palette = {
    start: { bg: colors.accent100, border: colors.accent200, color: colors.accent600 },
    msg: { bg: colors.primary50, border: colors.primary200, color: colors.primary700 },
    branch: { bg: colors.sage100, border: "#cfdad3", color: colors.sage600 },
  }[tone];

  return (
    <div
      style={{
        ...rise,
        padding: "12px 20px",
        borderRadius: 10,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.color,
        fontFamily: fonts.sans,
        fontSize: 20,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

const Connector: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame - delay, [0, 12], [0, 26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ width: 2, height: h, background: colors.primary300, margin: "0 auto" }} />;
};

export const MarketingScene: React.FC = () => (
  <SceneShell>
    <TextCol
      number="01"
      label="集客"
      headline={"LINEも、LPも、\nこの中で完結する。"}
      sub={"ステップ配信のシナリオを、\nドラッグ操作だけで組み立てられます。"}
    />
    <MockCard width={700}>
      <div
        style={{
          padding: "26px 30px",
          borderBottom: `1px solid ${colors.borderSoft}`,
          fontFamily: fonts.sans,
          fontSize: 20,
          fontWeight: 700,
          color: colors.primary900,
        }}
      >
        シナリオ編集
      </div>
      <div style={{ padding: "34px 30px 44px", display: "flex", flexDirection: "column" }}>
        <StepNode text="友だち追加" delay={20} tone="start" />
        <Connector delay={26} />
        <StepNode text="講座紹介メッセージ" delay={32} tone="msg" />
        <Connector delay={38} />
        <StepNode text="3日後：無料体験へ案内" delay={44} tone="msg" />
        <Connector delay={50} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <StepNode text="開封あり → 個別相談" delay={56} tone="branch" />
          </div>
          <div style={{ flex: 1 }}>
            <StepNode text="未開封 → 再送" delay={62} tone="branch" />
          </div>
        </div>
      </div>
    </MockCard>
  </SceneShell>
);

/* ---------- 02 学び：進捗バーが伸びてレッスンが完了していく ---------- */

const LessonRow: React.FC<{ title: string; doneAt: number | null; delay: number }> = ({
  title,
  doneAt,
  delay,
}) => {
  const frame = useCurrentFrame();
  const rise = useRise(delay);
  const isDone = doneAt !== null && frame >= doneAt;

  return (
    <div
      style={{
        ...rise,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: 10,
        border: `1px solid ${colors.borderSoft}`,
        background: colors.white,
        fontFamily: fonts.sans,
        fontSize: 20,
        color: colors.primary800,
      }}
    >
      <span>{title}</span>
      <span
        style={{
          fontWeight: 700,
          color: isDone ? colors.sage600 : colors.accent600,
          transition: "none",
        }}
      >
        {isDone ? "✓ 完了" : "学習中"}
      </span>
    </div>
  );
};

export const LearningScene: React.FC = () => {
  const frame = useCurrentFrame();
  // 進捗バーが 34% → 100% まで伸びる
  const progress = interpolate(frame, [30, 95], [34, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell background={colors.bgWarm}>
      <TextCol
        number="02"
        label="学び"
        headline={"進んだ実感が、\n続ける力になる。"}
        sub={"どこまで学んだかがひと目でわかり、\n受講生の離脱を防ぎます。"}
      />
      <MockCard width={700}>
        <div
          style={{
            padding: "26px 30px",
            borderBottom: `1px solid ${colors.borderSoft}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: fonts.sans,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary900 }}>
            Webライティング講座
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: colors.sage600,
              background: colors.sage100,
              borderRadius: 999,
              padding: "6px 16px",
            }}
          >
            学習中
          </span>
        </div>

        <div style={{ padding: "28px 30px 36px" }}>
          <div
            style={{
              background: colors.primary50,
              borderRadius: 12,
              padding: "18px 20px",
              marginBottom: 22,
            }}
          >
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 19,
                fontWeight: 700,
                color: colors.primary900,
                marginBottom: 12,
              }}
            >
              コース進捗 {Math.round(progress)}%
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 6,
                background: colors.primary200,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${colors.sage500}, ${colors.accent500})`,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <LessonRow title="1. 読まれる見出しの作り方" doneAt={0} delay={20} />
            <LessonRow title="2. 構成のテンプレート" doneAt={60} delay={28} />
            <LessonRow title="3. 感想文を提出する" doneAt={92} delay={36} />
          </div>
        </div>
      </MockCard>
    </SceneShell>
  );
};

/* ---------- 03 コミュニティ：チャットが順に届く ---------- */

const Bubble: React.FC<{
  name: string;
  text: string;
  delay: number;
  self?: boolean;
}> = ({ name, text, delay, self }) => {
  const rise = useRise(delay);
  return (
    <div
      style={{
        ...rise,
        alignSelf: self ? "flex-end" : "flex-start",
        maxWidth: "82%",
        padding: "14px 18px",
        borderRadius: 14,
        background: self ? colors.accent100 : colors.white,
        border: `1px solid ${self ? colors.accent200 : colors.borderSoft}`,
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: self ? colors.accent600 : colors.primary600,
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 20, color: colors.primary800, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
};

export const CommunityScene: React.FC = () => (
  <SceneShell>
    <TextCol
      number="03"
      label="コミュニティ"
      headline={"ひとりで学ばせない、\n場をつくる。"}
      sub={"講師と受講生、受講生同士。\n続く理由は、いつも人の側にあります。"}
    />
    <MockCard width={700}>
      <div
        style={{
          padding: "26px 30px",
          borderBottom: `1px solid ${colors.borderSoft}`,
          fontFamily: fonts.sans,
          fontSize: 20,
          fontWeight: 700,
          color: colors.primary900,
        }}
      >
        # 質問・相談
      </div>
      <div
        style={{
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: colors.bgCanvas,
          minHeight: 380,
        }}
      >
        <Bubble name="受講生 A" text="第3章の課題でつまずいています…" delay={18} />
        <Bubble name="講師" text="いいところに気づきましたね。一緒に見ていきましょう！" delay={40} self />
        <Bubble name="受講生 B" text="私も同じところで悩んでいました🙋" delay={62} />
      </div>
    </MockCard>
  </SceneShell>
);

/* ---------- タイトルカード ---------- */

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const markRise = useRise(0);
  const titleRise = useRise(10);
  const subRise = useRise(20);
  const lineWidth = interpolate(frame - 26, [0, 20], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.primary900 }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 22% 28%, rgba(201,122,69,0.30), transparent 55%), radial-gradient(circle at 80% 74%, rgba(124,154,135,0.24), transparent 55%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={markRise}>
          <BrandMark size={46} color={colors.white} />
        </div>

        <div
          style={{
            ...titleRise,
            marginTop: 34,
            fontFamily: fonts.serif,
            fontSize: 92,
            fontWeight: 700,
            color: colors.white,
            letterSpacing: 2,
          }}
        >
          寺子屋クラウドとは？
        </div>

        <div
          style={{
            width: lineWidth,
            height: 3,
            marginTop: 30,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${colors.sage500}, ${colors.accent500})`,
          }}
        />

        <div
          style={{
            ...subRise,
            marginTop: 30,
            fontFamily: fonts.sans,
            fontSize: 30,
            fontWeight: 500,
            color: colors.primary200,
            letterSpacing: 1,
          }}
        >
          「集客」「学び」「コミュニティ運営」を、これひとつで。
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
