# QAノート

## 実施日

2026-07-20

## コマンド確認

- `npm run lint`: 成功
- `npm run build`: 成功
- `npm run dev -- -p 3010`: 成功

## ブラウザ確認

- PC 1440px: トップページ表示、ヘッダーリンク、下層4ページ遷移を確認。
- SP 390px: トップページ表示、ハンバーガーメニュー開閉、下層4ページ遷移を確認。
- スクロール後にFramer MotionのwhileInView要素が表示されることを確認。

## 確認済みURL

- `http://localhost:3010/`
- `http://localhost:3010/about`
- `http://localhost:3010/services`
- `http://localhost:3010/works`
- `http://localhost:3010/contact`

## 補足

- PlaywrightのfullPageスクリーンショットでは未スクロール領域のwhileInView要素が非表示のまま写る。実際のスクロール検査では表示を確認済み。
- お問い合わせフォームは静的UIのみ。送信処理や外部サービス連携は未実装。
- ラスター画像はCodex app-server / `gpt-image-2` フローで生成済み。商標・実在ロゴ・読める文字なしで目視確認済み。
- 生成スクリプト: `scripts/generate-section-images.mjs`
- プロンプト定義: `scripts/sections.mjs` と `docs/image-prompts.md`
