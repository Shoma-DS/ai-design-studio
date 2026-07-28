---
name: color-palette-generator
description: ベースカラー（HEXまたは「雰囲気」の指定）から、明度スケール付きの配色パレット（Primary/Accent/Neutral/Background/Text、50〜950の11段階）とWCAGコントラスト確認を生成する。LP/HP/バナー/サムネ/SNS投稿の配色を決めるとき、HP制作でCSS変数・Tailwindカラートークンを作るときに使う。kigen.design/colorのような外部配色ツールに依存せず、リポジトリ内で完結させるためのスキル。
---

# 配色パレット生成

ベースカラー1色（またはブランドイメージの言語化）から、実制作にそのまま使える配色パレットを生成する。kigen.designのような外部ツールはAPIを公開していないため自動連携できない。代わりにこのスキルで同等のカラースケール生成をリポジトリ内で完結させる。

## いつ使うか

- LP/HP/バナー/サムネ/SNS投稿で、配色（メインカラー・アクセント・背景・文字色）を決めるとき
- HP制作（`skills/design/hp-creator/SKILL.md`）でTailwindのcolorトークンやCSS変数を用意するとき
- 既存プロジェクトの配色を、別のベースカラーに展開し直したいとき

ユーザーが具体的なHEXコードを持っていない場合は、「ブランドカラーのHEXコードはありますか？なければ、参考サイトのURLや『信頼感のある青系』のような雰囲気の指定でも構いません」と確認する。雰囲気だけの指定なら、妥当なベースカラーのHEXをこちらで提案してから進める。

## パレット構成

1つのベースカラーから、以下を生成する。

| 役割 | 内容 |
|---|---|
| Primary | ベースカラーそのもの（通常500付近） + 明度スケール50〜950（11段階） |
| Accent | Primaryの補色 または 三角配色（triadic、Hueを±120°ずらす）から1色。CTAボタンなど強調用。同じく50〜950の明度スケールを生成してもよい |
| Neutral（グレースケール） | ベースカラーのHueを保持しつつ彩度を5〜8%程度まで落としたグレー系。本文テキスト・境界線・背景に使う。50〜950 |
| Background | Neutralの明るい側（50〜100）、またはPrimaryの50（ごく淡いトーン） |
| Text | Neutralの暗い側（800〜900）を基本テキスト色、900〜950を見出し色に。白背景に対してWCAG AA（本文4.5:1以上、大見出し3:1以上）を満たす階調を選ぶ |

## 明度スケール生成アルゴリズム

ベースカラーをHSLに変換し、Hue（色相）・Saturation（彩度）は基本的に保持したまま、Lightness（明度）だけを以下の目標値に合わせて11段階生成する。両端（50・950）は彩度をやや下げて自然に見せる。

| ステップ | 目標Lightness | 彩度の調整 |
|---|---|---|
| 50 | 97% | ベースの彩度 × 0.5 |
| 100 | 94% | ベースの彩度 × 0.6 |
| 200 | 86% | ベースの彩度 × 0.75 |
| 300 | 76% | ベースの彩度 × 0.9 |
| 400 | 64% | ベースの彩度 × 1.0 |
| 500 | ベースのL（近似） | ベースの彩度（基準） |
| 600 | 42% | ベースの彩度 × 1.0 |
| 700 | 33% | ベースの彩度 × 0.95 |
| 800 | 24% | ベースの彩度 × 0.9 |
| 900 | 16% | ベースの彩度 × 0.85 |
| 950 | 10% | ベースの彩度 × 0.8 |

ベースカラーのLightnessが目標500の値から大きく離れている場合（例: 非常に明るい/暗いベースカラー）は、500をベースそのものにして、他のステップは500からの相対距離を保って比例配分する。

Neutral（グレースケール）は同じ表を使うが、彩度は最初からベースの5〜10%程度に固定する。

## 計算の実行方法

HSL⇔HEXの変換は手計算だと誤差が出やすいため、必ずNode.jsで正確に計算する。外部パッケージは不要（Node標準のみ）。スクラッチパッドに一時スクリプトを書いて実行する。

```js
// scratchpad/palette.mjs
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

// 相対輝度からWCAGコントラスト比を計算(白 #ffffff との比較例)
function relLuminance(hex) {
  const c = [0, 2, 4].map(i => {
    let v = parseInt(hex.slice(1 + i, 3 + i), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrastRatio(hexA, hexB) {
  const L1 = relLuminance(hexA), L2 = relLuminance(hexB);
  const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}

const BASE = '#2563eb'; // ここをベースカラーに差し替える
const { h, s } = hexToHsl(BASE);
const steps = {
  50: [97, 0.5], 100: [94, 0.6], 200: [86, 0.75], 300: [76, 0.9],
  400: [64, 1.0], 600: [42, 1.0], 700: [33, 0.95], 800: [24, 0.9],
  900: [16, 0.85], 950: [10, 0.8],
};
const palette = { 500: BASE };
for (const [step, [l, sMul]] of Object.entries(steps)) {
  palette[step] = hslToHex(h, s * sMul, l);
}
console.log(palette);
console.log('900 on white contrast:', contrastRatio(palette[900], '#ffffff').toFixed(2));
```

`node scratchpad/palette.mjs` で実行し、出力されたHEX一覧をそのまま使う。Accent色を作る場合は `h` を `(h + 150) % 360`（三角配色）や `(h + 180) % 360`（補色）に変えて同じ表を再利用する。

## コントラストの基準（WCAG AA）

- 本文テキスト（通常サイズ）: 背景とのコントラスト比 **4.5:1以上**
- 見出し・大きい文字（目安24px以上や太字18px以上）: **3:1以上**
- 上記スクリプトの`contrastRatio`関数で確認し、基準を満たさない場合はNeutralスケールのステップを1段階暗く/明るくずらす。

## 出力形式と制作タイプごとの使い方

生成したパレットは、制作タイプに応じて以下の形に変換して渡す。

**LP/バナー/サムネ/SNS投稿（画像生成ベース）**
`skills/design/image-prompt-generator/SKILL.md` のプロンプト内、【色・雰囲気ルール】セクションに、代表色のHEXと役割を言語化して埋め込む。

```
【色・雰囲気ルール】
・メインカラー：#2563EB（信頼感のある青、CTA・見出しに使用）
・アクセントカラー：#EB7A25（補色、CTAボタンの強調に限定使用）
・背景：#F8FAFC（Primaryの50）
・本文テキスト：#1E293B（Neutralの800、白背景とのコントラスト比◯◯:1でAA適合）
```

**HP制作（Next.js実コード）**
`globals.css` にCSS変数として定義するか、Tailwind設定のcolorsに追加する。

```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #2563eb;
  --color-primary-900: #1e293b;
  /* ... 必要な段階分 */
}
```

## kigen.design/colorとの使い分け

- kigen.design/colorはFigma連携やOKLCH出力など、デザイナーが手動でブラウザ上で配色を探索するのに適したツール。API非公開のため、このリポジトリのワークフローに自動組み込みはできない。
- 「配色のインスピレーションが欲しい」「Figmaで手動調整したい」という場面ではユーザーに同サイトの利用を案内してよいが、LP/HP/バナー等の実制作に使うHEX値は、再現性・リポジトリ内完結の観点から本スキルで生成する。
