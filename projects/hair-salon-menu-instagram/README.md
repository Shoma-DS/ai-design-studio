# ヘアサロン メニュー＆料金表 / Instagram投稿

Instagram投稿サイズ（1080×1350）で 2 パターン作成。

## 成果物

| ファイル | 内容 |
| --- | --- |
| `output/menu-a-all.png` / `.jpg` | パターンA：全19メニューを1枚に（🟥6件をSIGNATUREとして強調、残り13件をカテゴリ別2カラム） |
| `output/menu-b-signature.png` / `.jpg` | パターンB：🟥6件のみ（参考画像の構成に近い、説明文つき） |
| `output/menu-c-all-menu.png` / `.jpg` | パターンC：残り13件を大きく（Bとセットでカルーセル2枚目に使う） |

**推奨＝カルーセル2枚組（B → C）**。1枚に19件詰めたAは、実機幅390pxだと下段が小さく読みづらい。
納品用は `exports/instagram/hair-salon-menu/carousel/` に `01-人気6メニュー` / `02-その他13メニュー` で書き出し済み。

## 構成ファイル

- `menu-data.md` … メニュー原稿・要確認事項
- `prompt.md` … 人物写真の生成プロンプト
- `generate-photo.mjs` … Codex app-server / gpt-image-2 で `assets/portrait.png` を生成
- `pattern-a-all.html` / `pattern-b-signature.html` … レイアウト本体
- `capture.mjs` … Playwright で 1080×1350 PNG に書き出し

## 作り直し手順

```bash
node projects/hair-salon-menu-instagram/generate-photo.mjs   # 写真を作り直す場合のみ
node projects/hair-salon-menu-instagram/capture.mjs          # 画像を書き出す
```

文言・価格を直す場合は各 HTML を編集して `capture.mjs` を再実行する。

## デザイン仕様

- ベースカラー `#F3EBDD`（支給指定）
- 文字色 `#2E2823` / 補助 `#5C5147` / 淡色 `#8A7C6D` / 罫線 `#CFC0A9`・`#E0D4C0`
- 和文＝明朝（Toppan Bunkyu Mincho → ヒラギノ明朝 → 游明朝）、欧文・価格＝Didot
- 写真は右側に配置し、`#F3EBDD` のグラデーションで文字側を覆って可読性を確保
- 写真は gpt-image-2 で新規生成した架空の人物（参考画像のコピー・トレースはしていない）

## 要確認

- 税込／税別の表記（現状どちらも記載していない）
- サロン名・ロゴ・予約導線（現状は「DMよりお気軽にどうぞ」の汎用文言）
- パターンBの説明文は施術内容から起こした仮テキスト
