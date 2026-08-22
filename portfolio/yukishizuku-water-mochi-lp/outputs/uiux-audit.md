# UI/UX 実測監査レポート

- 対象: `portfolio/yukishizuku-water-mochi-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 0件 / 参考 8件

ページ高 4459px（5.3画面分） / テキストブロック 51 / 操作要素 6 / 画像 6

### 🔵 参考 [コンバージョン] CTA候補 1個（うちファーストビュー内 1個）

該当 1件

- `document` — "雪しずくを購入する→"

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.site-header` — "雪しずくYUKI SHIZUKU ものがたり味わい水のこと オンラインストア"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 6件

- `main#top > section.visual-section.hero > div.content.hero-copy > p` — 14.0px "清らかな天然水を、ふるんとやわらかなひとくちの余韻に仕立てました。"
- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "きゅんと甘酸っぱい、紅いしずく。"
- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "陽だまりのように、明るく爽やか。"
- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "水そのものを味わう、澄んだ余韻。"
- `section#shop > div.content.final-copy > p > small` — 12.0px "税込・送料別"
- `html > body > footer > small` — 13.3px "© 2026 YUKI SHIZUKU CONCEPT."

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` —

### 🔵 参考 [整列] テキストブロックの92%が中央揃え。左揃えの軸を通すと視線の起点が安定する

該当 1件

- `document` — 47 / 51 ブロック

### 🔵 参考 [反復] 文字サイズが13種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 9, 12, 13, 14, 15, 16, 20, 21, 22, 28, 32, 34, 44 px

### 🔵 参考 [反復] 余白の53%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `body > header.site-header > a.brand > span` — marginTop: 5.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > p.eyebrow` — marginBottom: 14.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > p` — marginBottom: 14.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > a.cta.cta-primary` — paddingTop: 14.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > a.cta.cta-primary` — paddingBottom: 14.0px
- `section#story > div.content.story-copy > p.eyebrow` — marginBottom: 14.0px

## desktop (1440×900)

重大 0件 / 要改善 0件 / 参考 6件

ページ高 5025px（5.6画面分） / テキストブロック 53 / 操作要素 9 / 画像 6

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 5件

- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "きゅんと甘酸っぱい、紅いしずく。"
- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "陽だまりのように、明るく爽やか。"
- `div.content.products-copy > div.flavor-grid > article > p` — 13.0px "水そのものを味わう、澄んだ余韻。"
- `section#shop > div.content.final-copy > p > small` — 12.0px "税込・送料別"
- `html > body > footer > small` — 13.3px "© 2026 YUKI SHIZUKU CONCEPT."

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` —

### 🔵 参考 [整列] テキストブロックの60%が中央揃え。左揃えの軸を通すと視線の起点が安定する

該当 1件

- `document` — 32 / 53 ブロック

### 🔵 参考 [反復] 余白の46%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `body > header.site-header > a.brand > span` — marginTop: 5.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > p.eyebrow` — marginBottom: 14.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > a.cta.cta-primary` — paddingTop: 14.0px
- `main#top > section.visual-section.hero > div.content.hero-copy > a.cta.cta-primary` — paddingBottom: 14.0px
- `section#story > div.content.story-copy > p.eyebrow` — marginBottom: 14.0px
- `section#story > div.content.story-copy > ul.feature-list` — marginTop: 13.0px

---

合計: 重大 0件 / 要改善 0件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。
