---
name: hp-gallery-sync
description: （非推奨・統合済み）HPポートフォリオは2026-07-16に統合ポートフォリオギャラリー（gallery/, Neon Postgresのportfolio_itemsテーブル, type='hp'）へ統合された。Use when asked about hp-portfolio-gallery, gallery-hp, HPポートフォリオギャラリー — 実際の作業は skills/lp-design/lp-gallery-sync/SKILL.md を使う。
---

# HP Gallery Sync（非推奨・統合済み）

2026-07-16、`gallery-hp/`（旧HP専用ポートフォリオサイト、Neon Postgresの`websites`テーブル）は `gallery/`（統合ポートフォリオギャラリー、`portfolio_items`テーブル、`type='hp'`）に統合された。

**新しいHPをギャラリーに登録する場合は、このファイルではなく `skills/lp-design/lp-gallery-sync/SKILL.md` の手順に従うこと。**

- `gallery-hp/`（Vercelプロジェクト `gallery-hp`、`https://gallery-hp-rho.vercel.app`）自体は削除しておらず稼働中だが、新規データを登録する先ではない（dormant）。取り下げるかリダイレクトするかは未決定なので、対応が必要な場合はユーザーに確認する。
- 旧`websites`テーブルもロールバック用にNeon上へ残置している（削除していない）。
- 統合の背景・標準運用については `skills/lp-design/lp-gallery-sync/SKILL.md` の冒頭を参照。
