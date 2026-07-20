export const project = {
  title: "株式会社グッドワン コーポレートサイト",
};

const baseStyle = [
  "あなたはトップクラスのBtoBテクニカルビジュアルデザイナーです。",
  "日本の業務車両メンテナンス企業のコーポレートサイトで使用する、信頼感のあるラスター画像を生成してください。",
  "実在企業ロゴ、車両メーカーの商標、ナンバープレート、看板文字、読める文字、透かしは一切入れない。",
  "参考サイトのコピーや既存写真のトレースは禁止。構造、雰囲気、視線誘導だけを参考にする。",
  "配色は濃紺、白、清潔なグレー、控えめな赤アクセント。広告チラシ風ではなく、BtoBの信頼感と技術感を優先。",
  "過度なHDR、過剰な光、未来的すぎるSF表現は避ける。",
].join(" ");

function prompt({ purpose, composition, orientation }) {
  const aspect =
    orientation === "sp"
      ? "アスペクト比 4:5 の縦長構図。スマホ画面で中央の被写体が自然に見え、上下に余白を残す。"
      : "アスペクト比 3:2 の横長構図。PC画面でテキストを重ねられる余白を確保し、被写体は右側または中央に寄せる。";

  return [
    baseStyle,
    `目的: ${purpose}`,
    `構図: ${composition}`,
    aspect,
    "出力: 写実寄り、清潔な整備現場、自然な奥行き、企業サイトにそのまま使える高解像度ラスター画像。",
  ].join("\n");
}

export const sections = [
  {
    id: "hero-pc",
    title: "PCヒーロー",
    imageName: "hero-pc.png",
    prompt: prompt({
      purpose: "ERC日本輸入総代理店、特許技術、全国ネットワークを感じさせるファーストビュー背景。",
      composition:
        "左半分にコピーを載せる暗めの余白、右半分に大型業務トラック、整備ピット、診断機器、整備士の手元を配置。車両と設備は文字やロゴなし。",
      orientation: "pc",
    }),
  },
  {
    id: "hero-sp",
    title: "SPヒーロー",
    imageName: "hero-sp.png",
    prompt: prompt({
      purpose: "スマホ版ファーストビュー背景。業務車両メンテナンスの専門性と安心感を伝える。",
      composition:
        "中央上部に業務トラックと整備士、下部にテキストが載る濃紺の余白。狭い画面でも主題が切れない構図。",
      orientation: "sp",
    }),
  },
  {
    id: "diagnostic-pc",
    title: "診断セクション",
    imageName: "diagnostic-pc.png",
    prompt: prompt({
      purpose: "DPF差圧診断と短時間施工の説明セクション用画像。",
      composition:
        "診断メーター、ホース、整備士の手元、清潔な工具台、業務車両の一部を自然に配置。数値や文字は入れない。",
      orientation: "pc",
    }),
  },
  {
    id: "sub-pc",
    title: "下層ページヒーロー",
    imageName: "sub-pc.png",
    prompt: prompt({
      purpose: "会社概要、サービス、実績、お問い合わせの下層ページで共通使用する落ち着いたヒーロー背景。",
      composition:
        "清潔な大型車両整備工場の広い空間。右側に業務車両と整備設備、左側に見出しを載せる濃紺の余白。文字、ロゴ、看板は入れない。",
      orientation: "pc",
    }),
  },
  {
    id: "service-pc",
    title: "サービス紹介",
    imageName: "service-pc.png",
    prompt: prompt({
      purpose: "DPF洗浄、水素カーボンクリーニング、ERCクリーナー供給を抽象的に表すサービスページ画像。",
      composition:
        "整備ピット内でエンジン洗浄装置、ホース、クリーナーボトル風の無地容器、診断端末が整然と並ぶ。文字やラベルは入れない。",
      orientation: "pc",
    }),
  },
  {
    id: "case-1",
    title: "運送会社事例",
    imageName: "case-1.png",
    prompt: prompt({
      purpose: "運送会社の導入事例カード用画像。",
      composition:
        "物流ヤードに停車した複数の業務トラックと、点検準備をする整備士。実在ロゴや会社名は入れない。",
      orientation: "pc",
    }),
  },
  {
    id: "case-2",
    title: "建設会社事例",
    imageName: "case-2.png",
    prompt: prompt({
      purpose: "建設会社の重機・業務車両メンテナンス事例カード用画像。",
      composition:
        "建設現場の重機と作業車両を背景に、メンテナンス機材を確認する作業者。安全で清潔な印象。",
      orientation: "pc",
    }),
  },
  {
    id: "case-3",
    title: "整備工場事例",
    imageName: "case-3.png",
    prompt: prompt({
      purpose: "整備工場の代理店導入事例カード用画像。",
      composition:
        "整備工場内で診断端末と洗浄機材を使う整備士。背景は整理された工具と業務車両の一部。",
      orientation: "pc",
    }),
  },
];
