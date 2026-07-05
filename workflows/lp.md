# LP Workflow

1. 商材、ターゲット、CV、参考LP、法務制約を確認する。
2. 保存先の案件フォルダを決めて先に作る（`projects/<client>/<project-name>/` または `portfolio/<project-name>/`）。以降のファイルはすべてこの配下に作る。参考LPのスクリーンショットも撮った時点でこの配下の `references/` に直接保存し、リポジトリ直下には置かない。詳細は `skills/design/lp-creator/SKILL.md` の「保存先」「参考スクリーンショットの保存」を参照。
3. セクション構成を作る。
4. セクション別LP原稿を作る（案件フォルダの `copy/` へ）。
5. セクション別画像プロンプトを nanobanana pro 形式で作る。
6. Codex app-server / gpt-image-2 でラスター画像を生成する（案件フォルダの `lp/images/` へ）。
7. セクション画像を縦結合し、`<案件フォルダ>/lp/images/lp-full.png` を作る。
8. `<案件フォルダ>/lp/index.html` でローカルプレビューする。
9. Vercelに公開する場合は、`skills/lp-design/vercel-free-deploy/SKILL.md` の手順で公開し、同スキルの「ギャラリーサイトへの追加」に従って `gallery/`（ポートフォリオギャラリーサイト）にも追加する。
