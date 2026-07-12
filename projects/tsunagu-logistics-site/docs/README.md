# docs/ について

このフォルダは、ツナグ物流株式会社サイトの設計根拠をまとめたドキュメント群です。

- `research/analysis.md` — 参考サイト（シンカ株式会社）のデザイン・構成・アニメーション分析
- `research/components/` — 実装済み11セクションそれぞれの仕様書（レイアウト・配色・アニメーションの実測値ベース）
- `sitemap.md` — サイトマップ（実装済み範囲と未実装の下層ページの切り分け）
- `copy.md` — トップページ原稿一覧（実装コードから抽出、実装と一致）
- `design-references/` — 参照スクリーンショット（シンカ社サイトの内部参照用、および自サイトの確認用）

## `docs/research/` という構成について

このフォルダ構成は [`JCodesMore/ai-website-cloner-template`](https://github.com/JCodesMore/ai-website-cloner-template) の `docs/research/`（分析・コンポーネント仕様）と `docs/design-references/`（参照スクリーンショット）というドキュメント運用の型を参考にしたものです。

ただし、同テンプレートが採用する技術スタック（Tailwind CSS v4 + shadcn/ui への全面移行や、gitワークツリーによるセクション並列実装パイプライン）は採用していません。本サイトは既にCSS Modules + Framer Motion + GSAPで実装・検証済みのプロトタイプであり、今回のスコープ（トップページのみの検証目的）に対して技術スタックの移行はオーバーエンジニアリングと判断したためです。取り入れたのは「分析→コンポーネント仕様→サイトマップ→原稿」というドキュメントの粒度・分割の型のみです。
