import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./theme";

/** 下からふわっと出る共通の入場アニメーション */
export const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [22, 0])}px)`,
  };
};

/** ブランドロゴ（●＋サービス名）。サイトヘッダーのロックアップと同じ構成 */
export const BrandMark: React.FC<{ size?: number; color?: string }> = ({
  size = 44,
  color = colors.primary900,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.3,
      fontFamily: fonts.serif,
      fontSize: size,
      fontWeight: 700,
      color,
    }}
  >
    <span
      style={{
        width: size * 0.34,
        height: size * 0.34,
        borderRadius: "50%",
        background: colors.accent600,
      }}
    />
    寺子屋クラウド
  </div>
);

/** セクション見出し（連番＋ラベル） */
export const SceneLabel: React.FC<{ number: string; label: string; delay?: number }> = ({
  number,
  label,
  delay = 0,
}) => {
  const rise = useRise(delay);
  return (
    <div style={{ ...rise, display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 4,
          color: colors.accent600,
        }}
      >
        {number}
      </span>
      <span style={{ width: 44, height: 2, background: colors.accent600, opacity: 0.5 }} />
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 3,
          color: colors.primary700,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Headline: React.FC<{ text: string; delay?: number; color?: string }> = ({
  text,
  delay = 8,
  color = colors.primary900,
}) => {
  const rise = useRise(delay);
  return (
    <div
      style={{
        ...rise,
        fontFamily: fonts.serif,
        fontSize: 62,
        fontWeight: 700,
        lineHeight: 1.35,
        letterSpacing: 1,
        whiteSpace: "pre-line",
        color,
      }}
    >
      {text}
    </div>
  );
};

export const SubCopy: React.FC<{ text: string; delay?: number }> = ({ text, delay = 16 }) => {
  const rise = useRise(delay);
  return (
    <div
      style={{
        ...rise,
        marginTop: 22,
        fontFamily: fonts.sans,
        fontSize: 28,
        fontWeight: 500,
        lineHeight: 1.7,
        whiteSpace: "pre-line",
        color: colors.primary700,
      }}
    >
      {text}
    </div>
  );
};

/** UIモックを載せるカード。サイトのDeviceFrameに近い見え方に寄せる */
export const MockCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  width?: number;
}> = ({ children, delay = 12, width = 760 }) => {
  const rise = useRise(delay);
  return (
    <div
      style={{
        ...rise,
        width,
        background: colors.white,
        borderRadius: 20,
        border: `1px solid ${colors.borderSoft}`,
        boxShadow: "0 40px 80px -40px rgba(30,38,51,0.45)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
