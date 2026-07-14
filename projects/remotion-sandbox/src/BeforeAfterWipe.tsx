import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const BeforeAfterWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 静止 → ワイプ → 静止、の3フェーズ構成
  const holdBefore = 20;
  const wipeStart = holdBefore;
  const wipeDuration = 50;
  const wipeEnd = wipeStart + wipeDuration;

  const wipeProgress = interpolate(frame, [wipeStart, wipeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imgHeight = height * 0.86;
  const imgWidth = (864 / 1821) * imgHeight;
  const imgLeft = (width - imgWidth) / 2;
  const imgTop = height * 0.07;

  const beforeBadgeOpacity = interpolate(
    frame,
    [0, 10, wipeStart, wipeStart + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const afterBadgeIn = spring({
    frame: frame - (wipeEnd - 15),
    fps,
    config: { damping: 200 },
  });

  const dividerX = imgLeft + imgWidth * wipeProgress;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f1ea" }}>
      {/* Before（下敷き） */}
      <div
        style={{
          position: "absolute",
          left: imgLeft,
          top: imgTop,
          width: imgWidth,
          height: imgHeight,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        }}
      >
        <Img
          src={staticFile("before-full.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* After（ワイプで右へ広がりながら重なる） */}
      <div
        style={{
          position: "absolute",
          left: imgLeft,
          top: imgTop,
          width: imgWidth * wipeProgress,
          height: imgHeight,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: wipeProgress > 0.02 ? "0 30px 80px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <Img
          src={staticFile("after-full.png")}
          style={{ width: imgWidth, height: imgHeight, objectFit: "cover" }}
        />
      </div>

      {/* 区切り線 */}
      {wipeProgress > 0.001 && wipeProgress < 0.999 && (
        <div
          style={{
            position: "absolute",
            left: dividerX - 2,
            top: imgTop,
            width: 4,
            height: imgHeight,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 20px rgba(0,0,0,0.35)",
            borderRadius: 4,
          }}
        />
      )}

      {/* Before バッジ */}
      <div
        style={{
          position: "absolute",
          left: imgLeft + 24,
          top: imgTop + 24,
          opacity: beforeBadgeOpacity,
          backgroundColor: "rgba(20,20,20,0.75)",
          color: "white",
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 34,
          padding: "10px 28px",
          borderRadius: 999,
          letterSpacing: 2,
        }}
      >
        Before
      </div>

      {/* After バッジ */}
      <div
        style={{
          position: "absolute",
          left: imgLeft + 24,
          top: imgTop + 24,
          opacity: afterBadgeIn,
          transform: `translateY(${interpolate(afterBadgeIn, [0, 1], [-10, 0])}px)`,
          backgroundColor: "#b98b56",
          color: "white",
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 34,
          padding: "10px 28px",
          borderRadius: 999,
          letterSpacing: 2,
        }}
      >
        After
      </div>

      {/* 下部キャプション */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.03,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 30,
          color: "#3a2e22",
          opacity: interpolate(frame, [wipeEnd, wipeEnd + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        同じ内容でも、デザイン次第でこんなに変わる。
      </div>
    </AbsoluteFill>
  );
};
