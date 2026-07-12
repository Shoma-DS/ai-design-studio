# MarqueeBand

**役割**：セクション間の区切りとなる、写真背景＋無限横スクロールする英字コピー帯。シンカの「MEET SHINKA IN MANGA」帯・「SHINKA STARTS WITH...」帯に相当。

**実装方式**：JSライブラリなし、純CSSキーフレームのみ。フレーズを配列で6回複製し、同じ内容を2グループ（`.group`×2）並べて`translateX(0) → translateX(-50%)`を`34s linear infinite`でループさせることで継ぎ目のない無限スクロールを実現。`prefers-reduced-motion:reduce`はグローバルCSS（`globals.css`）側で`animation-duration:.001ms !important`に上書きされ、モーション低減設定を尊重する。

**レイアウト・配色**：背景は`driver-cabin`画像＋`rgba(11,26,43,.72)`オーバーレイ。文字は`clamp(24px,6vw,44px)`、Archivo 800、白。3つおきの単語をamber-500に着色してリズムを作る。

**表示コンテンツ**："CONNECT PEOPLE. CONNECT REGIONS. CONNECT THE FUTURE."
