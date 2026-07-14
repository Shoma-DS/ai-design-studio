import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { LpHeroPromo, lpHeroPromoSchema } from "./LpHeroPromo";
import { BeforeAfterWipe } from "./BeforeAfterWipe";
import { TsunaguIntro } from "./TsunaguIntro";
import { TsunaguHeroBg } from "./TsunaguHeroBg";
import { NailPortfolioLoop, nailPortfolioLoopSchema } from "./NailPortfolioLoop";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="LpHeroPromo"
        component={LpHeroPromo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={lpHeroPromoSchema}
        defaultProps={{
          bgImage: "hero-bg.jpg",
          brandColor: "#c0455e",
          eyebrow: "NEW ARRIVAL",
          title: "Belle Rouge",
          subtitle: "唇も頬も、これ1本で。",
          cta: "詳しく見る",
        }}
      />

      <Composition
        id="BeforeAfterWipe"
        component={BeforeAfterWipe}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TsunaguIntro"
        component={TsunaguIntro}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TsunaguHeroBg"
        component={TsunaguHeroBg}
        durationInFrames={315}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="NailPortfolioRoseQuartz"
        component={NailPortfolioLoop}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        schema={nailPortfolioLoopSchema}
        defaultProps={{
          bgImage: "lumiere-nail/02-portfolio-1.png",
          shimmerColor: "#ffe4ec",
        }}
      />

      <Composition
        id="NailPortfolioSheerBeige"
        component={NailPortfolioLoop}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        schema={nailPortfolioLoopSchema}
        defaultProps={{
          bgImage: "lumiere-nail/03-portfolio-2.png",
          shimmerColor: "#fff3e2",
        }}
      />

      <Composition
        id="NailPortfolioMarbleGold"
        component={NailPortfolioLoop}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        schema={nailPortfolioLoopSchema}
        defaultProps={{
          bgImage: "lumiere-nail/04-portfolio-3.png",
          shimmerColor: "#f4dfa8",
        }}
      />

      <Composition
        id="LumiereHookLoop"
        component={NailPortfolioLoop}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        schema={nailPortfolioLoopSchema}
        defaultProps={{
          bgImage: "lumiere-nail/01-hook.png",
          shimmerColor: "#ffe9df",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
