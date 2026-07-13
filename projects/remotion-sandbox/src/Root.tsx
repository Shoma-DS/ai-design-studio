import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { LpHeroPromo, lpHeroPromoSchema } from "./LpHeroPromo";
import { TsunaguIntro } from "./TsunaguIntro";
import { TsunaguHeroBg } from "./TsunaguHeroBg";

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
