import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const VideoScene: React.FC<{
  video: string;
  startFrom?: number;
  number?: string;
  eyebrow?: string;
  headline: string;
  sub?: string;
}> = ({ video, startFrom = 0, number, eyebrow, headline, sub }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = spring({ frame, fps, config: { damping: 200 } });
  const headlineIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const subIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1b1a" }}>
      <OffthreadVideo
        src={staticFile(video)}
        startFrom={startFrom}
        volume={0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 120px 120px" }}>
        {number || eyebrow ? (
          <div
            style={{
              opacity: labelIn,
              transform: `translateY(${interpolate(labelIn, [0, 1], [16, 0])}px)`,
              fontFamily: "sans-serif",
              fontSize: 26,
              color: number ? "#7fd8c8" : "white",
              letterSpacing: 6,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            {number ?? eyebrow}
          </div>
        ) : null}

        <div
          style={{
            opacity: headlineIn,
            transform: `translateY(${interpolate(headlineIn, [0, 1], [24, 0])}px)`,
            fontFamily: "sans-serif",
            fontSize: 64,
            color: "white",
            fontWeight: 800,
            textShadow: "0 4px 20px rgba(0,0,0,0.4)",
            lineHeight: 1.3,
            whiteSpace: "pre-line",
          }}
        >
          {headline}
        </div>

        {sub ? (
          <div
            style={{
              opacity: subIn,
              transform: `translateY(${interpolate(subIn, [0, 1], [20, 0])}px)`,
              fontFamily: "sans-serif",
              fontSize: 32,
              color: "rgba(255,255,255,0.85)",
              marginTop: 16,
            }}
          >
            {sub}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
