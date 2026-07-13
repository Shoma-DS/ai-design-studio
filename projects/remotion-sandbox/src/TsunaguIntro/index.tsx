import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { Closing } from "./Closing";
import { Scene } from "./Scene";
import { VideoScene } from "./VideoScene";

const SCENE_LEN = 120; // 4秒
const TRANSITION_LEN = 10;
const CLOSING_LEN = 240; // 8秒

export const TsunaguIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1b1a" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Scene
            image="tsunagu/hero-pc.png"
            eyebrow="TSUNAGU LOGISTICS"
            headline={"運ぶ、\nその先へ。"}
            sub="TSUNAGU CONNECTS WHAT MATTERS."
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <VideoScene
            video="stock/highway.mp4"
            startFrom={30}
            number="01 幹線輸送"
            headline="地域と地域を、"
            sub="確かな時間でつなぐ。"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <VideoScene
            video="stock/delivery.mp4"
            startFrom={90}
            number="02 地域宅配"
            headline="荷物の先に、"
            sub="人の暮らしがある。"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <VideoScene
            video="stock/warehouse.mp4"
            startFrom={0}
            number="03 倉庫保管・仕分け"
            headline="止まらない物流を、"
            sub="静かに支える。"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Scene
            image="tsunagu/control-room-pc.png"
            number="04 物流DXソリューション"
            headline="データが、"
            sub="次の一手を教えてくれる。"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <Scene
            image="tsunagu/meeting-pc.png"
            eyebrow="OUR PEOPLE"
            headline="人と人が、"
            sub="物流を動かしている。"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={CLOSING_LEN}>
          <Closing image="tsunagu/driver-cabin-pc.png" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
