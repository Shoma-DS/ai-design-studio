# UI/UX 実測監査レポート

- 対象: `https://lp-portfolio-gallery-nine.vercel.app`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 5件 / 参考 7件

ページ高 14141px（16.8画面分） / テキストブロック 297 / 操作要素 40 / 画像 29

### 🟡 要改善 [アクセシビリティ] 本文テキストのコントラスト比が WCAG AA（4.5:1）未満

該当 265件

- `html > body > header.page-header > p.page-subtitle` — 3.75:1（rgb(138, 122, 128) on rgb(250,245,243)）"制作した作品を種類・カテゴリ・タグで一覧できるポートフォリオです。"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"HP"
- `nav#type-tabs > button.type-tab.active` — 4.23:1（rgb(255, 253, 252) on rgb(168,103,124)）"LP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"動くLP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"スワイプLP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"バナー"

### 🟡 要改善 [タイポグラフィ] 複数行の本文で行間が1.5未満（日本語本文は1.7〜1.9が読みやすい）

該当 4件

- `html > body > header.page-header > p.page-subtitle` — line-height 1.20 "制作した作品を種類・カテゴリ・タグで一覧できるポートフォリオです。"
- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "雰囲気で探す 0 ▾"
- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "商品で探す 0 ▾"
- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "機能で探す 0 ▾"

### 🟡 要改善 [タイポグラフィ] 文字が12px未満。注釈でも12pxを下限にする

該当 224件

- `div#card-grid > button.card > div.card-body > span.card-category` — 11.5px "自治体・啓発"
- `button.card > div.card-body > div.card-tags > span.tag-mood` — 11.5px "可愛い"
- `button.card > div.card-body > div.card-tags > span.tag-mood` — 11.5px "ポップ"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "自治体"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "啓発"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "SDGs"

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が15px未満（本文の基準はモバイル16px・最低15px）

該当 1件

- `div#card-grid > button.card > div.card-body > p.card-heading` — 13.6px / 41字 "絵心ゼロ・スマホだけで30秒、漫画づくりならAI漫画クリエイターにお任せください"

### 🟡 要改善 [モバイルUX] タップ領域が44px未満（指で押しにくい。iOS HIG は44px、Material は48dp推奨）

該当 11件

- `nav#type-tabs > button.type-tab` — 57×41px "HP"
- `nav#type-tabs > button.type-tab.active` — 56×41px "LP"
- `nav#type-tabs > button.type-tab` — 84×41px "動くLP"
- `nav#type-tabs > button.type-tab` — 113×41px "スワイプLP"
- `nav#type-tabs > button.type-tab` — 80×41px "バナー"
- `nav#type-tabs > button.type-tab` — 80×41px "サムネ"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > main > div.controls` — "雰囲気で探す 0 ▾ 商品で探す 0 ▾ 機能で探す 0 ▾ すべてクリア 絞り"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 43件

- `html > body > header.page-header > p.page-subtitle` — 14.7px "制作した作品を種類・カテゴリ・タグで一覧できるポートフォリオです。"
- `nav#type-tabs > button.type-tab` — 14.4px "HP"
- `nav#type-tabs > button.type-tab.active` — 14.4px "LP"
- `nav#type-tabs > button.type-tab` — 14.4px "動くLP"
- `nav#type-tabs > button.type-tab` — 14.4px "スワイプLP"
- `nav#type-tabs > button.type-tab` — 14.4px "バナー"

### 🔵 参考 [モーション] アニメーションがあるが prefers-reduced-motion への配慮がない。動きに酔うユーザー向けに停止指定を入れる

該当 1件

- `stylesheet` — @media (prefers-reduced-motion: reduce) を追加する

### 🔵 参考 [情報設計] meta description がない（検索結果・SNSでの説明文）

該当 1件

- `head` — 

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

### 🔵 参考 [反復] 余白の75%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `html > body > header.page-header > h1` — marginBottom: 9.6px
- `nav#type-tabs > button.type-tab` — paddingTop: 8.8px
- `nav#type-tabs > button.type-tab` — paddingBottom: 8.8px
- `nav#type-tabs > button.type-tab.active` — paddingTop: 8.8px
- `nav#type-tabs > button.type-tab.active` — paddingBottom: 8.8px
- `nav#type-tabs > button.type-tab` — paddingTop: 8.8px

## desktop (1440×900)

重大 0件 / 要改善 4件 / 参考 6件

ページ高 5554px（6.2画面分） / テキストブロック 297 / 操作要素 40 / 画像 29

### 🟡 要改善 [アクセシビリティ] 本文テキストのコントラスト比が WCAG AA（4.5:1）未満

該当 265件

- `html > body > header.page-header > p.page-subtitle` — 3.75:1（rgb(138, 122, 128) on rgb(250,245,243)）"制作した作品を種類・カテゴリ・タグで一覧できるポートフォリオです。"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"HP"
- `nav#type-tabs > button.type-tab.active` — 4.23:1（rgb(255, 253, 252) on rgb(168,103,124)）"LP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"動くLP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"スワイプLP"
- `nav#type-tabs > button.type-tab` — 4.00:1（rgb(138, 122, 128) on rgb(255,253,252)）"バナー"

### 🟡 要改善 [タイポグラフィ] 複数行の本文で行間が1.5未満（日本語本文は1.7〜1.9が読みやすい）

該当 3件

- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "雰囲気で探す 0 ▾"
- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "商品で探す 0 ▾"
- `div.controls > div.filter-dropdown > div.filter-trigger-row > button.filter-trigger` — line-height 1.20 "機能で探す 0 ▾"

### 🟡 要改善 [タイポグラフィ] 文字が12px未満。注釈でも12pxを下限にする

該当 224件

- `div#card-grid > button.card > div.card-body > span.card-category` — 11.5px "自治体・啓発"
- `button.card > div.card-body > div.card-tags > span.tag-mood` — 11.5px "可愛い"
- `button.card > div.card-body > div.card-tags > span.tag-mood` — 11.5px "ポップ"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "自治体"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "啓発"
- `button.card > div.card-body > div.card-tags > span.tag-product` — 11.5px "SDGs"

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が14px未満（本文の基準はPC16〜17px・最低14px）

該当 1件

- `div#card-grid > button.card > div.card-body > p.card-heading` — 13.6px / 41字 "絵心ゼロ・スマホだけで30秒、漫画づくりならAI漫画クリエイターにお任せください"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 31件

- `div.filter-dropdown > div.filter-trigger-row > button.filter-trigger > span.filter-trigger-chevron` — 12.0px "▾"
- `div.filter-dropdown > div.filter-trigger-row > button.filter-trigger > span.filter-trigger-chevron` — 12.0px "▾"
- `div.filter-dropdown > div.filter-trigger-row > button.filter-trigger > span.filter-trigger-chevron` — 12.0px "▾"
- `p#result-count` — 13.6px "28件 / 全28件"
- `div#card-grid > button.card > div.card-body > p.card-heading` — 13.6px "めひょうってな〜に？"
- `div#card-grid > button.card > div.card-body > p.card-heading` — 13.6px "異彩を放つ、コンパクトSUV"

### 🔵 参考 [モーション] アニメーションがあるが prefers-reduced-motion への配慮がない。動きに酔うユーザー向けに停止指定を入れる

該当 1件

- `stylesheet` — @media (prefers-reduced-motion: reduce) を追加する

### 🔵 参考 [情報設計] meta description がない（検索結果・SNSでの説明文）

該当 1件

- `head` — 

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

### 🔵 参考 [反復] 余白の77%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `html > body > header.page-header > h1` — marginBottom: 9.6px
- `nav#type-tabs > button.type-tab` — paddingTop: 8.8px
- `nav#type-tabs > button.type-tab` — paddingBottom: 8.8px
- `nav#type-tabs > button.type-tab.active` — paddingTop: 8.8px
- `nav#type-tabs > button.type-tab.active` — paddingBottom: 8.8px
- `nav#type-tabs > button.type-tab` — paddingTop: 8.8px

---

合計: 重大 0件 / 要改善 9件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。