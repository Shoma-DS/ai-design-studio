import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// このスキーマがそのまま「差し替え可能なパーツ」になる。
// 案件が変わっても、ここの値を変えるだけで別のLPヒーロー動画になる。
export const lpHeroPromoSchema = z.object({
  bgImage: z.string(),
  brandColor: zColor(),
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  cta: z.string(),
});

export const LpHeroPromo: React.FC<z.infer<typeof lpHeroPromoSchema>> = ({
  bgImage,
  brandColor,
  eyebrow,
  title,
  subtitle,
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 背景をゆっくりズームさせる（Ken Burns効果）
  const zoom = interpolate(frame, [0, 150], [1, 1.12], {
    extrapolateRight: "clamp",
  });

  const eyebrowIn = spring({ frame, fps, config: { damping: 200 } });
  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const subtitleIn = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200 },
  });
  const ctaIn = spring({ frame: frame - 45, fps, config: { damping: 200 } });

  const ctaPulse = interpolate(
    frame % 60,
    [0, 30, 60],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0d10" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={staticFile(bgImage)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* 可読性のための暗めのグラデーション */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 140,
        }}
      >
        <div
          style={{
            opacity: eyebrowIn,
            transform: `translateY(${interpolate(eyebrowIn, [0, 1], [20, 0])}px)`,
            color: brandColor,
            fontFamily: "sans-serif",
            fontSize: 32,
            letterSpacing: 6,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
            color: "white",
            fontFamily: "sans-serif",
            fontSize: 92,
            fontWeight: 800,
            textAlign: "center",
            textShadow: "0 4px 24px rgba(0,0,0,0.4)",
            marginBottom: 24,
          }}
        >
          {title}
        </div>

        <div
          style={{
            opacity: subtitleIn,
            transform: `translateY(${interpolate(subtitleIn, [0, 1], [20, 0])}px)`,
            color: "white",
            fontFamily: "sans-serif",
            fontSize: 36,
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [20, 0])}px) scale(${ctaPulse})`,
            backgroundColor: brandColor,
            color: "white",
            fontFamily: "sans-serif",
            fontSize: 32,
            fontWeight: 700,
            padding: "24px 64px",
            borderRadius: 999,
          }}
        >
          {cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
