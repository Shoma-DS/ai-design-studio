---
name: airth-mate-image-style
description: Airth Mate風の白背景・青基調・成長矢印・線画人物イラストのビジネス画像を作る。ブログ見出し画像、記事サムネイル、SNSバナー、採用/営業/AI活用系の告知画像で「この画風」「Airth Mateっぽい」「青い成長矢印とチームの線画」のように依頼されたときに使う。
---

# Airth Mate Image Style

## 方針

添付テンプレ画像の構造、配色、余白、視線誘導だけを抽出し、ロゴ・ブランド名・既存コピーは複製しない。

参考アセット: `assets/style-reference.png`

## 画風

- 白背景を広く取り、清潔感のあるビジネス向けトーンにする。
- メインカラーは濃いロイヤルブルー。差し色はイエロー、オレンジ、水色を少量だけ使う。
- 左側に大きな太字タイトル、下に2行程度のサブコピー、さらに淡い水色の角丸ラベルを置く。
- 右側に、黒い細線の人物イラストと太い青い上昇矢印を置く。
- 人物は3〜5人のチーム。矢印を支える、押し上げる、見上げるなど、成長・前進が伝わるポーズにする。
- 背景装飾は斜線、ドット、三角、円を四隅に薄く散らす。装飾は控えめにし、本文の可読性を優先する。
- 全体は16:9または1.91:1で作る。ブログ見出し画像は16:9、SNS/OGPサムネイルは1200x630相当を基本にする。

## 文字

- 文字は画像内に直接入れる。
- 日本語は大きく、短く、読みやすくする。
- 重要語だけ青にし、それ以外は黒を基本にする。
- 1枚に入れる文字は、タイトル1〜2行、サブコピー2行、ラベル1行までを目安にする。
- 誤字を避けるため、プロンプト内に「表示するテキスト」を明示し、「他の文字は入れない」と指定する。
- 生成後は全テキストを目視確認し、疑似文字、脱字、余計な文字があれば再生成する。

## 禁止

- 参考画像のロゴ、Airth Mateというブランド名、既存コピーをそのまま使わない。
- 実在企業のロゴや商標を、許可なく生成しない。
- 写真風、3D、過度なグラデーション、暗い背景、装飾過多にしない。
- 小さすぎる文字、長文、読めない疑似文字を入れない。

## プロンプト骨子

```text
Create a clean Japanese business blog image in the same general style as the reference: white background, royal blue growth arrow, black line-art team illustration, light blue geometric decorations, bold Japanese typography on the left.

Do not copy the reference logo, brand name, or exact text.

Canvas: [size / aspect ratio]
Text to render exactly:
- Small brand text: [...]
- Main title: [...]
- Subcopy line 1: [...]
- Subcopy line 2: [...]
- Label: [...]

Layout:
- Left 48%: text area with strong hierarchy.
- Right 52%: upward blue arrow and 3-5 line-art business people pushing/supporting it.
- Use blue emphasis on the most important words only.
- Add small yellow/orange/blue geometric accents near corners.
- No extra text, no watermark, no misspellings.
```
