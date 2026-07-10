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
- LP
- その他

質問例:

```text
今回作るものは、バナー、サムネ、SNS投稿、スライド、LPのどれですか？
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
- 原稿、セクション別画像プロンプト、生成画像、結合LPを分けて保存する。
- セクションが1枚に収まらない場合は、情報の流れが自然につながるよう複数セクションに分割する。
- 新規LPは必ず `skills/design/lp-responsive/SKILL.md` に従いPC/スマホ両対応にする。明示的に頼まれていなくても標準工程として行う。
- LPをVercelに本番公開したら、`skills/lp-design/lp-gallery-sync/SKILL.md` に従いポートフォリオギャラリー（Neon DB `landing_pages`）へ登録し、ギャラリーサイトを再公開する。2026-07-10からユーザー承認済みの標準工程なので、都度確認は不要。

## Git

- コミットメッセージは日本語で書く。
- コミット前に `git status --short --branch` と差分を確認し、変更内容とコミットメッセージ案をユーザーへ提示する。
- ユーザー承認があるまで `git commit` は実行しない。
- push はユーザーが明示した場合だけ行う。
