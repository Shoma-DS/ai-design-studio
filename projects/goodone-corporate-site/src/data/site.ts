import type { LucideIcon } from "lucide-react";
import { Gauge, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

export const site = {
  name: "GOOD ONE",
  legalName: "株式会社グッドワン",
  title: "株式会社グッドワン | ERC日本輸入総代理店",
  description:
    "ERC製カーボンクリーニングシステム、水素カーボンクリーニング、DPFアッシュクリーニングを全国ネットワークで提供する株式会社グッドワンのコーポレートサイトです。",
  phone: "090-2783-0101",
  email: "info@good1-inc.jp",
  address: "高知県香南市香我美町山北757-10",
};

export const nav = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "サービス" },
  { href: "/works", label: "実績" },
  { href: "/about", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

export const stats = [
  { value: "2.5h", label: "最大施工時間", note: "分解を抑えた短時間メンテナンス" },
  { value: "39kPa -> 6kPa", label: "改善事例", note: "DPF最大排気差圧の参考値" },
  { value: "全国", label: "代理店ネットワーク", note: "各地域の事業者と連携" },
  { value: "特許7492281", label: "技術基盤", note: "内燃機関の洗浄装置" },
];

export type Service = {
  title: string;
  lead: string;
  body: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "DPFアッシュクリーニング",
    lead: "高額交換の前に、短時間で状態を見極める。",
    body:
      "差圧チェックからクリーナー噴霧、燃焼確認までを一連の工程として整理し、業務車両の稼働停止時間を抑えます。",
    icon: Gauge,
  },
  {
    title: "水素カーボンクリーニング",
    lead: "吸排気系の堆積カーボンに定期メンテナンスで向き合う。",
    body:
      "水素ガスを活用し、エンジン内部に堆積したカーボンの排出を促します。小型車から重機まで幅広い車両を想定します。",
    icon: Sparkles,
  },
  {
    title: "ERCクリーナー供給",
    lead: "日本輸入総代理店として、品質と運用を支える。",
    body:
      "ドイツメーカーERCの製品供給と施工ノウハウを組み合わせ、代理店や整備事業者の現場品質を支援します。",
    icon: ShieldCheck,
  },
  {
    title: "代理店・施工店サポート",
    lead: "導入後に困らない、技術と事業運営の伴走。",
    body:
      "導入企業向けに、対象車両、施工順序、営業導線、問い合わせ対応まで一体で整える支援を行います。",
    icon: MapPinned,
  },
];

export const cases = [
  {
    category: "運送会社",
    title: "DPF再生頻度の増加に対する予防整備",
    result: "車両停止の長期化を避け、定期施工へ移行",
  },
  {
    category: "建設会社",
    title: "重機・業務車両の黒煙対策",
    result: "現場稼働を優先しながら段階的に洗浄",
  },
  {
    category: "整備工場",
    title: "代理店導入による新しい整備メニュー化",
    result: "既存顧客への提案商材として展開",
  },
];

export const company = [
  ["会社名", "株式会社グッドワン"],
  ["所在地", "高知県香南市香我美町山北757-10"],
  ["拠点", "大阪支店、関東支店、全国代理店ネットワーク"],
  ["事業内容", "ERC製品の輸入販売、カーボンクリーニング、DPFクリーニング、代理店支援"],
  ["特許", "特許第7492281号 内燃機関のカーボン堆積物の洗浄装置"],
  ["連絡先", "090-2783-0101"],
];
