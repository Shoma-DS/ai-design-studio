// LPポートフォリオギャラリーのデータ。
// 新しいLPをVercelに公開したら、ここにエントリを追加してから
// `cd gallery && npx vercel --prod --yes` で再公開する。
// 詳細: skills/lp-design/vercel-free-deploy/SKILL.md の「ギャラリーサイトへの追加」を参照。
//
// タグの分類:
// - moodTags: 雰囲気で探す（デザインの印象。カッコイイ/可愛い/上品 など）
// - productTags: 商品で探す（業種・商材のジャンル）
// - featureTags: 機能で探す（LPに実装されている技術的なUI機能。アニメーション/レスポンシブ/カルーセル/
//   アコーディオン/ハンバーガーメニュー/固定ヘッダーなど。1枚絵を縦結合しただけの静的LPは対象機能が
//   実装されていないため空配列にする。ビジネス上の訴求（EC、会員登録、予約導線など）はここに含めない。
window.LP_GALLERY_DATA = [
  {
    slug: "ashita-town-sdgs-lp",
    title: "あしたタウン〜みんなにやさしい17のなかまたち〜",
    heading: "めひょうってな〜に？",
    category: "自治体・啓発",
    moodTags: ["可愛い", "ポップ"],
    productTags: ["自治体", "啓発", "SDGs"],
    featureTags: [],
    url: "https://ashita-town-sdgs-lp.vercel.app",
    thumbnail: "assets/thumbnails/ashita-town-sdgs-lp.jpg"
  },
  {
    slug: "astella-vxr-suv-lp",
    title: "ASTELLA MOTORS「V-XR」コンパクトSUV LP",
    heading: "異彩を放つ、コンパクトSUV",
    category: "自動車",
    moodTags: ["カッコイイ", "クール"],
    productTags: ["自動車", "SUV"],
    featureTags: [],
    url: "https://astella-vxr-suv-lp.vercel.app",
    thumbnail: "assets/thumbnails/astella-vxr-suv-lp.jpg"
  },
  {
    slug: "beauty-salon-c3-inspired-lp",
    title: "Lumiere Smooth Beauty LP Portfolio",
    heading: "夏肌、透明感で魅せる",
    category: "美容・サロン",
    moodTags: ["上品", "ロマンティック"],
    productTags: ["美容", "サロン"],
    featureTags: [],
    url: "https://beauty-salon-c3-inspired-lp.vercel.app",
    thumbnail: "assets/thumbnails/beauty-salon-c3-inspired-lp.jpg"
  },
  {
    slug: "career-bridge-job-support-lp",
    title: "キャリアブリッジ（CAREER BRIDGE）転職支援サービスLP",
    heading: "頑張るあなたを、とことん応援!!",
    category: "人材・転職",
    moodTags: ["ポップ", "信頼感"],
    productTags: ["人材", "転職"],
    featureTags: [],
    url: "https://career-bridge-job-support-lp.vercel.app",
    thumbnail: "assets/thumbnails/career-bridge-job-support-lp.jpg"
  },
  {
    slug: "kurabiyori-miso-shop-lp",
    title: "蔵日和 特選（KURABIYORI TOKUSEN）味噌オンラインショップLP",
    heading: "発酵の技を極めし蔵人が生み出す味噌「蔵日和特選」",
    category: "食品・EC",
    moodTags: ["上品", "ラグジュアリー"],
    productTags: ["食品", "味噌"],
    featureTags: [],
    url: "https://kurabiyori-miso-shop-lp.vercel.app",
    thumbnail: "assets/thumbnails/kurabiyori-miso-shop-lp.jpg"
  },
  {
    slug: "protoskill-webdesign-school-lp",
    title: "ProtoSkill 超実践型Webデザイン養成スクール LP",
    heading: "好きを、仕事に。／その一歩、ProtoSkillで。",
    category: "教育・スクール",
    moodTags: ["ナチュラル", "信頼感"],
    productTags: ["教育", "スクール", "Webデザイン"],
    featureTags: [],
    url: "https://protoskill-webdesign-school-lp.vercel.app",
    thumbnail: "assets/thumbnails/protoskill-webdesign-school-lp.jpg"
  },
  {
    slug: "rosier-beauty-petal-mood-lp",
    title: "ROSIER BEAUTY PETAL mood コスメキャンペーンLP",
    heading: "質感を重ねるほどに深まる、輪郭のあるロマンティックさ",
    category: "美容・コスメ",
    moodTags: ["上品", "ロマンティック"],
    productTags: ["美容", "コスメ"],
    featureTags: [],
    url: "https://rosier-beauty-petal-mood-lp.vercel.app",
    thumbnail: "assets/thumbnails/rosier-beauty-petal-mood-lp.jpg"
  },
  {
    slug: "stellant-fortune-rental-lp",
    title: "STELLANT 占いコンテンツレンタルサービスLP",
    heading: "占いで、サイトに新しい特別を＋",
    category: "エンタメ・占い",
    moodTags: ["幻想的", "ラグジュアリー"],
    productTags: ["エンタメ", "占い"],
    featureTags: [],
    url: "https://stellant-fortune-rental-lp.vercel.app",
    thumbnail: "assets/thumbnails/stellant-fortune-rental-lp.jpg"
  },
  {
    slug: "sunshine-berry-uv-care-lp",
    title: "サンシャインベリー UVケアインナーサプリメント LP",
    heading: "毎日を 自分らしく 楽しみたい あなたに",
    category: "健康食品・サプリ",
    moodTags: ["ポップ", "ナチュラル"],
    productTags: ["健康食品", "サプリメント"],
    featureTags: [],
    url: "https://sunshine-berry-uv-care-lp.vercel.app",
    thumbnail: "assets/thumbnails/sunshine-berry-uv-care-lp.jpg"
  },
  {
    slug: "tomoni-data-service-lp",
    title: "株式会社トモニデータサービス コーポレートLP",
    heading: "つながる想いが、明日をつくる。",
    category: "BtoB・コーポレート",
    moodTags: ["信頼感", "ナチュラル"],
    productTags: ["BtoB", "データサービス", "IT"],
    featureTags: [],
    url: "https://tomoni-data-service-lp.vercel.app",
    thumbnail: "assets/thumbnails/tomoni-data-service-lp.jpg"
  },
  {
    slug: "verdia-aging-care-hair-lp",
    title: "VERDIA エイジングケアヘアラインLP",
    heading: "先端のケア技術で、年齢を重ねた髪も髪質改善",
    category: "美容・ヘアケア",
    moodTags: ["上品", "ラグジュアリー"],
    productTags: ["美容", "ヘアケア"],
    featureTags: [],
    url: "https://verdia-aging-care-hair-lp.vercel.app",
    thumbnail: "assets/thumbnails/verdia-aging-care-hair-lp.jpg"
  },
  {
    slug: "ai-income-course",
    title: "最短でAI副業を成功させる方法！AI副業の始め方講座",
    heading: "最短でAI副業を成功させる方法！",
    category: "教育・講座",
    moodTags: ["ポップ", "信頼感"],
    productTags: ["教育", "オンライン講座"],
    featureTags: [],
    url: "https://ai-income-course.vercel.app",
    thumbnail: "assets/thumbnails/ai-income-course.jpg"
  },
  {
    slug: "wheelbase-cycle-app-lp",
    title: "ホイールベース公式アプリ紹介LP",
    heading: "ホイールベースが 公式アプリで もっと身近に!!",
    category: "自転車・モビリティ",
    moodTags: ["ポップ", "カッコイイ"],
    productTags: ["モビリティ", "自転車"],
    featureTags: [],
    url: "https://wheelbase-cycle-app-lp.vercel.app",
    thumbnail: "assets/thumbnails/wheelbase-cycle-app-lp.jpg"
  },
  {
    slug: "awavie-carbonated-skincare-lp",
    title: "AWAVIE 微炭酸うるおい発想スキンケアLP",
    heading: "肌の奥まで、はじける潤い。",
    category: "美容・コスメ",
    moodTags: ["ナチュラル", "上品"],
    productTags: ["美容", "スキンケア", "コスメ"],
    featureTags: ["ハンバーガーメニュー", "固定ヘッダー", "アニメーション", "レスポンシブ"],
    url: "https://awavie-carbonated-skincare-lp.vercel.app",
    thumbnail: "assets/thumbnails/awavie-carbonated-skincare-lp.jpg"
  },
  {
    slug: "flexa-warehouse-lp",
    title: "FLEXA システム建築・倉庫建築LP",
    heading: "つくる自由が、ひろがる。フレキシブルな倉庫建築。",
    category: "建築・システム建築",
    moodTags: ["信頼感", "カッコイイ"],
    productTags: ["建築", "倉庫建築", "BtoB"],
    featureTags: ["ハンバーガーメニュー", "固定ヘッダー", "アニメーション", "カルーセル", "アコーディオン", "レスポンシブ"],
    url: "https://flexa-warehouse-lp.vercel.app",
    thumbnail: "assets/thumbnails/flexa-warehouse-lp.jpg"
  },
  {
    slug: "usubeni-pink-plum-liqueur-lp",
    title: "薄紅 -usubeni- プレミアムピンク梅酒セットLP",
    heading: "まとうのは、透きとおる紅色。",
    category: "食品・EC",
    moodTags: ["上品", "ロマンティック"],
    productTags: ["食品", "梅酒"],
    featureTags: [],
    url: "https://usubeni-pink-plum-liqueur-lp.vercel.app",
    thumbnail: "assets/thumbnails/usubeni-pink-plum-liqueur-lp.jpg"
  }
];
