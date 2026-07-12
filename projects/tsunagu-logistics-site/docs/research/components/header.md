# Header

**役割**：全ページ共通の固定ヘッダー。ロゴ・グローバルナビ・CTA・ハンバーガーメニューを内包。

**レイアウト**
- `position: fixed; top:0; z-index:100`。`.inner`は`max-width: 1280px`中央寄せ、`padding: 14px 24px`。
- 1024px未満：ロゴ＋ハンバーガーボタンのみ表示（`.nav`と`.actions`は`display:none`）。
- 1024px以上：`.nav`（横並びリンク、`gap:32px`）と`.actions`（採用情報／お問い合わせボタン）が表示され、ハンバーガーは非表示。

**配色・タイポ**
- 初期状態：`background: linear-gradient(to bottom, rgba(11,26,43,.55), rgba(11,26,43,0))`、文字色白（写真の上に重なる透過ヘッダー）。
- `scrollY > 40`で`.headerScrolled`：`background: rgba(255,255,255,.96)`＋`backdrop-filter: blur(6px)`、文字色ネイビー（`--color-ink`）に切り替え。
- ロゴ：英字`--font-en`（Archivo）800、20px＋日本語サブテキスト10px。
- ナビ文字：14px/500。ボタン文字：13px/700。

**アニメーション**
- ヘッダー背景切替：`transition: background .4s var(--ease-out)`（スクロール検知はJSの`scroll`イベント、CSSトランジションで滑らかに）。
- ハンバーガー→×：`span`の`top`/`transform`/`opacity`を0.3秒`var(--ease-out)`でモーフィング。
- モバイルメニュー：Framer Motion `AnimatePresence`。背景オーバーレイは`opacity 0→1`（0.3s）、パネルは`x:"100%"→0`（0.4s、右からスライドイン）、各リンクは`y:16→0`かつ`opacity:0→1`を`delay: 0.1 + index*0.06`でスタッガー。
- Escキー／背景クリックでメニューを閉じる。開いている間は`body.style.overflow = "hidden"`でスクロールロック。

**表示コンテンツ**：`navLinks`（トップページ／私たちについて／事業内容／数字で見る／お問い合わせ）＋採用情報／お問い合わせボタン。
