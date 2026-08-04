import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { colors } from "./theme";
import { CommunityScene, LearningScene, MarketingScene, TitleCard } from "./Scenes";
import { Closing } from "./Closing";

const TITLE_LEN = 90; // 3秒
const SCENE_LEN = 135; // 4.5秒
const CLOSING_LEN = 150; // 5秒
const TRANSITION_LEN = 12;

/**
 * 寺子屋クラウドのサービス紹介動画（Aboutページのイントロに埋め込む）。
 * 参考サイトの同位置にある紹介動画は先方の著作物なので流用せず、
 * 構成（タイトル → 機能紹介 → クロージング）だけを踏襲した完全オリジナル。
 *
 * 合計: 90 + 135*3 + 150 - 12*4 = 597 フレーム（30fpsで約19.9秒）
 */
export const TERAKOYA_INTRO_DURATION =
  TITLE_LEN + SCENE_LEN * 3 + CLOSING_LEN - TRANSITION_LEN * 4;

export const TerakoyaIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bgCanvas }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={TITLE_LEN}>
          <TitleCard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <MarketingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <LearningScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_LEN}>
          <CommunityScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_LEN })}
        />

        <TransitionSeries.Sequence durationInFrames={CLOSING_LEN}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
