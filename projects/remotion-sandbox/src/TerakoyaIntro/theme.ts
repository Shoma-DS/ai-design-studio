/** 寺子屋クラウド（projects/terakoya-cloud）のデザイントークンと揃える */
export const colors = {
  primary50: "#f6f7f9",
  primary100: "#edeff2",
  primary200: "#d3d9e3",
  primary300: "#b1bdd2",
  primary500: "#2c3a52",
  primary600: "#4b638b",
  primary700: "#3c4e6c",
  primary800: "#2d394e",
  primary900: "#1e2633",
  accent100: "#f5efeb",
  accent200: "#ead8cd",
  accent500: "#c97a45",
  accent600: "#a65f30",
  sage100: "#eff1ef",
  sage500: "#7c9a87",
  sage600: "#5d7967",
  bgCanvas: "#faf9f7",
  bgWarm: "#f3efe9",
  borderSoft: "#e6e2da",
  white: "#ffffff",
};

// サイト本体と同じ書体構成に揃える。
// 本文・見出し＝Noto Sans JP、ブランド名と大見出し＝Zen Kaku Gothic New 900。
// システムフォント任せだとレンダリング環境で崩れるため、Googleフォントを読み込む。
import { loadFont as loadNotoSansJp } from "@remotion/google-fonts/NotoSansJP";
import { loadFont as loadZenKakuGothicNew } from "@remotion/google-fonts/ZenKakuGothicNew";

const notoSansJp = loadNotoSansJp("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const zenKakuGothicNew = loadZenKakuGothicNew("normal", { weights: ["700", "900"], subsets: ["latin"] });

export const fonts = {
  sans: notoSansJp.fontFamily,
  display: zenKakuGothicNew.fontFamily,
};
