# 画像生成プロンプト

## nanobanana pro形式

あなたは【トップクラスのインフォグラフィックデザイナー兼グラフィックレコーダー】です。
目的：架空の濃密保湿ジェルを訴求するWeb広告バナーの、文字を除いた写真素材を生成する
────────────────
【入力】
@img（参考画像）

【最重要ルール】
・@img の構造・雰囲気・視線誘導・余白感・被写体サイズ・写真の距離感のみ抽出する
・コピー／トレース／商標再現は禁止
・文字、ロゴ、記号、疑似文字は一切生成しない
・背景、商品、柔らかな光だけを生成する

【構図】
444:373の横長比率。開封した低い丸型ジェル容器を左下に置き、左端と下端で大胆にトリミング。商品は画面幅の約52%、高さの約55%。やや上からの近接商品撮影。中央上と右半分は後から文字を置くため広く空ける。
視線誘導：左下の透明ジェルの艶から、空白の中央上、右側へ自然に抜ける

【タイトル】
メイン：「後から配置するため生成しない」
サブ：「後から配置するため生成しない」

【各セクションのコピー・内容】
文字要素は生成しない。架空商品の容器にも読めるラベルを入れない。

【色・雰囲気ルール】
白〜ごく淡いミントグリーン。背景は高明度・低コントラスト。ジェルは透明感のある淡いミント。明るい拡散光で、清涼感、うるおい、親しみを表現する。

【デザイン】
日本のドラッグストア系スキンケア広告に合う、清潔で柔らかくレタッチされた商品写真。高級すぎず、分かりやすく爽やか。

【出力条件】
・文字、ロゴ、商標、透かしなし
・人物、手、植物、追加商品、水しぶき、円、リボン、罫線、矢印なし
・後から文字を載せられる均一で明るい余白を確保
・主役は商品容器ひとつだけ

【最終目的】
見た瞬間にこう思わせる：みずみずしく、軽やかなのにしっかり保湿してくれそう

## 実生成プロンプト

Use case: ads-marketing
Asset type: Japanese web advertising banner background, 444:373 landscape ratio
Primary request: Create a text-free base visual for a fictional moisturizing gel banner. Use the attached image only as a composition, spacing, subject scale, camera distance, lighting, and visual-flow reference; do not copy any brand, logo, text, trade dress, or exact product design.
Scene/backdrop: clean white background fading into extremely pale mint green near the bottom, airy high-key studio look, generous empty space across the upper center and entire right half for later typography.
Subject: one open, low round translucent frosted cosmetic jar containing clear pale mint gel with a soft glossy swirl peak. Place it in the lower-left quadrant, partially cropped by the left and bottom edges, occupying approximately 52% of the canvas width and 55% of the canvas height.
Style/medium: clean Japanese drugstore skincare product photography, realistic but softly retouched.
Composition/framing: match the reference's negative-space balance closely; product anchored lower-left; open blank area above it for a circular badge; broad blank right side for large headline; no other objects.
Lighting/mood: bright diffused studio lighting from upper left, fresh cooling hydration, friendly and accessible rather than luxury.
Text: none.
Avoid: all text, letters, pseudo-text, logos, trademarks, badges, circles, ribbons, arrows, borders, CTA buttons, extra products, aloe leaves, flowers, hands, people, water splashes, dense decoration, watermark.
