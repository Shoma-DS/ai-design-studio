// HPポートフォリオギャラリーのデータ（オフラインフォールバック用）。
// 正本はNeon Postgres（websitesテーブル）。通常はgallery-hp/scripts/add-website.mjsで
// DBに登録し、/api/websites経由でサイトに反映される。このファイルはDB取得失敗時の
// フォールバックとしてのみ使われる。
//
// タグの分類:
// - moodTags: 雰囲気で探す（デザインの印象。カッコイイ/可愛い/上品 など）
// - productTags: 商品で探す（業種・商材のジャンル）
// - featureTags: 機能で探す（HPに実装されている技術的なUI機能。アニメーション/レスポンシブ/カルーセル/
//   アコーディオン/ハンバーガーメニュー/固定ヘッダーなど）
window.HP_GALLERY_DATA = [
  {
    slug: "tsunagu-logistics-site",
    title: "TSUNAGU LOGISTICS（ツナグ物流株式会社）コーポレートサイト",
    heading: "運ぶ、その先へ。",
    category: "物流・運輸",
    moodTags: ["信頼感", "ナチュラル"],
    productTags: ["物流", "運輸", "配送"],
    featureTags: ["アニメーション", "ハンバーガーメニュー", "固定ヘッダー", "レスポンシブ"],
    url: "https://tsunagu-logistics-site.vercel.app",
    thumbnail: "assets/thumbnails/tsunagu-logistics-site.jpg"
  }
];
