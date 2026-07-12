# ServiceCarousel（OUR BUSINESS 事業紹介）

**役割**：4事業（幹線輸送／地域宅配／倉庫保管・仕分け／物流DXソリューション）を1枚ずつ見せるカルーセル。シンカの「事業部紹介カルーセル＋進捗バー型ページネーション」を再現。

**実装方式**：外部ライブラリ（Swiper等）は使わず自前実装。`useState`でインデックス管理、`setTimeout`による自動送り（`AUTOPLAY_MS = 5200`）、`mouseenter/leave`で一時停止。Framer Motionの`AnimatePresence mode="wait"`でスライド切替時にクロスフェード（0.6s）。

**レイアウト**
- モバイル：`.slide`は縦積み（画像→コピー）、画像`aspect-ratio:4/5`。
- 768px以上：横並び（画像46%／コピー残り）。
- 1024px以上：左右に矢印ボタン（円形、white背景、hover時`scale(1.08)`）が追加表示。

**ページネーション**：進捗バー型（シンカと同じ意匠）。各バーは現在スライドのみCSSアニメーション`fillProgress`（`animationDuration: AUTOPLAY_MS`）で0→100%に伸び、完了/未完了スライドは`width:100%`/`0`で塗り分け。一時停止中は`animation-play-state:paused`。

**表示コンテンツ**：`services`配列4件（`docs/copy.md`参照）。
