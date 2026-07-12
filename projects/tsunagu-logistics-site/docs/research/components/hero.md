# Hero（FV）

**役割**：ファーストビュー。斜めカット×写真＋メインコピー＋動画サムネ＋Topicsティッカー。

**レイアウト**
- `height: 100vh; max-height: 900px`、`clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%)`で右下が斜めに切れる形状（シンカのダイアゴナルカットを再現）。
- モバイル：`.content`は縦積み（`flex-direction: column`）、`padding: 120px 24px 64px`。
- 561px以上：`padding: 140px 48px 72px`、動画サムネ幅220px。
- 1024px以上：`.content`は`flex-direction: row`（見出しと動画サムネが横並び）、`max-width: 1280px`中央寄せ、動画サムネ幅300px。

**画像**：`<picture>`で1024px以上は`hero-pc.png`、それ未満は`hero-sp.png`。`object-fit: cover; object-position: center 30%`。オーバーレイは115度グラデーション（ネイビー系、右にかけて薄くなる）。

**配色・タイポ**
- 見出し：`clamp(36px,11vw,68px)`→PC`clamp(48px,5.4vw,76px)`、900、白。
- アイキャッチ（TSUNAGU LOGISTICS）：Archivo 700、13px、amber-500、letter-spacing 0.24em。
- 右上に幅140pxのアンバーのアクセントストライプを12度回転させて配置（`opacity:.16`）。

**アニメーション**
- Framer Motionの`initial/animate`（マウント時に一度だけ）：アイキャッチ→見出し→サブコピー→動画サムネの順に`delay`をずらして出現（0, 0.15, 0.4, 0.55秒）。すべて`opacity`＋`y`（動画サムネのみ`scale`も）、duration 0.7〜0.8秒、`ease:[0.16,0.7,0.3,1]`。
- Topicsバーはアニメーションなし（静的表示）。

**表示コンテンツ**：`topics.date` / `topics.text`（`src/data/site.ts`）。
