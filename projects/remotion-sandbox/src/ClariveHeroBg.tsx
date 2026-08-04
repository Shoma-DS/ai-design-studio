import React from "react";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

/**
 * CLARIVE 渋谷店 LP ファーストビューの背景ループ映像。
 *
 * 設計の要点:
 * - **クロスディゾルブを使わない。** 人物が写ったカット同士を重ねると、体が二重に見える
 *   ゴーストが出て不自然になる。スライド転換なら2枚が混ざらないため、この問題が起きない。
 * - 各カットの中では、ゆっくりした寄り／引きを交互に入れて単調さを避ける。
 * - ループの継ぎ目を消すため、末尾にカット1を「動きを止めた状態」でもう一度置き、
 *   最終フレームが先頭フレームと完全に一致するようにしている。
 * - テキスト・ロゴは入れない（LP側のHTMLで重ねるため）。
 *   PC版は画面左55%に見出しとCTAが乗るので、全カットでそこに人物・什器を置いていない。
 */

const SCENE = 90; // 3秒
const TRANS = 18; // 0.6秒
const LOOP_TAIL = 2; // 転換が完了しきった状態のフレームを末尾に残す

export const clariveHeroSchema = z.object({
  variant: z.enum(["pc", "sp"]),
});

type Scene = {
  image: string;
  /** カット内のズーム（開始→終了）。寄りと引きを交互にする */
  scaleFrom: number;
  scaleTo: number;
  /** 横方向のわずかな流し（フレーム幅に対する%） */
  panFrom: number;
  panTo: number;
  /** スマホ版で人物が入るように切り出し位置を寄せる */
  spPosition: string;
};

const SCENES: Scene[] = [
  {
    image: "clarive/shot-01-curl.png",
    scaleFrom: 1.0,
    scaleTo: 1.055,
    panFrom: 0,
    panTo: -0.6,
    spPosition: "72% center",
  },
  {
    image: "clarive/shot-02-close.png",
    scaleFrom: 1.055,
    scaleTo: 1.0,
    panFrom: 0,
    panTo: 0.6,
    spPosition: "62% center",
  },
  {
    image: "clarive/shot-03-trainer.png",
    scaleFrom: 1.0,
    scaleTo: 1.045,
    panFrom: 0,
    panTo: -0.5,
    spPosition: "70% center",
  },
  {
    image: "clarive/shot-04-room.png",
    scaleFrom: 1.045,
    scaleTo: 1.0,
    panFrom: 0,
    panTo: 0.5,
    spPosition: "78% center",
  },
];

const Shot: React.FC<{
  scene: Scene;
  variant: "pc" | "sp";
  /** ループを閉じる末尾カット。動きを止めて先頭フレームと同じ絵にする */
  frozen?: boolean;
}> = ({ scene, variant, frozen = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const t = frozen
    ? 0
    : interpolate(frame, [0, durationInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const scale = scene.scaleFrom + (scene.scaleTo - scene.scaleFrom) * t;
  const pan = scene.panFrom + (scene.panTo - scene.panFrom) * t;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${pan}%) scale(${scale})`,
        transformOrigin: "center center",
        backgroundColor: "#FBF8F5",
      }}
    >
      <Img
        src={staticFile(scene.image)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: variant === "sp" ? scene.spPosition : "center",
        }}
      />
    </AbsoluteFill>
  );
};

export const ClariveHeroBg: React.FC<z.infer<typeof clariveHeroSchema>> = ({
  variant,
}) => {
  const timing = linearTiming({
    durationInFrames: TRANS,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FBF8F5" }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={scene.image}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={timing}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={SCENE}>
              <Shot scene={scene} variant={variant} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        {/* ループを閉じる: 先頭カットへスライドで戻り、最終フレームを先頭と一致させる。
            尺を転換より2フレーム長くするのは、転換が完全に終わりきった「純粋な先頭カット」の
            フレームを最後に残すため。ぴったり同尺だと転換が94%までしか進まず継ぎ目が出る。 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />
        <TransitionSeries.Sequence durationInFrames={TRANS + LOOP_TAIL}>
          <Shot scene={SCENES[0]} variant={variant} frozen />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/** シーン数 × 尺 − 転換の重なり。Root.tsx の durationInFrames と一致させること */
export const CLARIVE_HERO_DURATION =
  SCENES.length * SCENE + (TRANS + LOOP_TAIL) - SCENES.length * TRANS;
