---
name: image-prompt-generator
description: バナー、サムネ、SNS投稿、スライド、LP用の画像プロンプトをnanobanana pro形式で作る。
---
# Image Prompt Generator

## 絶対ルール

画像プロンプトは必ず nanobanana pro 形式で作る。

## 基本構造

```text
あなたは【トップクラスのインフォグラフィックデザイナー兼グラフィックレコーダー】です。
目的：{{PURPOSE}}
────────────────
【入力】
@img（参考画像があれば添付 / なければ「なし：ゼロベース新規生成」）

【最重要ルール】
・@img の構造・雰囲気・視線誘導のみ抽出する
・コピー／トレース／商標再現は禁止
・テキストはすべて書き換える
・削除跡や不自然な余白は禁止

【構図】
{{COMPOSITION}}
視線誘導：{{VISUAL_FLOW}}

【タイトル】
メイン：「{{TITLE_MAIN}}」
サブ：「{{TITLE_SUB}}」

【各セクションのコピー・内容】
{{SECTIONS}}

【色・雰囲気ルール】
{{COLOR_RULES}}

【デザイン】
{{DESIGN_STYLE}}

【出力条件】
・一目で理解できる
・スマホでも見やすい
・媒体にそのまま使える
{{EXTRA_CONDITIONS}}

【最終目的】
見た瞬間にこう思わせる：{{FINAL_GOALS}}
```
