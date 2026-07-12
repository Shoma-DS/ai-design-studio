---
name: hp-creator
description: 参考サイトの構成・演出・世界観を分析し、それを踏まえた架空企業のコーポレートサイト（HP）をNext.js（App Router、実コード）で新規制作する。分析→オリジナル企画→実装→画像生成→ドキュメント化→QA→ローカル確認→Vercel公開→ポートフォリオギャラリー登録まで一気通貫。Use when the user wants to clone/reference an existing corporate website's design and build an original Next.js/React site inspired by it (not a raster-image LP), when they say "HP" or "コーポレートサイト" or "参考サイトを分析してHPを作って", or when comparing to lp-creator (raster LP) is needed.
---

# HP Creator

## 使う場面

ユーザーが「HP（ホームページ／コーポレートサイト）を作りたい」「参考サイトを分析してオリジナルのコーポレートサイトを作りたい」と明示したときに使う。単なる1枚絵LPではなく、**実際に動くコード（Next.js + 実CSS/JS）で、複数セクション・実装済みアニメーション・ハンバーガーメニューなどのUIを持つサイト**を作る場合が対象。

## LP（lp-creator）との違い（重要）

| | LP（`lp-creator`） | HP（このスキル） |
|---|---|---|
| 実体 | セクション画像を縦結合した1枚のラスター画像 | 実際に動くNext.jsアプリ（HTML/CSS/JS） |
| レスポンシブ | PC/SP別のラスター画像を`<picture>`で切替（`lp-responsive`） | CSSのメディアクエリ + PC/SP別コンポジション画像 |
| アニメーション | 基本的になし（静的画像） | Framer Motion / GSAP ScrollTriggerで実装 |
| 保存先 | `portfolio/<project>/lp/` | `projects/<slug>/`（独立Next.jsプロジェクト） |
| 公開先 | Vercel（静的） | Vercel（Next.jsアプリとしてビルド） |
| ギャラリー | `gallery/`（`lp-portfolio-gallery`、`landing_pages`テーブル） | `gallery-hp/`（`hp-portfolio-gallery`、`websites`テーブル） |

判断に迷ったら「一枚絵で十分か、実際にコードで動くサイトが要るか」をユーザーに確認する。ボタン・ナビ・カルーセル・アコーディオンなど操作要素だけが必要な場合は `skills/design/lp-hybrid-image-html/SKILL.md`（画像+HTML/CSS/JSハイブリッド）も選択肢になる。HPはそれよりさらに本格的な、複数ページ展開を見据えたコーポレートサイト向け。

## 手順

### 1. 参考サイトの分析

対象URLをclaude-in-chromeで開き、以下を調べる。

1. **セクション構成**：ページ全体をスクロールしながら、各セクションの役割・順番をメモする。
2. **ファーストビュー**：レイアウト、斜めカット等の図形要素、コピーの配置、動画/写真サムネの有無。
3. **配色・フォント**：`javascript_tool`で主要要素の`getComputedStyle()`を取得する（`fontFamily`, `color`, `backgroundColor`など）。文字はスパン分割されている場合があるので、見出し全体を含む親要素で取得する。
4. **使用JSライブラリ検出**：`window`のグローバル変数を調べる。
   ```js
   ['gsap','ScrollTrigger','Lenis','AOS','LocomotiveScroll','Swiper','THREE','barba']
     .filter(g => typeof window[g] !== 'undefined')
   ```
5. **ブレークポイント抽出**：全スタイルシートの`CSSMediaRule`を列挙する。
   ```js
   const breakpoints = new Set();
   for (const ss of document.styleSheets) {
     try { for (const rule of ss.cssRules) if (rule.type === 4) breakpoints.add(rule.conditionText); } catch(e) {}
   }
   ```
6. **アニメーション演出**：スクロールに応じたフェードイン/スタッガー/ピン留め（背景固定+テキスト順送り等）/マーキー帯などを、実際にスクロールしながら目視確認する。
7. **ヘッダー/ハンバーガー**：スクロール時の背景変化、メニュー開閉ボタンの有無（`[class*=hamburger]`, `[class*=menu]`などをDOM検索）。
8. **著作権配慮（重要）**：構造・雰囲気・演出パターンのみ抽出する。コピー・画像・ロゴ・実コンテンツの複製、商標の再現は禁止。分析結果はドキュメント化してよいが、参考サイトの文章をそのまま転記しない。

### 2. オリジナル企画の決定

分析結果を踏まえ、以下をユーザーと合意する（詳細は聞かず、大枠だけでよい場合はユーザー任せの範囲で妥当に決めてよい）。

- 架空企業名・業種
- キャッチコピー・コンセプト
- 配色（参考サイトと同じ配色をそのまま使わず、業種・世界観に合わせて独自に決める）
- セクション構成（参考サイトの型を踏襲しつつ、内容が1セクションに収まらない場合は無理に詰め込まず複数セクションへ自然に分割する）

### 3. 保存先とスキャフォールド

`projects/<slug>/` に**独立したNext.jsプロジェクト**を新規作成する（リポジトリルートの`package.json`やVite構成には触れない）。

```bash
cd projects
npx create-next-app@latest <slug> --typescript --app --eslint --no-tailwind --src-dir --import-alias "@/*"
```

Tailwindは使わず、セクションごとにCSS Modulesで実装する（「各セクションをHTML/CSSで構築する」という制作条件に沿う。保守しやすさ重視）。

```text
projects/<slug>/
  src/app/          ← layout.tsx, page.tsx, globals.css
  src/components/<Section>/<Section>.tsx + .module.css
  src/data/site.ts  ← ナビ・コピー・数値等のデータをコンポーネントから分離
  public/images/    ← 生成した写真（PC/SP別）
  scripts/          ← 画像生成スクリプト（下記）
  docs/             ← 分析・仕様書（下記）
```

### 4. 画像生成

`skills/design/image-prompt-generator/SKILL.md` のnanobanana pro形式でプロンプトを作り、Codex app-server（`gpt-image-2`、`server/codexImageClient.mjs`の`generateImageWithCodexAppServer`）で生成する。AGENTS.mdのルールに従い、他の画像生成手段（OpenAI Images API等）は使わない。

- **PC用とSP用は別コンポジションで生成する**（1枚をCSSで引き伸ばさない）。実装条件「スマホ用の縦長画像をPCで横に引き伸ばさない」を満たすため。
- 撮影シーン（モーメント）ごとにPC（横長〜自然比率）・SP（縦長）の2枚を用意し、`<picture><source media="(min-width: 1024px)" srcSet="...">`で出し分ける。
- スクリプトは既存の `portfolio/agrume-citrus-cleansing-lp/scripts/generate-section-images.mjs` パターンを踏襲し、`projects/<slug>/scripts/generate-section-images.mjs` として新規作成する（並列実行、既存ファイルはスキップ）。
- ログイン切れは `skills/common/codex-image-auth/SKILL.md` に従う。

### 5. 実装

- スタイリング：CSS Modules。ブレークポイント目安は `1024px`（PC⇔ハンバーガー切替の主境界）、`768px`、`560px`程度（参考サイトの実測値があればそれを踏襲）。
- スクロールアニメーション：**Framer Motion**の`whileInView`（`viewport={{ once: true, amount: 0.3 }}`程度）でフェードイン+わずかな移動、`staggerChildren`0.1〜0.15秒。
- 背景固定＋テキスト順送りのような「ピン留め」演出が必要な箇所だけ**GSAP + ScrollTrigger**を使う。Reactでは`useLayoutEffect` + `gsap.context(...).revert()`で確実にクリーンアップする（未クリーンアップだとページ遷移時にScrollTriggerが残留する）。
- 動きは全体的に控えめに：duration 0.6〜0.8秒、ease-out系、回転・大きなズーム・バウンスは使わない。
- ハンバーガーメニューは`AnimatePresence`でスライドイン/フェード、Escキー・背景クリックで閉じる、開いている間は`body`のスクロールをロックする。

### 6. ドキュメント化

`projects/<slug>/docs/` に以下を作る（[JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)の`docs/research/`運用の型を参考にしているが、**Tailwind/shadcnへの技術移行は行わない**。既に動くCSS Modules実装があるプロトタイプを、スコープに見合わない理由で作り直さないため）。

- `docs/research/analysis.md` — 手順1の分析結果（デザインの特徴／配色／余白設計／フォント／ページ構成／導線設計／使用アニメーション／サイト全体の世界観／再現時の重要ポイント）。末尾に著作権配慮（コピー・トレースではなくオリジナル制作である旨）を明記する。
- `docs/research/components/<section>.md` — 実装済み各セクションの仕様書（実装コードから実測値ベースで抽出。役割・レイアウト・配色・アニメーション仕様・コンテンツ）。
- `docs/sitemap.md` — サイトマップ。実装済み/未実装ページを明記する。
- `docs/copy.md` — 原稿一覧（実装のデータファイルと完全一致させる。新規創作しない）。
- `docs/qa-notes.md` — 下記QAの記録。

### 7. QA（必須）

リンク確認・ボタン確認・アニメーション確認・表示崩れ確認・レスポンシブ確認・コンソールエラー確認を必ず行う。

1. `npm run dev` でローカル起動。
2. claude-in-chromeでPC幅（1440px程度）とスマホ幅の両方を確認する。
3. 全リンク・ボタンをクリックし、JSエラーが出ないか確認する（下層ページ未実装なら404は許容、JSクラッシュは不可）。
4. 各スクロールアニメーションの発火を確認する。
5. `<picture>`のPC/SP出し分けが機能し、縦長画像がPCで間延びしていないか確認する。
6. `read_console_messages`でコンソールエラー・警告を確認する（0件が理想）。

**既知のツール制約**：この環境のブラウザ自動化ツールには以下の既知の不安定さがある。

- `resize_window`実行後も`window.innerWidth`が変わらないことがある。真のモバイル幅を作れない場合は、コード側の`@media`定義を直接レビューする代替手段を取る。
- 合成クリック（`computer left_click`）によるアンカーのフラグメントナビゲーションで、`window.scrollY`/`scrollTo()`が反映されないことがある。一方、**実際のホイール入力（`computer scroll`アクション）は正常に動作する**ことが多い。この場合、アプリ側のバグではなく自動化ツール環境固有の制約である可能性が高いので、コードレビュー（`preventDefault`や独自スクロール処理の有無、`overflow`設定）で異常がなければ、この既知の制約として`docs/qa-notes.md`に記録し、ユーザーに実ブラウザでの手動確認を推奨する。過度にコードを推測で変更しない。

### 8. ローカルプレビュー

完成したら`npm run dev`のURLをユーザーに提示する。devサーバーは確認後も動かしたままにしてよい。

### 9. Vercel公開（ユーザーが明示した場合のみ）

公開は「Explicit permission required」カテゴリの操作（公開コンテンツの作成）にあたるため、都度チャットで明示的な許可を得てから実行する。手順は `skills/lp-design/vercel-free-deploy/SKILL.md` のCLI公開パターンを流用する。

```bash
cd projects/<slug>
npx vercel --prod --yes
```

Production URLが新しくできたら、確認を取らずに自動的にChromeで開く（LPと同じ標準運用）。

### 10. ポートフォリオギャラリーへの登録

`skills/design/hp-gallery-sync/SKILL.md` を使う。**LPの自動登録運用（2026-07-10承認）とは異なり、HPの自動デプロイ・自動ギャラリー登録は2026-07-12時点でまだユーザーから標準運用として承認されていない。** 公開・DB登録・Vercel環境変数への秘密情報書き込みは、その都度チャットで明示的に確認する。

## 注意

- 参考サイトの構造・演出パターンのみを参考にし、コピー・トレース・商標の再現はしない。
- 検証目的の場合、まずトップページのみ作り、実装可能性を確認してから下層ページに広げる進め方を基本とする。
- ルートの`package.json`・`server/`・他プロジェクトの`portfolio/`/`gallery/`など、無関係な既存ファイルに触れない。
- git commitはユーザー承認後に行う（AGENTS.mdのGit運用ルール）。

## 関連スキル

- `skills/design/image-prompt-generator/SKILL.md` — 画像プロンプト
- `skills/common/codex-image-auth/SKILL.md` — Codex認証トラブル対応
- `skills/lp-design/vercel-free-deploy/SKILL.md` — Vercel公開の基本作法
- `skills/design/hp-gallery-sync/SKILL.md` — HPポートフォリオギャラリーへの登録
