# UI/UX 実測監査レポート

- 対象: `portfolio/morning-bloom-call-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 0件 / 参考 7件

ページ高 6970px（8.3画面分） / テキストブロック 63 / 操作要素 8 / 画像 1

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 30件

- `main#top > section.intro.reveal > p.section-kicker` — 1.48〜14.23:1 "GOOD MORNING, GOOD DAY."
- `main#top > section.intro.reveal > h2` — 1.48〜14.23:1 "人気の声で、あなたの朝がはじまる。"
- `main#top > section.intro.reveal > p` — 1.48〜14.23:1 "慌ただしい朝にも、ひと息つける時間を。MORNING BLOOMを手に取ると、日"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "OAT"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "MINT"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "COCOA"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.site-header` — "MORNING BLOOM参加方法"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 2件

- `main#top > section.hero > div.hero-copy > p` — 14.4px "対象商品を読み取ると、今日のあなたへ届くオリジナル音声メッセージ。"
- `main#top > section.voices.reveal > p.note` — 12.0px "※登場人物はすべて架空です。"

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [整列] テキストブロックの73%が中央揃え。左揃えの軸を通すと視線の起点が安定する

該当 1件

- `document` — 46 / 63 ブロック

### 🔵 参考 [反復] 余白の43%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `main#top > section.hero > div.hero-copy` — paddingBottom: 390.0px
- `main#top > section.hero > div.hero-copy > p.eyebrow` — marginTop: 14.4px
- `main#top > section.hero > div.hero-copy > p.eyebrow` — marginBottom: 14.4px
- `h1#hero-title` — marginTop: 9.6px
- `h1#hero-title` — marginBottom: 9.6px
- `main#top > section.hero > div.hero-copy > p` — marginTop: 14.4px

## desktop (1440×900)

重大 0件 / 要改善 1件 / 参考 6件

ページ高 5794px（6.4画面分） / テキストブロック 63 / 操作要素 8 / 画像 1

### 🟡 要改善 [タイポグラフィ] 1行が長すぎて視線が戻りにくい（日本語は20〜45字が目安）

該当 2件

- `main#top > section.hero > p.period` — 約75字/行 "キャンペーン期間 2026.8.10 — 9.30"
- `main#top > section.intro.reveal > p` — 約63字/行 "慌ただしい朝にも、ひと息つける時間を。MORNING BLOOMを手に取ると、日"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 30件

- `main#top > section.intro.reveal > p.section-kicker` — 1.48〜14.23:1 "GOOD MORNING, GOOD DAY."
- `main#top > section.intro.reveal > h2` — 1.48〜14.23:1 "人気の声で、あなたの朝がはじまる。"
- `main#top > section.intro.reveal > p` — 1.48〜14.23:1 "慌ただしい朝にも、ひと息つける時間を。MORNING BLOOMを手に取ると、日"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "OAT"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "MINT"
- `main#top > section.intro.reveal > div.flavors > span` — 1.48〜14.23:1 "COCOA"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 1件

- `main#top > section.voices.reveal > p.note` — 12.0px "※登場人物はすべて架空です。"

### 🔵 参考 [モーション] transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安

該当 2件

- `stylesheet` — 最長 0.7s

### 🔵 参考 [整列] テキストブロックの60%が中央揃え。左揃えの軸を通すと視線の起点が安定する

該当 1件

- `document` — 38 / 63 ブロック

### 🔵 参考 [反復] 余白の37%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `h1#hero-title` — marginTop: 18.7px
- `h1#hero-title` — marginBottom: 18.7px
- `main#top > section.hero > div.hero-copy > a.button` — paddingTop: 14.0px
- `main#top > section.hero > div.hero-copy > a.button` — paddingBottom: 14.0px
- `main#top > section.hero > p.period` — paddingTop: 14.0px
- `main#top > section.hero > p.period` — paddingBottom: 14.0px

---

合計: 重大 0件 / 要改善 1件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。