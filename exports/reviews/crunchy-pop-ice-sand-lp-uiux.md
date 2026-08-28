# UI/UX 実測監査レポート

- 対象: `portfolio/crunchy-pop-ice-sand-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 0件 / 参考 4件

ページ高 5277px（6.3画面分） / テキストブロック 3 / 操作要素 3 / 画像 7

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.site-header` — "CRUNCHYPOP 食感 こだわり フレーバー おためしセット"

### 🔵 参考 [パフォーマンス] width/height または aspect-ratio がなく、読み込み時にレイアウトがずれる（CLS）

該当 7件

- `main#top > picture.lp-section > img` — 01-hero.png
- `picture#texture > img` — 02-texture.png
- `picture#process > img` — 03-process.png
- `picture#lineup > img` — 04-lineup.png
- `main#top > picture.lp-section > img` — 05-limited.png
- `main#top > picture.lp-section > img` — 06-arrange.png

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

## desktop (1440×900)

重大 0件 / 要改善 0件 / 参考 3件

ページ高 4799px（5.3画面分） / テキストブロック 7 / 操作要素 6 / 画像 7

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [パフォーマンス] width/height または aspect-ratio がなく、読み込み時にレイアウトがずれる（CLS）

該当 7件

- `main#top > picture.lp-section > img` — 01-hero.png
- `picture#texture > img` — 02-texture.png
- `picture#process > img` — 03-process.png
- `picture#lineup > img` — 04-lineup.png
- `main#top > picture.lp-section > img` — 05-limited.png
- `main#top > picture.lp-section > img` — 06-arrange.png

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

---

合計: 重大 0件 / 要改善 0件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。