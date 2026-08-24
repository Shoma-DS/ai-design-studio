# UI/UX 実測監査レポート

- 対象: `portfolio/uminone-kaidashi-ramen-lp/lp/index.html`
- 検査ビューポート: mobile (390×844) / desktop (1440×900)

## mobile (390×844)

重大 0件 / 要改善 3件 / 参考 6件

ページ高 6891px（8.2画面分） / テキストブロック 73 / 操作要素 9 / 画像 1

### 🟡 要改善 [アクセシビリティ] 本文テキストのコントラスト比が WCAG AA（4.5:1）未満

該当 7件

- `main#top > section.intro.paper > p.eyebrow` — 4.19:1（rgb(230, 35, 35) on rgb(255,245,223)）"OUR STORY"
- `main#top > section.intro.paper > div.stamp` — 4.19:1（rgb(230, 35, 35) on rgb(255,245,223)）"じんわり三段だし"
- `section#flavors > div.cards > article > div.bowl.red` — 2.63:1（rgb(36, 35, 31) on rgb(168,67,45)）"◯"
- `section#flavors > div.cards > article > div.bowl.green` — 3.38:1（rgb(36, 35, 31) on rgb(115,120,75)）"◯"
- `section#craft > div > p.eyebrow` — 2.61:1（rgb(230, 35, 35) on rgb(242,189,50)）"SECRET 01"
- `section#howto > p.eyebrow` — 2.41:1（rgb(230, 35, 35) on rgb(134,198,223)）"HOW TO ENJOY"

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が15px未満（本文の基準はモバイル16px・最低15px）

該当 1件

- `html > body > footer > small` — 13.3px / 44字 "© 2026 UMINONE / Fictional portfolio pro"

### 🟡 要改善 [モバイルUX] タップ領域が44px未満（指で押しにくい。iOS HIG は44px、Material は48dp推奨）

該当 5件

- `html > body > header.site-header > a.brand` — 86×32px "うみの音"
- `main#top > section.faq.reveal > details > summary` — 342×31px "辛みはありますか？"
- `main#top > section.faq.reveal > details > summary` — 342×31px "賞味期限はどのくらいですか？"
- `main#top > section.faq.reveal > details > summary` — 342×31px "ギフト包装はできますか？"
- `html > body > footer > a.brand` — 108×32px "うみの音"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 3件

- `main#top > section.hero > div.hero-copy > p.kicker` — 1.34〜15.73:1 "ひと口すすれば、海の余韻。"
- `section.hero > div.hero-copy > h1 > em` — 1.00〜21.00:1 "ほっと"
- `main#top > section.hero > div.hero-copy > p` — 1.34〜15.73:1 "あさり・えび・昆布を重ねた、澄んだ旨みの一杯。"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [コンバージョン] 追従要素あり（1個）

該当 1件

- `html > body > header.site-header` — "うみの音 三つの味おいしさの秘密楽しみ方 お取り寄せ"

### 🔵 参考 [タイポグラフィ] 12〜14pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 1件

- `section#buy > div.offer > small` — 13.3px "※架空商品のデモLPです。実際の販売はありません。"

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

### 🔵 参考 [反復] 文字サイズが15種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 0, 13, 14, 16, 19, 20, 25, 28, 32, 36, 45, 48, 54, 55, 56 px

## desktop (1440×900)

重大 0件 / 要改善 2件 / 参考 5件

ページ高 5881px（6.5画面分） / テキストブロック 76 / 操作要素 12 / 画像 1

### 🟡 要改善 [アクセシビリティ] 本文テキストのコントラスト比が WCAG AA（4.5:1）未満

該当 7件

- `main#top > section.intro.paper > p.eyebrow` — 4.19:1（rgb(230, 35, 35) on rgb(255,245,223)）"OUR STORY"
- `main#top > section.intro.paper > div.stamp` — 4.19:1（rgb(230, 35, 35) on rgb(255,245,223)）"じんわり三段だし"
- `section#flavors > div.cards > article > div.bowl.red` — 2.63:1（rgb(36, 35, 31) on rgb(168,67,45)）"◯"
- `section#flavors > div.cards > article > div.bowl.green` — 3.38:1（rgb(36, 35, 31) on rgb(115,120,75)）"◯"
- `section#craft > div > p.eyebrow` — 2.61:1（rgb(230, 35, 35) on rgb(242,189,50)）"SECRET 01"
- `section#howto > p.eyebrow` — 2.41:1（rgb(230, 35, 35) on rgb(134,198,223)）"HOW TO ENJOY"

### 🟡 要改善 [タイポグラフィ] 読ませたい本文が14px未満（本文の基準はPC16〜17px・最低14px）

該当 1件

- `html > body > footer > small` — 13.3px / 44字 "© 2026 UMINONE / Fictional portfolio pro"

### 🔵 参考 [アクセシビリティ] 背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する

該当 3件

- `main#top > section.hero > div.hero-copy > p.kicker` — 1.34〜15.73:1 "ひと口すすれば、海の余韻。"
- `section.hero > div.hero-copy > h1 > em` — 1.00〜21.00:1 "ほっと"
- `main#top > section.hero > div.hero-copy > p` — 1.34〜15.73:1 "あさり・えび・昆布を重ねた、澄んだ旨みの一杯。"

### 🔵 参考 [コンバージョン] CTA候補 0個（うちファーストビュー内 0個）

該当 1件

- `document` — なし

### 🔵 参考 [タイポグラフィ] 12〜13pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる

該当 1件

- `section#buy > div.offer > small` — 13.3px "※架空商品のデモLPです。実際の販売はありません。"

### 🔵 参考 [情報設計] og:image がない。SNSシェア時にサムネイルが出ない

該当 1件

- `head` — 

### 🔵 参考 [反復] 文字サイズが14種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る

該当 1件

- `document` — 0, 13, 14, 16, 19, 25, 28, 32, 45, 48, 54, 68, 80, 101 px

---

合計: 重大 0件 / 要改善 5件

※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。