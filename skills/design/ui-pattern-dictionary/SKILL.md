---
name: ui-pattern-dictionary
description: UI/LP設計時に使う定番UIパターン108件の辞典（ナビゲーション、レイアウト、フォーム、データ表示、フィードバック、コンテンツ、アクション、モバイル、SNS、オンボーディング、メディア、EC、上級パターン、認証、エラー系）。出典: ui-design-dictionary.pages.dev。
---

# UI Pattern Dictionary

LP・アプリ・管理画面などのUI設計で「この機能にはどのUIパターンが定石か」を判断するための参照辞典。
[ui-design-dictionary.pages.dev](https://ui-design-dictionary.pages.dev/)（KAWAI氏制作、108パターン収録）の内容を元にまとめた。

## 使う場面

- LPやアプリのセクション/コンポーネントを設計する際、既存の定番パターン名・用途を確認したいとき。
- 「ナビゲーションどうする」「フォーム入力どうする」「読み込み中の表現どうする」のように、UIの型で悩んだとき。
- `skills/design/lp-creator/SKILL.md` や `skills/design/lp-hybrid-image-html/SKILL.md` でLPを設計する前段階の構成検討に使う。

## 使い方

1. 目的（例: 「価格プランを見せたい」「ステップ入力させたい」）から近いカテゴリを下表で探す。
2. 該当パターンの説明・タグを確認し、実装/画像プロンプトに反映する。
3. 実在サービスの模写にならないよう、パターン（構造・機能）だけを参考にし、配色・ロゴ・コピーは案件オリジナルにする（`portfolio/README.md`のポリシーに従う）。

## パターン一覧（15カテゴリ・108件）

各行: **英名 / 日本語名** — 説明（タグ）

### Navigation（14）

- **Hamburger Menu / ハンバーガーメニュー** — 三本線アイコンでメニューの開閉を制御する。モバイルで頻出。（Mobile, Responsive）
- **Tab Bar / タブバー** — 画面下部に固定配置される主要セクションの切替UI。iOS/Androidの標準パターン。（Mobile, iOS, Android）
- **Breadcrumb / パンくずリスト** — 現在位置までの階層パスを表示し、上位ページへの導線を提供する。（Web, Hierarchy）
- **Sidebar Navigation / サイドバーナビ** — 画面左側に常時表示されるナビゲーション。デスクトップ管理画面の定番。（Desktop, Admin）
- **Mega Menu / メガメニュー** — ホバーで大きなパネルが展開され、多数のリンクをカテゴリごとに表示する。（Web, EC, Large Site）
- **Pagination / ページネーション** — コンテンツを複数ページに分割し、番号付きリンクで移動する。（Web, List）
- **Infinite Scroll / 無限スクロール** — スクロール末尾到達時に自動的にコンテンツを追加読み込みする。（Mobile, SNS, Feed）
- **Sticky Header / 固定ヘッダー** — スクロールしても画面上部に固定表示されるヘッダー。（Web, Mobile）
- **Drawer / ドロワー** — 画面端からスライドインするパネル。ナビやフィルターに使用。（Mobile, Responsive）
- **Command Palette / コマンドパレット** — キーボードショートカット（Cmd+K等）で呼び出す検索+コマンド実行UI。パワーユーザー向け。（Desktop, Productivity）
- **Segmented Control / セグメンテッドコントロール** — 2〜5個の排他的選択肢を横並びボタンで切り替える。タブの軽量版。（iOS, Mobile）
- **Tabs / タブ** — 同一画面内でコンテンツ領域を切り替える水平タブ。（Web, Desktop, Mobile）
- **Stepper / Wizard / ステッパー** — 複数ステップのプロセスを順番に案内するナビゲーション。（Form, EC, Onboarding）
- **Anchor Navigation / アンカーナビ** — ページ内の各セクションへスムーズスクロールで移動するリンク群。（LP, Web, Long-form）

### Layout（9）

- **Grid Layout / グリッドレイアウト** — コンテンツを均等なグリッドセルに配置する基本レイアウト。（Web, Basic, Responsive）
- **Masonry Layout / メイソンリー** — 高さの異なるカードをレンガ積みのように隙間なく並べるレイアウト。（Web, Image, Pinterest）
- **Card Layout / カードレイアウト** — 情報を独立したカード単位にまとめて並べるパターン。（Web, Mobile, Basic）
- **Split Screen / スプリットスクリーン** — 画面を左右に2分割し、異なるコンテンツを並べるレイアウト。（LP, Web, Desktop）
- **Hero Section / ヒーローセクション** — ページ冒頭の大きなビジュアル+見出し+CTA。第一印象を決定する。（LP, Web, Marketing）
- **Bento Grid / ベントグリッド** — 様々なサイズのカードをタイル状に配置するモダンレイアウト。（Web, Modern, Dashboard）
- **Holy Grail Layout / ホーリーグレイル** — ヘッダー+フッター+3カラムの伝統的Webレイアウト。（Web, Classic, Desktop）
- **Full Bleed / フルブリード** — コンテンツを画面幅いっぱいに広げるレイアウト。没入感を演出。（Web, LP, Photo）
- **Sticky Sidebar / スティッキーサイドバー** — メインコンテンツのスクロールに追従するサイドバー。（Web, Blog, EC）

### Forms & Input（17）

- **Text Field / テキストフィールド** — 1行のテキスト入力。ラベル・プレースホルダー・バリデーション状態を持つ。（Form, Basic）
- **Textarea / テキストエリア** — 複数行のテキスト入力。リサイズ可能。（Form, Basic）
- **Select / Dropdown / セレクト** — 選択肢のリストから1つを選ぶ。クリックでリストが展開する。（Form, Basic）
- **Checkbox / チェックボックス** — 複数の選択肢から任意の数を選択できるUI。（Form, Basic）
- **Radio Button / ラジオボタン** — 複数の選択肢から1つだけを選択するUI。排他的選択。（Form, Basic）
- **Toggle Switch / トグルスイッチ** — ON/OFFの2状態を切り替えるスイッチUI。即座に設定が反映される。（Form, Mobile, Settings）
- **Slider / Range / スライダー** — ドラッグで数値を連続的に選択するUI。（Form, Filter）
- **Date Picker / デートピッカー** — カレンダーUIから日付を選択する。（Form, Booking）
- **File Upload / ファイルアップロード** — ファイルを選択またはドラッグ&ドロップでアップロードするUI。（Form, Web）
- **Search Bar / 検索バー** — キーワードを入力してコンテンツを検索するUI。（Basic, Web, Mobile）
- **Autocomplete / オートコンプリート** — 入力に応じて候補を自動表示し、選択を補助するUI。（Form, Search）
- **Tag Input / タグ入力** — タグをチップとして追加・削除できるマルチ入力UI。（Form, Tag）
- **OTP Input / OTP入力** — ワンタイムパスワードを1文字ずつ個別入力するUI。（Form, Auth, Security）
- **Password Strength Meter / パスワード強度メーター** — パスワード入力時にリアルタイムで強度を表示するUI。（Form, Security）
- **Color Picker / カラーピッカー** — 色をビジュアルに選択するUI。（Form, Design Tool）
- **Inline Edit / インラインエディット** — 表示テキストを直接クリックして編集モードに切り替えるUI。（Form, Advanced）
- **Multi-step Form / マルチステップフォーム** — 長いフォームをステップに分割し段階的に入力させるUI。（Form, UX）

### Data Display（13）

- **Table / テーブル** — 行と列で構造化されたデータを表示する。ソート・フィルター機能を持つことが多い。（Data, Admin）
- **List View / リストビュー** — データを垂直リストで表示するシンプルなパターン。（Data, Basic, Mobile）
- **Tree View / ツリービュー** — 階層的なデータを展開/折りたたみ可能なツリーで表示する。（Data, Hierarchy）
- **Timeline / タイムライン** — 時間軸に沿ってイベントを表示するUI。（Data, History）
- **Kanban Board / カンバンボード** — カードをカラム間でドラッグ移動するタスク管理UI。（Task, Project）
- **Stat Card / 統計カード** — 数値指標を大きく目立たせるカード。ダッシュボードの定番。（Dashboard, Data）
- **Badge / バッジ** — アイコンや要素の隅に付く小さな通知マーク。（UI Part, Notification）
- **Tag / Chip / タグ・チップ** — カテゴリやステータスを小さなラベルで表現する。（UI Part, Category）
- **Avatar / アバター** — ユーザーのプロフィール画像やイニシャルを円形で表示する。（UI Part, User）
- **Progress Bar / プログレスバー** — タスクや処理の進捗率を横棒グラフで表示する。（UI Part, Progress）
- **Skeleton Screen / スケルトンスクリーン** — コンテンツ読み込み中にレイアウトの骨格をプレースホルダーで表示する。（Loading, UX）
- **Empty State / エンプティステート** — データがない時のプレースホルダー表示。行動を促すCTAを含む。（UX, State）
- **Chart / Graph / チャート** — データを折れ線・棒・円などのグラフで視覚化する。（Data, Dashboard）

### Feedback（8）

- **Toast / Snackbar / トースト** — 一時的なメッセージを画面端に表示し自動で消えるUI。（Notification, Lightweight）
- **Modal / Dialog / モーダル** — 背景を暗転させてコンテンツを前面に表示する。ユーザーの注目を強制する。（Overlay, Critical）
- **Alert / Banner / アラート** — 画面上部などに固定表示される重要な通知メッセージ。（Notification, Important）
- **Tooltip / ツールチップ** — ホバーやフォーカス時に補助情報を小さなポップアップで表示する。（Help, Micro-interaction）
- **Popover / ポップオーバー** — クリックでトリガーされるリッチなフローティングUI。（Overlay, Info）
- **Loading Spinner / ローディングスピナー** — 処理中であることを示す回転アニメーション。（Loading, Basic）
- **Confirmation Dialog / 確認ダイアログ** — 破壊的操作の前にユーザーに確認を求めるダイアログ。（Safety, Confirm）
- **Notification Panel / 通知パネル** — 通知一覧をドロップダウンパネルで表示する。（Notification, Overlay）

### Content（9）

- **Accordion / アコーディオン** — 見出しクリックで内容の展開/折りたたみを切り替える。（Content, FAQ）
- **Carousel / Slider / カルーセル** — 複数のコンテンツを左右にスワイプ/クリックで切り替える。（Content, Image, Mobile）
- **Lightbox / ライトボックス** — 画像をフルスクリーンオーバーレイで拡大表示する。（Image, Overlay）
- **Pricing Table / 料金テーブル** — 複数プランを横並びで比較表示する。おすすめプランを強調。（Marketing, LP, SaaS）
- **Testimonial / テスティモニアル** — ユーザーの声・レビュー・推薦文を表示するUI。（Marketing, LP, Trust）
- **CTA Section / CTAセクション** — ユーザーの行動を促す大きなボタンとメッセージのセクション。（Marketing, LP, Conversion）
- **FAQ Section / FAQセクション** — よくある質問とその回答をまとめた専用セクション。（Support, LP）
- **Feature Section / フィーチャーセクション** — 製品の機能をアイコン+テキストでグリッド表示する。（LP, Marketing）
- **Comparison Table / 比較テーブル** — 複数のオプションを機能ごとに比較する表。（Marketing, Decision）

### Actions（8）

- **Button / ボタン** — クリックでアクションを実行するUI。Primary/Secondary/Ghost/Dangerなど複数バリエーション。（Basic, Form）
- **FAB / フローティングアクションボタン** — 画面上に浮遊する円形のメインアクションボタン。（Mobile, Material Design）
- **Context Menu / コンテキストメニュー** — 右クリックで表示されるアクションメニュー。（Desktop, Operation）
- **Action Sheet / アクションシート** — 画面下部からスライドアップするモバイル向けアクション選択UI。（Mobile, iOS）
- **Split Button / スプリットボタン** — メインアクションとドロップダウンによる追加アクションを組み合わせたボタン。（Desktop, Advanced）
- **Button Group / ボタングループ** — 関連するアクションボタンを横並びで結合表示する。（UI Part, Basic）
- **Swipe Actions / スワイプアクション** — リスト項目を左右にスワイプして操作するモバイルパターン。（Mobile, Gesture）
- **Pull to Refresh / プルトゥリフレッシュ** — 画面を下に引いてコンテンツを更新するモバイルジェスチャー。（Mobile, Gesture）

### Mobile（4）

- **Bottom Sheet / ボトムシート** — 画面下部からスライドアップする半モーダルパネル。（Mobile, Overlay）
- **Stories / ストーリーズ** — 画面上部の円形アイコン行。タップで全画面コンテンツを表示する。（SNS, Video）
- **App Bar / アプリバー** — アプリ画面上部のタイトルバー。戻るボタン・タイトル・アクションを含む。（Mobile, Navigation）
- **Speed Dial / スピードダイヤル** — FABをタップすると複数のサブアクションが扇状に展開するUI。（Mobile, Material Design）

### Social & Communication（5）

- **Chat UI / チャットUI** — メッセージを左右に振り分けるチャット形式のUI。（Message, Realtime）
- **Comment Thread / コメントスレッド** — ネストされたコメントと返信のスレッド表示。（Community, Comment）
- **Emoji Reactions / リアクション** — メッセージやコンテンツに絵文字で反応するUI。（Social, Micro-interaction）
- **Feed Card / フィードカード** — SNSフィードの投稿カード。アバター・テキスト・画像・アクション行。（SNS, Feed）
- **@Mention / メンション** — テキスト入力中に@で始まるユーザー候補をサジェストするUI。（Social, Input Assist）

### Onboarding & Guidance（3）

- **Walkthrough / ウォークスルー** — UIの要素をハイライトし、ステップバイステップで使い方を案内するオーバーレイ。（Onboarding, Tutorial）
- **Welcome Screen / ウェルカム画面** — アプリ初回起動時に表示されるスワイプ式のイントロダクション画面。（Onboarding, Mobile）
- **Progress Checklist / プログレスチェックリスト** — セットアップの完了度をチェックリストで表示し、次のアクションを促す。（Onboarding, Gamification）

### Media（3）

- **Video Player / ビデオプレーヤー** — 動画再生UI。再生/一時停止・シーク・音量・全画面のコントロールを含む。（Media, Video）
- **Audio Player / オーディオプレーヤー** — 音声再生UI。再生ボタン・波形・プログレスバーを含む。（Media, Audio）
- **Image Gallery / イメージギャラリー** — 複数画像をグリッドやスライドで表示する。タップで拡大。（Image, Media）

### Commerce（3）

- **Product Card / 商品カード** — 商品画像・名前・価格・レーティングを1枚にまとめたECカード。（EC, Product）
- **Shopping Cart / カート** — 選択した商品と数量・小計を表示し、決済へ進むUI。（EC, Checkout）
- **Rating / Review / レーティング** — 星やスコアで評価を表示・入力するUI。（EC, Feedback）

### Advanced Patterns（6）

- **Dark Mode Toggle / ダークモード切替** — ライト/ダークテーマをワンクリックで切り替えるUI。（Accessibility, Settings）
- **Drag & Drop / ドラッグ&ドロップ** — 要素をドラッグして並べ替えや移動を行うインタラクション。（Interaction, Advanced）
- **Virtual Scroll / 仮想スクロール** — 大量データのうち画面に表示される分だけをDOMに描画する最適化パターン。（Performance, Data）
- **Responsive Breakpoints / レスポンシブブレークポイント** — 画面幅に応じてレイアウトを変化させるパターン。（Responsive, Basic, CSS）
- **Micro-interactions / マイクロインタラクション** — ホバー・クリック・遷移時の小さなアニメーションやフィードバック。（Animation, UX）
- **Keyboard Shortcuts / キーボードショートカット一覧** — 利用可能なキーボードショートカットをオーバーレイで一覧表示する。（Accessibility, Power User）

### Authentication（2）

- **Login Form / ログインフォーム** — メール/パスワードでサインインするフォーム。ソーシャルログインボタンを含むことが多い。（Auth, Form）
- **Sign Up Form / 新規登録フォーム** — アカウント作成のためのフォーム。（Auth, Form）

### Error & System（4）

- **404 Page / 404ページ** — ページが見つからない時のエラーページ。（Error, Web）
- **Error State / エラー状態** — 操作失敗時の状態表示。エラー内容と復旧アクションを提示。（Error, UX）
- **Maintenance Page / メンテナンス画面** — システムメンテナンス中に表示されるページ。（System, Web）
- **Cookie Banner / クッキーバナー** — Cookie利用の同意を求めるGDPR対応バナー。（Legal, Web）

## 注意

- このリストは名称・用途・タグの参照用であり、実装コードそのものではない。実装時は案件の技術スタック（静止画LP/HTML+CSS+JS/フレームワーク）に合わせて作る。
- 実在サイトの配色・ロゴ・コピーをそのまま模写しない。パターン（構造・機能）だけを参考にする。
