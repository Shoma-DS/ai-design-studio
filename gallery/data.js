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
// author: 制作者（登録時のgit user.name。誰が作った作品かを表す。未記録はnull）
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
    "thumbnail": "assets/thumbnails/ashita-town-sdgs-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/astella-vxr-suv-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/beauty-salon-c3-inspired-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/career-bridge-job-support-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/kurabiyori-miso-shop-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/protoskill-webdesign-school-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/rosier-beauty-petal-mood-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/stellant-fortune-rental-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/sunshine-berry-uv-care-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/tomoni-data-service-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/verdia-aging-care-hair-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/ai-income-course.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/wheelbase-cycle-app-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/awavie-carbonated-skincare-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/flexa-warehouse-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/usubeni-pink-plum-liqueur-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/belle-rouge-lip-cheek-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/agrume-citrus-cleansing-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/tsunagu-logistics-site.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/reve-cerisier-beaute-summer-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/nobiru-consulting-swipe-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/lumiere-nail-atelier-swipe-lp.jpg",
    "author": "rina"
  },
  {
    "slug": "compass-consulting-school-lp",
    "type": "lp",
    "title": "AI漫画クリエイター アフィリエイトLP（A案）",
    "heading": "絵心ゼロでOK、スマホだけでOK！30秒で売れるAI漫画が作れる",
    "category": "IT・ツール",
    "moodTags": [
      "ポップ",
      "カッコイイ"
    ],
    "productTags": [
      "IT",
      "AI",
      "アフィリエイト"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://best.kigyouka-best-members.com/page/GOzx4btSZzap?v=a",
    "thumbnail": "assets/thumbnails/ai-manga-creator-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/keishou-tax-swipe-lp.jpg",
    "author": "rina"
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
    "thumbnail": "assets/thumbnails/emberwood-glamping-swipe-lp.jpg",
    "author": "rina"
  },
  {
    "slug": "goodone-corporate-site",
    "type": "hp",
    "title": "GOOD ONE（株式会社グッドワン）コーポレートサイト",
    "heading": "エンジンの奥まで、確かなクリーンを。",
    "category": "自動車メンテナンス・輸入代理店",
    "moodTags": [
      "信頼感",
      "クリーン"
    ],
    "productTags": [
      "自動車",
      "メンテナンス",
      "コーポレートサイト"
    ],
    "featureTags": [
      "アニメーション",
      "ハンバーガーメニュー",
      "固定ヘッダー",
      "レスポンシブ",
      "下層ページ"
    ],
    "linkType": "external",
    "url": "https://goodone-corporate-site.vercel.app",
    "thumbnail": "assets/thumbnails/goodone-corporate-site.jpg",
    "author": "tsukino ayaka"
  },
  {
    "slug": "mizuha-lab-moisture-gel-banner",
    "type": "banner",
    "title": "MIZUHA LAB 濃密保湿ジェル 広告バナー（保湿訴求）",
    "heading": "緊急保湿！ 濃密保湿ジェル",
    "category": "美容・コスメ",
    "moodTags": [
      "ナチュラル"
    ],
    "productTags": [
      "美容",
      "スキンケア"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/mizuha-lab-moisture-gel-banner.png",
    "thumbnail": "assets/thumbnails/mizuha-lab-moisture-gel-banner.jpg",
    "author": "rina"
  },
  {
    "slug": "ai-manga-creator-lp-b",
    "type": "lp",
    "title": "AI漫画クリエイター アフィリエイトLP（B案）",
    "heading": "絵心ゼロ・スマホだけで30秒、漫画づくりならAI漫画クリエイターにお任せください！",
    "category": "IT・ツール",
    "moodTags": [
      "ポップ",
      "カッコイイ"
    ],
    "productTags": [
      "IT",
      "AI",
      "アフィリエイト"
    ],
    "featureTags": [],
    "linkType": "external",
    "url": "https://best.kigyouka-best-members.com/page/qXOTp9mifwDG?v=b",
    "thumbnail": "assets/thumbnails/ai-manga-creator-lp-b.jpg",
    "author": "rina"
  },
  {
    "slug": "todomatsu-recruit",
    "type": "hp",
    "title": "株式会社トドマツ 新卒採用サイト",
    "heading": "根を張り、育っていく。",
    "category": "小売・スーパーマーケット",
    "moodTags": [
      "信頼感",
      "温かみ",
      "誠実"
    ],
    "productTags": [
      "新卒採用",
      "スーパーマーケット",
      "小売"
    ],
    "featureTags": [
      "アニメーション",
      "ハンバーガーメニュー",
      "複数ページ"
    ],
    "linkType": "external",
    "url": "https://todomatsu-recruit.vercel.app",
    "thumbnail": "assets/thumbnails/todomatsu-recruit.jpg",
    "author": "rina"
  },
  {
    "slug": "ai-movie-campus-inspired-lp",
    "type": "lp",
    "title": "AIムービーキャンパス｜未経験から90日でAI動画クリエイターを目指すオンライン講座 LP",
    "heading": "たった90日で、「AI動画」を仕事にする。",
    "category": "教育・スクール",
    "moodTags": [
      "信頼感",
      "ポップ"
    ],
    "productTags": [
      "教育",
      "スクール",
      "AI動画"
    ],
    "featureTags": [
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://ai-movie-campus-inspired-lp.vercel.app",
    "thumbnail": "assets/thumbnails/ai-movie-campus-inspired-lp.jpg",
    "author": "rina"
  },
  {
    "slug": "hikari-fit-gym-banner-practice",
    "type": "banner",
    "title": "ヒカリフィット 女性専用スポーツジム 広告バナー（練習作）",
    "heading": "わたし史上、いちばん通いやすいジム",
    "category": "スポーツ・フィットネス",
    "moodTags": [
      "やさしい",
      "見やすい"
    ],
    "productTags": [
      "フィットネス",
      "女性専用ジム"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/hikari-fit-gym-banner-practice.png",
    "thumbnail": "assets/thumbnails/hikari-fit-gym-banner-practice.jpg",
    "author": "rina"
  },
  {
    "slug": "hakosumu-rental-banner-practice",
    "type": "banner",
    "title": "HAKOSUMU 賃貸不動産 広告バナー（練習作）",
    "heading": "初期費用0円で、はじめての一人暮らし",
    "category": "不動産・賃貸",
    "moodTags": [
      "見やすい",
      "信頼感"
    ],
    "productTags": [
      "不動産",
      "賃貸",
      "一人暮らし"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/hakosumu-rental-banner-practice.png",
    "thumbnail": "assets/thumbnails/hakosumu-rental-banner-practice.jpg",
    "author": "rina"
  },
  {
    "slug": "anniversa-bridal-banner-practice",
    "type": "banner",
    "title": "アニバーサ迎賓館 ブライダル 広告バナー（練習作）",
    "heading": "わたしたちらしい、一生の思い出を",
    "category": "ブライダル・結婚式場",
    "moodTags": [
      "上品",
      "ロマンティック"
    ],
    "productTags": [
      "ブライダル",
      "結婚式場"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/anniversa-bridal-banner-practice.png",
    "thumbnail": "assets/thumbnails/anniversa-bridal-banner-practice.jpg",
    "author": "rina"
  },
  {
    "slug": "mori-hitoyasumi-cafe-banner-practice",
    "type": "banner",
    "title": "森のひとやすみ珈琲 カフェ 広告バナー（練習作）",
    "heading": "とろけるほうじ茶ティラミス、今だけ。",
    "category": "飲食店・カフェ",
    "moodTags": [
      "やさしい",
      "ナチュラル"
    ],
    "productTags": [
      "カフェ",
      "スイーツ",
      "期間限定"
    ],
    "featureTags": [],
    "linkType": "image",
    "url": "assets/portfolio/banner/mori-hitoyasumi-cafe-banner-practice.png",
    "thumbnail": "assets/thumbnails/mori-hitoyasumi-cafe-banner-practice.jpg",
    "author": "rina"
  },
  {
    "slug": "reve-cerisire-9-1",
    "type": "lp",
    "title": "Reve cerisire9/1配信",
    "heading": "秋肌リセット",
    "category": "美容・サロン",
    "moodTags": [
      "上品",
      "可愛い",
      "ロマンティック"
    ],
    "productTags": [
      "美容",
      "サロン",
      "フェイシャル"
    ],
    "featureTags": [
      "アニメーション",
      "カルーセル",
      "固定CTA"
    ],
    "linkType": "external",
    "url": "https://reve-cerisire-9-1.vercel.app",
    "thumbnail": "https://reve-cerisire-9-1.vercel.app/assets/autumn-lead-poster.png",
    "author": "tsukino ayaka"
  },
  {
    "slug": "zaku-potato-lp",
    "type": "lp",
    "title": "ZAKU POTATO 厚切りポテトチップス LP",
    "heading": "ザクッと厚い。余韻まで、うまい。",
    "category": "食品・EC",
    "moodTags": [
      "ポップ",
      "カッコイイ"
    ],
    "productTags": [
      "食品",
      "スナック",
      "ポテトチップス"
    ],
    "featureTags": [
      "アニメーション",
      "レスポンシブ"
    ],
    "linkType": "external",
    "url": "https://zaku-potato-lp.vercel.app",
    "thumbnail": "https://zaku-potato-lp.vercel.app/images/hero.png",
    "author": "syuu0104"
  },
  {
    "slug": "workshift-lp",
    "type": "lp",
    "title": "WorkShift スキマバイト・仕事探しアプリ LP",
    "heading": "今日の時間を、いい仕事に。",
    "category": "人材・求人",
    "moodTags": [
      "ポップ",
      "信頼感"
    ],
    "productTags": [
      "人材",
      "求人",
      "仕事探しアプリ"
    ],
    "featureTags": [
      "アコーディオン",
      "固定ヘッダー",
      "レスポンシブ"
    ],
    "linkType": "external",
    "url": "https://workshift-lp.vercel.app",
    "thumbnail": "https://workshift-lp.vercel.app/images/work-scenes.png",
    "author": "syuu0104"
  },
  {
    "slug": "clarive-womens-personal-gym-lp",
    "type": "lp",
    "title": "CLARIVE｜渋谷の女性専用パーソナルジム",
    "heading": "会食を断らずに、2ヶ月 −7kg。",
    "category": "美容・サロン",
    "moodTags": [
      "上品",
      "信頼感",
      "ナチュラル"
    ],
    "productTags": [
      "ジム",
      "ダイエット",
      "美容"
    ],
    "featureTags": [
      "アニメーション",
      "レスポンシブ",
      "固定ヘッダー",
      "ハンバーガーメニュー",
      "カルーセル",
      "アコーディオン",
      "固定CTA",
      "ビフォーアフター比較",
      "背景動画"
    ],
    "linkType": "external",
    "url": "https://clarive-womens-personal-gym-lp.vercel.app",
    "thumbnail": "assets/thumbnails/clarive-womens-personal-gym-lp.jpg",
    "author": "rina"
  },
  {
    "slug": "crunchy-pop-ice-sand-lp",
    "type": "lp",
    "title": "CRUNCHY POP チョコクランチアイスサンドLP",
    "heading": "ザクッと、ひんやり。気分まで弾ける。",
    "category": "食品・EC",
    "moodTags": [
      "ポップ",
      "カラフル"
    ],
    "productTags": [
      "食品",
      "アイス",
      "お菓子"
    ],
    "featureTags": [
      "レスポンシブ",
      "CTAボタン"
    ],
    "linkType": "external",
    "url": "https://crunchy-pop-ice-sand-lp.vercel.app",
    "thumbnail": "assets/thumbnails/crunchy-pop-ice-sand-lp.jpg",
    "author": "saruga"
  },
  {
    "slug": "morning-bloom-call-lp",
    "type": "lp",
    "title": "MORNING BLOOM ボイスギフトLP",
    "heading": "明日の朝を、少し楽しみに。",
    "category": "食品・飲料",
    "moodTags": [
      "爽やか",
      "ナチュラル"
    ],
    "productTags": [
      "飲料",
      "キャンペーン"
    ],
    "featureTags": [
      "レスポンシブ",
      "アコーディオン"
    ],
    "linkType": "external",
    "url": "https://morning-bloom-call-lp.vercel.app",
    "thumbnail": "assets/thumbnails/morning-bloom-call-lp.jpg",
    "author": "saruga"
  },
  {
    "slug": "night-roast-reward-lp",
    "type": "lp",
    "title": "NIGHT ROAST ポイントキャンペーンLP",
    "heading": "夜を味方に。500名に、小さなご褒美。",
    "category": "食品・飲料",
    "moodTags": [
      "カッコイイ",
      "上品"
    ],
    "productTags": [
      "飲料",
      "コーヒー",
      "キャンペーン"
    ],
    "featureTags": [
      "レスポンシブ",
      "アコーディオン",
      "アニメーション"
    ],
    "linkType": "external",
    "url": "https://night-roast-reward-lp.vercel.app",
    "thumbnail": "assets/thumbnails/night-roast-reward-lp.jpg",
    "author": "saruga"
  },
  {
    "slug": "sumikei-water-lp",
    "type": "lp",
    "title": "澄景水",
    "heading": "山の時間を、そのまま一滴に。",
    "category": "飲料・食品",
    "moodTags": [
      "爽やか",
      "ナチュラル"
    ],
    "productTags": [
      "天然水",
      "飲料"
    ],
    "featureTags": [
      "レスポンシブ",
      "ボタン実装"
    ],
    "linkType": "external",
    "url": "https://sumikei-water-lp.vercel.app",
    "thumbnail": "assets/thumbnails/sumikei-water-lp.jpg",
    "author": "saruga"
  }
];
