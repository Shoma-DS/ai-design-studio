# LP Workflow

1. 商材、ターゲット、CV、参考LP、法務制約を確認する。
2. 保存先の案件フォルダを決めて先に作る（`projects/<client>/<project-name>/` または `portfolio/<project-name>/`）。以降のファイルはすべてこの配下に作る。参考LPのスクリーンショットも撮った時点でこの配下の `references/` に直接保存し、リポジトリ直下には置かない。詳細は `skills/design/lp-creator/SKILL.md` の「保存先」「参考スクリーンショットの保存」を参照。
3. セクション構成を作る。
4. セクション別LP原稿を作る（案件フォルダの `copy/` へ）。
5. セクション別画像プロンプトを nanobanana pro 形式で作る。
6. セクションごとに、①スマホ版画像 → ②PC版画像の順でCodex app-server / gpt-image-2 により生成し、両方を成果物として保存する（スマホ版: `lp/images/mobile/`、PC版: `lp/images/`）。PC版はスマホ版の単純な拡大・縮小にせず、横幅を活かして構図を再設計する。詳細は `skills/design/lp-responsive/SKILL.md` を参照。
7. `<案件フォルダ>/lp/index.html` を、レスポンシブ時の画像切り替え（1セクション1`<picture>`、スマホ版/PC版の`srcset`切り替え）を前提に組み立てる。全セクションを縦結合した `lp-full.png` は作らない（廃止済み）。
8. `<案件フォルダ>/lp/index.html` でローカルプレビューし、PC幅・スマホ幅の両方で構図が切り替わることを確認する。
9. Vercelに公開する場合は、`skills/lp-design/vercel-free-deploy/SKILL.md` の手順で公開し、同スキルの「ギャラリーサイトへの追加」に従って `gallery/`（ポートフォリオギャラリーサイト）にも追加する。
