# 株式会社ソラリンク（SORALINK）2028年卒 新卒採用LP

大手通信会社の新卒採用サイトを参考に、**構造・配色トーン・視線誘導だけ**を抽出して制作した架空案件の自主制作LP。
社名・ロゴ・コピー・写真・登場人物はすべてオリジナル（実在企業・実在人物の再現なし）。

## 構成

| # | セクション | 内容 |
|---|---|---|
| 01 | ヒーロー | みちを、ひらけ。／ニュース帯 |
| 02 | メッセージ | 何をひらく？何をつなぐ？ |
| — | キーワード帯 | 事業キーワードの無限マーキー（HTML） |
| 03 | 事業を知る | 通信インフラ／DC運用／地域DX／防災NW |
| — | 数字で見るソラリンク | count-upの実績バンド（HTML） |
| 04 | 職種を知る | 6職種カード |
| 05 | 育つ環境 | 導入研修→OJT→資格取得支援 |
| 06 | キャリアと働き方 | キャリアパス／働き方3制度 |
| 07 | 福利厚生 | 4カード |
| 08 | 社員を知る | 架空社員6名 |
| 09 | 社員の1日 | 08:30〜18:00 タイムライン |
| — | 選考の流れ | スクロール連動タイムライン（HTML） |
| — | よくある質問 | アコーディオン5問（HTML） |
| 10 | エントリー＋フッター | 主CTA・副CTA・サイトマップ |

「1セクションに収まらない内容は次セクションへ自然につなぐ」方針で、参考サイトの
`採用情報` ブロックを **職種／育成／キャリア・働き方／福利厚生** の4セクションへ分割している。

## 配色

| 役割 | 色 |
|---|---|
| メイン | `#0B5BD3` ビビッドブルー |
| サブ | `#1E87D6` ライトブルー（交互配色） |
| ダーク | `#06327A` ネイビー |
| アクセント1 | `#FFE04D` イエロー |
| アクセント2 | `#FF4D8D` マゼンタ |

反復モチーフ: 下向きシェブロン／黄色い破線ストライプ／マゼンタの輪郭円。

## 使用アニメーション（Neon `animations` テーブルから読み込み）

`scroll-progress-bar` / `sticky-header-shrink` / `title-fade-up-blur` / `scroll-fade-up` /
`marquee-loop` / `count-up-number` / `timeline-scroll-draw` / `accordion-toggle` /
`sticky-cta-bar-slideup` / `ripple-click-effect` / `toast-notification-slide` / `back-to-top-fade`

## ファイル

```
copy/LP原稿.md            LP原稿（セクション別コピー）
prompts/*.txt             セクション別 画像プロンプト（nanobanana pro形式）
sections.mjs              セクション定義 + buildPrompt()
scripts/generate-mobile-images.mjs   スマホ版生成（taskType: showcase）
scripts/generate-pc-images.mjs       PC版生成（スマホ版を参照画像に再構成）
lp/index.html / style.css / script.js
lp/images/                PC版セクション画像（1536×1024）
lp/images/mobile/         スマホ版セクション画像（約864×1821）
references/               参考サイトのスクリーンショット
outputs/                  完成版フルページスクショ（PC/スマホ）
```

## 画像の再生成

```bash
node scripts/generate-mobile-images.mjs [section-id...]   # スマホ版が先（正本）
node scripts/generate-pc-images.mjs [section-id...]       # PC版はスマホ版を参照して再構成
```

生成はPNGで出力されるため、公開前に `sips -s format jpeg -s formatOptions 82` でJPEG化して
`index.html` の参照を `.jpg` に揃える（PC/スマホ20枚で 29MB → 6MB）。

## 品質チェック

`node skills/design/uiux-design/scripts/uiux-audit.mjs http://localhost:8899/` で
mobile/desktop とも 🔴重大 0件 / 🟡要改善 0件 を確認済み。
