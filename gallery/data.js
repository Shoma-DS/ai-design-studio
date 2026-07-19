// ポートフォリオギャラリーのデータ（オフラインフォールバック用）。
// 正本はNeon Postgres（portfolio_itemsテーブル）。通常はgallery/scripts/add-portfolio-item.mjsで
// DBに登録し、/api/portfolio-items経由でサイトに反映される。このファイルはDB取得失敗時の
// フォールバックとしてのみ使われる。node scripts/sync-data-js.mjs で再生成できる。
//
// type: 大タブの種類（lp/hp/moving-lp/swipe-lp/banner/thumbnail/sns-post/flyer）
// linkType: "external"=カードクリックで実サイトをiframeプレビュー / "image"=カードクリックで画像を拡大表示
// タグの分類:
// - moodTags: 雰囲気で探す（デザインの印象。カッコイイ/可愛い/上品 など）
// - productTags: 商品で探す（業種・商材のジャンル）
// - featureTags: 機能で探す（実装されている技術的なUI機能。アニメーション/レスポンシブ/カルーセル/
//   アコーディオン/ハンバーガーメニュー/固定ヘッダーなど。ビジネス上の訴求はここに含めない）
window.PORTFOLIO_GALLERY_DATA = [
  {
    "slug": "ashita-town-sdgs-lp",
    "type": "lp",
    "title": "あしたタウン〜みんなにやさしい17のなかまたち〜",
    "heading": "めひょうってな〜に？",
    "category": "自治体・啓発",
    "moodTags": [
      "可愛い",
      "ポップ"
    ],
    "productTags": [
      "自治体",
      "啓発",
      "SDGs"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://ashita-town-sdgs-lp.vercel.app",
    "thumbnail": "assets/thumbnails/ashita-town-sdgs-lp.jpg"
  },
  {
    "slug": "astella-vxr-suv-lp",
    "type": "lp",
    "title": "ASTELLA MOTORS「V-XR」コンパクトSUV LP",
    "heading": "異彩を放つ、コンパクトSUV",
    "category": "自動車",
    "moodTags": [
      "カッコイイ",
      "クール"
    ],
    "productTags": [
      "自動車",
      "SUV"
    ],
    "featureTags": [
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://astella-vxr-suv-lp.vercel.app",
    "thumbnail": "assets/thumbnails/astella-vxr-suv-lp.jpg"
  },
  {
    "slug": "beauty-salon-c3-inspired-lp",
    "type": "lp",
    "title": "Lumiere Smooth Beauty LP Portfolio",
    "heading": "夏肌、透明感で魅せる",
    "category": "美容・サロン",
    "moodTags": [
      "上品",
      "ロマンティック"
    ],
    "productTags": [
      "美容",
      "サロン"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://beauty-salon-c3-inspired-lp.vercel.app",
    "thumbnail": "assets/thumbnails/beauty-salon-c3-inspired-lp.jpg"
  },
  {
    "slug": "career-bridge-job-support-lp",
    "type": "lp",
    "title": "キャリアブリッジ（CAREER BRIDGE）転職支援サービスLP",
    "heading": "頑張るあなたを、とことん応援!!",
    "category": "人材・転職",
    "moodTags": [
      "ポップ",
      "信頼感"
    ],
    "productTags": [
      "人材",
      "転職"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://career-bridge-job-support-lp.vercel.app",
    "thumbnail": "assets/thumbnails/career-bridge-job-support-lp.jpg"
  },
  {
    "slug": "kurabiyori-miso-shop-lp",
    "type": "lp",
    "title": "蔵日和 特選（KURABIYORI TOKUSEN）味噌オンラインショップLP",
    "heading": "発酵の技を極めし蔵人が生み出す味噌「蔵日和特選」",
    "category": "食品・EC",
    "moodTags": [
      "上品",
      "ラグジュアリー"
    ],
    "productTags": [
      "食品",
      "味噌"
    ],
    "featureTags": [
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://kurabiyori-miso-shop-lp.vercel.app",
    "thumbnail": "assets/thumbnails/kurabiyori-miso-shop-lp.jpg"
  },
  {
    "slug": "protoskill-webdesign-school-lp",
    "type": "lp",
    "title": "ProtoSkill 超実践型Webデザイン養成スクール LP",
    "heading": "好きを、仕事に。／その一歩、ProtoSkillで。",
    "category": "教育・スクール",
    "moodTags": [
      "ナチュラル",
      "信頼感"
    ],
    "productTags": [
      "教育",
      "スクール",
      "Webデザイン"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://protoskill-webdesign-school-lp.vercel.app",
    "thumbnail": "assets/thumbnails/protoskill-webdesign-school-lp.jpg"
  },
  {
    "slug": "rosier-beauty-petal-mood-lp",
    "type": "lp",
    "title": "ROSIER BEAUTY PETAL mood コスメキャンペーンLP",
    "heading": "質感を重ねるほどに深まる、輪郭のあるロマンティックさ",
    "category": "美容・コスメ",
    "moodTags": [
      "上品",
      "ロマンティック"
    ],
    "productTags": [
      "美容",
      "コスメ"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://rosier-beauty-petal-mood-lp.vercel.app",
    "thumbnail": "assets/thumbnails/rosier-beauty-petal-mood-lp.jpg"
  },
  {
    "slug": "stellant-fortune-rental-lp",
    "type": "lp",
    "title": "STELLANT 占いコンテンツレンタルサービスLP",
    "heading": "占いで、サイトに新しい特別を＋",
    "category": "エンタメ・占い",
    "moodTags": [
      "幻想的",
      "ラグジュアリー"
    ],
    "productTags": [
      "エンタメ",
      "占い"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://stellant-fortune-rental-lp.vercel.app",
    "thumbnail": "assets/thumbnails/stellant-fortune-rental-lp.jpg"
  },
  {
    "slug": "sunshine-berry-uv-care-lp",
    "type": "lp",
    "title": "サンシャインベリー UVケアインナーサプリメント LP",
    "heading": "毎日を 自分らしく 楽しみたい あなたに",
    "category": "健康食品・サプリ",
    "moodTags": [
      "ポップ",
      "ナチュラル"
    ],
    "productTags": [
      "健康食品",
      "サプリメント"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://sunshine-berry-uv-care-lp.vercel.app",
    "thumbnail": "assets/thumbnails/sunshine-berry-uv-care-lp.jpg"
  },
  {
    "slug": "tomoni-data-service-lp",
    "type": "lp",
    "title": "株式会社トモニデータサービス コーポレートLP",
    "heading": "つながる想いが、明日をつくる。",
    "category": "BtoB・コーポレート",
    "moodTags": [
      "信頼感",
      "ナチュラル"
    ],
    "productTags": [
      "BtoB",
      "データサービス",
      "IT"
    ],
    "featureTags": [
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://tomoni-data-service-lp.vercel.app",
    "thumbnail": "assets/thumbnails/tomoni-data-service-lp.jpg"
  },
  {
    "slug": "verdia-aging-care-hair-lp",
    "type": "lp",
    "title": "VERDIA エイジングケアヘアラインLP",
    "heading": "先端のケア技術で、年齢を重ねた髪も髪質改善",
    "category": "美容・ヘアケア",
    "moodTags": [
      "上品",
      "ラグジュアリー"
    ],
    "productTags": [
      "美容",
      "ヘアケア"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://verdia-aging-care-hair-lp.vercel.app",
    "thumbnail": "assets/thumbnails/verdia-aging-care-hair-lp.jpg"
  },
  {
    "slug": "ai-income-course",
    "type": "lp",
    "title": "最短でAI副業を成功させる方法！AI副業の始め方講座",
    "heading": "最短でAI副業を成功させる方法！",
    "category": "教育・講座",
    "moodTags": [
      "ポップ",
      "信頼感"
    ],
    "productTags": [
      "教育",
      "オンライン講座"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://ai-income-course.vercel.app",
    "thumbnail": "assets/thumbnails/ai-income-course.jpg"
  },
  {
    "slug": "wheelbase-cycle-app-lp",
    "type": "lp",
    "title": "ホイールベース公式アプリ紹介LP",
    "heading": "ホイールベースが 公式アプリで もっと身近に!!",
    "category": "自転車・モビリティ",
    "moodTags": [
      "ポップ",
      "カッコイイ"
    ],
    "productTags": [
      "モビリティ",
      "自転車"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://wheelbase-cycle-app-lp.vercel.app",
    "thumbnail": "assets/thumbnails/wheelbase-cycle-app-lp.jpg"
  },
  {
    "slug": "awavie-carbonated-skincare-lp",
    "type": "lp",
    "title": "AWAVIE 微炭酸うるおい発想スキンケアLP",
    "heading": "肌の奥まで、はじける潤い。",
    "category": "美容・コスメ",
    "moodTags": [
      "ナチュラル",
      "上品"
    ],
    "productTags": [
      "美容",
      "スキンケア",
      "コスメ"
    ],
    "featureTags": [
      "ハンバーガーメニュー",
      "固定ヘッダー",
      "アニメーション",
      "レスポンシブ"
    ],
    "linkType": "external",
    "url": "https://awavie-carbonated-skincare-lp.vercel.app",
    "thumbnail": "assets/thumbnails/awavie-carbonated-skincare-lp.jpg"
  },
  {
    "slug": "flexa-warehouse-lp",
    "type": "lp",
    "title": "FLEXA システム建築・倉庫建築LP",
    "heading": "つくる自由が、ひろがる。フレキシブルな倉庫建築。",
    "category": "建築・システム建築",
    "moodTags": [
      "信頼感",
      "カッコイイ"
    ],
    "productTags": [
      "建築",
      "倉庫建築",
      "BtoB"
    ],
    "featureTags": [
      "ハンバーガーメニュー",
      "固定ヘッダー",
      "アニメーション",
      "カルーセル",
      "アコーディオン",
      "レスポンシブ"
    ],
    "linkType": "external",
    "url": "https://flexa-warehouse-lp.vercel.app",
    "thumbnail": "assets/thumbnails/flexa-warehouse-lp.jpg"
  },
  {
    "slug": "usubeni-pink-plum-liqueur-lp",
    "type": "lp",
    "title": "薄紅 -usubeni- プレミアムピンク梅酒セットLP",
    "heading": "まとうのは、透きとおる紅色。",
    "category": "食品・EC",
    "moodTags": [
      "上品",
      "ロマンティック"
    ],
    "productTags": [
      "食品",
      "梅酒"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://usubeni-pink-plum-liqueur-lp.vercel.app",
    "thumbnail": "assets/thumbnails/usubeni-pink-plum-liqueur-lp.jpg"
  },
  {
    "slug": "belle-rouge-lip-cheek-lp",
    "type": "moving-lp",
    "title": "BELLE ROUGE 彩香リップ&チーク LP",
    "heading": "唇に、灯れ。女性の色香",
    "category": "美容・コスメ",
    "moodTags": [
      "上品",
      "ロマンティック"
    ],
    "productTags": [
      "美容",
      "コスメ",
      "リップ"
    ],
    "featureTags": [
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://belle-rouge-lip-cheek-lp.vercel.app",
    "thumbnail": "assets/thumbnails/belle-rouge-lip-cheek-lp.jpg"
  },
  {
    "slug": "agrume-citrus-cleansing-lp",
    "type": "lp",
    "title": "AGRUME サニーピール デュオ シトラス洗顔料LP",
    "heading": "泡ごと、シトラスに満ちる。",
    "category": "美容・コスメ",
    "moodTags": [
      "ポップ",
      "ナチュラル"
    ],
    "productTags": [
      "美容",
      "スキンケア",
      "洗顔料"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://agrume-citrus-cleansing-lp.vercel.app",
    "thumbnail": "assets/thumbnails/agrume-citrus-cleansing-lp.jpg"
  },
  {
    "slug": "tsunagu-logistics-site",
    "type": "hp",
    "title": "TSUNAGU LOGISTICS（ツナグ物流株式会社）コーポレートサイト",
    "heading": "運ぶ、その先へ。",
    "category": "物流・運輸",
    "moodTags": [
      "信頼感",
      "ナチュラル"
    ],
    "productTags": [
      "物流",
      "運輸",
      "配送"
    ],
    "featureTags": [
      "アニメーション",
      "ハンバーガーメニュー",
      "固定ヘッダー",
      "レスポンシブ"
    ],
    "linkType": "external",
    "url": "https://tsunagu-logistics-site.vercel.app",
    "thumbnail": "assets/thumbnails/tsunagu-logistics-site.jpg"
  },
  {
    "slug": "reve-cerisier-beaute-summer-lp",
    "type": "lp",
    "title": "BEAUTE Rêve Cerisier 2026 summer 特別号",
    "heading": "間に合う脱毛で、夏をもっと快適＆美しく",
    "category": "美容・サロン",
    "moodTags": [
      "南国リゾート",
      "ポップ"
    ],
    "productTags": [
      "美容",
      "サロン",
      "脱毛"
    ],
    "featureTags": [
      "キャンペーン訴求"
    ],
    "linkType": "external",
    "url": "https://reve-cerisier-beaute-summer-lp.vercel.app",
    "thumbnail": "assets/thumbnails/reve-cerisier-beaute-summer-lp.jpg"
  },
  {
    "slug": "nobiru-consulting-swipe-lp",
    "type": "swipe-lp",
    "title": "NOBIRU CONSULTING 中小企業経営コンサルティング スワイプ型LP",
    "heading": "その経営課題、まるごと解決。",
    "category": "BtoB・コーポレート",
    "moodTags": [
      "信頼感",
      "クール"
    ],
    "productTags": [
      "コンサルティング",
      "経営支援",
      "BtoB"
    ],
    "featureTags": [
      "カルーセル",
      "スワイプ"
    ],
    "linkType": "external",
    "url": "https://nobiru-consulting-swipe-lp.vercel.app",
    "thumbnail": "assets/thumbnails/nobiru-consulting-swipe-lp.jpg"
  },
  {
    "slug": "lumiere-nail-atelier-swipe-lp",
    "type": "swipe-lp",
    "title": "Lumière Nail Atelier プライベートネイルサロン スワイプ型LP",
    "heading": "指先にまとう、上質な物語。",
    "category": "美容・サロン",
    "moodTags": [
      "上品",
      "ラグジュアリー"
    ],
    "productTags": [
      "美容",
      "ネイルサロン"
    ],
    "featureTags": [
      "カルーセル",
      "スワイプ"
    ],
    "linkType": "external",
    "url": "https://lumiere-nail-atelier-swipe-lp.vercel.app",
    "thumbnail": "assets/thumbnails/lumiere-nail-atelier-swipe-lp.jpg"
  },
  {
    "slug": "fruitein-banner-taste",
    "type": "banner",
    "title": "FRUITEIN ホエイプロテイン 白桃風味 広告バナー（味訴求）",
    "heading": "甘すぎました。",
    "category": "健康食品・サプリ",
    "moodTags": [
      "ポップ",
      "ナチュラル"
    ],
    "productTags": [
      "健康食品",
      "プロテイン"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/fruitein-banner-taste.png",
    "thumbnail": "assets/thumbnails/fruitein-banner-taste.jpg"
  },
  {
    "slug": "fruitein-banner-price",
    "type": "banner",
    "title": "FRUITEIN ホエイプロテイン 白桃風味 広告バナー（価格訴求）",
    "heading": "安すぎました。",
    "category": "健康食品・サプリ",
    "moodTags": [
      "ポップ",
      "ナチュラル"
    ],
    "productTags": [
      "健康食品",
      "プロテイン"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/fruitein-banner-price.png",
    "thumbnail": "assets/thumbnails/fruitein-banner-price.jpg"
  },
  {
    "slug": "fruitein-banner-trust",
    "type": "banner",
    "title": "FRUITEIN ホエイプロテイン 白桃風味 広告バナー（信頼・実績訴求）",
    "heading": "売れすぎました。",
    "category": "健康食品・サプリ",
    "moodTags": [
      "ポップ",
      "ナチュラル"
    ],
    "productTags": [
      "健康食品",
      "プロテイン"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/fruitein-banner-trust.png",
    "thumbnail": "assets/thumbnails/fruitein-banner-trust.jpg"
  },
  {
    "slug": "compass-consulting-school-lp",
    "type": "lp",
    "title": "COMPASS 超実践型コンサルタント養成スクール LP",
    "heading": "その経験を、価値に変える。その一歩、COMPASSで。",
    "category": "教育・スクール",
    "moodTags": [
      "信頼感",
      "ポップ"
    ],
    "productTags": [
      "教育",
      "スクール",
      "コンサルティング"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://utage-system.com/p/714WtLeEZYXJ",
    "thumbnail": "assets/thumbnails/compass-consulting-school-lp.jpg"
  },
  {
    "slug": "keishou-tax-swipe-lp",
    "type": "swipe-lp",
    "title": "継承パートナーズ会計事務所",
    "heading": "その相続・事業承継、後回しにしていませんか？",
    "category": "BtoB・コーポレート",
    "moodTags": [
      "信頼感",
      "誠実"
    ],
    "productTags": [
      "税理士",
      "相続",
      "事業承継",
      "士業"
    ],
    "featureTags": [
      "カルーセル",
      "スワイプ"
    ],
    "linkType": "external",
    "url": "https://keishou-tax-swipe-lp.vercel.app",
    "thumbnail": "assets/thumbnails/keishou-tax-swipe-lp.jpg"
  },
  {
    "slug": "emberwood-glamping-swipe-lp",
    "type": "swipe-lp",
    "title": "EMBERWOOD GLAMPING 森のグランピングリゾート スワイプ型LP",
    "heading": "灯りに、還る場所。",
    "category": "旅行・宿泊",
    "moodTags": [
      "温かみ",
      "癒し"
    ],
    "productTags": [
      "グランピング",
      "宿泊予約"
    ],
    "featureTags": [
      "カルーセル",
      "スワイプ"
    ],
    "linkType": "external",
    "url": "https://emberwood-glamping-swipe-lp.vercel.app",
    "thumbnail": "assets/thumbnails/emberwood-glamping-swipe-lp.jpg"
  }
];
