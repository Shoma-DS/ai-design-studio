# CompanyIntro（Step 01 トドマツを知る）

## 役割

会社の歴史・規模を数字とともに紹介し、新卒がまず知っておくべき企業概要を伝える。Hero・FloorIntroと同じ「見出し＋没入イラスト」の2カラム構成に統一し、Step間の視覚的リズムを揃えている（初版ではイラストが無く数字カードのみだったが、参考サイトとの一致度を高めるため追加）。

## レイアウト

- 上段：SPでは縦積み（イラスト→テキスト）、PC（769px以上）では横並び（テキスト40%：イラスト60%、イラストは画面右端までフルブリード、角丸なし）。
- 下段：statGridはSPで2列、PC（769px以上）で4列。

## コンテンツ

`src/data/site.ts`の`companyInfo`（創業年・キャッチコピー・リード文）と`stats`（創業年数／店舗数／従業員数／展開道県数）。

## アニメーション仕様

- 見出し・リード文：`whileInView`によるfade-up（`y: 24→0`, `duration: 0.6s`, `delay`を0.1s刻みでずらす）。
- 統計カード：`useInView`（`once: true, amount: 0.6`）をトリガーに`framer-motion`の`animate()`で0→目標値へカウントアップ（`duration: 1.4s`, `ease: "easeOut"`）。`staggerChildren: 0.12s`でカード自体もfade-upする。

## 画像生成プロンプトの要点

針葉樹に囲まれた本社・1号店の外観イラスト。地域の人々・配送トラック・従業員が店の前を行き交う情景。詳細は`scripts/sections.mjs`の`company`モーメントを参照。
