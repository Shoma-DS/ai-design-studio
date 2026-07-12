# ServiceList（OUR SERVICE 事業内容）

**役割**：4事業の詳細説明を、写真とテキストが左右交互になるリスト形式で見せる。シンカの「OUR SERVICE」暗背景・番号バッジ付きリストを踏襲。

**レイアウト**
- 背景`--color-navy-950`、文字白。
- モバイル：`.row`は縦積み（画像→コピー）、画像比率`4/3`。
- 1024px以上：`.row`は横並び、`data-reverse="true"`（偶数番目）で`flex-direction:row-reverse`にし、画像とテキストが交互に左右入れ替わる。画像は`flex:0 0 46%`、比率`3/2`。

**配色・タイポ**：番号バッジは円形、`--color-green-500`背景（シンカのブルーに対し、本サイトではグリーン＝「未来をつなぐ」のアクセントカラーを採用し差別化）。見出し24px/800、本文14〜15px/1.9行間、白72%不透明度。

**アニメーション**：各行が`whileInView`で`opacity:0,y:32→opacity:1,y:0`（duration 0.7s、`viewport:{once:true, amount:0.25}`）。GSAPは使わずFramer Motionのみで統一。

**表示コンテンツ**：`services`配列4件（ServiceCarouselと同一データソース、`docs/copy.md`参照）。
