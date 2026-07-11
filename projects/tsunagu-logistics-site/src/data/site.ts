export const navLinks = [
  { href: "#top", label: "トップページ" },
  { href: "#intro", label: "私たちについて" },
  { href: "#service", label: "事業内容" },
  { href: "#numbers", label: "数字で見る" },
  { href: "#contact", label: "お問い合わせ" },
];

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  lead: string;
  description: string;
  image: string;
  imageSp: string;
};

export const services: ServiceItem[] = [
  {
    id: "trunk",
    number: "01",
    title: "幹線輸送",
    lead: "地域と地域を、確かな時間でつなぐ。",
    description:
      "全国の主要拠点を結ぶ幹線輸送を担う事業部です。長距離ドライバーの働きやすさと安全運行を両立させる運行管理体制のもと、離れた地域同士を毎日つないでいます。",
    image: "/images/highway-pc.png",
    imageSp: "/images/highway-sp.png",
  },
  {
    id: "regional",
    number: "02",
    title: "地域宅配",
    lead: "荷物の先に、人の暮らしがある。",
    description:
      "個人宅・商店・小規模事業者まで、地域に根ざしたラストワンマイル配送を担当。顔の見える距離で、荷物と一緒に「ありがとう」を届けることを大切にしています。",
    image: "/images/handoff-pc.png",
    imageSp: "/images/handoff-sp.png",
  },
  {
    id: "warehouse",
    number: "03",
    title: "倉庫保管・仕分け",
    lead: "止まらない物流を、静かに支える。",
    description:
      "入出庫管理から検品・仕分け・流通加工まで、荷主企業の在庫を安全に預かる拠点運営を行っています。チームの連携が、翌日の「届く」を作っています。",
    image: "/images/warehouse-pc.png",
    imageSp: "/images/warehouse-sp.png",
  },
  {
    id: "dx",
    number: "04",
    title: "物流DXソリューション",
    lead: "データが、次の一手を教えてくれる。",
    description:
      "配送ルートの最適化、庫内稼働の可視化、需要予測など、テクノロジーで物流の非効率をなくす取り組みを進めています。現場と管制室が一体となって未来をつくります。",
    image: "/images/control-room-pc.png",
    imageSp: "/images/control-room-sp.png",
  },
];

export type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
};

export const stats: StatItem[] = [
  { id: "bases", value: 48, suffix: "拠点", label: "全国の物流拠点数", detail: "地域ごとにきめ細かく展開" },
  { id: "deliveries", value: 32000, suffix: "件/日", label: "1日あたりの配送件数", detail: "毎日、この数だけの「届く」を実現" },
  { id: "drivers", value: 1200, suffix: "名", label: "在籍ドライバー数", detail: "地域を知り尽くしたプロフェッショナル" },
  { id: "co2", value: 18, suffix: "%", label: "CO2排出量削減率", detail: "2021年度比・DXによるルート最適化の成果" },
];

export const topics = {
  date: "2026.07.01",
  text: "コーポレートサイトをリニューアルしました",
};

export const companyInfo = {
  name: "ツナグ物流株式会社",
  nameEn: "TSUNAGU LOGISTICS CO., LTD.",
  postalCode: "812-0011",
  address: "福岡県福岡市博多区博多駅前3丁目2-1",
  tel: "092-441-2200",
  fax: "092-441-2201",
};
