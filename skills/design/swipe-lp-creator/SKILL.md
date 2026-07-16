---
name: swipe-lp-creator
description: 縦スワイプ型カルーセルLP（構成05）を、架空ブランドの原稿作成から画像生成・HTML/CSS/JS実装・サムネイル・Vercel公開・ギャラリー登録まで一気通貫で作る。Use when the user wants a new swipe-type/carousel LP, スワイプ型LP, カード送りLP, Instagram/TikTokリール風の1画面1カードLPを作って、と依頼された場合。
---

# スワイプ型LP制作（構成05）

構成の型そのものは `skills/design/lp-layout-templates/SKILL.md` の「構成05」を参照する。このスキルは、その型を実際に動くLPとして作り切るための実装フロー（原稿→画像プロンプト→画像生成→HTML/CSS/JS→公開→ギャラリー登録）を扱う。
実装例: `portfolio/nobiru-consulting-swipe-lp/`（情報訴求型）、`portfolio/lumiere-nail-atelier-swipe-lp/`（ポートフォリオ型、セクション別ファイル管理の最新形）。

## Step 0: スタイルを決める

構成05には3系統ある。ユーザー指定がなければ商材の性質で判断し、迷う場合はユーザーに確認する。

- **感情訴求型**（5枚程度、写真主体、コピー少なめ）: 美容室・サロン・飲食店など、雰囲気で惹きつける業種向け。
- **情報訴求型**（7〜8枚、数字・チェックリスト・お客様の声・代表挨拶を積み上げる）: 士業・コンサル・BtoBなど、検討期間が長く納得感の積み上げが必要な業種向け。カード構成の目安: フック→実績数字→悩みチェックリスト→解決策（番号リスト）→お客様の声（1人1カード）→代表挨拶→最終オファー。
- **ポートフォリオ型**（5〜6枚、コピーはブランド名・タグライン・一言ラベル程度に極限まで削る）: ネイルサロン・ヘアサロン・写真スタジオなど、作品の写真そのものが訴求力を持つ業種向け。カード構成の目安: フック（ブランド名＋一言）→作品ポートフォリオ×3〜4（デザイン名ラベルのみ）→世界観・信頼カード（一言トラスト訴求）→最終CTA。参考: Tokify社のスワイプLP（`voguenail.tokify.shop`等）はこの型の実例で、コピーを一切持たず写真/動画だけで見せる構成だった。

## Step 0.5: 原稿設計の鉄則（外部記事の知見を反映、2026-07-16）

[アナグラム社の検証記事](https://anagrams.jp/blog/swipeable-lp-benefits-and-results/)と[Letro社の解説記事](https://service.aainc.co.jp/product/letro/article/landing-page-swipetype)から、以下をスワイプ型LP制作の原則として適用する。

- **「1枚1メッセージ」を全型で徹底する**: 型を問わず、1カードで言いたいことは1つに絞り、テキストは短く、「次のカードが気になる」流れを意識する。1枚に情報を詰め込むと途端に読まれなくなる。感情訴求型・ポートフォリオ型はもともとコピーが少ないが、情報訴求型（数字・チェックリストが多い型）でも1カードに複数の主張を同居させない。
- **枚数は長すぎないこと**: Step 0の枚数目安（感情訴求型5枚程度／情報訴求型7〜8枚／ポートフォリオ型5〜6枚）を上限の目安として守る。分割する意味が薄い（説明に必要な情報量がそもそも少ない）商材には無理にスワイプ型を勧めない。
- **動画を使う場合は早い位置（2枚目目安）に置く**: 動画付きスワイプLPの実測で、全10枚構成中2枚目に「利用シーン動画」を配置したところ、そのカードの到達率・滞在時間が最も高く、動画を経由したユーザーほど最終コンバージョンに至りやすい傾向が見られた。文章だけで説明が長くなりがちなカード（フックの直後、サービス理解の核になる部分）に動画を割り当てる。
- **広告からの遷移を前提にするなら、フックカードは広告クリエイティブとのトーン連続性を意識する**: SNS広告（特にInstagram）経由の流入では、広告とLPのビジュアル・トーンが断絶していると「違うサイトに来た」感が離脱を招く。フックカードの配色・被写体のテイストは、想定する広告クリエイティブと地続きになるようにする。

### 商材適性チェック（クライアントに提案する際に使う）

以下に複数当てはまる商材は、スワイプ型LPを提案する価値が高い。

- 文章での説明が難しく、差別化ポイントを視覚化したい商材
- 画像・動画でストーリー仕立てにして見せたい商材
- 情報量は必要だが、縦長LPだと読み疲れで離脱されやすい商材
- 手前のコンバージョン（例: 資料請求・無料体験）は取れているのに、その先の本申込・本契約が伸び悩んでいる商材

逆に、説明に必要な情報量がそもそも少ない商材や、公開後の分析・改善を回す体制を確保できない案件では、無理にスワイプ型を勧める必要はない（縦長LPで十分）。

### KPI設計（実クライアント案件で運用まで受注する場合）

スワイプ型LPの真価は「手前のCV（例: 無料体験・資料請求）」だけでは測れないことがある。ある実測事例では、無料体験のCPAは従来LPと同水準だったが、本契約率は従来LP比で約5倍（4%→19%）に伸びた。制作を受ける際は、可能であれば以下も合わせてヒアリング・提案する。

- カード到達率、CTAクリック率、滞在時間などカード単位の計測（GA4のイベント設計等）
- 「本当に見るべきKPI」が手前のCVだけでなく、その先（本申込・入金など）にある商材かどうかの確認
- A/Bテスト前提で、後から差し替えやすいカード単位の構造で作る（この点は元々Step 4の実装方針と整合する）

## Step 1: 架空ブランド・原稿（セクションごとに個別ファイル化する）

`skills/design/lp-creator` と同じ注意点に従う（実在企業・商品・ロゴ・コピーの模写は禁止、完全オリジナルの架空ブランド）。

1. `portfolio/<slug>/copy/構成.md` に、ブランド設定・参考分析・カード構成の全体像（一覧表）を作る。
2. 各カードの画像プロンプトは `portfolio/<slug>/copy/prompts/<section-id>.md` として**1カード1ファイル**で作る。1ファイルにまとめない（AGENTS.mdの「原稿、セクション別画像プロンプト、生成画像、結合LPを分けて保存する」に従う）。ファイル内フォーマット:
   ```markdown
   # <section-id>（カードの役割）

   共通ルール（全セクション共通）:
   - 縦型9:16、1080×1920px相当のスマホ縦画面いっぱいに写る構図
   - 写真（実写風）のみで、文字・ロゴ・グラフィック装飾・キャプションは一切焼き込まない
   - 商標・実在人物・実在ブランドの模写は禁止、完全にオリジナルとして生成する

   ## プロンプト

   （実際のプロンプト本文）
   ```
   `section-id` は生成する画像ファイル名（`01-hook` など）と一致させ、あとで画像・HTML・スクリプトを横断して同じ名前で追跡できるようにする。
   実装例: `portfolio/lumiere-nail-atelier-swipe-lp/copy/prompts/`（6ファイル）。

## Step 2: フォルダ構成

```
portfolio/<slug>/
  copy/構成.md
  copy/prompts/<section-id>.md   # カードごとの画像プロンプト（Step 1）
  lp/images/                     # 静止画（全カード共通のフォールバック/posterも含む）
  lp/videos/                     # Remotionで作ったループ動画を使う場合のみ（Step 3の補足）
  scripts/generate-images.mjs
  outputs/
  references/
```

## Step 3: 画像生成（プロンプトファイルから読み込む・重要な落とし穴）

- `scripts/generate-images.mjs` はプロンプト文字列をスクリプト内にハードコードせず、`copy/prompts/<section-id>.md` を読み込んで `## プロンプト` 以降を抽出して使う。原稿（プロンプト）とコード（生成ロジック）を分離し、プロンプトだけを見直したいときにスクリプトを触らずに済むようにする。実装例: `portfolio/lumiere-nail-atelier-swipe-lp/scripts/generate-images.mjs` の `loadPrompt(id)`。
- 各カード背景は縦9:16のポートレート写真1枚。文字・ロゴは画像に焼き込まず、後からHTML/CSSで重ねる。
- `generateImageWithCodexAppServer` を呼ぶとき、**`taskType: "section"`（デフォルト）を使わない。** このtaskTypeは「PC/デスクトップ表示前提、最大幅1200pxで自然な高さに」という指示が内部で強制的に付与され、プロンプトで9:16を明記していても横長〜正方形の画像が返ってくる（実際に8枚中6枚が横長で返ってきた実績あり）。`taskType: "showcase"` を使うと、プロンプトのアスペクト比指定がそのまま尊重される。
- プロンプトには次を明記する: 「幅1080px×高さ1920px（width < height）」「横長・正方形の構図は禁止」「被写体はカメラを寄せる／立ち位置を工夫して縦構図に収める」。
- スクリプトの基本形（`refImages: []`、`taskType: "showcase"`、並列生成、生成済みファイルはスキップ）は `portfolio/nobiru-consulting-swipe-lp/scripts/generate-images.mjs` と `portfolio/lumiere-nail-atelier-swipe-lp/scripts/generate-images.mjs` を参照。後者がプロンプトファイル読み込み対応版で、新規プロジェクトはこちらの形を基本にする。

### 補足: 特に見せたいカードだけRemotionでループ動画にする

ポートフォリオ型のように「写真の質そのもの」が訴求力になるカード（作品ショーケースなど）は、静止画の代わりに`projects/remotion-sandbox/`でループ動画を作ると質感が上がる。全カードを動画化する必要はなく、費用対効果の高い1〜数枚（フック、ポートフォリオ/ギャラリー系カードなど）に絞るのが基本。

1. 対象カードの静止画（Step 3で生成済みのもの）を `projects/remotion-sandbox/public/<slug>/` にコピーする。
2. `src/NailPortfolioLoop.tsx`（実装例）のように、`bgImage`を受け取りKen Burnsズーム（往復させてループの継ぎ目をなくす）＋控えめなシマー/光の演出を加えるコンポジションを作る。**テキストは焼き込まない**（HTMLオーバーレイと役割分担する、Step 3の方針と一貫させる）。サイズはカードに合わせて縦型（例: 1080×1920）にする。
3. `src/Root.tsx` に `<Composition>` として登録し、`npx remotion render <id> out/<name>.mp4 --codec=h264` でレンダリングする。
4. Web配信用に圧縮する（音声トラックがないので `-an` で除去してよい）。目安は6秒・1080×1920で1〜1.5MB程度。
   ```bash
   ffmpeg -y -i out/<name>.mp4 -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart out/<name>-web.mp4
   ```
5. `portfolio/<slug>/lp/videos/<section-id>.mp4` に配置し、HTML側で `<img class="card-bg">` の代わりに以下を使う。`poster`には元の静止画（Step 3の出力）を指定し、動画が読み込めない環境でもフォールバックが効くようにする。
   ```html
   <video class="card-bg" src="videos/<section-id>.mp4" poster="images/<section-id>.png" autoplay muted loop playsinline></video>
   ```
   `.card-bg` のCSSは `img`/`video` どちらにも同じスタイル（`position:absolute; inset:0; object-fit:cover;`）が適用されるよう、タグ名を含まないクラスセレクタのままにしておく。
6. **ローカルの `python3 -m http.server` では動画を確認しない。** Pythonの`http.server`はHTTP Range Requestに対応しておらず、`<video>`の読み込みが止まって見えることがある（ファイル自体は正常でも再生できない）。ローカル確認する場合は `npx serve` 等Range対応のサーバーを使うか、Vercelにデプロイして確認する。
7. 実装例: `projects/remotion-sandbox/src/NailPortfolioLoop.tsx`（テキストを焼き込まないポートフォリオ/ギャラリー系）、`projects/remotion-sandbox/src/HookIntro.tsx`（フックカード限定でテキストを動画に焼き込みspringでフェード/スライドインさせる、Tokify型に寄せたいときの型）、`portfolio/lumiere-nail-atelier-swipe-lp/lp/videos/`。
8. フックカードだけテキストを動画に焼き込む場合、その1枚だけHTML側の`.card-content`テキストを持たせない（重複表示になるため）。他のカードはStep 4の方針どおりHTMLオーバーレイのままにする。

### 補足: 動画化しないカードにも軽いフェードインを入れる

全カードを動画化しなくても、`.card`/`.h-card`が現在表示中かどうかで`.card-content`等のopacityを切り替えるだけで体感の質感が上がる。`transform`はカードごとの位置指定（中央寄せ等）と衝突しやすいので、entrance演出は**opacityのみ**にする。JS側は`render()`/`renderH()`で現在表示中のカード/章内カードに`is-active`クラスを付け替えるだけでよい。実装例: `portfolio/lumiere-nail-atelier-swipe-lp/lp/style.css`・`lp/script.js`。

## Step 4: HTML/CSS/JS実装

カルーセルの基本JSロジック（Pointer Events + `setPointerCapture` によるマウス/タッチ/ペン統一、矢印ナビ、インジケータードット）は `skills/design/lp-layout-templates/SKILL.md` 構成05の「実装上の注意」を参照。加えて、情報訴求型で確立した以下のパターンを使う。

- **カードタイプの使い分け**: hook / achievement / testimonial / rep / final-cta は写真フル背景＋下部scrim＋テキストオーバーレイでよい。concern（悩み共感）や solution（解決策）のようにチェックリスト・番号リストなど情報量が多いカードは、写真の上に半透明の浮き島カードを重ねて可読性を確保する（`background: rgba(8,12,20,0.6); backdrop-filter: blur(6px); border-radius: 20px;`）。
- **下部scrimは情報量に応じて強める**: テキストが多いカードでは、最初の行（eyebrow）が写真の明るい部分にかかりやすくコントラスト不足になる。`card-scrim--bottom` は最低でも `rgba(0,0,0,0.85) 0% → 0.6 40% → 0.28 62% → 0 85%` 程度の多段グラデーションにする。1段階の弱いグラデーションだとeyebrowが白飛びした背景に埋もれる。
- **常時表示CTAバー**: 最終カードだけにCTAボタンを置くと、そこまでスワイプしないと申込導線が見えない。`.carousel` 直下に `position: absolute; bottom: 0;` の固定バー（`.sticky-cta`）を置き、全カード共通で表示する。最終カード自体には重複ボタンを置かず固定バーに一本化し、タップ時は `goTo(cards.length - 1)` で最終オファーカードへジャンプさせる。
- **インジケーターの位置**: 固定CTAバーと重ならないよう、`.indicator` の `bottom` をCTAバーの高さ分（目安94px）上げる。

### 補足: 章の中に複数カードを持たせる（2軸グリッド、Tokify型の忠実な構造再現）

参考にしたTokify系のスワイプLPは「縦スワイプ＝章の切り替え、横スワイプ＝章内カードの切り替え」という2軸グリッド構造で、全ての章がこの形とは限らない（単一カードの章もある）。忠実に再現したい場合はこの2軸構造を必要な章にだけ適用する。よくある章内カードのパターン:

- **予告カード→本編カード**: 章の1枚目に「MENU --→」のようなタイトルのみのカードを置き、2枚目以降に本編を続ける。複数の予告カードで同じ背景画像を使い回してよい（Tokify自身もそうしている）。
- **反復カード**: 口コミなど同じ形式のカードを複数並べる（背景画像も使い回してよく、テキストだけを差し替える）。
- **バリエーション一覧**: ポートフォリオ/ギャラリーのように、同種のコンテンツを複数横に並べる。

実装:

1. 該当カードに `class="card card--group"` を付け、内部に `.h-track`（`display:flex; flex-direction:row;`）と、その中に章内カードの数だけ `.h-card`（`.card`と同じ `position:relative; flex:0 0 100%; height:100%; overflow:hidden;`）を並べる。`.card-bg`・`.card-content`等の中身は通常のカードと同じ書き方でよい。
2. 章の中に、章専用の横方向インジケーター（`.h-indicator`、小さいドット、上部に配置）と横方向ナビボタン（`.h-nav--prev` / `.h-nav--next`）を置く。縦方向の `.nav--prev/.nav--next`（右端・画面中央）と位置が重ならないよう、横方向の「次へ」は縦ナビの下（例: `top: calc(50% + 54px)`）にずらす。
3. JSは「グループを持つカードの配列」を汎用的に扱う設計にする（1個のグループカードだけを想定した専用変数にしない）。`cards`を走査して `card--group` を持つものだけ `{ childIndex, hTrack, hCards, hDots, hPrevBtn, hNextBtn }` を持たせ、`index`（何番目の章か）をキーにして参照する。
4. ポインタージェスチャーは、動き始めのdeltaX/deltaYを比較して**縦方向か横方向かを一度だけ判定してロックする**（`AXIS_LOCK_THRESHOLD`程度動くまでは未確定のままにする）。ロックするのは現在表示中の章が `card--group` を持つ場合のみで、それ以外の章では常に縦方向として扱う。斜め方向のドラッグでジェスチャーがブレるのを防ぐための必須ロジック。
5. 実装例: `portfolio/lumiere-nail-atelier-swipe-lp/lp/script.js`（`groups`配列による汎用実装）、`lp/index.html`（PORTFOLIO/MENU/ACCESSの予告カード→本編カード、REVIEWSの反復カード）。

## Step 5: モバイルファースト固定幅（PC対応はしない）

構成05のスワイプLPはスマホ専用として作る。**フルブリードで画面幅いっぱいに引き伸ばす実装（`width: 100%` のみで`max-width`を設けない）はNG** — PC幅で見ると縦長写真が横に間延び・トリミングされて破綻する。`.carousel` は `max-width: 430px; margin: 0 auto;` で固定し、PC表示の見栄えは作り込まない。ユーザーから明示の指定がなければ、この固定幅をデフォルトにする。

## Step 6: サムネイル・公開・Neon DB（ギャラリー）登録

LP単体を公開して終わりにせず、必ずポートフォリオギャラリー（Neon Postgres `landing_pages`テーブル）まで登録する。2026-07-10からユーザー承認済みの標準工程なので、都度確認は不要。

1. サムネイル生成: `node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> gallery/assets/thumbnails/<slug>.jpg`
2. Vercel公開: `skills/lp-design/vercel-free-deploy/SKILL.md` に従う。初回は `npx vercel link --project <slug>` でプロジェクト名を明示してから `--prod` で公開する。
3. **Neon DBへ登録する（ここが抜けやすいので必ず実行する）**: `skills/lp-design/lp-gallery-sync/SKILL.md` に従い、`gallery/scripts/add-landing-page.mjs` でエントリJSONを`landing_pages`テーブルにupsertし、`cd gallery && npx vercel --prod --yes` でギャラリーサイトを再公開する。**`featureTags` に「スワイプ」を必ず含める。** これは単なる表示タグではなく、`gallery/script.js` の `isMobileOnlyItem()` が参照する機能フラグで、含めるとギャラリーのプレビューモーダルでPCタブが自動的に消え、スマホタブ固定で開くようになる（2026-07-14実装）。実態と矛盾するため「レスポンシブ」タグは付けない。
4. 登録後、`curl -sS https://lp-portfolio-gallery.vercel.app/api/landing-pages` で新規slugがNeon DB経由で返ってくることを確認する。

## 関連

- 型の定義: `skills/design/lp-layout-templates/SKILL.md`（構成05）
- 画像生成の基盤: `server/codexImageClient.mjs`
- 公開: `skills/lp-design/vercel-free-deploy/SKILL.md`
- ギャラリー登録: `skills/lp-design/lp-gallery-sync/SKILL.md`
- 実装例（情報訴求型）: `portfolio/nobiru-consulting-swipe-lp/`
- 実装例（ポートフォリオ型、プロンプトのセクション別ファイル管理版）: `portfolio/lumiere-nail-atelier-swipe-lp/`
