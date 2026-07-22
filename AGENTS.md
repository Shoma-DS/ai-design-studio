# AI Design Studio エージェント運用

このリポジトリは、AIデザイン制作の共通基盤です。Claude Code、Codex、Gemini など、どのAIエージェントもこのファイルを正本として扱います。

## 会話

- ユーザーとの会話は日本語で行う。
- 変更はユーザーの目的に必要な範囲へ絞る。
- 未確認の破壊的操作、秘密情報の共有、外部サービスへの送信、意図しない課金につながる操作はしない。
- `.env`、`.vercel/`、秘密情報ファイルはGitに追加しない。

## 制作タイプ確認

ユーザーが何を作るか明示していない場合、作業開始前に必ず確認する。

選択肢:

- バナー
- サムネ
- SNS投稿
- スライド
- LP（1枚絵のラスターLP）
- HP（実コードのコーポレートサイト。参考サイト分析→Next.js実装→デプロイまで。LPとの違いは`skills/design/hp-creator/SKILL.md`参照）
- その他

質問例:

```text
今回作るものは、バナー、サムネ、SNS投稿、スライド、LP、HPのどれですか？
```

## 正本フォルダ

- 制作タイプ別コンテキスト: `contexts/<type>/`
- 制作タイプ別スキル: `skills/design/<type>-creator/SKILL.md`
- 制作タイプ別ワークフロー: `workflows/<type>.md`
- ポートフォリオ: `portfolio/`
- 業務・案件: `projects/`
- 参考資料: `references/`
- 納品物: `exports/`

## 画像生成

- 画像生成は Codex app-server 経由の `gpt-image-2` を使う。
- OpenAI APIキー、OpenAI Images REST API、外部画像生成APIは使わない。
- 参考画像がある場合は、構造・雰囲気・視線誘導のみ抽出し、コピー／トレース／商標再現は禁止。
- 生成した画像は、該当プロジェクト配下または `portfolio/` / `exports/` に保存する。
- ログイン切れ・リフレッシュトークン失効時の確認/復旧手順は `skills/common/codex-image-auth/SKILL.md` を使う。ユーザーへの再ログイン依頼は1回にまとめ、何度も催促しない。

## LP制作

- LP制作では `skills/design/lp-creator/SKILL.md` と `skills/design/image-prompt-generator/SKILL.md` を使う。
- ボタン・ナビ・カルーセル・アコーディオンなど操作が必要な要素があるLPは `skills/design/lp-hybrid-image-html/SKILL.md`（画像+HTML/CSS/JSのハイブリッド構成）を使う。
- 縦スワイプ型カルーセルLP（構成05、Instagram/TikTokリール風の1画面1カード形式）は `skills/design/swipe-lp-creator/SKILL.md` を使う。このタイプはスマホ専用として作り、下のPC/スマホ両対応の原則は適用しない。
- 原稿、セクション別画像プロンプト、生成画像、結合LPを分けて保存する。
- セクションが1枚に収まらない場合は、情報の流れが自然につながるよう複数セクションに分割する。
- 新規LPは必ず `skills/design/lp-responsive/SKILL.md` に従いPC/スマホ両対応にする（スワイプ型LPを除く）。明示的に頼まれていなくても標準工程として行う。
- LPをVercelに本番公開したら、`skills/lp-design/lp-gallery-sync/SKILL.md` に従い統合ポートフォリオギャラリー（`gallery/`, Neon DB `portfolio_items`テーブル, `type='lp'`）へ登録し、ギャラリーサイトを再公開する。2026-07-10からユーザー承認済みの標準工程なので、都度確認は不要。
- クライアントのWordPress／Wix／STUDIO／ペライチへ納品する場合は `skills/lp-design/platform-embed/SKILL.md` を使い、静的LP出力を各プラットフォームのカスタムHTML・埋め込み機能に貼れる形式へ変換する。実際の管理画面への貼り付け・画像アップロード・公開作業はこのリポジトリから自動化できないため、人が行う作業として案内する。

## HP制作（実コードのコーポレートサイト）

- 1枚絵のLPではなく、Next.js（App Router）で実際に動くコーポレートサイトを作る場合は `skills/design/hp-creator/SKILL.md` を使う。参考サイトの分析（配色・余白・フォント・構成・導線・アニメーション・世界観の抽出）→オリジナル企画→独立Next.jsプロジェクトとしての実装（`projects/<slug>/`）→画像生成→ドキュメント化（`docs/research/`）→QA→ローカル確認、までを一気通貫で行う。
- 画像生成はLPと同様、Codex app-server / `gpt-image-2` のみを使う。PC/SP別コンポジションで生成し、1枚を引き伸ばして両対応させない。
- Vercelへの公開、Vercel環境変数への秘密情報書き込みは、LPと異なり2026-07-12時点でまだ標準運用として承認されていない。**都度チャットで明示的な許可を得てから実行する。**
- 公開後にポートフォリオギャラリー（`gallery/`、Neon DB `portfolio_items`テーブル、`type='hp'`）へ登録する場合は `skills/lp-design/lp-gallery-sync/SKILL.md` を使う（旧`gallery-hp/`は2026-07-16に統合済み。詳細は `skills/design/hp-gallery-sync/SKILL.md` 参照）。

## 見積書

- クライアント向けLP/HP見積書の作成は `skills/common/quote-creator/SKILL.md` を使う。「見積書を作成して」「◯◯様の見積書作って」等の指示だけで、`references/quote-templates/` のテンプレート（LP用・HP用）から実ファイルを `exports/quotes/` 配下に自動生成する。
- テンプレート本体は編集せず、案件ごとに `exports/quotes/` へコピーしてから中身を埋める。生成したHTMLはブラウザで開くと本文をクリックして直接編集でき、右上のツールバーから印刷／PDF化・編集内容の保存ができる。

## UTAGE

- UTAGEで実際に何か（ファネル、メール・LINE配信シナリオ、会員サイト、イベント・予約、パートナー機能などの構築・設定）を作るときだけ、NotebookLMの「UTAGE公式マニュアル」ノートブック（notebook_id: `942db75e-5025-41b2-8c7e-aac3ebc86c7a`、https://notebooklm.google.com/notebook/942db75e-5025-41b2-8c7e-aac3ebc86c7a）を参照する。UTAGEに軽く言及されただけの場面では参照不要。
- このノートブックは `help.utage-system.com/knowledge-allpages` の全記事（331件、2026-07-19時点）をURLソースとして登録した公式マニュアルのデータベース。`mcp__notebooklm-mcp__notebook_query` 等で該当機能の正しい仕様・手順を確認してから実装・設定作業を行う。

## Git

- コミットメッセージは日本語で書く。
- コミット前に `git status --short --branch` と差分を確認し、変更内容とコミットメッセージ案をユーザーへ提示する。
- ユーザー承認があるまで `git commit` は実行しない。
- push はユーザーが明示した場合だけ行う。
