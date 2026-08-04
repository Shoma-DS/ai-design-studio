# コンポーネント仕様（実装ベース）

## Header (`src/components/Header/`)

- 役割：全ページ共通のグローバルヘッダー。sticky配置
- レイアウト：ロゴ（左）／メインナビ4項目（中央）／ログイン・CTA・ハンバーガー（右）
- 配色：背景 `rgba(250,249,247,0.7)` + `backdrop-filter: blur(14px)`、スクロール時は不透明度が上がり境界線が表示される
- アニメーション：スクロール検知で高さを84px→64pxへ`transition`（0.35s ease-out）
- レスポンシブ：1024px以下でメインナビ・ログインリンクを非表示にし、ハンバーガーボタンを表示

## MobileNav (`src/components/MobileNav/`)

- `createPortal`で`document.body`直下に描画（ヘッダーの`backdrop-filter`によるcontaining block問題を回避）
- `AnimatePresence`でオーバーレイのフェード＋パネルの右からのスライドイン（0.4s, ease-out-soft）
- Escキー・背景クリックで閉じる、開いている間は`body`のスクロールをロック

## Hero（トップページ）

- 見出しは`Reveal`でフェードアップ+ブラー解除、統計3項目は`CountUp`でスクロールイン時にカウントアップ
- ヒーロー画像はPC/SP別に生成した2枚を`<Image>`+CSSクラス切り替えで出し分け（640px境界）

## Highlight Sections / ProductMock (`src/components/ProductMock/`)

- 参考サイトの「ダッシュボード画面のノートPC/スマホフレーム」演出を、実際の他社製品スクリーンショットではなく、独自CSSで組んだ`LearningDashboardMock`・`CommunityChatMock`・`AbstractFeatureCard`で再現
- `LaptopFrame`・`PhoneFrame`（`DeviceFrame`）で機体フレームを表現し、控えめなシャドウで浮遊感を出す

## Intro Lockup（Aboutページ・イントロ左カラム）

参考サイトの同ブロックを`getComputedStyle`で実測し、数値ベースで揃えている。

| 要素 | 指定 | 参考サイト実測 |
|---|---|---|
| 実績エイブロウ | 本文フォント / clamp(20,2.1vw,26)px / 700 / `--text-heading` | 26px / 700 / rgb(26,26,26) |
| ブランド名 | 見出しフォント / clamp(34,3.6vw,46)px / 700 + アクセント色のドット | ロゴ画像 350×64 |
| 訴求文 | 本文フォント / clamp(17,1.7vw,21)px / 700 / `--primary-500` / 3行 | 21px / 700 / rgb(0,57,115) / 3行 |
| CTA | 16px / padding 20px 60px / `line-height: 1` / 右にシェブロン | 16px / padding 20px 60px / 高さ57px |

- 訴求文は参考サイト同様に3行へ分割（`white-space: pre-line`）。高さも実測95pxで一致
- CTAは`.btn`の`line-height: 1.75`を継ぐと高さが余るため`1`に上書きしている
- **意図的な差異**：参考サイトのCTAは`border-radius: 50px`のピル型だが、当リポジトリの「ピル型ボタンを使わない」方針に従い角丸10pxを維持している
- 640px以下ではCTAの左右パディングを32pxへ詰め、画面幅からの溢れを防ぐ

## Pain Points（Aboutページ・課題整理）

参考サイトの同セクションを、レイアウトの型としてかなり忠実に再現している。

- セクション見出し（2行）→ 台形にクリップした淡色エリア → 中央の人物を6つの吹き出しが囲む構成
- 吹き出しは整列グリッドではなく、`src/data/site.ts` の `aboutPainPoints[].pos`（コンテナに対する%）で**非対称に散らす**絶対配置。参考サイト同様、左右3つずつを縦にずらして配置している
- 各吹き出しから人物へ向けて、思考の吹き出し風の小さな丸を2つずつ配置（`dots`）
- 人物イラストは枠なしの切り抜き。`scripts/cutout-white-bg.mjs` で白背景をフラッドフィル透過したPNGを使う
  - `mix-blend-mode: multiply` でも白は消せるが、親要素（`Reveal` の framer-motion が持つ `filter`）が合成コンテキストを作ると破綻するため、画像側に透過を持たせている
  - 単純な明るさしきい値だと白いシャツまで抜けるため、画像の縁から連結した白領域だけをフラッドフィルで塗り潰している
- 900px以下では絶対配置をやめ、イラストを先頭にした1カラムスタックへ積み替え、ドットは非表示にする
  - このとき `.painCharacter` は `position: relative` を維持する。`static` にすると `next/image` の `fill`（絶対配置）が基準を失って画面いっぱいに広がる

## Reasons（選ばれる理由）

- ダーク背景（`--primary-900`）のセクションで4項目を横罫線区切りのリストとして表示、番号はアクセントカラーの大きな見出し数字

## Pricing（料金ページ）

- 5プランを横並びカードで表示、各カードの上部に色分けされたアクセントバー
- プラン別機能比較表は横スクロール対応（`.tableScroll`）

## Testimonials（お客様の声）

- 2カラムカードグリッド、アバターはグラデーション円+頭文字（実写真は使用せず、架空の導入事例として誠実に表現）

## Footer / CTA Band (`src/components/Footer/`)

- 全ページ共通のクロージングCTAバンド（2ボタン）→フッターナビ→法定リンク→コピーライト、という参考サイトと同じ「型」を踏襲
- CTAバンドの背景装飾（`radial-gradient`の2つの光暈）に、`useScroll`+`useTransform`でパララックス（スクロール量に応じて±12%移動）を適用
