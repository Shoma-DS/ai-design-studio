# UI/UX 実測監査レポート

- 対象: `portfolio/uminone-kaidashi-ramen-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 1件 / 参考 7件

ページ高 6546px（7.8画面分） / テキストブロック 81 / 操作要素 8 / 画像 5

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が15px未満（本文の基準はモバイル16px・最低15px）

該当 1件

- `html > body > footer > small` — 12.0px / 44字 "© 2026 UMINONE / Fictional portfolio pro"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 5件

- `main#top > section.hero > div.hero-copy > p.kicker` — 1.02〜20.66:1 "SHELLFISH BROTH RAMEN"
- `main#top > section.hero > div.hero-copy > h1` — 1.02〜20.66:1 "海の余韻を、澄んだ一杯に。"
- `main#top > section.hero > div.hero-copy > p` — 1.02〜20.66:1 "あさり、えび、昆布。三つの旨みを、静かに重ねました。"
- `main#top > section.hero > div.hero-copy > a.text-link` — 1.02〜20.66:1 "三つの味を見る ↘"
- `section.hero > div.hero-copy > a.text-link > span` — 1.02〜20.66:1 "↘"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.site-header` — "貝だし麺処うみの音 お品書きだしのことおいしい作り方 お取り寄せ"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 26件

- `body > header.site-header > a.brand > small` — 12.0px "貝だし麺処"
- `main#top > section.hero > div.hero-copy > p.kicker` — 12.0px "SHELLFISH BROTH RAMEN"
- `main#top > section.hero > div.hero-copy > p` — 14.0px "あさり、えび、昆布。三つの旨みを、静かに重ねました。"
- `main#top > section.hero > div.hero-copy > a.text-link` — 14.0px "三つの味を見る ↘"
- `div.menu-list > article > div > p.menu-no` — 13.0px "一"
- `div.menu-list > article > div > p` — 13.0px "澄んだ旨みと、柚子の香り。"

### 🔵 参考 [パフォーマンス] width/height または aspect-ratio がなく、読み込み時にレイアウトがずれる（CLS）

該当 4件

- `div.menu-list > article > div.ramen-photo > img` — menu-asari-shio.png
- `div.menu-list > article > div.ramen-photo > img` — menu-ebi-miso.png
- `div.menu-list > article > div.ramen-photo > img` — menu-kombu-shoyu.png
- `section.noodle.reveal > div.noodle-grid > figure.noodle-photo > img` — noodles-fresh.png

### 🔵 参考 [反復] 文字サイズが13種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 12, 13, 14, 16, 18, 19, 21, 22, 24, 32, 36, 42, 46 px

### 🔵 参考 [反復] 余白の51%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `main#top > section.hero > div.hero-copy > h1` — marginTop: 17.0px
- `main#top > section.hero > div.hero-copy > h1` — marginBottom: 17.0px
- `main#top > section.hero > div.hero-copy > p` — marginTop: 14.0px
- `main#top > section.hero > div.hero-copy > p` — marginBottom: 14.0px
- `main#top > section.hero > div.hero-copy > a.text-link` — marginTop: 15.0px
- `main#top > section.hero > div.hero-copy > a.text-link` — paddingTop: 14.0px

## desktop (1440×900)

重大 0件 / 要改善 1件 / 参考 6件

ページ高 6862px（7.6画面分） / テキストブロック 84 / 操作要素 11 / 画像 5

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が14px未満（本文の基準はPC16〜17px・最低14px）

該当 1件

- `html > body > footer > small` — 12.0px / 44字 "© 2026 UMINONE / Fictional portfolio pro"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 6件

- `main#top > section.hero > div.hero-copy > p.kicker` — 1.02〜20.66:1 "SHELLFISH BROTH RAMEN"
- `main#top > section.hero > div.hero-copy > h1` — 1.02〜20.66:1 "海の余韻を、澄んだ一杯に。"
- `main#top > section.hero > div.hero-copy > p` — 1.02〜20.66:1 "あさり、えび、昆布。三つの旨みを、静かに重ねました。"
- `main#top > section.hero > div.hero-copy > a.text-link` — 1.02〜20.66:1 "三つの味を見る ↘"
- `section.hero > div.hero-copy > a.text-link > span` — 1.02〜20.66:1 "↘"
- `main#top > section.hero > p.hero-note` — 1.02〜20.66:1 "ゆっくり炊いて、すっきり仕上げる。"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 21件

- `body > header.site-header > a.brand > small` — 12.0px "貝だし麺処"
- `body > header.site-header > nav > a` — 13.0px "お品書き"
- `body > header.site-header > nav > a` — 13.0px "だしのこと"
- `body > header.site-header > nav > a` — 13.0px "おいしい作り方"
- `html > body > header.site-header > a.header-cta` — 13.0px "お取り寄せ"
- `main#top > section.hero > div.hero-copy > p.kicker` — 12.0px "SHELLFISH BROTH RAMEN"

### 🔵 参考 [パフォーマンス] width/height または aspect-ratio がなく、読み込み時にレイアウトがずれる（CLS）

該当 4件

- `div.menu-list > article > div.ramen-photo > img` — menu-asari-shio.png
- `div.menu-list > article > div.ramen-photo > img` — menu-ebi-miso.png
- `div.menu-list > article > div.ramen-photo > img` — menu-kombu-shoyu.png
- `section.noodle.reveal > div.noodle-grid > figure.noodle-photo > img` — noodles-fresh.png

### 🔵 参考 [反復] 文字サイズが15種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 12, 13, 14, 16, 18, 19, 21, 22, 24, 25, 30, 54, 56, 62, 82 px

### 🔵 参考 [反復] 余白の38%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）

該当 1件

- `html > body > header.site-header > a.header-cta` — paddingTop: 14.0px
- `html > body > header.site-header > a.header-cta` — paddingBottom: 14.0px
- `main#top > section.hero > div.hero-copy > a.text-link` — paddingTop: 14.0px
- `main#top > section.hero > div.hero-copy > a.text-link` — paddingBottom: 14.0px
- `section.story.reveal > div.story-grid > div > p` — marginBottom: 22.0px
- `section.story.reveal > div.story-grid > div > p` — marginBottom: 22.0px

---

合計: 重大 0件 / 要改善 2件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。