# CtaBand

**役割**：採用導線への短いCTA帯。シンカのグリーン背景CTA帯を踏襲。

**レイアウト**：モバイルは縦積み左寄せ、1024px以上は横並び・両端揃え（`justify-content:space-between`）。

**配色**：背景は`linear-gradient(135deg, --color-green-500, --color-green-600)`。ピル型ボタンは白背景・ネイビー文字、hover時`translateY(-2px)`。

**アニメーション**：`whileInView`で`opacity:0,y:20→opacity:1,y:0`（duration 0.7s）。

**表示コンテンツ**：「ツナグ物流の仕事や現場を、もっと詳しく知りたい方へ。」＋「採用情報を見る →」（リンク先`#recruit`は未実装、`docs/sitemap.md`参照）。
