# AI Design Studio

バナー、サムネ、SNS投稿、スライド、LPをAIで制作するための共通リポジトリです。

## できること

- バナー制作
- サムネイル制作
- SNS投稿画像制作
- スライド制作
- LP制作
- ポートフォリオ管理
- 業務・クライアント・プロジェクト単位の制作管理
- 制作タイプ別のコンテキスト、スキル、ワークフロー管理

## 重要ルール

ユーザーが制作物の種類を明示していない場合は、作り始める前に必ず確認します。

確認例:

```text
今回作るものは、バナー、サムネ、SNS投稿、スライド、LPのどれですか？
```

## フォルダ構成

```text
contexts/              制作タイプ別・案件別の前提情報
skills/                AIエージェント用スキル
workflows/             制作タイプ別ワークフロー
templates/             制作物ごとのテンプレート
portfolio/             公開可能なポートフォリオ成果物
projects/              業務・クライアント・案件ごとの作業
references/            参考画像・参考LP・競合調査
exports/               納品物・書き出し
server/ src/ scripts/  LP編集GUIと画像生成補助
```

## LP編集GUI

既存のLPデザインリポジトリから、LP制作に必要なGUI・サーバー・Codex app-server画像生成クライアントをコピーしています。

```bash
npm install
npm run dev
```

デフォルトURL:

```text
http://127.0.0.1:5177
```

画像生成は Codex app-server 経由の `gpt-image-2` を使います。OpenAI APIキーや外部画像生成APIは使いません。
