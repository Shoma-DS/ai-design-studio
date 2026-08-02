export const siteMeta = {
  serviceName: "寺子屋クラウド",
  serviceNameEn: "TERAKOYA CLOUD",
  operatorName: "株式会社テラコヤ",
  tagline: "教えるを、続けられる仕事に。",
  description:
    "個人講師・コーチ・士業のための集客×オンライン講座×コミュニティ運営オールインワンプラットフォーム「寺子屋クラウド」",
  url: "https://terakoya-cloud.example.com",
};

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "寺子屋クラウドとは", href: "/about" },
  { label: "機能", href: "/features" },
  { label: "料金プラン", href: "/price" },
  { label: "お客様の声", href: "/case" },
];

export const footerNav: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "寺子屋クラウドとは", href: "/about" },
  { label: "機能", href: "/features" },
  { label: "料金プラン", href: "/price" },
  { label: "お客様の声", href: "/case" },
];

export const legalNav: NavItem[] = [
  { label: "特定商取引法に基づく表示", href: "/law" },
  { label: "利用規約", href: "/use" },
  { label: "プライバシーポリシー", href: "/privacy" },
];

export const hero = {
  eyebrow: "導入実績 3,200件突破",
  title: "教えるを、\n続けられる仕事に。",
  subtitle:
    "集客も、講座運営も、受講生とのつながりも。寺子屋クラウドは、個人で「教える」を仕事にする人のためのオールインワンプラットフォームです。",
  primaryCta: { label: "まずは無料ではじめる", href: "#signup" },
  secondaryCta: { label: "資料をダウンロードする", href: "#download" },
  captionPc: "PC版：ワクワク学べる受講生ダッシュボード",
  captionSp: "スマホ版：どこでも続けられる学習体験",
};

export const highlightSections = [
  {
    badge: "2026年8月 新機能",
    title: "受講生の“学ぶ体験”を、もっと自分ごとに。",
    subtitle: "学習画面カラーを9色から選べる、新しい受講生ダッシュボードをリリースしました。",
    points: [
      {
        label: "POINT 01",
        title: "学習画面が9色のテーマから選べる",
        note: "※スタンダードプラン以上でご利用いただけます",
        description: "講座の世界観や受講生の好みに合わせて、テーマカラーを自由に選べます。",
      },
      {
        label: "POINT 02",
        title: "学んだ場所が、ひと目でわかる",
        description: "いま学習している位置が一目でわかり、復習したいときもすぐに探せます。",
      },
      {
        label: "POINT 03",
        title: "続けたくなる学習カウンター",
        description: "学習を継続したくなるカウンター機能や達成バッジで、離脱を防ぎます。",
      },
    ],
    cta: { label: "この機能を、あなたの講座でも。", href: "#signup" },
  },
  {
    badge: "コミュニティ機能 提供開始",
    title: "教える人と学ぶ人が、もっと近くなる。",
    subtitle: "掲示板・チャット・DMで、受講生同士のつながりも生まれるコミュニティ機能。",
    points: [
      {
        label: "特徴 01",
        title: "リアルタイムで講師とやり取りができる",
        description: "質問・相談チャンネルで、受講生の疑問をその場で解消できます。",
      },
      {
        label: "特徴 02",
        title: "オンラインサロンを運営できる",
        description: "講座の枠を超えた継続コミュニティとして運営できます。",
      },
      {
        label: "特徴 03",
        title: "受講生満足度が向上する",
        description: "受講生同士の交流が生まれ、継続率・満足度の向上につながります。",
      },
    ],
    cta: { label: "コミュニティ機能を、あなたの講座でも。", href: "#signup" },
  },
] as const;

export const marketingFeature = {
  badge: "集客機能 追加",
  title: "「集客」×「学び」×「コミュニティ運営」を\nオールインワンで管理できる",
  items: [
    {
      title: "LINEステップ配信",
      note: "LINE機能が月額5,980円〜のプランから利用可能",
      description: "構築が難しいLINEステップ配信もサクサク設定。集客に必要な機能をすべて完備。",
    },
    {
      title: "LPテンプレート機能",
      note: "LPテンプレート機能が月額5,980円〜のプランから利用可能",
      description: "ノーコードでLPが簡単に作れる。集客に必要なテンプレートが多数揃っています。",
    },
  ],
  cta: { label: "集客機能を、あなたの講座でも。", href: "#signup" },
};

export const reasons = [
  {
    number: "01",
    title: "「集客」「学び」「コミュニティ運営」が\nオールインワンで運営できる",
    description:
      "LINEステップ配信 × LP機能 × オンライン講座 × コミュニティ運営。これらすべてを寺子屋クラウドひとつで運用可能。複数ツールを使い分ける必要がなく、コストを大幅に削減できます。",
  },
  {
    number: "02",
    title: "受講生満足度を高める、\n教育特化のオールインワン設計",
    description:
      "インプットとアウトプットの両方が可能な講座を作成できます。講座構築×コミュニティ機能のオールインワンで、満足度の高い学習環境を構築します。",
  },
  {
    number: "03",
    title: "複雑な操作はなし。誰でも本格的な\nオンライン講座を作成できる",
    description:
      "パソコンが苦手な方も直感的に講座を作成可能。デザイン・プログラミングの知識は不要で、日本語の丁寧なサポートも付いているので安心です。",
  },
  {
    number: "04",
    title: "業界最安水準の集客機能を、\nはじめから使える",
    description: "月額5,980円のスタンダードプランからLINEステップ配信・LP機能が使えます。",
  },
] as const;

export const onboardingSteps = [
  { step: "Step 1", title: "「まずは無料ではじめる」ボタンをクリック" },
  { step: "Step 2", title: "無料アカウントを作成" },
  { step: "Step 3", title: "講座・LPを作成（動画・資料を添付）" },
  { step: "Step 4", title: "集客から講座提供・コミュニティ運営まで開始" },
] as const;

export const faqItems = [
  {
    q: "無料で試してみたいのですが、クレジットカードの登録などは必要ですか？",
    a: "必要ありません。ただし、クレジットカードの登録は有料プラン移行時に必要となります。",
  },
  {
    q: "申し込み後、いつから利用できますか？",
    a: "お申し込み完了後、最短当日からご利用いただけます。講座の準備が整い次第、すぐに公開できます。",
  },
  {
    q: "使い方のサポートは受けられますか？",
    a: "チャットサポートに加え、プロプラン以上ではオンラインでの個別相談も承っております。",
  },
  {
    q: "途中で料金プランを変更することはできますか？",
    a: "いつでも変更可能です。プラン変更時は日割りで計算されるため、無駄なく移行いただけます。",
  },
  {
    q: "料金はどのタイミングで決済されますか？",
    a: "ご登録いただいたクレジットカードにて、月次で自動決済されます。",
  },
] as const;

export type PricingPlan = {
  name: string;
  tagline: string;
  price: string;
  priceNote?: string;
  students: string;
  courses: string;
  cta: { label: string; variant: "outline" | "dark" | "sage" };
  accent: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "フリー",
    tagline: "まずは無料で試してみたい",
    price: "0円",
    priceNote: "※2ヶ月間無料",
    students: "〜15人",
    courses: "2",
    cta: { label: "今すぐ試してみる", variant: "outline" },
    accent: "var(--primary-300)",
  },
  {
    name: "スタンダード",
    tagline: "小規模でも本格的な講座運営をしたい",
    price: "5,980円",
    students: "〜30人",
    courses: "3",
    cta: { label: "今すぐ申し込む", variant: "dark" },
    accent: "var(--accent-500)",
  },
  {
    name: "プロ",
    tagline: "中規模講座を運営したい",
    price: "15,800円",
    students: "〜120人",
    courses: "5",
    cta: { label: "今すぐ申し込む", variant: "dark" },
    accent: "var(--sage-500)",
  },
  {
    name: "プロプラス",
    tagline: "300名以上の講座運営をしたい",
    price: "21,800円",
    students: "〜350人",
    courses: "5",
    cta: { label: "今すぐ申し込む", variant: "dark" },
    accent: "var(--accent-700)",
  },
  {
    name: "エンタープライズ",
    tagline: "受講生数を気にせず全機能を使いたい",
    price: "要問い合わせ",
    students: "カスタマイズ",
    courses: "カスタマイズ",
    cta: { label: "公式LINEで相談する", variant: "sage" },
    accent: "var(--primary-700)",
  },
];

export const pricingMatrix = [
  { feature: "LINEステップ配信", free: false, standard: true, pro: true, proPlus: true, enterprise: true },
  { feature: "LPテンプレート機能", free: false, standard: true, pro: true, proPlus: true, enterprise: true },
  { feature: "学習画面カラーカスタム", free: false, standard: false, pro: true, proPlus: true, enterprise: true },
  { feature: "コミュニティ機能", free: false, standard: true, pro: true, proPlus: true, enterprise: true },
  { feature: "アンケート機能", free: true, standard: true, pro: true, proPlus: true, enterprise: true },
  { feature: "受講生CSVインポート", free: false, standard: false, pro: true, proPlus: true, enterprise: true },
  { feature: "AIアシスト要約機能", free: false, standard: false, pro: false, proPlus: true, enterprise: true },
] as const;

/**
 * Aboutページの課題整理セクション。
 * pos / dots はPC幅で吹き出しを人物の周囲へ非対称に散らすための座標（コンテナに対する%）。
 * dots は吹き出しから人物へ向かって伸びる、思考の吹き出し風の小さな丸。
 * 768px以下ではこれらの座標は使わず、通常のグリッドに積み替える。
 */
export const aboutPainPoints = [
  {
    title: "受講生のフォローやリマインドを\n手動でやっていて限界…",
    pos: { top: 4, left: 10 },
    dots: [
      { top: 25, left: 32, size: 13 },
      { top: 31, left: 37, size: 9 },
    ],
  },
  {
    title: "集客・講座づくり・受講生管理まで\nまとめて任せたい",
    pos: { top: 0, left: 52 },
    dots: [
      { top: 22, left: 58, size: 12 },
      { top: 28, left: 54, size: 8 },
    ],
  },
  {
    title: "動画を渡すだけの\nオンライン講座になっている",
    pos: { top: 40, left: 1 },
    dots: [
      { top: 58, left: 25, size: 14 },
      { top: 64, left: 30, size: 9 },
    ],
  },
  {
    title: "LPやサイトの構築は\n難しそう",
    pos: { top: 38, left: 69 },
    dots: [
      { top: 57, left: 68, size: 13 },
      { top: 63, left: 64, size: 9 },
    ],
  },
  {
    title: "受講生の進捗管理が\nできていない",
    pos: { top: 76, left: 4 },
    dots: [
      { top: 80, left: 27, size: 12 },
      { top: 73, left: 31, size: 8 },
    ],
  },
  {
    title: "コミュニティがなく\n受講生満足度が伸び悩む",
    pos: { top: 78, left: 67 },
    dots: [
      { top: 82, left: 66, size: 12 },
      { top: 75, left: 62, size: 8 },
    ],
  },
] as const;

export const useCases = [
  {
    title: "オンラインスクール",
    description:
      "感想文機能の活用で動画の理解度が向上。進捗管理機能でリアルタイムのコミュニケーションをとることで、モチベーションを維持できています。",
  },
  {
    title: "コーチング・伴走コミュニティ",
    description:
      "コミュニティ機能を活用し、受講生同士が支え合う場を提供。1対1の伴走だけでなく、仲間との継続学習の仕組みができました。",
  },
  {
    title: "士業・専門家の顧問サービス",
    description:
      "顧問先向けの動画マニュアルをコース化。最低限の対応手順を伝えられるようになり、問い合わせ対応の工数を削減できました。",
  },
  {
    title: "企業研修・社内教育",
    description:
      "新入社員教育をオンライン化。部署ごとに伝える内容を棲み分けられ、研修担当者の負担が大きく軽減されました。",
  },
] as const;

export type Testimonial = {
  name: string;
  headline: string;
  body: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "スタジオLUNA（ヨガインストラクター）様",
    headline: "参加者一人ひとりに応じた学習の機会を提供できるようになりました",
    body: "オンラインサロンの参加者様の教育サポートを寺子屋クラウドで行っています。煩雑だったコミュニティ内の情報が整理され、参加者一人ひとりに応じた学習機会を提供できるようになり、満足度が大きく向上しました。",
  },
  {
    name: "テックリード伴走塾 様",
    headline: "SNSでのコンテンツ提供から切り替えたことでスクールの価値が上がりました",
    body: "今まで受講生限定のチャットグループでコーチングを提供していました。無料のSNSでのコンテンツ提供では価値が伝わりにくいことに悩んでいましたが、寺子屋クラウドの導入で本格的なオンラインスクールとしての信頼感が生まれました。",
  },
  {
    name: "社労士スタートアップ研究会 様",
    headline: "受講生からはコンテンツが見やすい、講師からはサポートがしやすいと好評です",
    body: "会員限定のコンテンツ配信のため以前はLINEグループでサポートしていましたが、講座の満足度を上げるためにコンテンツを見せるシステムを導入したいと考えていました。学習コンテンツをコース化し、全ての会員様が迷うことなくカリキュラムを進められるようになりました。",
  },
  {
    name: "行政書士やまなみ事務所 様",
    headline: "顧問先向けマニュアルの提供に取り入れてよかったです",
    body: "顧問先ごとに異なる手続きの流れを動画でまとめ、必要な時にいつでも確認できる環境を整えられました。問い合わせ対応の工数も大きく削減できています。",
  },
  {
    name: "英会話コーチングLUCE 様",
    headline: "コンテンツ管理の工数削減により、満足度UP・別講座の購入につながりました",
    body: "累計受講者数1,500名以上の英語コーチングを運営するにあたり、会員サイトとして寺子屋クラウドを利用しています。導入前は複数のプラットフォームを併用しており学習環境が整っていませんでしたが、導入後は一元管理に成功し、リピート率が向上しました。",
  },
  {
    name: "株式会社ミライズ 人事担当 様",
    headline: "新入社員研修のオンライン化で教育担当の負担が大きく減りました",
    body: "研修動画を部署別・階層別にコース分けできるようになり、必要な内容だけを的確に届けられるようになりました。進捗が可視化されるので、フォローが必要な社員にもすぐ気づけます。",
  },
];

export const featureGroups = [
  {
    category: "集客機能",
    items: [
      { title: "LINEステップ配信", description: "LINEステップ配信で販促を強化。ユーザーに合わせた最適なアプローチが可能になります。" },
      { title: "LPテンプレート機能", description: "ノーコードでLPが簡単に作れる。集客に必要なテンプレートが多数揃っています。" },
      { title: "流入経路分析", description: "どの経路から登録につながったかを可視化し、集客施策の改善に活かせます。" },
    ],
  },
  {
    category: "学習機能",
    items: [
      { title: "感想文機能", description: "動画に対して感想やワークを提出してもらうことで、理解力を格段にアップ。質の高い学びの場を提供します。" },
      { title: "順番学習", description: "コンテンツを順番に学習することで、学習順序を間違えない・迷わない設計にできます。" },
      { title: "進捗ダッシュボード", description: "コース全体の進捗を確認し、離脱している受講生を個別サポートできます。" },
      { title: "学習画面カラーカスタム", description: "受講生の学習画面を9色のテーマから選択でき、講座の世界観に合わせられます。" },
    ],
  },
  {
    category: "コミュニティ機能",
    items: [
      { title: "チャンネル掲示板", description: "話題ごとにチャンネルを分けて、受講生同士が自然に交流できる場を作れます。" },
      { title: "ダイレクトメッセージ", description: "個別の質問や相談にも、その場でスムーズにやり取りできます。" },
      { title: "オンラインサロン運営", description: "講座の枠を超えた継続的なコミュニティとして運営できます。" },
    ],
  },
  {
    category: "管理機能",
    items: [
      { title: "受講生CSVインポート", description: "既存の受講生リストを一括で取り込み、スムーズに移行できます。" },
      { title: "アンケート機能", description: "受講後アンケートを組み込み、講座改善のためのデータを集められます。" },
      { title: "決済・請求管理", description: "クレジットカード決済・請求管理をまとめて行えます。" },
    ],
  },
] as const;

export const legalCompany = {
  name: "株式会社テラコヤ",
  representative: "代表取締役 寺子 悠人（デモ用の架空情報です）",
  address: "東京都渋谷区圓山町1-2-3 テラコヤビル5F（デモ用の架空住所です）",
  contactNote: "お問い合わせは公式LINE、または以下のお問い合わせフォームよりご連絡ください。",
};
