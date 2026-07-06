---
name: hover-animations
description: Hover.css（IanLunn/Hover）から適切なCSSホバーアニメーションを選び、ボタン・カード・アイコン・リンクに実装する。実HTML/CSSで作るギャラリーサイトやLP編集GUIなど、コードで組んだUI要素にホバー演出を足すときに使う。
---

# Hover.css アニメーション実装

このスキルは、`references/hover-css/`（[IanLunn/Hover](https://github.com/IanLunn/Hover) をクローンしたもの）から、実装したいUI要素に合うホバーアニメーションを選び、必要な分だけCSSを取り込んで実装するために使う。

**対象は実HTML/CSSで組まれたUI要素のみ**（`gallery/` サイトのボタン・カード・チップ、`src/` のLP編集GUI、今後作る実コードのランディングページ等）。`portfolio/*/lp/` のようにテキストが1枚のラスター画像に焼き込まれているLPには適用できない（ホバーで反応する実DOM要素が無いため）。

---

## ライセンスに関する重要な注意（必ず確認する）

Hover.cssはデュアルライセンス。

- **個人利用・オープンソース・非商用のポートフォリオ表示**（例: このリポジトリの `gallery/` サイトや自主制作LP）→ MITライセンスで無料利用可。
- **クライアントへ納品する商用LP・有償で販売するテンプレート**（`projects/<client>/` 配下の実案件）→ 商用ライセンスの購入が必要（[ianlunn.co.uk/store](https://ianlunn.co.uk/store/hover-css/) 参照）。

実案件（`projects/`配下）にHover.css由来のクラスを実装する場合は、着手前に「この案件は商用ライセンスの購入対象になる可能性がある」とユーザーに伝え、確認を取ってから進める。ポートフォリオ・自主制作（`portfolio/`配下、`gallery/`サイト自体）であればMIT範囲内として進めてよい。

---

## 効果の分類と選び方

`references/hover-css/css/hover.css` に全110種類のクラスが入っている（クラス名一覧は同ファイルまたは `references/hover-css/README.md` 参照）。UI要素の種類に応じて分類から選ぶ。

| 分類 | 主なクラス例 | 向いている要素 |
|------|--------------|----------------|
| 2D Transitions | `hvr-grow`, `hvr-shrink`, `hvr-pulse`, `hvr-pulse-grow`, `hvr-push`, `hvr-pop`, `hvr-bounce-in`, `hvr-float`, `hvr-buzz` | 主要CTAボタン、強調したい単体ボタン |
| Background Transitions | `hvr-sweep-to-right`（`hvr-sweep-to-*`）, `hvr-shutter-in-horizontal`, `hvr-radial-in`, `hvr-rectangle-in`, `hvr-fade` | 背景色が変わるボタン、フィルターチップ、タブ |
| Icons | `hvr-icon-spin`, `hvr-icon-pop`, `hvr-icon-bounce`, `hvr-icon-float`, `hvr-icon-push`（アイコン専用の子要素 `<span class="hvr-icon">` に付ける） | ボタン内アイコン、矢印付きリンク |
| Borders | `hvr-underline-from-left`, `hvr-underline-from-center`, `hvr-overline-reveal`, `hvr-outline-out`, `hvr-border-fade`, `hvr-round-corners` | テキストリンク、ナビゲーション項目 |
| Shadow / Glow | `hvr-box-shadow-outset`, `hvr-grow-shadow`, `hvr-float-shadow`, `hvr-glow` | カード、サムネイル、浮き上がらせたい要素 |
| Speech Bubbles | `hvr-bubble-top`, `hvr-bubble-float-top` | ツールチップ的な補足、通知バッジ |
| Curls | `hvr-curl-top-left`, `hvr-curl-bottom-right` | 画像・カードの角めくり演出 |

選定の目安:
- **主要CTA（例: 「無料相談する」ボタン）** → 2D Transitions（`grow` / `pulse-grow`）か Shadow/Glow（`grow-shadow`）。派手すぎない、1テンポで完結するものを優先する。
- **カード（ギャラリーの`.card`など）** → Shadow/Glow（`float-shadow` / `box-shadow-outset`）。ホバーで持ち上がる・影が濃くなる程度にとどめ、`transform`の大きな移動は既存の`.card:hover { transform: translateY(-3px) }`と重複させない。
- **テキストリンク・タブ・チップ** → Borders（`underline-from-left`等）。背景色を持つチップには Background Transitions も検討する。
- **アイコン単体ボタン** → Icons分類。アイコンを囲む要素とアイコン本体それぞれにクラスが必要な場合があるので、`references/hover-css/index.html` のデモとマークアップ例を確認する。

奇をてらった効果（`curl`, `bubble`）は多用しない。1ページ内で使うアニメーションの種類は2〜3個までに絞り、トーンを揃える。

## 実装手順

1. `references/hover-css/css/hover.css` を検索し、選んだクラス名（例: `.hvr-grow`）とその `:hover, :focus, :active` ブロックを丸ごと取り出す。ほとんどの効果は他クラスに依存せず自己完結している。
2. 対象プロジェクトの既存CSSファイル（例: `gallery/style.css`）に、取り出したブロックをそのまま追記する。クラス名は `hvr-` プレフィックスのまま使ってよいし、既存の命名規約に合わせて変更してもよい（変更する場合は `:hover, :focus, :active` の3セレクタとも揃えて変更する）。
3. 対象のHTML要素に取り込んだクラスを追加する。ボタンやリンクなど、もともとホバー可能な要素に付ける（`div`など非対話要素に付ける場合は `tabindex="0"` を検討する）。
4. 既存のホバー・トランジション指定（例: `.card:hover { transform: ... }`）と衝突しないか確認する。同じプロパティ（`transform`など）を両方が指定している場合は、どちらか一方に統一する。
5. ブラウザで実際にホバーして確認する（`prefers-reduced-motion` に配慮する場合は、大きな動きを伴う効果は避けるかメディアクエリで無効化する）。

## ムードから選ぶ場合（軽量な自前CSSで済ませたいとき）

Hover.cssを丸ごと使うほどではない、1〜2箇所だけ・LPのトーンに合わせた軽量なホバー効果が欲しい場合は、[b-risk.jp「コピペで使えるCSSホバーアニメーション集」](https://b-risk.jp/blog/2021/11/hover-reference/)のムード分類も参考にする。外部ライブラリ不要で、`transition` + `transform`/`box-shadow`/擬似要素だけの短いCSSで実装できる。

| ムード | 技法の例 |
|---|---|
| シンプル・綺麗系 | 色反転（背景/文字色スワップ）、字間拡大（`letter-spacing`）、浮き上がり（`translateY`）、ズームイン（`scale`）、疑似要素オーバーレイテキスト |
| ポップ・勢い系 | 押下効果（`box-shadow`+`transform`）、スライド背景（`scale`+`transform-origin`）、斜めスライド（`skewY`） |
| スタイリッシュ系 | グラデーション切替（`background-size`/`background-position`）、ズレ効果（複数疑似要素）、縮小+影 |
| かわいい系 | 中央円形展開リップル（`border-radius`+`scale`）、ブラー（`filter: blur`）、円形変化（`border-radius: 50%`） |

このLPスタジオの案件は配色・トーンを「エレガント」「フレッシュ」「ポップ」等のムードで指定することが多いため（`skills/lp-design/lp-version-creator/SKILL.md`参照）、LPのムードに合わせてこの表から技法を選び、Hover.cssのクラスを流用するより軽いCSSで済ませたいときに使う。

## Animate.cssとの使い分け

ホバー中だけの反応はHover.css（本スキル）。要素の登場・退場・注目誘導（ページ読込時、スクロール出現、フォームエラー等）は `skills/design/animate-css/SKILL.md`（Animate.css）を使う。

## 関連

- ソース: `references/hover-css/`（README.mdに全効果のデモリンクあり）
- Animate.css（登場・退場・注目誘導系）: `skills/design/animate-css/SKILL.md`
- ギャラリーサイトの既存UI: `gallery/style.css`, `gallery/script.js`
