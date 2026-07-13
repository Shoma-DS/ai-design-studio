import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const stats = [
  { value: "48", label: "拠点" },
  { value: "32,000", label: "件/日の配送" },
  { value: "1,200", label: "名のドライバー" },
];

export const Closing: React.FC<{ image: string }> = ({ image }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statsIn = stats.map((_, i) =>
    spring({ frame: frame - i * 8, fps, config: { damping: 200 } }),
  );

  const logoIn = spring({ frame: frame - 60, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 75, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1b1a" }}>
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <Img
          src={staticFile(image)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(13,27,26,0.7) 0%, rgba(13,27,26,0.95) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
          paddingBottom: 220,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              opacity: statsIn[i],
              transform: `translateY(${interpolate(statsIn[i], [0, 1], [24, 0])}px)`,
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 800, color: "#7fd8c8" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 26, color: "white", marginTop: 8 }}>
              {s.label}
            </div>
          </div>
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}
      >
        <div
          style={{
            opacity: logoIn,
            transform: `translateY(${interpolate(logoIn, [0, 1], [16, 0])}px)`,
            fontFamily: "sans-serif",
            fontSize: 44,
            fontWeight: 800,
            color: "white",
            letterSpacing: 2,
          }}
        >
          運ぶ、その先へ。
        </div>
        <div
          style={{
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [16, 0])}px)`,
            fontFamily: "sans-serif",
            fontSize: 22,
            color: "#7fd8c8",
            marginTop: 16,
            letterSpacing: 4,
          }}
        >
          TSUNAGU LOGISTICS CO., LTD.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
