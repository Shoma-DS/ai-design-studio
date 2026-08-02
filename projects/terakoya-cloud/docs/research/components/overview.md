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
