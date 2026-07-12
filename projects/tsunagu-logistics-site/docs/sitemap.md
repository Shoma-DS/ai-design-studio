# サイトマップ：ツナグ物流株式会社

## 実装済み

- `/`（トップページ） — Header, Hero, Intro, MessagePin, ServiceCarousel, MarqueeBand, NumbersSection, ServiceList, ContactSection, CtaBand, Footer の11セクション構成。

## 未実装（今回スコープ外・トップページのみの検証プロトタイプのため）

ヘッダー／フッターナビ（`src/data/site.ts` の `navLinks`）およびCTAが指すアンカー・ページ：

| リンク | 遷移先 | 状態 |
|---|---|---|
| トップページ | `#top` | 実装済み（同一ページ内アンカー） |
| 私たちについて | `#intro` | 実装済み（Introセクションへのアンカー。将来的に単独ページ`/about`に分離する想定） |
| 事業内容 | `#service` | 実装済み（ServiceListセクションへのアンカー。将来的に単独ページ`/service`、事業部ごとの詳細ページに分割する想定） |
| 数字で見る | `#numbers` | 実装済み（NumbersSectionへのアンカー） |
| お問い合わせ | `#contact` | 実装済み（ContactSectionへのアンカー） |
| 採用情報 | `#recruit` | **未実装**。ヘッダー・CtaBandからリンクされているが、対応するセクション/ページが存在しないため現状は同一ページ内で何もスクロールしない（該当IDなし）。採用サイトへの外部リンク or `/recruit`ページを別途用意する想定。 |
| メールでのお問い合わせ | `mailto:info@tsunagu-logistics.example.co.jp` | ダミーアドレス（`.example`ドメイン、実在しない） |
| お電話でのお問い合わせ | `tel:0924412200` | ダミー番号（`companyInfo.tel`はサンプル値） |

## 想定される下層ページ（将来拡張案・未着手）

- `/about` 会社情報（沿革・代表挨拶・企業理念）
- `/service` 事業内容詳細（幹線輸送／地域宅配／倉庫保管・仕分け／物流DXソリューションの個別ページ）
- `/recruit` 採用情報
- `/news` お知らせ一覧（Hero内Topicsティッカーの遷移先）
- `/privacy` プライバシーポリシー
- `/contact` お問い合わせフォーム（現状はmailto/tel直リンクのみ）

これらは今回の検証スコープ外であり、実装されていません。
