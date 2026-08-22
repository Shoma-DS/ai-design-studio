# UI/UX 実測監査レポート

- 対象: `portfolio/sumika-milk-tea-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 1件 / 参考 8件

ページ高 7770px（9.2画面分） / テキストブロック 62 / 操作要素 11 / 画像 1

### 🟡 要改善 [コンバージョン] ファーストビュー内にCTAがない。最初の画面で次の行動を示す

該当 1件

- `document` — 

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 4件

- `section#story > div.story-inner.reveal > p.eyebrow` — 3.62〜5.80:1 "OUR CRAFT"
- `section#story > div.story-inner.reveal > h2` — 1.00〜21.00:1 "香りの一滴まで、ていねいに。"
- `section#story > div.story-inner.reveal > p` — 1.00〜21.00:1 "茶葉の選定から抽出、ミルクとの調和まで。数字だけでは測れない香りと口あたりを、つ"
- `section#story > div.story-inner.reveal > div.signature` — 3.62〜5.80:1 "SUMIKA TEA CRAFT"

### 🔵 参考 [コンバージョン] CTA候補 1個（うちファーストビュー内 0個）

該当 1件

- `document` — "どこで購入できますか？＋"

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.header` — "SUMIKA澄香 おいしさ商品ものづくり 商品を見る"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 8件

- `html > body > header.header > a.mini-cta` — 13.0px "商品を見る"
- `section#top > div.hero-copy > p` — 14.0px "紅茶の輪郭と、ミルクのまろやかさ。一口のなかで、美しく重なる。"
- `section#lineup > div.cards > article.product-card.reveal > p` — 13.0px "紅茶のコクとミルクの調和。270ml"
- `section#lineup > div.cards > article.product-card.reveal > p` — 13.0px "軽やかな甘さと爽やかな後味。270ml"
- `section#lineup > div.cards > article.product-card.reveal > p` — 13.0px "茶葉の香りをまっすぐ楽しむ。500ml"
- `main > section.final-cta > div > p` — 12.0px "YOUR QUIET TEA MOMENT"

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [整列] テキストブロックの52%が中央揃え。左揃えの軸を通すと視線の起点が安定する

該当 1件

- `document` — 32 / 62 ブロック

### 🔵 参考 [反復] 文字サイズが14種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 9, 11, 12, 13, 14, 16, 18, 20, 23, 24, 30, 34, 38, 42 px

### 🔵 参考 [反復] 余白の33%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `body > header.header > a.brand > span` — marginBottom: 6.0px
- `html > body > header.header > a.mini-cta` — paddingTop: 9.0px
- `html > body > header.header > a.mini-cta` — paddingBottom: 9.0px
- `section#top > div.hero-copy > h1` — marginTop: 18.0px
- `section#top > div.hero-copy > h1` — marginBottom: 22.0px
- `section#top > div.hero-copy > p` — marginTop: 14.0px

## desktop (1440×900)

重大 0件 / 要改善 2件 / 参考 6件

ページ高 6594px（7.3画面分） / テキストブロック 65 / 操作要素 15 / 画像 1

### 🟡 要改善 [コンバージョン] ファーストビュー内にCTAがない。最初の画面で次の行動を示す

該当 1件

- `document` — 

### 🟡 要改善 [タイポグラフィ] 1行が長すぎて視線が戻りにくい（日本語は20〜45字が目安）

該当 4件

- `section#top > div.hero-copy > p` — 約75字/行 "紅茶の輪郭と、ミルクのまろやかさ。一口のなかで、美しく重なる。"
- `section#faq > div.faq-list > details > p` — 約51字/行 "このLPは自主制作の架空ブランドです。実際の販売は行っていません。"
- `section#faq > div.faq-list > details > p` — 約51字/行 "ブランドコンセプト上は、冷温どちらでも香りが引き立つ設計を想定しています。"
- `section#faq > div.faq-list > details > p` — 約51字/行 "乳成分を含む想定です。実商品ではないため、表示内容はデザイン上のサンプルです。"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 4件

- `section#story > div.story-inner.reveal > p.eyebrow` — 3.62〜5.80:1 "OUR CRAFT"
- `section#story > div.story-inner.reveal > h2` — 1.00〜21.00:1 "香りの一滴まで、ていねいに。"
- `section#story > div.story-inner.reveal > p` — 1.00〜21.00:1 "茶葉の選定から抽出、ミルクとの調和まで。数字だけでは測れない香りと口あたりを、つ"
- `section#story > div.story-inner.reveal > div.signature` — 3.62〜5.80:1 "SUMIKA TEA CRAFT"

### 🔵 参考 [コンバージョン] CTA候補 1個（うちファーストビュー内 0個）

該当 1件

- `document` — "どこで購入できますか？＋"

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 11件

- `body > header.header > nav > a` — 13.0px "おいしさ"
- `body > header.header > nav > a` — 13.0px "商品"
- `body > header.header > nav > a` — 13.0px "ものづくり"
- `html > body > header.header > a.mini-cta` — 13.0px "商品を見る"
- `section#top > a.scroll` — 12.0px "SCROLL"
- `section#lineup > div.cards > article.product-card.reveal > p` — 13.0px "紅茶のコクとミルクの調和。270ml"

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [反復] 文字サイズが14種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 9, 11, 12, 13, 16, 18, 20, 23, 24, 54, 56, 58, 62, 72 px

### 🔵 参考 [反復] 余白の36%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `body > header.header > a.brand > span` — marginBottom: 6.0px
- `html > body > header.header > a.mini-cta` — paddingTop: 10.0px
- `html > body > header.header > a.mini-cta` — paddingBottom: 10.0px
- `section#top > div.hero-copy` — paddingTop: 126.0px
- `section#top > div.hero-copy > h1` — marginTop: 18.0px
- `section#top > div.hero-copy > h1` — marginBottom: 22.0px

---

合計: 重大 0件 / 要改善 3件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。