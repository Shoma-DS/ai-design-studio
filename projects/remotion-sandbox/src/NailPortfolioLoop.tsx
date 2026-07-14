import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// ネイルポートフォリオカード用のループ動画。
// テキストは焼き込まない（LP側のHTMLオーバーレイと役割分担するため）。
// ゆっくりとしたKen Burnsズーム（1→1.06→1で往復）と、
// 斜めに一度だけ通過する光沢シマーで「静止画+HTML」より上質な質感を出す。
export const nailPortfolioLoopSchema = z.object({
  bgImage: z.string(),
  shimmerColor: zColor(),
});

export const NailPortfolioLoop: React.FC<
  z.infer<typeof nailPortfolioLoopSchema>
> = ({ bgImage, shimmerColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // 0→1→0 を1周期として往復させる（ループ時の継ぎ目をなくす）
  const zoomProgress = Math.sin((frame / durationInFrames) * Math.PI);
  const zoom = 1 + zoomProgress * 0.06;

  // シマーは全体の1/3の位置を、幅広く柔らかいバンドでゆっくり通過させる
  const shimmerCenter = interpolate(
    frame,
    [0, durationInFrames],
    [-0.3, 1.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shimmerX = shimmerCenter * (width + height) - height * 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={staticFile(bgImage)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* 斜め45度の光沢シマー。screenブレンドで馴染ませる */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background: `linear-gradient(115deg, transparent 0%, transparent 42%, ${shimmerColor}55 50%, transparent 58%, transparent 100%)`,
          transform: `translateX(${shimmerX}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
