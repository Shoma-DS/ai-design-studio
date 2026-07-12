# MessagePin（シンカ「メッセージセクション」の再現）

**役割**：本サイト最大の技術的見せ場。背景写真を画面に固定（pin）したまま、3つのメッセージ（人をつなぐ／地域をつなぐ／未来をつなぐ）を1つずつスクロールに応じて順送りでフェードインさせる。

**実装方式**：GSAP + ScrollTrigger（Framer Motionではなくこの1箇所だけGSAPを使用）。
- `useLayoutEffect`内で`gsap.context(() => {...}, wrapperRef)`によりスコープを限定し、返り値のクリーンアップ関数で`ctx.revert()`を呼ぶ。これによりコンポーネントのアンマウント時にScrollTriggerインスタンスが確実に破棄され、残留・二重発火を防ぐ。
- `ScrollTrigger.create`：`trigger`はセクション自身、`start:"top top"`、`end:"+=${lines.length*480}"`（メッセージ数×480pxぶんスクロールする間ピン留め）、`pin:true, pinSpacing:true, scrub:0.6`。
- `onUpdate`で`self.progress`（0〜1）を3等分し、各行の`local`進捗を`gsap.utils.clamp`で計算、`opacity`と`y`（32px→0）を直接`gsap.set`で更新（Reactの再レンダリングを介さないためスクロール追従が滑らか）。

**レイアウト**
- `.inner`：`height:100vh; max-height:900px`。背景`<picture>`（`driver-cabin-pc/sp.png`）＋グラデーションオーバーレイ（縦方向、上下を暗く）。
- テキストは1024px未満は左寄せ縦積み、1024px以上は右寄せ（`align-items:flex-end; text-align:right`）。

**配色・タイポ**：見出し`clamp(24px,6vw,36px)`800白、本文14px/1.9、白72〜85%不透明度。

**表示コンテンツ**：人をつなぐ。／地域をつなぐ。／未来をつなぐ。＋各見出しの説明文（`docs/copy.md`参照）。
