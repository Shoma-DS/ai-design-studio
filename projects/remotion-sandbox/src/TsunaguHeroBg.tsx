import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SCENE_LEN = 90; // 3秒
const TRANSITION_LEN = 15;

const ZoomImage: React.FC<{ image: string }> = ({ image }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <Img
        src={staticFile(image)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ video: string; startFrom?: number }> = ({
  video,
  startFrom = 0,
}) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile(video)}
      startFrom={startFrom}
      volume={0}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

// サイトのFV背景として複数シーンを巡回させるループ動画。
// テキストやCTAはNext.js側(Hero.tsx)にそのまま残し、ここでは背景のみ担当する。
export const TsunaguHeroBg: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <ZoomImage image="tsunagu/hero-pc.png" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Clip video="stock/highway.mp4" startFrom={30} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Clip video="stock/warehouse.mp4" startFrom={0} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Clip video="stock/delivery.mp4" startFrom={90} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
