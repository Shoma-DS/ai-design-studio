---
name: animate-css
description: Animate.cssから適切なキーフレームアニメーション（登場・退場・注目誘導）を選び実装する。ホバー演出はskills/design/hover-animations、それ以外（ページ読込時の登場、スクロールで出現、フォームエラーの強調など）はこちら。
---

# Animate.css アニメーション実装

このスキルは、`references/animate-css/`（[animate-css/animate.css](https://github.com/animate-css/animate.css) をクローンしたもの）から、実装したい場面に合うキーフレームアニメーションを選び、実装するために使う。

**対象は実HTML/CSS/JSで組まれたUI要素のみ**（`gallery/` サイト、`src/` のLP編集GUI、今後作る実コードのページ等）。`portfolio/*/lp/` のようにテキストが1枚のラスター画像に焼き込まれているLPには適用できない。

## Hover.cssとの使い分け

- **マウスホバー中だけ反応する演出**（ボタン・カード・リンクにカーソルを乗せたとき）→ `skills/design/hover-animations/SKILL.md`（Hover.css）
- **要素が画面に現れるとき・ページ読み込み時・スクロールで出現したとき・注目させたいとき・状態変化のフィードバック**（フォームエラーで揺らす、保存成功でチェックマークを跳ねさせる等）→ こちら（Animate.css）

両方使う場合は、同じページ内でトーンが揃うよう、動きの速さ・大きさを統一する。

## ライセンス

Hippocratic License 2.1（人権原則の遵守を条件とする以外はほぼ制限なし。Hover.cssと違い商用利用に別途有償ライセンスは不要）。クライアント案件でも特別な確認なしに利用してよい。著作権表示・ライセンス本文の同梱条件があるため、配布物にライセンスファイルを含めるか、参照元を明記する。

## 導入方法

このリポジトリの構成に応じて選ぶ。

- **`gallery/` のような素のHTML/CSS/JS（ビルドツールなし）** → CDNで読み込む。
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  ```
  もしくは、使うアニメーションが1〜2種類だけなら、`references/animate-css/source/<category>/<name>.css` の該当ファイルの中身だけを既存CSSに直接コピーする方が軽量（Hover.cssの実装手順と同じ考え方）。
- **`src/` のようなVite/Reactビルド環境** → `npm install animate.css` してから `import 'animate.css'`（このリポジトリの`package.json`に依存追加が必要な場合はユーザーに確認してから追加する）。

## 基本の使い方

要素に `animate__animated` と、アニメーション名クラス（`animate__<名前>`）を付ける。

```html
<h1 class="animate__animated animate__fadeInUp">見出し</h1>
```

速さ・遅延・回数はユーティリティクラスで調整する。

```html
<div class="animate__animated animate__bounce animate__slow animate__delay-1s">...</div>
```

JavaScriptから動的に付与する場合（ページ読み込み後・スクロールで要素が見えたとき等）:

```js
const animateCSS = (el, animation, prefix = "animate__") =>
  new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    const node = typeof el === "string" ? document.querySelector(el) : el;
    node.classList.add(`${prefix}animated`, animationName);
    function onEnd(e) {
      e.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve();
    }
    node.addEventListener("animationend", onEnd, { once: true });
  });
```

## 分類と選び方

`references/animate-css/source/` のフォルダ構成がそのまま分類になっている。

| 分類（フォルダ） | 代表クラス | 向いている場面 |
|---|---|---|
| `attention_seekers/` | `bounce`, `flash`, `pulse`, `shake`, `headShake`, `tada`, `wobble`, `jello`, `heartBeat`, `rubberBand` | フォームエラー、通知、注目させたいバッジ・アイコン |
| `fading_entrances/` `fading_exits/` | `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeOut`系 | ページ読み込み時の穏やかな登場、モーダル・トーストの表示/非表示 |
| `sliding_entrances/` `sliding_exits/` | `slideInLeft`, `slideInUp` 等 | サイドメニュー、ドロワー、カードの順次登場 |
| `bouncing_entrances/` `bouncing_exits/` | `bounceIn`, `bounceInUp` 等 | 目立たせたいCTA・成功メッセージの登場 |
| `zooming_entrances/` `zooming_exits/` | `zoomIn`, `zoomInDown` 等 | モーダル・ライトボックスの開閉 |
| `rotating_entrances/` `rotating_exits/` | `rotateIn` 等 | ロゴ・アイコンの演出（多用しない） |
| `flippers/` | `flip`, `flipInX`, `flipInY` | カードの表裏切り替え |
| `lightspeed/` | `lightSpeedInRight` 等 | 強い勢いを出したい一発演出（多用しない） |
| `specials/` | `hinge`, `jackInTheBox`, `rollIn` | ここぞという特別な1箇所のみ（多用厳禁） |

選定の目安:
- **モーダル・プレビュー（`gallery/`のプレビューモーダル等）の開閉** → `fadeIn`/`zoomIn`系 + 対応する`Out`系。開閉で対になるペアを選ぶ。
- **フォームのバリデーションエラー** → `attention_seekers/shake` か `headShake`。
- **リスト・カードが順番に現れる演出** → `fadeInUp` をJSで要素ごとに`delay`をずらして付与する。
- **`specials/`・`lightspeed/`・`rotating_entrances/`は基本的に使わない**。ここぞという1箇所だけに留める。

## ベストプラクティス（必ず守る）

- **無限ループのアニメーションは避ける**（`animate__infinite`）。ユーザーの気を散らし続けるため。
- **`<html>`/`<body>`を直接アニメーションしない**。ラップした`<main>`等に付ける。
- **インライン要素（`<span>`等）に直接付けない**。`display: inline-block`にするか、ブロック/インラインブロック要素に付ける。
- **`prefers-reduced-motion`を無効化しない**。Animate.css自体が対応しているので、そのメディアクエリを上書きしない。
- 1ページで使うアニメーションの種類を絞り、UIの一貫性を保つ。

## 関連

- ホバー演出: `skills/design/hover-animations/SKILL.md`（Hover.css）
- ソース: `references/animate-css/`（`source/`配下がカテゴリ別、`animate.css`が全部入りビルド）
