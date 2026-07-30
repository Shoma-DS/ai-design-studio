export const navLinks = [
  { href: "/", label: "トップ" },
  { href: "/floor", label: "現場を知る" },
  { href: "/career", label: "専門性を磨く" },
  { href: "/voices", label: "先輩の声" },
  { href: "/recruitment", label: "募集要項" },
  { href: "/about", label: "会社概要" },
  { href: "/faq", label: "よくある質問" },
  { href: "#entry", label: "エントリー" },
];

export const steps = [
  { id: "company", href: "#company", number: "01", label: "トドマツを知る" },
  { id: "floor", href: "/floor", number: "02", label: "現場を知る" },
  { id: "career", href: "/career", number: "03", label: "専門性を磨く" },
  { id: "voices", href: "/voices", number: "04", label: "先輩の声" },
];

export const companyInfo = {
  name: "株式会社トドマツ",
  nameEn: "TODOMATSU CO., LTD.",
  postalCode: "060-0001",
  address: "北海道札幌市中央区北一条西5丁目1-2",
  tel: "011-200-1968",
  founded: "1968年（創業56年）",
  catchphrase: "暮らしの近くで、成長していく。",
  lead:
    "北海道・東北の食卓を支えて56年。トドマツは、地域の「今日の晩ごはん」に一番近いスーパーマーケットです。",
};

export type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export const stats: StatItem[] = [
  { id: "years", value: 56, suffix: "年", label: "創業からの歴史" },
  { id: "stores", value: 128, suffix: "店舗", label: "北海道・東北の出店数" },
  { id: "staff", value: 2400, suffix: "名", label: "在籍する従業員数" },
  { id: "areas", value: 6, suffix: "県", label: "展開する道県数" },
];

export type CareerItem = {
  id: string;
  number: string;
  title: string;
  catchphrase: string;
  description: string;
};

export const careers: CareerItem[] = [
  {
    id: "buyer",
    number: "01",
    title: "バイヤー",
    catchphrase: "産地と、まっすぐつながる。",
    description: "産地に足を運び、地域の「おいしい」を店頭に届ける仕入れのプロフェッショナル。",
  },
  {
    id: "area-manager",
    number: "02",
    title: "エリアマネージャー",
    catchphrase: "現場を、束ねる人。",
    description: "複数店舗の運営を見渡し、現場のチームづくりを支えるリーダー職。",
  },
  {
    id: "product",
    number: "03",
    title: "商品開発",
    catchphrase: "「おいしい」を、かたちにする。",
    description: "地域の食材を活かしたオリジナル商品を、企画から売場づくりまで手がける。",
  },
  {
    id: "marketing",
    number: "04",
    title: "販売促進・マーケティング",
    catchphrase: "季節を、売場に変える。",
    description: "季節の暮らしと売場をつなぐ企画で、来店のきっかけをつくる。",
  },
  {
    id: "logistics",
    number: "05",
    title: "物流センター",
    catchphrase: "届ける。止めない。",
    description: "商品を止めずに届ける仕組みを、日々の改善で支える裏方のプロ。",
  },
  {
    id: "corporate",
    number: "06",
    title: "総務・人事・経理",
    catchphrase: "会社の、屋台骨。",
    description: "会社という土台を数字と制度の両面から支えるバックオフィス業務。",
  },
  {
    id: "store",
    number: "07",
    title: "店舗スタッフ・販売",
    catchphrase: "「ありがとう」に、一番近い。",
    description: "お客さまに一番近い売場で、日々の「ありがとう」を積み重ねる仕事。",
  },
  {
    id: "system",
    number: "08",
    title: "情報システム",
    catchphrase: "現場を、裏から支える。",
    description: "レジ・在庫・発注のデジタル基盤を整え、現場の働きやすさを支える。",
  },
];

export type VoiceItem = {
  id: string;
  name: string;
  role: string;
  years: string;
  quote: string;
  body: string;
  image: string;
};

export const voices: VoiceItem[] = [
  {
    id: "sato",
    name: "佐藤 星南",
    role: "店舗スタッフ・販売",
    years: "入社3年目",
    quote: "お客さまの「ありがとう」が、次の工夫につながる。",
    body:
      "最初は品出しで精一杯でしたが、今は売場のPOPも自分で考えるように。小さな気づきを試せる環境があります。",
    image: "/images/voice-sato.png",
  },
  {
    id: "kondo",
    name: "近藤 拓真",
    role: "バイヤー",
    years: "入社6年目",
    quote: "産地に足を運ぶほど、店頭で語れる言葉が増える。",
    body:
      "生産者の方と直接話す機会が多く、その会話がそのまま売場のPOPや商品説明につながっています。",
    image: "/images/voice-kondo.png",
  },
  {
    id: "yoshida",
    name: "吉田 美咲",
    role: "エリアマネージャー",
    years: "入社10年目",
    quote: "新人だった自分が、今は新人を育てる側に。",
    body:
      "複数店舗を任されるようになり、視点は変わりましたが、現場を大事にする軸は入社時から変わっていません。",
    image: "/images/voice-yoshida.png",
  },
  {
    id: "takahashi",
    name: "高橋 陸",
    role: "商品開発",
    years: "入社5年目",
    quote: "地域の食材で、ここにしかない一品を。",
    body:
      "店舗での経験から生まれたアイデアを商品として形にできるのが、この仕事の面白さです。地元の生産者の方と試作を重ねる時間が好きです。",
    image: "/images/voice-takahashi.png",
  },
  {
    id: "watanabe",
    name: "渡辺 咲良",
    role: "物流センター",
    years: "入社7年目",
    quote: "商品を止めない裏方の誇り。",
    body:
      "縁の下の力持ちのような仕事ですが、店舗のスタッフから「今日も助かった」と言われるたびにやりがいを感じます。",
    image: "/images/voice-watanabe.png",
  },
];

export const ceoMessage = {
  role: "代表取締役社長",
  name: "戸田 正勝",
  title: "「今日の晩ごはん」に、いちばん近い場所で。",
  body: [
    "トドマツは1968年、北海道の小さな一軒の店から始まりました。当時から変わらず大切にしてきたのは、規模の大きさよりも地域との距離の近さです。",
    "56年間、地域のお客さまの「今日の晩ごはん」を支えてこられたのは、店舗で働く一人ひとりが、目の前のお客さまと丁寧に向き合い続けてきたからだと思っています。",
    "これからの56年も、地域と共に成長していく会社でありたい。そのために、新しい仲間の力が必要です。あなたの「やってみたい」を、私たちと一緒に形にしていきましょう。",
  ],
  image: "/images/ceo.png",
};

export type ScheduleItem = { time: string; title: string; description: string };

export const dailySchedule: ScheduleItem[] = [
  { time: "8:00", title: "出社・朝礼", description: "その日の売場の状況や注意点をチームで共有します。" },
  { time: "8:30", title: "品出し・発注", description: "前日の売れ行きを確認しながら、売場に商品を並べていきます。" },
  { time: "10:00", title: "開店・接客対応", description: "お客さまのお困りごとや質問に、売場から直接お応えします。" },
  { time: "12:00", title: "休憩", description: "交代で1時間の休憩。スタッフ同士で情報交換をすることも。" },
  { time: "13:00", title: "売場づくり・POP作成", description: "季節や売れ筋にあわせて、売場のレイアウトやPOPを工夫します。" },
  { time: "16:00", title: "在庫確認・発注準備", description: "翌日以降の欠品を防ぐため、在庫状況を確認し発注をかけます。" },
  { time: "17:30", title: "終礼・退勤", description: "1日の振り返りをチームで共有してから退勤します。" },
];

export type CareerStepItem = { year: string; title: string; description: string };

export const careerSteps: CareerStepItem[] = [
  { year: "1年目", title: "店舗スタッフとして現場を経験", description: "品出し・発注・接客など、売場のすべての業務を一通り経験します。" },
  { year: "2〜3年目", title: "売場のリーダーを任される", description: "特定の売場（青果・精肉・鮮魚 等）の責任者として、発注や後輩指導を担当します。" },
  { year: "4〜6年目", title: "専門分野への配属", description: "本人の適性と希望をふまえ、バイヤーや商品開発など専門分野に配属されます。" },
  { year: "7年目以降", title: "マネジメント・専門性の深化", description: "エリアマネージャーとして複数店舗を見渡す、または専門分野をさらに極める道を選べます。" },
];

export type HistoryItem = { year: string; event: string };

export const companyHistory: HistoryItem[] = [
  { year: "1968年", event: "北海道札幌市に1号店を開店。創業。" },
  { year: "1985年", event: "北海道内の出店を拡大、10店舗体制に。" },
  { year: "1998年", event: "東北エリアへ初出店。" },
  { year: "2005年", event: "青果・鮮魚・精肉の自社加工センターを新設。" },
  { year: "2015年", event: "プライベートブランド商品の展開を開始。" },
  { year: "2020年", event: "全店舗でキャッシュレス決済に対応。" },
  { year: "2024年", event: "北海道・東北6県、128店舗体制に（現在）。" },
];

export const companyProfile = [
  { label: "会社名", value: "株式会社トドマツ" },
  { label: "設立", value: "1968年（創業56年）" },
  { label: "代表者", value: "代表取締役社長　戸田 正勝" },
  { label: "資本金", value: "8,000万円" },
  { label: "事業内容", value: "食品スーパーマーケットの運営・管理" },
  { label: "本社所在地", value: "〒060-0001　北海道札幌市中央区北一条西5丁目1-2" },
  { label: "電話番号", value: "011-200-1968" },
  { label: "店舗数", value: "128店舗（北海道・東北6県）" },
  { label: "従業員数", value: "2,400名（2026年7月現在）" },
  { label: "取引銀行", value: "北海道信用金庫、みちのく銀行 ほか" },
];

export type RecruitmentGroup = {
  title: string;
  items: { label: string; value: string }[];
};

export const recruitmentGroups: RecruitmentGroup[] = [
  {
    title: "募集概要",
    items: [
      { label: "募集職種", value: "総合職（店舗運営・バイヤー・商品開発・本部機能 等）" },
      { label: "雇用形態", value: "正社員（入社後3か月は試用期間）" },
      { label: "募集人数", value: "若干名" },
      { label: "応募資格", value: "2027年3月卒業見込みの方（学部・学科不問）" },
    ],
  },
  {
    title: "勤務条件",
    items: [
      { label: "勤務地", value: "北海道・東北エリアの各店舗、本社（配属は入社後の適性・希望を踏まえて決定）" },
      { label: "勤務時間", value: "シフト制・実働8時間（休憩60分）" },
      { label: "給与", value: "月給21万円〜（大学卒）※地域手当・賞与別途" },
      { label: "昇給・賞与", value: "昇給年1回、賞与年2回" },
    ],
  },
  {
    title: "休日・休暇",
    items: [
      { label: "休日", value: "シフト制・完全週休2日、年間休日110日" },
      { label: "休暇", value: "有給休暇、慶弔休暇、産前産後・育児休業、介護休業" },
    ],
  },
  {
    title: "福利厚生",
    items: [
      { label: "各種保険", value: "健康保険・厚生年金・雇用保険・労災保険 完備" },
      { label: "制度", value: "社員割引制度、資格取得支援制度、育児と仕事の両立支援制度" },
    ],
  },
  {
    title: "研修制度",
    items: [
      { label: "入社時研修", value: "集合研修（ビジネスマナー・商品知識・接客の基礎）約2週間" },
      { label: "OJT", value: "店舗配属後、先輩社員によるマンツーマン指導" },
      { label: "階層別研修", value: "入社3年目・リーダー登用時・管理職登用時に実施" },
    ],
  },
  {
    title: "選考フロー",
    items: [
      { label: "STEP 1", value: "エントリー" },
      { label: "STEP 2", value: "会社説明会" },
      { label: "STEP 3", value: "書類選考" },
      { label: "STEP 4", value: "面接（1〜2回）" },
      { label: "STEP 5", value: "内定" },
    ],
  },
];

export type FaqItem = { id: string; question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    id: "transfer",
    question: "転勤はありますか？",
    answer: "北海道・東北エリア内での転勤の可能性があります。ライフイベントに応じて働き方を相談できる制度もあります。",
  },
  {
    id: "major",
    question: "文系・理系は関係ありますか？",
    answer: "学部・学科は問いません。実際に、様々な専攻出身の先輩たちが幅広い職種で活躍しています。",
  },
  {
    id: "assignment",
    question: "配属先はどう決まりますか？",
    answer: "入社後、まずは店舗の現場を経験したうえで、本人の適性と希望をふまえて専門分野への配属を検討します。",
  },
  {
    id: "training",
    question: "研修制度について教えてください。",
    answer: "入社後の集合研修に加え、店舗でのOJT、階層別研修など、段階に応じた研修を用意しています。",
  },
  {
    id: "leave",
    question: "有給休暇は取りやすいですか？",
    answer: "シフト制のため計画的に取得しやすく、直近5年間の平均取得率は8割を超えています。",
  },
  {
    id: "explanation",
    question: "会社説明会はいつ開催されますか？",
    answer: "毎年3月頃からオンライン・対面の両形式で開催しています。日程はエントリー後にご案内します。",
  },
  {
    id: "internship",
    question: "インターンシップは実施していますか？",
    answer: "夏季・冬季に店舗体験型のインターンシップを実施しています。詳細はエントリー後にご案内します。",
  },
  {
    id: "female",
    question: "女性の管理職はいますか？",
    answer: "エリアマネージャーや店長など、女性の管理職も多数活躍しています。育児と両立しながら働く社員も増えています。",
  },
  {
    id: "qualification",
    question: "入社後に取得できる資格はありますか？",
    answer: "食品衛生責任者や販売士など、業務に関連する資格の取得支援制度があります。",
  },
  {
    id: "selection-count",
    question: "選考は何回くらいありますか？",
    answer: "書類選考のあと、面接を1〜2回実施します。適性や希望をじっくり伺う機会を設けています。",
  },
];

export const entry = {
  title: "まずはエントリーから。",
  lead: "会社説明会・選考のご案内をお送りします。",
  buttonLabel: "エントリーする",
  badges: [
    { id: "b1", label: "地域雇用貢献企業（社内認定）" },
    { id: "b2", label: "育児と仕事の両立支援認定" },
    { id: "b3", label: "新卒定着率 92%（過去5年平均）" },
  ],
};
