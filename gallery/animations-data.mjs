export const animations = [
  {
    slug: "title-fade-up-blur",
    name: "見出しフェードアップ(ぼかし)",
    category: "title",
    description: "見出しが下から浮かび上がりながら、ぼかしが晴れて表示される。上品で落ち着いた第一印象を作る。",
    cssCode: `.fade-up-blur {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(6px);
  animation: fadeUpBlur 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUpBlur {
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}`,
    htmlSnippet: `<h1 class="fade-up-blur">Sample</h1>`,
    jsCode: null,
    tags: ["title", "hero", "fade", "blur", "上品", "美容"],
    useCase: "LPファーストビューの見出し、HPのヒーロータイトル",
    moodTags: ["オシャレ", "見やすい"]
  },
  {
    slug: "title-char-stagger",
    name: "見出し1文字ずつ表示",
    category: "title",
    description: "見出しの文字が1文字ずつ時間差でふわっと現れる。キャッチコピーを印象づけたい時に。",
    cssCode: `.char-stagger span {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.4em);
  animation: charIn 0.6s ease forwards;
}
@keyframes charIn {
  to { opacity: 1; transform: translateY(0); }
}`,
    htmlSnippet: `<h2 class="char-stagger" data-text="Sample"></h2>`,
    jsCode: `function staggerText(el) {
  const text = el.dataset.text || el.textContent;
  el.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\\u00A0" : ch;
    span.style.animationDelay = \`\${i * 0.05}s\`;
    el.appendChild(span);
  });
}
document.querySelectorAll(".char-stagger").forEach(staggerText);`,
    tags: ["title", "text", "stagger", "キャッチコピー"],
    useCase: "キャッチコピーの強調演出",
    moodTags: ["ポップ", "見やすい"]
  },
  {
    slug: "gradient-text-shimmer",
    name: "グラデーション文字シマー",
    category: "title",
    description: "見出し文字にグラデーションが左右に流れ、光沢のあるテキストに見せる。高級感の演出に。",
    cssCode: `.gradient-shimmer {
  background: linear-gradient(90deg, #b08d57, #f5e6c8, #b08d57);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer {
  to { background-position: -200% center; }
}`,
    htmlSnippet: `<span class="gradient-shimmer">Sample</span>`,
    jsCode: null,
    tags: ["title", "gradient", "gold", "高級感", "美容", "ネイル"],
    useCase: "高級感・美容系LPのロゴやキャッチコピー",
    moodTags: ["オシャレ", "派手"]
  },
  {
    slug: "typewriter",
    name: "タイプライター表示",
    category: "title",
    description: "文字が左から順にタイプされるように表示され、カーソルが点滅する。width/stepsの数値は表示する文字数に合わせて調整する。",
    cssCode: `.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 6ch; /* 文字数に応じて調整 */
  border-right: 2px solid currentColor;
  animation: typing 2.5s steps(6, end), blink 0.75s step-end infinite;
}
@keyframes typing {
  from { width: 0; }
  to { width: 6ch; }
}
@keyframes blink { 50% { border-color: transparent; } }`,
    htmlSnippet: `<span class="typewriter">Sample</span>`,
    jsCode: null,
    tags: ["title", "typewriter", "キャッチコピー"],
    useCase: "サービス紹介の一言キャッチコピー",
    moodTags: ["シンプル"]
  },
  {
    slug: "underline-grow",
    name: "下線が伸びる強調",
    category: "title",
    description: "見出しやキーワードの下線が左から右へ伸びて表示され、視線を誘導する。",
    cssCode: `.underline-grow {
  position: relative;
  display: inline-block;
}
.underline-grow::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  animation: growLine 0.8s ease forwards 0.3s;
}
@keyframes growLine { to { transform: scaleX(1); } }`,
    htmlSnippet: `<span class="underline-grow">Sample</span>`,
    jsCode: null,
    tags: ["title", "underline", "強調"],
    useCase: "キーワードの強調、見出しの装飾",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "scroll-fade-up",
    name: "スクロールで下から表示",
    category: "scroll",
    description: "要素が画面内に入ったタイミングで下からふわっと表示される、最も汎用的なセクション登場演出。",
    cssCode: `.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}`,
    htmlSnippet: `<div class="reveal">Sample</div>`,
    jsCode: `const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));`,
    tags: ["scroll", "reveal", "fade", "汎用"],
    useCase: "LP各セクションの登場演出(全カテゴリ共通で使える)",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "button-shine-sweep",
    name: "ボタン光沢スイープ",
    category: "button",
    description: "ボタンにカーソルを乗せると、光の帯が斜めに通過するホバー演出。",
    cssCode: `.btn-shine {
  position: relative;
  overflow: hidden;
}
.btn-shine::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}
.btn-shine:hover::before { left: 125%; }`,
    htmlSnippet: `<button class="btn-shine">Sample</button>`,
    jsCode: null,
    tags: ["button", "hover", "shine", "cta"],
    useCase: "CTAボタンのホバー演出",
    moodTags: ["派手", "オシャレ"]
  },
  {
    slug: "pulse-cta",
    name: "CTAボタンの脈動",
    category: "button",
    description: "CTAボタンが呼吸するようにゆっくり拡大縮小を繰り返し、自然に目線を誘導する。",
    cssCode: `.pulse-cta {
  animation: pulseCta 2s ease-in-out infinite;
}
@keyframes pulseCta {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(200, 150, 80, 0.5);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 0 10px rgba(200, 150, 80, 0);
  }
}`,
    htmlSnippet: `<button class="pulse-cta">Sample</button>`,
    jsCode: null,
    tags: ["button", "pulse", "cta", "予約", "購入"],
    useCase: "予約・購入ボタンなど最重要CTA",
    moodTags: ["派手", "見やすい"]
  },
  {
    slug: "image-hover-zoom",
    name: "画像ホバーズーム",
    category: "image",
    description: "画像にマウスを乗せるとゆっくり拡大表示される。カード型のギャラリーや商品一覧に。",
    cssCode: `.hover-zoom {
  overflow: hidden;
}
.hover-zoom img {
  display: block;
  width: 100%;
  transition: transform 0.6s ease;
}
.hover-zoom:hover img {
  transform: scale(1.08);
}`,
    htmlSnippet: `<div class="hover-zoom"><img src="https://picsum.photos/seed/sample/400/300" alt="Sample"></div>`,
    jsCode: null,
    tags: ["image", "hover", "zoom", "gallery", "商品"],
    useCase: "ギャラリー・商品画像カードのホバー演出",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "count-up-number",
    name: "数字カウントアップ",
    category: "number",
    description: "数字が0から目標値まで一気にカウントアップする。実績や満足度の表示に説得力を出す。",
    cssCode: `/* CSSのみでは実現不可。JSで textContent を書き換える */`,
    htmlSnippet: `<span class="count-up" data-target="1000">0</span>`,
    jsCode: `function countUp(el, duration = 1500) {
  const target = Number(el.dataset.target);
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll(".count-up").forEach((el) => countUp(el));`,
    tags: ["number", "count-up", "実績", "満足度"],
    useCase: "「導入実績1000件」「満足度98%」などの実績訴求",
    moodTags: ["見やすい", "シンプル"]
  },
  {
    slug: "parallax-bg",
    name: "パララックス背景",
    category: "background",
    description: "背景画像がスクロール速度と異なる速度で動き、奥行きを演出する。CTA・予約導線セクション向け。",
    cssCode: `.parallax-section {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}
/* iOS Safariはbackground-attachment:fixedが効きにくいため、
   モバイルはJSでtransformを使ったフォールバックを推奨 */`,
    htmlSnippet: `<section class="parallax-section" style="background-image:url('https://picsum.photos/seed/parallax/800/600')">Sample</section>`,
    jsCode: null,
    tags: ["background", "parallax", "cta", "問い合わせ", "予約"],
    useCase: "CTA(問い合わせ・予約誘導)セクションの背景演出",
    moodTags: ["オシャレ"]
  },
  {
    slug: "marquee-loop",
    name: "ロゴ無限マーキー",
    category: "装飾",
    description: "導入企業ロゴやメディア掲載バッジが横方向に途切れなく無限スクロールする。",
    cssCode: `.marquee {
  overflow: hidden;
  white-space: nowrap;
}
.marquee__track {
  display: inline-flex;
  gap: 48px;
  animation: marqueeScroll 20s linear infinite;
}
.marquee__track span {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  color: #888;
}
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`,
    htmlSnippet: `<div class="marquee"><div class="marquee__track">
  <span>Sample</span><span>Sample</span><span>Sample</span><span>Sample</span>
  <span>Sample</span><span>Sample</span><span>Sample</span><span>Sample</span>
</div></div>`,
    jsCode: null,
    tags: ["marquee", "logo", "導入実績", "メディア掲載"],
    useCase: "導入企業ロゴ・メディア掲載バッジの帯(spanの中身を実際のロゴ画像に差し替えて使う)",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "title-glow-illumination",
    name: "文字が光り輝くイルミネーション",
    category: "title",
    description: "文字がぼんやりと光り輝くグロー演出。プロダクト系LPで見かける高級感のある光の表現。",
    cssCode: `.glow-illumination {
  color: #fff;
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.6),
    0 0 24px rgba(160, 200, 255, 0.5),
    0 0 48px rgba(120, 170, 255, 0.4);
  animation: glowPulse 3s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 0 24px rgba(160, 200, 255, 0.4), 0 0 48px rgba(120, 170, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.8), 0 0 32px rgba(160, 200, 255, 0.6), 0 0 64px rgba(120, 170, 255, 0.5);
  }
}`,
    htmlSnippet: `<h1 class="glow-illumination" style="background:#0a0a12;padding:16px;">Sample</h1>`,
    jsCode: null,
    tags: ["title", "glow", "光", "高級感", "テキスト効果"],
    useCase: "暗い背景のプロダクト・ハイテク系LPの見出し",
    moodTags: ["派手", "オシャレ"]
  },
  {
    slug: "title-aurora-gradient",
    name: "オーロラ風グラデーション文字",
    category: "title",
    description: "オーロラのように複数色のグラデーションがゆらめきながら流れる、幻想的な文字演出。",
    cssCode: `.aurora-text {
  background: linear-gradient(120deg, #7f5af0, #2cb67d, #ff8906, #7f5af0);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: auroraFlow 6s ease infinite;
}
@keyframes auroraFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
    htmlSnippet: `<h2 class="aurora-text">Sample</h2>`,
    jsCode: null,
    tags: ["title", "gradient", "aurora", "幻想的", "テキスト効果"],
    useCase: "世界観訴求・ブランディング系LPの見出し",
    moodTags: ["派手", "オシャレ"]
  },
  {
    slug: "title-neon-glow",
    name: "ネオンサイン風点滅テキスト",
    category: "title",
    description: "ネオンサインのようにチカチカと点滅しながら光るテキスト。夜・エンタメ・美容系の演出に。",
    cssCode: `.neon-text {
  color: #fff;
  background: #1a1a1a;
  padding: 8px 16px;
  text-shadow:
    0 0 4px #fff,
    0 0 10px #ff2ee6,
    0 0 20px #ff2ee6,
    0 0 40px #ff2ee6;
  animation: neonFlicker 2.5s infinite alternate;
}
@keyframes neonFlicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 0 0 4px #fff, 0 0 10px #ff2ee6, 0 0 20px #ff2ee6, 0 0 40px #ff2ee6;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}`,
    htmlSnippet: `<span class="neon-text">Sample</span>`,
    jsCode: null,
    tags: ["title", "neon", "点滅", "夜", "エンタメ", "テキスト効果"],
    useCase: "夜・エンタメ・ナイトサロン系LPの見出し",
    moodTags: ["派手", "ポップ"]
  },
  {
    slug: "title-wave-shimmer",
    name: "波打ちながら光る文字",
    category: "title",
    description: "文字がゆらゆらと波打つように上下しながら、光沢がきらりと流れる演出。1文字ずつspanで囲んで使う。",
    cssCode: `.wave-shimmer span {
  display: inline-block;
  animation: waveMotion 2.4s ease-in-out infinite;
  background: linear-gradient(90deg, #1a1a1a 40%, #fff 50%, #1a1a1a 60%);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
@keyframes waveMotion {
  0%, 100% { transform: translateY(0); background-position: 0% 0; }
  50% { transform: translateY(-6px); background-position: -200% 0; }
}`,
    htmlSnippet: `<h2 class="wave-shimmer"><span style="animation-delay:0s">S</span><span style="animation-delay:0.1s">a</span><span style="animation-delay:0.2s">m</span><span style="animation-delay:0.3s">p</span><span style="animation-delay:0.4s">l</span><span style="animation-delay:0.5s">e</span></h2>`,
    jsCode: null,
    tags: ["title", "wave", "shimmer", "水", "美容", "テキスト効果"],
    useCase: "水・美容系LPのやわらかい見出し演出(title-char-staggerの文字分割JSと併用可)",
    moodTags: ["ポップ", "オシャレ"]
  },
  {
    slug: "text-highlighter-marker",
    name: "蛍光マーカー風ハイライト",
    category: "装飾",
    description: "蛍光マーカーで線を引いたようなハイライトが後から重なって表示される、実用的な強調表現。",
    cssCode: `.highlight-marker {
  position: relative;
  display: inline;
}
.highlight-marker::before {
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: 0.05em;
  height: 0.5em;
  background: #ffe066;
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
  animation: markerSweep 0.6s ease forwards 0.2s;
}
@keyframes markerSweep {
  to { transform: scaleX(1); }
}`,
    htmlSnippet: `<p>This is a <span class="highlight-marker">Sample</span> text.</p>`,
    jsCode: null,
    tags: ["highlight", "marker", "強調", "本文", "テキスト効果"],
    useCase: "本文中のキーワード強調、料金・実績数値の強調",
    moodTags: ["ポップ", "見やすい"]
  },
  {
    slug: "title-bouncing-letters",
    name: "文字が跳ねるバウンス演出",
    category: "title",
    description: "文字が1文字ずつ順番にポンポンと弾むように跳ねる、親しみやすいポップな演出。",
    cssCode: `.bounce-letters span {
  display: inline-block;
  animation: letterBounce 1.2s ease infinite;
}
@keyframes letterBounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
  50% { transform: translateY(0); }
}`,
    htmlSnippet: `<h2 class="bounce-letters"><span style="animation-delay:0s">S</span><span style="animation-delay:0.1s">a</span><span style="animation-delay:0.2s">m</span><span style="animation-delay:0.3s">p</span><span style="animation-delay:0.4s">l</span><span style="animation-delay:0.5s">e</span></h2>`,
    jsCode: `// title-char-stagger と同じ文字分割関数を使い、span.style.animationDelay を i * 0.1s ずつずらす`,
    tags: ["title", "bounce", "ポップ", "カジュアル", "テキスト効果"],
    useCase: "子供向け・カジュアル・キャンペーン系LPの見出し",
    moodTags: ["ポップ"]
  },
  {
    slug: "marquee-hover-slow",
    name: "ホバーで減速するロゴマーキー",
    category: "装飾",
    description: "ロゴやバッジが横に無限スクロールし、カーソルを乗せると滑らかに減速してじっくり見せられる。",
    cssCode: `.marquee-hover {
  overflow: hidden;
  white-space: nowrap;
}
.marquee-hover__track {
  display: inline-flex;
  gap: 48px;
  animation: marqueeScroll 20s linear infinite;
  transition: animation-duration 0.4s ease;
}
.marquee-hover:hover .marquee-hover__track {
  animation-duration: 60s;
}
.marquee-hover__track span {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  color: #888;
}
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`,
    htmlSnippet: `<div class="marquee-hover"><div class="marquee-hover__track">
  <span>Sample</span><span>Sample</span><span>Sample</span><span>Sample</span>
  <span>Sample</span><span>Sample</span><span>Sample</span><span>Sample</span>
</div></div>`,
    jsCode: null,
    tags: ["marquee", "logo", "hover", "導入実績", "メディア掲載"],
    useCase: "導入企業ロゴ・メディア掲載バッジ(ホバーでじっくり見せたい場合)、marquee-loopの発展形",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "text-block-reveal",
    name: "ブロックスイープ文字表示",
    category: "title",
    description: "色付きのバーが文字の上を左から右へ通過し、通過した瞬間にテキストが現れる上品な見出し表示。",
    cssCode: `.block-reveal-wrap {
  position: relative;
  display: inline-block;
  overflow: hidden;
}
.block-reveal-text {
  display: inline-block;
  opacity: 0;
  animation: revealTextShow 0.1s linear forwards 0.6s;
}
.block-reveal-bar {
  position: absolute;
  inset: 0;
  background: #1a1a1a;
  animation: revealBarSweep 1s cubic-bezier(0.77, 0, 0.18, 1) forwards;
}
@keyframes revealBarSweep {
  0% { transform: scaleX(0); transform-origin: left; }
  50% { transform: scaleX(1); transform-origin: left; }
  51% { transform-origin: right; }
  100% { transform: scaleX(0); transform-origin: right; }
}
@keyframes revealTextShow {
  to { opacity: 1; }
}`,
    htmlSnippet: `<span class="block-reveal-wrap"><span class="block-reveal-text">Sample</span><span class="block-reveal-bar"></span></span>`,
    jsCode: null,
    tags: ["title", "reveal", "block", "上品", "テキスト効果"],
    useCase: "ブランド系LP・HPの上品な見出し登場演出",
    moodTags: ["オシャレ", "見やすい"]
  },
  {
    slug: "text-reveal-conic-gradient",
    name: "扇状に浮かび上がる文字表示",
    category: "title",
    description: "conic-gradientを使い、文字が扇状にぼんやりと浮かび上がるように表示される。モダンブラウザ向け。",
    cssCode: `@property --reveal-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
.conic-reveal {
  background: conic-gradient(from 0deg, #1a1a1a var(--reveal-angle), transparent var(--reveal-angle));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: conicReveal 1.5s ease forwards;
}
@keyframes conicReveal {
  to { --reveal-angle: 360deg; }
}
/* Safari/Firefoxの一部バージョンは@propertyに非対応。非対応環境ではグラデーション無しの通常表示にフォールバックする */`,
    htmlSnippet: `<h2 class="conic-reveal">Sample</h2>`,
    jsCode: null,
    tags: ["title", "conic-gradient", "reveal", "モダンCSS", "テキスト効果"],
    useCase: "ロゴ・キャッチコピーの登場演出(対応ブラウザ限定)",
    moodTags: ["オシャレ"]
  },
  {
    slug: "title-twist-hover",
    name: "ホバーで回転する文字",
    category: "title",
    description: "ホバーすると文字がくるりと3D回転して見える演出。ナビゲーションやボタンラベルに。",
    cssCode: `.twist-hover {
  display: inline-block;
  transition: transform 0.5s ease;
  transform-style: preserve-3d;
}
.twist-hover:hover {
  transform: rotateX(360deg);
}`,
    htmlSnippet: `<a href="#" class="twist-hover">Sample</a>`,
    jsCode: null,
    tags: ["title", "hover", "3d", "回転", "ナビゲーション", "テキスト効果"],
    useCase: "ナビゲーションリンク、ボタンラベルのホバー演出",
    moodTags: ["ポップ"]
  },
  {
    slug: "logo-stroke-draw",
    name: "輪郭線が描かれるロゴ表示",
    category: "装飾",
    description: "ロゴやタイトルの輪郭線が、ペンで描くように少しずつ現れるSVGストロークアニメーション。",
    cssCode: `.stroke-draw path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawStroke 2s ease forwards;
}
@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}
/* stroke-dasharray/dashoffsetの数値は、実際のpathの長さ(element.getTotalLength())に合わせて調整する */`,
    htmlSnippet: `<svg class="stroke-draw" viewBox="0 0 200 60"><path d="M10,40 Q100,-10 190,40" /></svg>`,
    jsCode: null,
    tags: ["logo", "svg", "stroke", "ブランド", "テキスト効果"],
    useCase: "ロゴ・ブランド名の登場演出、サービスタイトルの装飾",
    moodTags: ["オシャレ", "シンプル"]
  },
  {
    slug: "text-shadow-emboss",
    name: "エンボス風の浮き上がり文字",
    category: "title",
    description: "文字がふわっと浮き上がって見える、上下2色の影を使ったエンボス風テキストシャドウ。",
    cssCode: `.emboss-text {
  color: #e8e8ec;
  background: #d8d8de;
  padding: 8px 16px;
  animation: embossBreath 3s ease-in-out infinite;
}
@keyframes embossBreath {
  0%, 100% {
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.7), -1px -1px 1px rgba(0, 0, 0, 0.25);
  }
  50% {
    text-shadow: 2px 2px 1px rgba(255, 255, 255, 0.9), -2px -2px 2px rgba(0, 0, 0, 0.35);
  }
}`,
    htmlSnippet: `<h2 class="emboss-text">Sample</h2>`,
    jsCode: null,
    tags: ["title", "emboss", "shadow", "高級感", "立体感", "テキスト効果"],
    useCase: "明るい背景での高級感・立体感の演出(見出し・ロゴ)",
    moodTags: ["シンプル", "オシャレ"]
  },
  {
    slug: "text-scroll-driven-reveal",
    name: "スクロール連動テキスト表示",
    category: "scroll",
    description: "スクロール量に連動して文字が左から徐々にはっきり表示される、scroll-timelineを使ったモダンな演出。",
    cssCode: `.scroll-reveal-text {
  clip-path: inset(0 100% 0 0);
  animation: scrollRevealClip linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
@keyframes scrollRevealClip {
  to { clip-path: inset(0 0 0 0); }
}
/* animation-timeline: view() は2023年以降のChromium系ブラウザのみ対応。
   Safari/Firefoxは非対応のため、scroll-fade-upのIntersectionObserver版をフォールバックとして用意する */`,
    htmlSnippet: `<h2 class="scroll-reveal-text">Sample</h2>`,
    jsCode: null,
    tags: ["scroll", "scroll-timeline", "reveal", "モダンCSS", "テキスト効果"],
    useCase: "ストーリーテリング型LPの本文セクション見出し(対応ブラウザ限定、他はscroll-fade-upで代替)",
    moodTags: ["オシャレ", "見やすい"]
  },
  {
    slug: "loading-spinner",
    name: "円形ローディングスピナー",
    category: "loading",
    description: "シンプルな円形ローディングスピナー。データ読み込み中の待機表示に。",
    cssCode: `.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    htmlSnippet: `<div class="spinner"></div>`,
    jsCode: null,
    tags: ["loading", "spinner", "基本"],
    useCase: "フォーム送信中、データ読み込み中の待機表示",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "skeleton-loading-shimmer",
    name: "スケルトンローディング",
    category: "loading",
    description: "コンテンツ読み込み前に表示する、光が流れるスケルトンプレースホルダー。",
    cssCode: `.skeleton {
  background: linear-gradient(90deg, #d0d0d0 25%, #e8e8e8 50%, #d0d0d0 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
  border-radius: 4px;
}
@keyframes skeletonShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
    htmlSnippet: `<div class="skeleton" style="width:100%;height:18px;margin-bottom:10px;"></div>
<div class="skeleton" style="width:80%;height:18px;margin-bottom:10px;"></div>
<div class="skeleton" style="width:60%;height:18px;"></div>`,
    jsCode: null,
    tags: ["loading", "skeleton", "基本"],
    useCase: "画像・カード・記事一覧のローディングプレースホルダー",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "scroll-progress-bar",
    name: "スクロール進行バー",
    category: "scroll",
    description: "ページ上部に、スクロール量に応じて伸びるプログレスバーを表示する読了インジケーター。",
    cssCode: `.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 0%;
  background: #1a1a1a;
  z-index: 9999;
  transition: width 0.1s ease-out;
}`,
    htmlSnippet: `<div class="scroll-progress"></div>`,
    jsCode: `const bar = document.querySelector(".scroll-progress");
function updateProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = \`\${(scrollTop / scrollHeight) * 100}%\`;
}
window.addEventListener("scroll", updateProgress);`,
    tags: ["scroll", "progress-bar", "読了", "基本"],
    useCase: "長文コラム・ブログ記事、長いLPの読了度表示",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "back-to-top-fade",
    name: "トップへ戻るボタン",
    category: "scroll",
    description: "一定量スクロールすると、画面右下にトップへ戻るボタンがふわっと現れる。",
    cssCode: `.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}
.back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}`,
    htmlSnippet: `<button class="back-to-top">↑</button>`,
    jsCode: `const btn = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  btn.classList.toggle("is-visible", window.scrollY > 400);
});
btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));`,
    tags: ["scroll", "back-to-top", "基本"],
    useCase: "長いLP/コラムページのトップへ戻る導線",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "hamburger-menu-morph",
    name: "ハンバーガーメニュー変形",
    category: "navigation",
    description: "ハンバーガーメニューアイコンがタップでバツ印(×)に変形するアニメーション。",
    cssCode: `.hamburger {
  width: 28px;
  height: 20px;
  position: relative;
  cursor: pointer;
}
.hamburger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease;
}
.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 9px; }
.hamburger span:nth-child(3) { top: 18px; }
.hamburger.is-open span:nth-child(1) { top: 9px; transform: rotate(45deg); }
.hamburger.is-open span:nth-child(2) { opacity: 0; }
.hamburger.is-open span:nth-child(3) { top: 9px; transform: rotate(-45deg); }`,
    htmlSnippet: `<div class="hamburger"><span></span><span></span><span></span></div>`,
    jsCode: `document.querySelector(".hamburger").addEventListener("click", function () {
  this.classList.toggle("is-open");
});`,
    tags: ["navigation", "hamburger", "menu", "基本"],
    useCase: "スマホ用ナビゲーションメニューの開閉ボタン",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "accordion-toggle",
    name: "アコーディオン開閉",
    category: "ui",
    description: "FAQなどでクリックすると滑らかに開閉するアコーディオン。",
    cssCode: `.accordion-item .accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.accordion-item.is-open .accordion-body {
  max-height: 400px;
}
.accordion-item .accordion-head {
  cursor: pointer;
}
.accordion-item .accordion-head::after {
  content: "+";
  float: right;
  transition: transform 0.3s ease;
}
.accordion-item.is-open .accordion-head::after {
  transform: rotate(45deg);
}`,
    htmlSnippet: `<div class="accordion-item">
  <div class="accordion-head">Sample Question</div>
  <div class="accordion-body"><p>Sample answer text.</p></div>
</div>`,
    jsCode: `document.querySelectorAll(".accordion-head").forEach((head) => {
  head.addEventListener("click", () => head.parentElement.classList.toggle("is-open"));
});`,
    tags: ["ui", "accordion", "faq", "基本"],
    useCase: "FAQセクション、料金プラン詳細の開閉",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "card-flip-3d",
    name: "カード3Dフリップ",
    category: "ui",
    description: "カードにホバーすると表から裏へくるりと反転する3Dフリップ演出。",
    cssCode: `.flip-card {
  perspective: 1000px;
  width: 200px;
  height: 120px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  background: #f0f0f0;
  border-radius: 8px;
}
.flip-card-back {
  transform: rotateY(180deg);
  background: #1a1a1a;
  color: #fff;
}`,
    htmlSnippet: `<div class="flip-card"><div class="flip-card-inner">
  <div class="flip-card-front">Sample Front</div>
  <div class="flip-card-back">Sample Back</div>
</div></div>`,
    jsCode: null,
    tags: ["ui", "card", "flip", "hover", "基本"],
    useCase: "スタッフ紹介カード、サービス一覧カードのホバー演出",
    moodTags: ["ポップ", "派手"]
  },
  {
    slug: "drawer-slide-menu",
    name: "ドロワーメニュー",
    category: "navigation",
    description: "画面端からスライドして現れるドロワー(サイドメニュー)の開閉。",
    cssCode: `.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 240px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
  padding: 24px;
  box-sizing: border-box;
  transform: translateX(100%);
  transition: transform 0.35s ease;
  z-index: 1000;
}
.drawer.is-open {
  transform: translateX(0);
}
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s;
}
.drawer-overlay.is-open {
  opacity: 1;
  visibility: visible;
}`,
    htmlSnippet: `<button class="drawer-open-btn">Menu</button>
<div class="drawer-overlay"></div>
<div class="drawer">Sample Menu</div>`,
    jsCode: `const menuButton = document.querySelector(".drawer-open-btn");
const drawer = document.querySelector(".drawer");
const overlay = document.querySelector(".drawer-overlay");
menuButton.addEventListener("click", () => {
  drawer.classList.add("is-open");
  overlay.classList.add("is-open");
});
overlay.addEventListener("click", () => {
  drawer.classList.remove("is-open");
  overlay.classList.remove("is-open");
});`,
    tags: ["navigation", "drawer", "menu", "基本"],
    useCase: "スマホ用サイドメニュー、フィルターパネル",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "toast-notification-slide",
    name: "トースト通知",
    category: "notification",
    description: "画面右下からスライドインし、数秒後に自動で消えるトースト通知。",
    cssCode: `.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 14px 20px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 8px;
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast.is-visible {
  transform: translateY(0);
  opacity: 1;
}`,
    htmlSnippet: `<button class="toast-trigger-btn">Show Toast</button>
<div class="toast"></div>`,
    jsCode: `function showToast(message, duration = 3000) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), duration);
}
document.querySelector(".toast-trigger-btn").addEventListener("click", () => showToast("Sample notification"));`,
    tags: ["notification", "toast", "基本"],
    useCase: "フォーム送信完了・カート追加などの完了通知",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "ripple-click-effect",
    name: "クリックリップルエフェクト",
    category: "button",
    description: "ボタンをクリックした位置から波紋が広がるマテリアルデザイン風のリップルエフェクト。",
    cssCode: `.ripple {
  position: relative;
  overflow: hidden;
}
.ripple-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: rippleEffect 0.6s ease-out;
  pointer-events: none;
}
@keyframes rippleEffect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}`,
    htmlSnippet: `<button class="ripple">Sample</button>`,
    jsCode: `const button = document.querySelector(".ripple");
button.addEventListener("click", (e) => {
  const rect = button.getBoundingClientRect();
  const circle = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  circle.className = "ripple-circle";
  circle.style.width = circle.style.height = \`\${size}px\`;
  circle.style.left = \`\${e.clientX - rect.left - size / 2}px\`;
  circle.style.top = \`\${e.clientY - rect.top - size / 2}px\`;
  button.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());
});`,
    tags: ["button", "ripple", "click", "基本"],
    useCase: "ボタン・カードのクリックフィードバック",
    moodTags: ["ポップ", "見やすい"]
  },
  {
    slug: "svg-checkmark-draw",
    name: "チェックマーク描画アニメーション",
    category: "ui",
    description: "フォーム送信完了時などに使う、チェックマークが円を描きながら現れる成功アニメーション。",
    cssCode: `.check-circle,
.check-mark {
  fill: none;
  stroke: #2cb67d;
  stroke-width: 3;
  stroke-linecap: round;
}
.check-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: drawCircle 0.6s ease forwards;
}
.check-mark {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: drawCheck 0.4s ease forwards 0.5s;
}
@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}`,
    htmlSnippet: `<svg viewBox="0 0 52 52" width="60" height="60">
  <circle class="check-circle" cx="26" cy="26" r="24" />
  <path class="check-mark" d="M14 27l7 7 16-16" />
</svg>`,
    jsCode: null,
    tags: ["ui", "svg", "success", "checkmark", "基本"],
    useCase: "フォーム送信完了、予約完了ページの成功表示",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "circular-progress-ring",
    name: "円形プログレスリング",
    category: "ui",
    description: "SVGでリング状に円を描く、パーセンテージ表示用の円形プログレスバー。",
    cssCode: `.progress-ring__circle {
  fill: none;
  stroke: #1a1a1a;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.6s ease;
}`,
    htmlSnippet: `<svg width="120" height="120"><circle class="progress-ring__circle" cx="60" cy="60" r="52" /></svg>`,
    jsCode: `function setProgress(circle, percent) {
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = \`\${circumference} \${circumference}\`;
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
}
// 使用例(実際の数値に置き換えて呼び出す)
setProgress(document.querySelector(".progress-ring__circle"), 72);`,
    tags: ["ui", "svg", "progress", "満足度", "基本"],
    useCase: "満足度・達成率などの数値をビジュアルで見せる",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "modal-fade-scale",
    name: "モーダルフェード表示",
    category: "ui",
    description: "モーダルウィンドウがふわっと拡大しながら表示・非表示になる開閉演出。",
    cssCode: `.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s;
}
.modal-overlay.is-open {
  opacity: 1;
  visibility: visible;
}
.modal-box {
  background: #fff;
  padding: 24px 32px;
  border-radius: 10px;
  text-align: center;
  transform: scale(0.9);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-overlay.is-open .modal-box {
  transform: scale(1);
  opacity: 1;
}`,
    htmlSnippet: `<button class="modal-open-btn">Open Modal</button>
<div class="modal-overlay">
  <div class="modal-box">Sample Modal<br><button class="modal-close-btn">Close</button></div>
</div>`,
    jsCode: `const overlay = document.querySelector(".modal-overlay");
document.querySelector(".modal-open-btn").addEventListener("click", () => overlay.classList.add("is-open"));
document.querySelector(".modal-close-btn").addEventListener("click", () => overlay.classList.remove("is-open"));`,
    tags: ["ui", "modal", "基本"],
    useCase: "予約フォーム・画像拡大などのモーダル表示",
    moodTags: ["シンプル", "オシャレ"]
  },
  {
    slug: "sticky-cta-bar-slideup",
    name: "スマホ固定CTAバー",
    category: "cta",
    description: "スマホ画面下部に、スクロール後にスライドインして固定表示されるCTAバー。",
    cssCode: `.sticky-cta-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a1a;
  padding: 14px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.4s ease;
  z-index: 900;
}
.sticky-cta-bar a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
.sticky-cta-bar.is-visible {
  transform: translateY(0);
}`,
    htmlSnippet: `<div class="sticky-cta-bar"><a href="#reserve">Sample</a></div>`,
    jsCode: `window.addEventListener("scroll", () => {
  document.querySelector(".sticky-cta-bar").classList.toggle("is-visible", window.scrollY > 300);
});`,
    tags: ["cta", "sticky", "mobile", "予約", "基本"],
    useCase: "LPのスマホ固定CTAバー(予約・購入導線)",
    moodTags: ["見やすい", "派手"]
  },
  {
    slug: "input-underline-focus",
    name: "フォーム入力欄フォーカス下線",
    category: "form",
    description: "フォーム入力欄にフォーカスすると、下線がアクセントカラーで左から伸びる。",
    cssCode: `.input-underline {
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  padding: 8px 0;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
}
.input-wrap {
  position: relative;
  width: 220px;
}
.input-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #1a1a1a;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.input-wrap:has(.input-underline:focus)::after {
  transform: scaleX(1);
}`,
    htmlSnippet: `<div class="input-wrap">
  <input class="input-underline" type="text" placeholder="Sample">
</div>`,
    jsCode: null,
    tags: ["form", "input", "focus", "基本"],
    useCase: "予約フォーム・お問い合わせフォームの入力欄",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "tab-switch-fade",
    name: "タブ切り替えフェード",
    category: "ui",
    description: "タブ切り替え時に、コンテンツがフェードでクロスフェード表示される。",
    cssCode: `.tab-button {
  border: none;
  background: #eee;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
}
.tab-panel {
  display: none;
  opacity: 0;
  padding: 12px;
  animation: tabFadeIn 0.3s ease forwards;
}
.tab-panel.is-active {
  display: block;
}
@keyframes tabFadeIn {
  to { opacity: 1; }
}`,
    htmlSnippet: `<div class="tab-buttons">
  <button class="tab-button" data-target="panel-1">Tab 1</button>
  <button class="tab-button" data-target="panel-2">Tab 2</button>
</div>
<div class="tab-panel is-active" id="panel-1">Sample content 1</div>
<div class="tab-panel" id="panel-2">Sample content 2</div>`,
    jsCode: `document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
    document.getElementById(btn.dataset.target).classList.add("is-active");
  });
});`,
    tags: ["ui", "tab", "基本"],
    useCase: "料金プラン比較、サービス内容タブ切り替え",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "custom-checkbox",
    name: "カスタムチェックボックス",
    category: "form",
    description: "チェックボックスをカスタムデザインし、チェック時にチェックマークがふわっと表示される。",
    cssCode: `.custom-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.custom-checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.custom-checkbox .box {
  width: 22px;
  height: 22px;
  border: 2px solid #ccc;
  border-radius: 6px;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.custom-checkbox .box::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 11px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.2s ease;
}
.custom-checkbox input:checked ~ .box {
  background: #1a1a1a;
  border-color: #1a1a1a;
}
.custom-checkbox input:checked ~ .box::after {
  transform: rotate(45deg) scale(1);
}`,
    htmlSnippet: `<label class="custom-checkbox">
  <input type="checkbox" checked>
  <span class="box"></span>
  Sample
</label>`,
    jsCode: null,
    tags: ["form", "checkbox", "ui-ux", "基本"],
    useCase: "予約フォームの同意チェック、複数選択オプション",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "custom-radio-button",
    name: "カスタムラジオボタン",
    category: "form",
    description: "ラジオボタンをカスタムデザインし、選択時に中央のドットがふわっと拡大表示される。",
    cssCode: `.custom-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  cursor: pointer;
  user-select: none;
}
.custom-radio input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.custom-radio .dot-ring {
  width: 22px;
  height: 22px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: border-color 0.2s ease;
}
.custom-radio .dot-ring::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #1a1a1a;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.custom-radio input:checked ~ .dot-ring {
  border-color: #1a1a1a;
}
.custom-radio input:checked ~ .dot-ring::after {
  transform: scale(1);
}`,
    htmlSnippet: `<label class="custom-radio">
  <input type="radio" name="sample-radio" checked>
  <span class="dot-ring"></span>
  Sample A
</label>
<label class="custom-radio">
  <input type="radio" name="sample-radio">
  <span class="dot-ring"></span>
  Sample B
</label>`,
    jsCode: null,
    tags: ["form", "radio", "ui-ux", "基本"],
    useCase: "プラン選択、コース選択などの単一選択項目",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "toggle-switch",
    name: "トグルスイッチ",
    category: "form",
    description: "iOSのようなスライド式トグルスイッチ。ON/OFF切り替えがなめらかにアニメーションする。",
    cssCode: `.toggle-switch {
  display: inline-block;
  width: 48px;
  height: 26px;
  position: relative;
  cursor: pointer;
}
.toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-switch .track {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 999px;
  transition: background 0.25s ease;
}
.toggle-switch .track::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-switch input:checked ~ .track {
  background: #2cb67d;
}
.toggle-switch input:checked ~ .track::after {
  transform: translateX(22px);
}`,
    htmlSnippet: `<label class="toggle-switch">
  <input type="checkbox" checked>
  <span class="track"></span>
</label>`,
    jsCode: null,
    tags: ["form", "toggle", "switch", "ui-ux", "基本"],
    useCase: "通知ON/OFF、オプション有無の切り替えUI",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "range-slider-custom",
    name: "カスタムレンジスライダー",
    category: "form",
    description: "レンジスライダーのつまみをカスタムデザインし、ホバー・ドラッグ時にふわっと拡大する。",
    cssCode: `.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 220px;
  height: 4px;
  background: #ddd;
  border-radius: 999px;
  outline: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1a1a1a;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.range-slider:hover::-webkit-slider-thumb,
.range-slider:active::-webkit-slider-thumb {
  transform: scale(1.3);
}
.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1a1a1a;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}`,
    htmlSnippet: `<input type="range" class="range-slider" min="0" max="100" value="50">`,
    jsCode: null,
    tags: ["form", "range", "slider", "ui-ux", "基本"],
    useCase: "予算・回数・年齢などの数値選択UI",
    moodTags: ["シンプル", "見やすい"]
  },
  {
    slug: "star-rating-input",
    name: "星評価入力",
    category: "form",
    description: "星をホバー・クリックすると、その位置まで金色に塗りつぶされる評価入力UI。",
    cssCode: `.star-rating {
  display: inline-flex;
  flex-direction: row-reverse;
  gap: 4px;
}
.star-rating input {
  display: none;
}
.star-rating label {
  font-size: 28px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.15s ease, transform 0.15s ease;
}
.star-rating input:checked ~ label,
.star-rating label:hover,
.star-rating label:hover ~ label {
  color: #f5a623;
  transform: scale(1.1);
}`,
    htmlSnippet: `<div class="star-rating">
  <input type="radio" name="sample-rating" id="star5"><label for="star5">★</label>
  <input type="radio" name="sample-rating" id="star4" checked><label for="star4">★</label>
  <input type="radio" name="sample-rating" id="star3"><label for="star3">★</label>
  <input type="radio" name="sample-rating" id="star2"><label for="star2">★</label>
  <input type="radio" name="sample-rating" id="star1"><label for="star1">★</label>
</div>`,
    jsCode: null,
    tags: ["form", "rating", "star", "ui-ux", "基本"],
    useCase: "レビュー投稿・満足度アンケートの評価入力",
    moodTags: ["ポップ", "見やすい"]
  },
  {
    slug: "segmented-control",
    name: "セグメントコントロール",
    category: "ui",
    description: "選択中の項目にハイライトがなめらかにスライド移動する、iOS風のセグメントコントロール。",
    cssCode: `.segmented-control {
  display: inline-flex;
  position: relative;
  background: #eee;
  border-radius: 10px;
  padding: 4px;
}
.segmented-control input {
  display: none;
}
.segmented-control label {
  position: relative;
  z-index: 1;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: color 0.25s ease;
}
.segmented-control input:checked + label {
  color: #1a1a1a;
}
.segmented-control .highlight {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(33.333% - 4px);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
    htmlSnippet: `<div class="segmented-control">
  <span class="highlight"></span>
  <input type="radio" name="segment" id="seg1" checked><label for="seg1">Sample A</label>
  <input type="radio" name="segment" id="seg2"><label for="seg2">Sample B</label>
  <input type="radio" name="segment" id="seg3"><label for="seg3">Sample C</label>
</div>`,
    jsCode: `const inputs = document.querySelectorAll(".segmented-control input");
const highlight = document.querySelector(".segmented-control .highlight");
inputs.forEach((input, i) => {
  input.addEventListener("change", () => {
    highlight.style.transform = \`translateX(\${i * 100}%)\`;
  });
});`,
    tags: ["ui", "segmented-control", "ui-ux", "基本"],
    useCase: "料金プランの月額/年額切り替え、表示形式の切り替え",
    moodTags: ["オシャレ", "見やすい"]
  },
  {
    slug: "custom-select-dropdown",
    name: "カスタムセレクトボックス",
    category: "ui",
    description: "セレクトボックスのカスタムデザイン。開閉時に矢印が回転し、メニューが滑らかに開く。",
    cssCode: `.custom-select {
  position: relative;
  width: 220px;
  font-size: 14px;
}
.custom-select .selected {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.custom-select .selected::after {
  content: "▾";
  transition: transform 0.25s ease;
}
.custom-select.is-open .selected::after {
  transform: rotate(180deg);
}
.custom-select .options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.25s ease, opacity 0.2s ease;
}
.custom-select.is-open .options {
  max-height: 200px;
  opacity: 1;
}
.custom-select .options div {
  padding: 10px 14px;
  cursor: pointer;
}
.custom-select .options div:hover {
  background: #f5f5f5;
}`,
    htmlSnippet: `<div class="custom-select">
  <div class="selected">Sample を選択</div>
  <div class="options">
    <div>Sample A</div>
    <div>Sample B</div>
    <div>Sample C</div>
  </div>
</div>`,
    jsCode: `const select = document.querySelector(".custom-select");
const selected = select.querySelector(".selected");
selected.addEventListener("click", () => select.classList.toggle("is-open"));
select.querySelectorAll(".options div").forEach((option) => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    select.classList.remove("is-open");
  });
});`,
    tags: ["ui", "select", "dropdown", "ui-ux", "基本"],
    useCase: "フォームの選択項目(コース・時間帯など)",
    moodTags: ["シンプル", "オシャレ"]
  },
  {
    slug: "custom-radio-card",
    name: "カード型ラジオボタン",
    category: "form",
    description: "プラン選択などで使う、選択中のカードが縁取りとチェックアイコンで強調されるカード型ラジオボタン。",
    cssCode: `.radio-card-group {
  display: flex;
  gap: 12px;
}
.radio-card {
  position: relative;
  cursor: pointer;
}
.radio-card input {
  position: absolute;
  opacity: 0;
}
.radio-card .card-face {
  display: block;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  min-width: 100px;
  text-align: center;
  position: relative;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.radio-card .card-face::after {
  content: "";
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ccc;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.radio-card input:checked ~ .card-face {
  border-color: #1a1a1a;
  transform: translateY(-2px);
}
.radio-card input:checked ~ .card-face::after {
  background: #1a1a1a;
  border-color: #1a1a1a;
}`,
    htmlSnippet: `<div class="radio-card-group">
  <label class="radio-card">
    <input type="radio" name="plan" checked>
    <span class="card-face">Sample A</span>
  </label>
  <label class="radio-card">
    <input type="radio" name="plan">
    <span class="card-face">Sample B</span>
  </label>
</div>`,
    jsCode: null,
    tags: ["form", "radio-card", "plan", "ui-ux", "基本"],
    useCase: "料金プラン・コース選択のカードUI",
    moodTags: ["オシャレ", "見やすい"]
  },
  {
    slug: "bottom-sheet-slide-up",
    name: "ボトムシート（下からせり上がるシート）",
    category: "ui",
    description: "画面下からスライドインするアクションシート。背景を暗くしてフォーカスさせる",
    cssCode: `.bottom-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  visibility: hidden;
  transition: background 0.3s ease, visibility 0.3s;
  z-index: 100;
}
.bottom-sheet-backdrop.is-open {
  background: rgba(0, 0, 0, 0.4);
  visibility: visible;
}
.bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 101;
}
.bottom-sheet.is-open {
  transform: translateY(0);
}
.bottom-sheet-handle {
  width: 36px;
  height: 4px;
  background: #d0d0d0;
  border-radius: 2px;
  margin: 0 auto 16px;
}`,
    htmlSnippet: `<div class="bottom-sheet-backdrop" data-sheet-backdrop></div>
<div class="bottom-sheet" data-sheet>
  <div class="bottom-sheet-handle"></div>
  <p>ここにフィルターや詳細メニューを配置</p>
</div>
<button data-sheet-open>開く</button>`,
    jsCode: `const backdrop = document.querySelector("[data-sheet-backdrop]");
const sheet = document.querySelector("[data-sheet]");
const openBtn = document.querySelector("[data-sheet-open]");

function openSheet() {
  backdrop.classList.add("is-open");
  sheet.classList.add("is-open");
}
function closeSheet() {
  backdrop.classList.remove("is-open");
  sheet.classList.remove("is-open");
}

openBtn.addEventListener("click", openSheet);
backdrop.addEventListener("click", closeSheet);`,
    tags: ["ボトムシート", "モーダル", "スマホUI"],
    useCase: "スマホ画面下からのフィルター選択・詳細メニュー・アクションシート（EC/予約サイトの絞り込みUIなど）",
    moodTags: ["モダン", "スマホライク"]
  },
  {
    slug: "carousel-swipe-snap",
    name: "スワイプカルーセル（スナップ+ドット）",
    category: "ui",
    description: "横スワイプでスナップするカードカルーセル。現在位置をドットで表示",
    cssCode: `.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 12px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 24px;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}
.carousel-slide {
  flex: 0 0 85%;
  scroll-snap-align: center;
  border-radius: 12px;
  overflow: hidden;
}
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}
.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d8d8d8;
  transition: background 0.2s ease, transform 0.2s ease;
}
.carousel-dot.is-active {
  background: #333;
  transform: scale(1.4);
}`,
    htmlSnippet: `<div class="carousel-track" data-carousel>
  <div class="carousel-slide"><img src="slide1.jpg" alt=""></div>
  <div class="carousel-slide"><img src="slide2.jpg" alt=""></div>
  <div class="carousel-slide"><img src="slide3.jpg" alt=""></div>
</div>
<div class="carousel-dots" data-carousel-dots></div>`,
    jsCode: `const track = document.querySelector("[data-carousel]");
const dotsWrap = document.querySelector("[data-carousel-dots]");
const slides = [...track.querySelectorAll(".carousel-slide")];

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.children];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = slides.indexOf(entry.target);
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
  });
}, { root: track, threshold: 0.6 });

slides.forEach((slide) => observer.observe(slide));`,
    tags: ["カルーセル", "スワイプ", "スマホUI"],
    useCase: "商品ギャラリー・お客様の声・実績事例など横スワイプで見せたいコンテンツ（スマホ最適、指1本で操作できる）",
    moodTags: ["モダン", "スマホライク"]
  },
  {
    slug: "icon-like-bounce",
    name: "いいねアイコンのバウンス演出",
    category: "icon",
    description: "ハートアイコンをタップすると弾むように拡大縮小し、色が変わる",
    cssCode: `.like-icon {
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
  transform-origin: center;
}
.like-icon.is-liked {
  color: #e0455f;
  animation: like-bounce 0.4s ease;
}
@keyframes like-bounce {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.35);
  }
  55% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .like-icon.is-liked {
    animation: none;
  }
}`,
    htmlSnippet: `<button class="like-icon" data-like aria-label="いいね" aria-pressed="false">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4.5 5.6 4c2-.3 3.9.6 5 2.2C11.7 4.6 13.6 3.7 15.6 4c3.6.5 5.2 4 3.6 7.7C16.7 16.4 12 21 12 21z"/></svg>
</button>`,
    jsCode: `const btn = document.querySelector("[data-like]");
btn.addEventListener("click", () => {
  const liked = btn.classList.toggle("is-liked");
  btn.setAttribute("aria-pressed", String(liked));
});`,
    tags: ["アイコン", "マイクロインタラクション", "いいね"],
    useCase: "お気に入り登録・レビュー高評価・SNSシェアボタンなど、タップの手応えを演出したい小さなアイコン操作",
    moodTags: ["ポップ", "スマホライク"]
  },
  {
    slug: "step-progress-indicator",
    name: "ステップ進行インジケーター",
    category: "progress",
    description: "現在の入力ステップを横並びのバーで示す。完了・現在・未着手を色分け",
    cssCode: `.step-progress {
  display: flex;
  gap: 8px;
}
.step-progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
}
.step-progress-bar-fill {
  height: 100%;
  width: 0%;
  background: #a8677c;
  transition: width 0.5s ease;
}
.step-progress-bar.is-complete .step-progress-bar-fill {
  width: 100%;
}
.step-progress-bar.is-current .step-progress-bar-fill {
  width: 50%;
}
.step-progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.75rem;
  color: #888;
}`,
    htmlSnippet: `<div class="step-progress">
  <div class="step-progress-bar is-complete"><div class="step-progress-bar-fill"></div></div>
  <div class="step-progress-bar is-current"><div class="step-progress-bar-fill"></div></div>
  <div class="step-progress-bar"><div class="step-progress-bar-fill"></div></div>
</div>
<div class="step-progress-labels">
  <span>お客様情報</span>
  <span>お支払い</span>
  <span>確認</span>
</div>`,
    jsCode: null,
    tags: ["プログレス", "ステップ", "フォーム"],
    useCase: "予約・購入フォームや会員登録など複数ステップの入力フローで、今どこにいるかを視覚的に示したい場面",
    moodTags: ["信頼感", "モダン"]
  },
  {
    slug: "tab-underline-slide",
    name: "タブ下線スライド",
    category: "navigation",
    description: "タブ切り替え時に下線がスライドして現在位置を示す",
    cssCode: `.tabs-underline {
  position: relative;
  display: flex;
  border-bottom: 1px solid #eee;
}
.tabs-underline button {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: none;
  font-size: 0.95rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease;
}
.tabs-underline button.is-active {
  color: #222;
  font-weight: 700;
}
.tabs-underline-bar {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: #a8677c;
  transition: left 0.3s cubic-bezier(0.65, 0, 0.35, 1), width 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}`,
    htmlSnippet: `<div class="tabs-underline" data-tabs>
  <button class="is-active">商品紹介</button>
  <button>レビュー</button>
  <button>よくある質問</button>
  <span class="tabs-underline-bar"></span>
</div>`,
    jsCode: `const wrap = document.querySelector("[data-tabs]");
const buttons = [...wrap.querySelectorAll("button")];
const bar = wrap.querySelector(".tabs-underline-bar");

function moveBar(btn) {
  bar.style.left = btn.offsetLeft + "px";
  bar.style.width = btn.offsetWidth + "px";
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    moveBar(btn);
  });
});

moveBar(wrap.querySelector(".is-active"));`,
    tags: ["タブ", "ナビゲーション", "下線"],
    useCase: "料金プラン比較・商品詳細/レビュー切り替え・FAQカテゴリなどタブUIの現在位置表示",
    moodTags: ["モダン", "信頼感"]
  },
  {
    slug: "before-after-slider",
    name: "ビフォーアフター比較スライダー",
    category: "image",
    description: "ドラッグで境界線を動かし、施術前後や効果の比較を見せる",
    cssCode: `.ba-slider {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 8px;
  user-select: none;
}
.ba-slider img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.ba-slider-after {
  clip-path: inset(0 0 0 50%);
}
.ba-slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background: #fff;
  transform: translateX(-50%);
  cursor: ew-resize;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}
.ba-slider-handle::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.ba-slider-label {
  position: absolute;
  top: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
}
.ba-slider-label--before { left: 12px; }
.ba-slider-label--after { right: 12px; }`,
    htmlSnippet: `<div class="ba-slider" data-ba-slider>
  <img class="ba-slider-before" src="before.jpg" alt="施術前">
  <img class="ba-slider-after" data-ba-after src="after.jpg" alt="施術後">
  <span class="ba-slider-label ba-slider-label--before">Before</span>
  <span class="ba-slider-label ba-slider-label--after">After</span>
  <div class="ba-slider-handle" data-ba-handle></div>
</div>`,
    jsCode: `const slider = document.querySelector("[data-ba-slider]");
const after = document.querySelector("[data-ba-after]");
const handle = document.querySelector("[data-ba-handle]");
let dragging = false;

function setPosition(clientX) {
  const rect = slider.getBoundingClientRect();
  const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  after.style.clipPath = \`inset(0 0 0 \${percent}%)\`;
  handle.style.left = percent + "%";
}

handle.addEventListener("pointerdown", () => { dragging = true; });
window.addEventListener("pointerup", () => { dragging = false; });
window.addEventListener("pointermove", (e) => {
  if (dragging) setPosition(e.clientX);
});
slider.addEventListener("click", (e) => setPosition(e.clientX));`,
    tags: ["ビフォーアフター", "比較", "美容", "ドラッグ"],
    useCase: "美容・スキンケア・エステ・リフォームなど施術/効果の前後比較を見せたいセクション（美容LPで特に効果的）",
    moodTags: ["信頼感", "上品"]
  },
  {
    slug: "magnetic-button-hover",
    name: "マグネティックボタン（カーソル追従CTA）",
    category: "button",
    description: "カーソルを近づけるとボタンが吸い寄せられるように少し動く。Awwwards系サイトで定番の演出",
    cssCode: `.magnetic-btn {
  display: inline-block;
  padding: 16px 36px;
  border-radius: 999px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .magnetic-btn {
    transition: none;
  }
}`,
    htmlSnippet: `<button class="magnetic-btn" data-magnetic>お問い合わせ</button>`,
    jsCode: `const btn = document.querySelector("[data-magnetic]");
const strength = 0.35;

btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  btn.style.transform = \`translate(\${x * strength}px, \${y * strength}px)\`;
});

btn.addEventListener("mouseleave", () => {
  btn.style.transform = "translate(0, 0)";
});`,
    tags: ["ボタン", "マグネティック", "CTA", "ホバー"],
    useCase: "PCでの主要CTAボタン（お問い合わせ・購入・資料請求）にリッチな操作感を出したい場面。タッチデバイスでは効果なし（PC専用の演出）",
    moodTags: ["モダン", "カッコイイ"]
  },
  {
    slug: "sticky-header-shrink",
    name: "スクロールで縮む固定ヘッダー",
    category: "navigation",
    description: "ページ上部では大きいヘッダーが、スクロールすると高さ・余白が縮んでコンパクトな固定ヘッダーに変わる",
    cssCode: `.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  padding: 24px 32px;
  transition: padding 0.3s ease, box-shadow 0.3s ease;
}
.site-header.is-shrunk {
  padding: 10px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.site-header-logo {
  display: block;
  height: 40px;
  transition: height 0.3s ease;
}
.site-header.is-shrunk .site-header-logo {
  height: 28px;
}`,
    htmlSnippet: `<header class="site-header" data-sticky-header>
  <img class="site-header-logo" src="logo.svg" alt="ロゴ">
</header>`,
    jsCode: `const header = document.querySelector("[data-sticky-header]");
window.addEventListener("scroll", () => {
  header.classList.toggle("is-shrunk", window.scrollY > 40);
}, { passive: true });`,
    tags: ["ヘッダー", "固定ヘッダー", "スクロール"],
    useCase: "コーポレートサイト・HPのグローバルヘッダー。スクロール後もロゴ・ナビを見せつつ画面占有を減らしたい場面",
    moodTags: ["信頼感", "モダン"]
  },
  {
    slug: "image-curtain-reveal",
    name: "カーテンワイプ画像リビール",
    category: "scroll",
    description: "スクロールで画像にかかった幕が横に開き、中の画像が現れる。Awwwards系サイトで見られる印象的な登場演出",
    cssCode: `.curtain-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}
.curtain-wrap img {
  display: block;
  width: 100%;
  height: auto;
}
.curtain-panel {
  position: absolute;
  inset: 0;
  background: #1a1a1a;
  transform-origin: left;
  transform: scaleX(1);
  transition: transform 1s cubic-bezier(0.83, 0, 0.17, 1);
}
.curtain-wrap.is-visible .curtain-panel {
  transform: scaleX(0);
}
@media (prefers-reduced-motion: reduce) {
  .curtain-panel {
    transition: none;
    transform: scaleX(0);
  }
}`,
    htmlSnippet: `<div class="curtain-wrap reveal-curtain">
  <img src="photo.jpg" alt="">
  <div class="curtain-panel"></div>
</div>`,
    jsCode: `const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".reveal-curtain").forEach((el) => observer.observe(el));`,
    tags: ["スクロール", "画像", "リビール", "カーテン"],
    useCase: "ブランディング系LP・HPのキービジュアルや事例写真など、印象的に画像を登場させたいセクション（scroll-fade-upより演出強め）",
    moodTags: ["カッコイイ", "ラグジュアリー"]
  },
  {
    slug: "testimonial-auto-carousel",
    name: "お客様の声 自動切り替えカルーセル",
    category: "ui",
    description: "レビュー・お客様の声のカードが数秒ごとに自動でフェード切り替わる。手動送りボタンも併用可",
    cssCode: `.testimonial-carousel {
  position: relative;
  min-height: 160px;
}
.testimonial-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}
.testimonial-slide.is-active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}
.testimonial-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ddd;
  transition: background 0.2s ease;
}
.testimonial-dot.is-active {
  background: #a8677c;
}`,
    htmlSnippet: `<div class="testimonial-carousel" data-testimonial>
  <div class="testimonial-slide is-active">「対応が丁寧で安心できました」 - 30代女性</div>
  <div class="testimonial-slide">「効果を実感できて満足です」 - 40代女性</div>
  <div class="testimonial-slide">「また利用したいと思います」 - 20代女性</div>
</div>
<div class="testimonial-dots" data-testimonial-dots></div>`,
    jsCode: `const wrap = document.querySelector("[data-testimonial]");
const dotsWrap = document.querySelector("[data-testimonial-dots]");
const slides = [...wrap.querySelectorAll(".testimonial-slide")];

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "testimonial-dot" + (i === 0 ? " is-active" : "");
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.children];

let current = 0;
function show(index) {
  slides[current].classList.remove("is-active");
  dots[current].classList.remove("is-active");
  current = index;
  slides[current].classList.add("is-active");
  dots[current].classList.add("is-active");
}

setInterval(() => {
  show((current + 1) % slides.length);
}, 4000);

dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));`,
    tags: ["カルーセル", "お客様の声", "レビュー", "自動再生"],
    useCase: "お客様の声・導入事例・レビューを省スペースで複数見せたいLP/HPのセクション",
    moodTags: ["信頼感", "上品"]
  },
  {
    slug: "gradient-blob-background",
    name: "有機的に動くグラデーションブロブ背景",
    category: "background",
    description: "ふわふわと形を変えながら漂うグラデーションの塊。SaaS系のヒーローセクションで定番の背景演出",
    cssCode: `.blob-wrap {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.blob {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%;
  filter: blur(60px);
  opacity: 0.55;
  z-index: -1;
  animation: blob-move 14s ease-in-out infinite;
}
.blob--a {
  top: -10%;
  left: -10%;
  background: #a8677c;
  animation-delay: 0s;
}
.blob--b {
  bottom: -15%;
  right: -10%;
  background: #6c8ea8;
  animation-delay: -6s;
}
@keyframes blob-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%;
  }
  33% {
    transform: translate(6%, 8%) scale(1.08);
    border-radius: 58% 42% 35% 65% / 55% 65% 35% 45%;
  }
  66% {
    transform: translate(-6%, 4%) scale(0.95);
    border-radius: 35% 65% 55% 45% / 40% 55% 45% 60%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}`,
    htmlSnippet: `<div class="blob-wrap">
  <div class="blob blob--a"></div>
  <div class="blob blob--b"></div>
  <h1>次世代のクラウドサービス</h1>
</div>`,
    jsCode: null,
    tags: ["背景", "ブロブ", "グラデーション", "SaaS"],
    useCase: "SaaS・ITサービス系LP/HPのヒーローセクション背景。ミニマルな文字組みに柔らかい動きを添えたい場面",
    moodTags: ["モダン", "幻想的"]
  },
  {
    slug: "notification-badge-ping",
    name: "通知バッジの点滅（ピン留めドット）",
    category: "notification",
    description: "アイコンの右上に赤いドットが波紋のように広がりながら点滅し、未読・新着を知らせる",
    cssCode: `.badge-wrap {
  position: relative;
  display: inline-flex;
}
.badge-ping {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
}
.badge-ping::before,
.badge-ping::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #e0455f;
}
.badge-ping::before {
  animation: badge-ping-wave 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes badge-ping-wave {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .badge-ping::before {
    animation: none;
  }
}`,
    htmlSnippet: `<span class="badge-wrap">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 0 0-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
  <span class="badge-ping"></span>
</span>`,
    jsCode: null,
    tags: ["通知", "バッジ", "ピン留め", "マイクロインタラクション"],
    useCase: "新着メッセージ・お知らせ・カート内商品ありなど、アイコンに小さく注意を引きたい場面",
    moodTags: ["ポップ", "モダン"]
  },
  {
    slug: "bento-grid-hover",
    name: "Bentoグリッドレイアウト（ホバーで強調）",
    category: "ui",
    description: "大小さまざまなサイズのカードを箱詰めのように敷き詰めるBentoグリッド。ホバーしたカードだけ浮き上がる",
    cssCode: `.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 140px;
  gap: 16px;
}
.bento-item {
  background: #f4f2ee;
  border-radius: 16px;
  padding: 20px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.bento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}
.bento-item--wide { grid-column: span 2; }
.bento-item--tall { grid-row: span 2; }
@media (max-width: 767px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bento-item--wide { grid-column: span 2; }
}`,
    htmlSnippet: `<div class="bento-grid">
  <div class="bento-item bento-item--wide">機能A</div>
  <div class="bento-item">機能B</div>
  <div class="bento-item bento-item--tall">機能C</div>
  <div class="bento-item">機能D</div>
  <div class="bento-item">機能E</div>
</div>`,
    jsCode: null,
    tags: ["Bento", "グリッド", "レイアウト", "ホバー"],
    useCase: "SaaS・サービス紹介LP/HPの機能一覧セクション。大小の情報量が混在する内容を1つの盤面にまとめて見せたい場面",
    moodTags: ["モダン", "見やすい"]
  },
  {
    slug: "countdown-timer",
    name: "カウントダウンタイマー",
    category: "ui",
    description: "残り時間を日・時・分・秒でカウントダウン表示する。数字が切り替わる瞬間に軽くフェードする",
    cssCode: `.countdown {
  display: flex;
  gap: 12px;
}
.countdown-block {
  text-align: center;
}
.countdown-num {
  display: inline-block;
  min-width: 2ch;
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  transition: opacity 0.15s ease;
}
.countdown-num.is-flip {
  opacity: 0.3;
}
.countdown-label {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #888;
}`,
    htmlSnippet: `<div class="countdown" data-countdown="2026-08-01T00:00:00">
  <div class="countdown-block"><span class="countdown-num" data-days>00</span><span class="countdown-label">日</span></div>
  <div class="countdown-block"><span class="countdown-num" data-hours>00</span><span class="countdown-label">時間</span></div>
  <div class="countdown-block"><span class="countdown-num" data-minutes>00</span><span class="countdown-label">分</span></div>
  <div class="countdown-block"><span class="countdown-num" data-seconds>00</span><span class="countdown-label">秒</span></div>
</div>`,
    jsCode: `const el = document.querySelector("[data-countdown]");
const target = new Date(el.dataset.countdown).getTime();
const daysEl = el.querySelector("[data-days]");
const hoursEl = el.querySelector("[data-hours]");
const minutesEl = el.querySelector("[data-minutes]");
const secondsEl = el.querySelector("[data-seconds]");

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

tick();
setInterval(tick, 1000);`,
    tags: ["カウントダウン", "タイマー", "期間限定"],
    useCase: "期間限定キャンペーン・セール終了・予約締切など、残り時間を示して行動を促したいCTA周辺（日付は必ず実在の締切に置き換え、根拠のない期間限定表現をしない）",
    moodTags: ["ポップ", "緊急感"]
  },
  {
    slug: "timeline-scroll-draw",
    name: "スクロール連動タイムライン（線が伸びる）",
    category: "scroll",
    description: "縦のタイムライン上を、スクロールに合わせて線が下へ伸びていき、通過したステップがハイライトされる",
    cssCode: `.timeline {
  position: relative;
  padding-left: 32px;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e5e5;
}
.timeline-progress {
  position: absolute;
  left: 7px;
  top: 0;
  width: 2px;
  height: 0%;
  background: #a8677c;
  transition: height 0.2s ease-out;
}
.timeline-item {
  position: relative;
  padding-bottom: 40px;
}
.timeline-dot {
  position: absolute;
  left: -32px;
  top: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e5e5e5;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.timeline-item.is-passed .timeline-dot {
  border-color: #a8677c;
  background: #a8677c;
}`,
    htmlSnippet: `<div class="timeline" data-timeline>
  <div class="timeline-progress" data-timeline-progress></div>
  <div class="timeline-item"><span class="timeline-dot"></span><h3>ヒアリング</h3><p>ご要望・課題をお伺いします</p></div>
  <div class="timeline-item"><span class="timeline-dot"></span><h3>ご提案</h3><p>最適なプランをご提案します</p></div>
  <div class="timeline-item"><span class="timeline-dot"></span><h3>制作・実装</h3><p>デザイン〜実装まで進めます</p></div>
  <div class="timeline-item"><span class="timeline-dot"></span><h3>納品</h3><p>公開・納品して完了です</p></div>
</div>`,
    jsCode: `const timeline = document.querySelector("[data-timeline]");
const progress = document.querySelector("[data-timeline-progress]");
const items = [...timeline.querySelectorAll(".timeline-item")];

function update() {
  const rect = timeline.getBoundingClientRect();
  const viewportCenter = window.innerHeight * 0.6;
  const percent = Math.min(100, Math.max(0, ((viewportCenter - rect.top) / rect.height) * 100));
  progress.style.height = percent + "%";

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    item.classList.toggle("is-passed", itemRect.top < viewportCenter);
  });
}

window.addEventListener("scroll", update, { passive: true });
update();`,
    tags: ["タイムライン", "スクロール", "ステップ", "導入の流れ"],
    useCase: "サービス導入の流れ・制作フロー・沿革紹介など、複数ステップを順に見せたいセクション",
    moodTags: ["信頼感", "モダン"]
  },
  {
    slug: "empty-state-illustration",
    name: "空状態（Empty State）の案内表示",
    category: "ui",
    description: "検索結果0件・カートが空など、何も無い状態でユーザーを迷わせないためのイラスト+文言+CTAをふわっと表示する",
    cssCode: `.empty-state {
  text-align: center;
  padding: 60px 24px;
  opacity: 0;
  transform: translateY(12px);
  animation: empty-state-in 0.6s ease forwards;
}
@keyframes empty-state-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.empty-state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}
.empty-state-title {
  font-weight: 700;
  margin-bottom: 6px;
}
.empty-state-text {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 20px;
}
@media (prefers-reduced-motion: reduce) {
  .empty-state {
    animation: none;
    opacity: 1;
    transform: none;
  }
}`,
    htmlSnippet: `<div class="empty-state">
  <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
  <p class="empty-state-title">該当する商品が見つかりませんでした</p>
  <p class="empty-state-text">条件を変えて再度お試しください</p>
  <button>絞り込みをリセット</button>
</div>`,
    jsCode: null,
    tags: ["空状態", "検索結果0件", "案内"],
    useCase: "EC・検索機能付きサイトで、検索結果0件・カートが空・お気に入り未登録など「何もない」状態を丁寧に案内したい画面",
    moodTags: ["やさしい", "見やすい"]
  },
  {
    slug: "file-upload-dropzone",
    name: "ドラッグ&ドロップ ファイルアップロード",
    category: "form",
    description: "ファイルをドラッグすると枠が光り、ドロップでアップロード進捗バーが伸びる",
    cssCode: `.dropzone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  color: #888;
  transition: border-color 0.2s ease, background 0.2s ease;
  cursor: pointer;
}
.dropzone.is-dragover {
  border-color: #a8677c;
  background: #faf3f5;
  color: #a8677c;
}
.dropzone-progress {
  margin-top: 16px;
  height: 6px;
  border-radius: 3px;
  background: #eee;
  overflow: hidden;
  display: none;
}
.dropzone-progress.is-active {
  display: block;
}
.dropzone-progress-fill {
  height: 100%;
  width: 0%;
  background: #a8677c;
  transition: width 0.3s ease;
}`,
    htmlSnippet: `<div class="dropzone" data-dropzone>
  <p>ここにファイルをドラッグ&ドロップ<br>またはクリックして選択</p>
  <div class="dropzone-progress" data-progress-wrap>
    <div class="dropzone-progress-fill" data-progress-fill></div>
  </div>
</div>`,
    jsCode: `const zone = document.querySelector("[data-dropzone]");
const progressWrap = document.querySelector("[data-progress-wrap]");
const progressFill = document.querySelector("[data-progress-fill]");

["dragenter", "dragover"].forEach((evt) => {
  zone.addEventListener(evt, (e) => {
    e.preventDefault();
    zone.classList.add("is-dragover");
  });
});
["dragleave", "drop"].forEach((evt) => {
  zone.addEventListener(evt, (e) => {
    e.preventDefault();
    zone.classList.remove("is-dragover");
  });
});

zone.addEventListener("drop", () => {
  progressWrap.classList.add("is-active");
  let percent = 0;
  const timer = setInterval(() => {
    percent = Math.min(100, percent + 10);
    progressFill.style.width = percent + "%";
    if (percent >= 100) clearInterval(timer);
  }, 120);
});`,
    tags: ["ファイルアップロード", "ドラッグ&ドロップ", "フォーム"],
    useCase: "応募フォームの写真添付・資料アップロードなど、ファイル送信を伴うフォームのUI",
    moodTags: ["モダン", "信頼感"]
  },
  {
    slug: "copy-to-clipboard-feedback",
    name: "コピーボタンのフィードバック",
    category: "button",
    description: "クリックでテキストをコピーし、ボタンの上に「コピーしました」という吹き出しが一瞬表示される",
    cssCode: `.copy-btn-wrap {
  position: relative;
  display: inline-flex;
}
.copy-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 4px);
  margin-bottom: 8px;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}
.copy-tooltip.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}`,
    htmlSnippet: `<span class="copy-btn-wrap">
  <button data-copy-btn data-copy-text="https://example.com/invite/abc123">リンクをコピー</button>
  <span class="copy-tooltip" data-copy-tooltip>コピーしました</span>
</span>`,
    jsCode: `const btn = document.querySelector("[data-copy-btn]");
const tooltip = document.querySelector("[data-copy-tooltip]");
let hideTimer;

btn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(btn.dataset.copyText);
  tooltip.classList.add("is-visible");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => tooltip.classList.remove("is-visible"), 1500);
});`,
    tags: ["コピー", "クリップボード", "フィードバック"],
    useCase: "紹介リンク・クーポンコード・APIキーなど、コピーして使ってもらいたいテキストのUI",
    moodTags: ["モダン", "見やすい"]
  },
  {
    slug: "pagination-dots-slide",
    name: "ページネーション（現在地スライド表示）",
    category: "navigation",
    description: "ページ番号の下に、現在のページ位置を示す下線/背景がスライドして移動する",
    cssCode: `.pagination {
  position: relative;
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: #f4f2ee;
  border-radius: 999px;
}
.pagination button {
  position: relative;
  z-index: 1;
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  border-radius: 50%;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: color 0.25s ease;
}
.pagination button.is-active {
  color: #fff;
}
.pagination-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1a1a1a;
  transition: transform 0.3s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 0;
}`,
    htmlSnippet: `<div class="pagination" data-pagination>
  <span class="pagination-indicator" data-pagination-indicator></span>
  <button class="is-active">1</button>
  <button>2</button>
  <button>3</button>
  <button>4</button>
</div>`,
    jsCode: `const wrap = document.querySelector("[data-pagination]");
const indicator = document.querySelector("[data-pagination-indicator]");
const buttons = [...wrap.querySelectorAll("button")];

buttons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    indicator.style.transform = \`translateX(\${i * 38}px)\`;
  });
});`,
    tags: ["ページネーション", "スライド", "ナビゲーション"],
    useCase: "ブログ一覧・商品一覧・お知らせ一覧などのページ送りUI",
    moodTags: ["モダン", "見やすい"]
  },
  {
    slug: "photo-stack-hover-fan",
    name: "重なった写真がホバーで扇状に広がる",
    category: "image",
    description: "数枚重ねて置かれた写真に、ホバーすると扇形に少しずつ回転しながら広がる。ポートフォリオ系サイトで見られる見せ方",
    cssCode: `.photo-stack {
  position: relative;
  width: 220px;
  height: 220px;
}
.photo-stack img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom center;
}
.photo-stack img:nth-child(1) { transform: rotate(0deg); z-index: 3; }
.photo-stack img:nth-child(2) { transform: rotate(0deg); z-index: 2; }
.photo-stack img:nth-child(3) { transform: rotate(0deg); z-index: 1; }
.photo-stack:hover img:nth-child(1) { transform: rotate(-10deg) translateX(-16px); }
.photo-stack:hover img:nth-child(2) { transform: rotate(0deg) translateY(-6px); }
.photo-stack:hover img:nth-child(3) { transform: rotate(10deg) translateX(16px); }
@media (prefers-reduced-motion: reduce) {
  .photo-stack img {
    transition: none;
  }
}`,
    htmlSnippet: `<div class="photo-stack">
  <img src="photo1.jpg" alt="">
  <img src="photo2.jpg" alt="">
  <img src="photo3.jpg" alt="">
</div>`,
    jsCode: null,
    tags: ["写真", "ホバー", "ポートフォリオ", "スタック"],
    useCase: "制作実績・お客様事例・ギャラリーなど、複数の写真をコンパクトに1箇所へまとめて見せたいカード",
    moodTags: ["オシャレ", "カッコイイ"]
  },
  {
    slug: "media-filmstrip-strip",
    name: "横並びフィルムストリップ（自動スクロール帯）",
    category: "装飾",
    description: "ヒーロー下部などに、実績写真や商品写真を横一列に並べた帯をゆっくり自動スクロールさせる（marquee-loopの画像版）",
    cssCode: `.filmstrip {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.filmstrip-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: filmstrip-scroll 30s linear infinite;
}
.filmstrip-track img {
  height: 120px;
  width: auto;
  border-radius: 8px;
  display: block;
}
@keyframes filmstrip-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.filmstrip:hover .filmstrip-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .filmstrip-track {
    animation: none;
  }
}`,
    htmlSnippet: `<div class="filmstrip">
  <div class="filmstrip-track">
    <img src="work1.jpg" alt="">
    <img src="work2.jpg" alt="">
    <img src="work3.jpg" alt="">
    <img src="work1.jpg" alt="">
    <img src="work2.jpg" alt="">
    <img src="work3.jpg" alt="">
  </div>
</div>`,
    jsCode: null,
    tags: ["フィルムストリップ", "自動スクロール", "ギャラリー"],
    useCase: "ヒーロー直下やフッター付近で、制作実績・商品ラインナップを一覧的に流し見せたいセクション（画像は同じ配列を2連結してループ）",
    moodTags: ["モダン", "カッコイイ"]
  },
  {
    slug: "light-beam-glow-bg",
    name: "斜めに差し込む光の筋（背景演出）",
    category: "background",
    description: "暗い背景に、斜めのグラデーション光がゆっくり明滅しながら差し込む。SaaS系の重厚なヒーロー背景で定番",
    cssCode: `.beam-wrap {
  position: relative;
  overflow: hidden;
  background: #0b0e14;
  isolation: isolate;
}
.beam {
  position: absolute;
  top: -20%;
  width: 2px;
  height: 140%;
  background: linear-gradient(180deg, transparent, rgba(168, 140, 255, 0.6), transparent);
  filter: blur(1px);
  transform: rotate(20deg);
  animation: beam-glow 4s ease-in-out infinite;
  z-index: -1;
}
.beam--1 { left: 20%; animation-delay: 0s; }
.beam--2 { left: 50%; animation-delay: 1.3s; }
.beam--3 { left: 78%; animation-delay: 2.6s; }
@keyframes beam-glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.8; }
}
@media (prefers-reduced-motion: reduce) {
  .beam {
    animation: none;
    opacity: 0.4;
  }
}`,
    htmlSnippet: `<div class="beam-wrap">
  <span class="beam beam--1"></span>
  <span class="beam beam--2"></span>
  <span class="beam beam--3"></span>
  <h1>次世代のセキュリティ基盤</h1>
</div>`,
    jsCode: null,
    tags: ["背景", "光", "グロー", "SaaS"],
    useCase: "SaaS・セキュリティ・テクノロジー系LP/HPの暗いヒーローセクションに重厚感・先進感を出したい場面",
    moodTags: ["カッコイイ", "モダン"]
  }
];
