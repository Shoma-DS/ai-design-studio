import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "./theme";
import { BrandMark, useRise } from "./ui";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineRise = useRise(6);
  const markRise = useRise(22);
  const ctaRise = useRise(34);

  // 背景の光暈をゆっくり動かして、静止画に見えないようにする
  const drift = interpolate(frame, [0, 150], [0, 26], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.primary900 }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${drift}px, ${-drift * 0.4}px, 0)`,
          background:
            "radial-gradient(circle at 26% 70%, rgba(201,122,69,0.32), transparent 52%), radial-gradient(circle at 76% 26%, rgba(124,154,135,0.26), transparent 52%)",
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            ...headlineRise,
            fontFamily: fonts.display,
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.4,
            textAlign: "center",
            color: colors.white,
            whiteSpace: "pre-line",
            letterSpacing: 2,
          }}
        >
          {"教えるを、\n続けられる仕事に。"}
        </div>

        <div style={{ ...markRise, marginTop: 52 }}>
          <BrandMark size={40} color={colors.white} />
        </div>

        <div
          style={{
            ...ctaRise,
            marginTop: 38,
            padding: "20px 56px",
            borderRadius: 10,
            background: colors.accent600,
            color: colors.white,
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          まずは無料ではじめる
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
