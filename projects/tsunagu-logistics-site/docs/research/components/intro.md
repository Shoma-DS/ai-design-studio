# Intro（WHAT WE CARRY）

**役割**：3枚の写真をスタッガーでフェードインさせ、企業の姿勢をリード文で伝える導入セクション。

**レイアウト**
- `max-width:1280px`中央寄せ、`padding:88px 24px`→1024px以上`140px 40px`。
- グリッド：モバイルは1カラム縦積み。561px以上で3カラム（`grid-template-columns: repeat(3,1fr)`）。1024px以上で2枚目のカードのみ`margin-top:40px`（千鳥配置でシンカのフォトグリップ演出を再現）。
- カード比率：モバイル`aspect-ratio:4/5`→PC`3/4`。

**アニメーション**
- リード文：`whileInView`で`opacity/y`フェードイン（duration 0.7s、`viewport:{once:true, amount:0.4}`）。
- 写真グリッド：親要素`variants`で`staggerChildren:0.14`、各カード`opacity:0,y:28 → opacity:1,y:0`（duration 0.7s）。`viewport:{once:true, amount:0.2}`でビューポート進入時に一度だけ発火。

**表示コンテンツ**：リード「荷物だけを運んでいるのではない。そのひとつ先にある景色を運んでいる。」＋写真キャプション（人をつなぐ／拠点をつなぐ／地域をつなぐ）。画像は`handoff` / `warehouse` / `highway`のPC・SPペア。
