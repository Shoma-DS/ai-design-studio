# Header

## 役割

全ページ共通の固定ヘッダー。ロゴ、常時表示のエントリーCTA、ハンバーガーメニューを配置する。

## レイアウト

- `position: fixed` で画面上部に固定。左：ロゴ（円形マーク＋社名＋"Recruit Site"サブラベル）、中央右：エントリーCTA（PC幅のみ表示）、右端：ハンバーガーボタン（円形）。
- ブレークポイント：769px未満ではエントリーCTAを非表示にし、ハンバーガーメニュー内の遷移に一本化。

## 配色

- ロゴ背景：クリーム`var(--color-bg)`、ロゴマーク：`var(--color-primary)`
- エントリーボタン：`var(--color-accent)`
- ハンバーガーボタン：`var(--color-primary)`

## アニメーション仕様

- メニュー開閉：`framer-motion`の`AnimatePresence`。オーバーレイは`opacity`フェード（0.3s）、パネルは`x: "100%" → 0`のスライドイン（0.4s、ease `[0.16, 0.7, 0.3, 1]`）。
- パネル内ナビ項目は`staggerChildren`相当（0.06s間隔）で`opacity`+`y`フェードイン。
- Escキー・背景クリックで閉じる。開いている間は`body`のスクロールをロック。

## コンテンツ

`src/data/site.ts`の`navLinks`を参照。
