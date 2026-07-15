import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { animations } from "../animations-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "animations-preview.html");

const CATEGORY_LABELS = {
  title: "タイトル・テキスト",
  scroll: "スクロール演出",
  button: "ボタン",
  cta: "CTA",
  image: "画像",
  number: "数字",
  background: "背景",
  navigation: "ナビゲーション",
  notification: "通知",
  loading: "ローディング",
  form: "フォーム",
  ui: "UI部品",
  "装飾": "装飾"
};

// スクロール連動のデモだけ、要素が最初は画面外(下)にあるようにfillerの高さを個別調整する。
// scroll-progress-bar / back-to-top-fade / text-scroll-driven-reveal は自動スクロール対象から外す。
const SCROLL_DEMO_CONFIG = {
  "scroll-fade-up": { top: 260, bottom: 60 },
  "parallax-bg": { top: 200, bottom: 100 },
  "sticky-cta-bar-slideup": { top: 200, bottom: 100 }
};
const SCROLL_DEMO_SLUGS = Object.keys(SCROLL_DEMO_CONFIG);

// スクロール対象から外した4件は、動きの代わりにデモ専用の追加HTML/スクリプトでSample表示・
// 本物のトランジション/アニメーションをタイマーで繰り返し再生する。
const DEMO_EXTRA_HTML = {
  "scroll-progress-bar": '<div style="margin-top:24px;color:#666;font-size:16px;">Sample <span class="demo-pct-label">0%</span></div>',
  "back-to-top-fade": '<div style="margin-top:80px;color:#666;font-size:16px;">Sample</div>'
};
const DEMO_EXTRA_SCRIPTS = {
  "scroll-progress-bar": `var demoBar = document.querySelector(".scroll-progress");
var demoPctLabel = document.querySelector(".demo-pct-label");
var demoPct = 0;
var demoPctDir = 1;
setInterval(function () {
  demoPct += demoPctDir * 4;
  if (demoPct >= 100) { demoPct = 100; demoPctDir = -1; }
  if (demoPct <= 0) { demoPct = 0; demoPctDir = 1; }
  demoBar.style.width = demoPct + "%";
  demoPctLabel.textContent = demoPct + "%";
}, 100);`,
  "back-to-top-fade": `var backToTopBtn = document.querySelector(".back-to-top");
setInterval(function () { backToTopBtn.classList.toggle("is-visible"); }, 2200);`,
  "text-scroll-driven-reveal": `document.querySelector(".scroll-reveal-text").classList.add("demo-loop");`,
  "sticky-cta-bar-slideup": `document.querySelector(".sticky-cta-bar").classList.add("is-visible");
window.addEventListener("scroll", function () {
  document.querySelector(".sticky-cta-bar").classList.add("is-visible");
});`
};
const DEMO_EXTRA_STYLES = {
  "scroll-progress-bar": `.scroll-progress { height: 10px !important; }`,
  "text-scroll-driven-reveal": `.scroll-reveal-text.demo-loop {
  animation: demoScrollReveal 2s ease-in-out infinite;
}
@keyframes demoScrollReveal {
  0% { clip-path: inset(0 100% 0 0); }
  50% { clip-path: inset(0 0 0 0); }
  100% { clip-path: inset(0 100% 0 0); }
}`
};

// 上部の絞り込みボタンは「ムード」ではなく機能タグ(category)で行う。
const MOOD_ORDER = Object.keys(CATEGORY_LABELS);

const HOVER_HINT_SLUGS = [
  "card-flip-3d",
  "title-twist-hover",
  "button-shine-sweep",
  "image-hover-zoom",
  "marquee-hover-slow"
];

// 本物の:hoverが効く要素向け: 何もしていない間は force-hover クラスを自動で点滅させる。
// 対象の要素は小さくカーソルを正確に乗せにくいため、iframe内のどこにマウスが入っても
// (documentレベルで検知)自動ループを止めて本物の:hoverに任せ、iframeから出たら再開する。
function pausableHoverLoop(selector, intervalMs) {
  return 'var hoverEl = document.querySelector("' + selector + '");'
    + 'var hoverTimer = setInterval(function () { hoverEl.classList.toggle("force-hover"); }, ' + intervalMs + ');'
    + 'document.documentElement.addEventListener("mouseenter", function () { clearInterval(hoverTimer); hoverEl.classList.remove("force-hover"); });'
    + 'document.documentElement.addEventListener("mouseleave", function () { hoverTimer = setInterval(function () { hoverEl.classList.toggle("force-hover"); }, ' + intervalMs + '); });';
}

// プレビュー専用の自動デモ駆動スクリプト。DBに保存された本来のjsCodeは変更せず、
// iframeの中だけで一定間隔ごとに操作をシミュレートして「常に動いている」ように見せる。
const AUTO_DEMO_SCRIPTS = {
  "hamburger-menu-morph": `setInterval(function () {
  document.querySelector(".hamburger").classList.toggle("is-open");
}, 2600);`,
  "accordion-toggle": `setInterval(function () {
  document.querySelector(".accordion-item").classList.toggle("is-open");
}, 3200);`,
  "drawer-slide-menu": `setInterval(function () {
  var d = document.querySelector(".drawer");
  var o = document.querySelector(".drawer-overlay");
  var open = d.classList.contains("is-open");
  d.classList.toggle("is-open", !open);
  o.classList.toggle("is-open", !open);
}, 3200);`,
  "toast-notification-slide": `showToast("Sample notification");
setInterval(function () { showToast("Sample notification"); }, 5000);`,
  "ripple-click-effect": `setInterval(function () {
  var btn = document.querySelector(".ripple");
  var rect = btn.getBoundingClientRect();
  btn.dispatchEvent(new MouseEvent("click", {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    bubbles: true
  }));
}, 2800);`,
  "modal-fade-scale": `setInterval(function () {
  var overlay = document.querySelector(".modal-overlay");
  overlay.classList.toggle("is-open");
}, 3500);`,
  "tab-switch-fade": `var tabButtons = document.querySelectorAll(".tab-button");
var tabIndex = 0;
setInterval(function () {
  tabIndex = (tabIndex + 1) % tabButtons.length;
  tabButtons[tabIndex].click();
}, 3000);`,
  "custom-checkbox": `var cb = document.querySelector(".custom-checkbox input");
setInterval(function () { cb.checked = !cb.checked; }, 2800);`,
  "custom-radio-button": `var radios = document.querySelectorAll(".custom-radio input");
var radioIdx = 0;
setInterval(function () {
  radioIdx = (radioIdx + 1) % radios.length;
  radios[radioIdx].checked = true;
}, 2800);`,
  "toggle-switch": `var toggle = document.querySelector(".toggle-switch input");
setInterval(function () { toggle.checked = !toggle.checked; }, 2800);`,
  "range-slider-custom": `var slider = document.querySelector(".range-slider");
var dir = 1;
setInterval(function () {
  var v = Number(slider.value) + dir * 6;
  if (v >= 100) { v = 100; dir = -1; }
  if (v <= 0) { v = 0; dir = 1; }
  slider.value = v;
}, 400);`,
  "star-rating-input": `var stars = document.querySelectorAll(".star-rating input");
var starIdx = 0;
setInterval(function () {
  starIdx = (starIdx + 1) % stars.length;
  stars[starIdx].checked = true;
}, 2200);`,
  "segmented-control": `var segs = document.querySelectorAll(".segmented-control input");
var segIdx = 0;
setInterval(function () {
  segIdx = (segIdx + 1) % segs.length;
  segs[segIdx].checked = true;
  segs[segIdx].dispatchEvent(new Event("change", { bubbles: true }));
}, 2800);`,
  "custom-select-dropdown": `var customSelect = document.querySelector(".custom-select");
var selectOptions = customSelect.querySelectorAll(".options div");
var selectIdx = 0;
setInterval(function () {
  customSelect.classList.add("is-open");
  setTimeout(function () {
    selectIdx = (selectIdx + 1) % selectOptions.length;
    selectOptions[selectIdx].click();
  }, 1200);
}, 3500);`,
  "custom-radio-card": `var planCards = document.querySelectorAll(".radio-card input");
var planIdx = 0;
setInterval(function () {
  planIdx = (planIdx + 1) % planCards.length;
  planCards[planIdx].checked = true;
}, 2800);`,
  "input-underline-focus": `var focusInput = document.querySelector(".input-underline");
setInterval(function () {
  if (document.activeElement === focusInput) { focusInput.blur(); } else { focusInput.focus({ preventScroll: true }); }
}, 2800);`,
  "card-flip-3d": pausableHoverLoop(".flip-card", 2600),
  "title-twist-hover": pausableHoverLoop(".twist-hover", 2600),
  "button-shine-sweep": pausableHoverLoop(".btn-shine", 2800),
  "image-hover-zoom": pausableHoverLoop(".hover-zoom", 3000)
};

// force-hoverクラス用の追加CSS(:hover疑似クラスはJSから発火できないため、
// プレビューだけ同じ見た目になるクラスを別途用意している)
const AUTO_DEMO_STYLES = {
  "card-flip-3d": `.flip-card.force-hover .flip-card-inner { transform: rotateY(180deg); }`,
  "title-twist-hover": `.twist-hover.force-hover { transform: rotateX(360deg); }`,
  "button-shine-sweep": `.btn-shine.force-hover::before { left: 125%; }`,
  "image-hover-zoom": `.hover-zoom.force-hover img { transform: scale(1.08); }`
};

const dataJson = JSON.stringify(animations).replace(/<\/script/gi, "<\\/script");
const labelsJson = JSON.stringify(CATEGORY_LABELS);
const scrollSlugsJson = JSON.stringify(SCROLL_DEMO_SLUGS);
const scrollConfigJson = JSON.stringify(SCROLL_DEMO_CONFIG);
const moodOrderJson = JSON.stringify(MOOD_ORDER);
const hoverHintSlugsJson = JSON.stringify(HOVER_HINT_SLUGS);
const autoDemoScriptsJson = JSON.stringify(AUTO_DEMO_SCRIPTS).replace(/<\/script/gi, "<\\/script");
const autoDemoStylesJson = JSON.stringify(AUTO_DEMO_STYLES);
const demoExtraHtmlJson = JSON.stringify(DEMO_EXTRA_HTML).replace(/<\/script/gi, "<\\/script");
const demoExtraScriptsJson = JSON.stringify(DEMO_EXTRA_SCRIPTS).replace(/<\/script/gi, "<\\/script");
const demoExtraStylesJson = JSON.stringify(DEMO_EXTRA_STYLES);

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>アニメーションスニペット プレビュー</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
    margin: 0;
    padding: 32px;
    background: #f5f5f7;
    color: #1a1a1a;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #16161a; color: #eee; }
    .card { background: #222 !important; border-color: #333 !important; }
  }
  h1 { font-size: 24px; margin-bottom: 6px; }
  .sub { color: #777; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
  @media (prefers-color-scheme: dark) { .sub { color: #aaa; } }
  h2.category {
    font-size: 18px;
    margin: 40px 0 16px;
    padding-bottom: 6px;
    border-bottom: 2px solid #ddd;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  .card {
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .demo {
    height: 220px;
    border-bottom: 1px solid #e2e2e2;
    position: relative;
  }
  .demo iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  .replay {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.95);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .demo:hover .replay,
  .demo:focus-within .replay {
    opacity: 1;
  }
  .cardbody { padding: 16px 18px; }
  .name { font-weight: 700; font-size: 16px; margin-bottom: 6px; }
  .slug { font-size: 12px; color: #999; margin-bottom: 10px; }
  .desc { font-size: 14px; line-height: 1.7; color: #444; margin-bottom: 10px; }
  @media (prefers-color-scheme: dark) { .desc { color: #ccc; } }
  .use-case { font-size: 13px; color: #6a4fd6; margin-bottom: 10px; line-height: 1.6; }
  @media (prefers-color-scheme: dark) { .use-case { color: #b8a6ff; } }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag {
    font-size: 11.5px;
    background: #f0eefc;
    color: #6a4fd6;
    padding: 3px 10px;
    border-radius: 999px;
  }
  @media (prefers-color-scheme: dark) {
    .tag { background: #2a2440; color: #b8a6ff; }
  }
  .mood-tag {
    font-size: 11.5px;
    background: #eef6f0;
    color: #1f8a4c;
    padding: 3px 10px;
    border-radius: 999px;
    font-weight: 700;
  }
  @media (prefers-color-scheme: dark) {
    .mood-tag { background: #16321f; color: #6fd695; }
  }
  .hover-hint {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(26, 26, 26, 0.8);
    color: #fff;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 2;
  }
  .demo:hover .hover-hint {
    opacity: 0;
  }
  .mood-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
  .mood-filter button {
    font-size: 13px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
  }
  .mood-filter button.is-active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }
  @media (prefers-color-scheme: dark) {
    .mood-filter button { background: #222; color: #eee; border-color: #444; }
    .mood-filter button.is-active { background: #6fd695; color: #111; border-color: #6fd695; }
  }
  .card.is-hidden { display: none; }
</style>
</head>
<body>
<h1>アニメーションスニペット プレビュー</h1>
<div class="sub">Neon DB (animations テーブル) の内容をローカルで確認する一覧。ホバー・クリック・スクロールで動きを確認できます。一度きりの演出は右上の「再生」で再実行できます。</div>
<div class="mood-filter" id="mood-filter"></div>
<div id="root"></div>

<script id="animations-data" type="application/json">${dataJson}</script>
<script id="category-labels" type="application/json">${labelsJson}</script>
<script id="scroll-demo-slugs" type="application/json">${scrollSlugsJson}</script>
<script id="scroll-demo-config" type="application/json">${scrollConfigJson}</script>
<script id="mood-order" type="application/json">${moodOrderJson}</script>
<script id="hover-hint-slugs" type="application/json">${hoverHintSlugsJson}</script>
<script id="auto-demo-scripts" type="application/json">${autoDemoScriptsJson}</script>
<script id="auto-demo-styles" type="application/json">${autoDemoStylesJson}</script>
<script id="demo-extra-html" type="application/json">${demoExtraHtmlJson}</script>
<script id="demo-extra-scripts" type="application/json">${demoExtraScriptsJson}</script>
<script id="demo-extra-styles" type="application/json">${demoExtraStylesJson}</script>
<script>
(function () {
  var animations = JSON.parse(document.getElementById("animations-data").textContent);
  var categoryLabels = JSON.parse(document.getElementById("category-labels").textContent);
  var scrollDemoSlugs = JSON.parse(document.getElementById("scroll-demo-slugs").textContent);
  var scrollDemoConfig = JSON.parse(document.getElementById("scroll-demo-config").textContent);
  var moodOrder = JSON.parse(document.getElementById("mood-order").textContent);
  var hoverHintSlugs = JSON.parse(document.getElementById("hover-hint-slugs").textContent);
  var autoDemoScripts = JSON.parse(document.getElementById("auto-demo-scripts").textContent);
  var autoDemoStyles = JSON.parse(document.getElementById("auto-demo-styles").textContent);
  var demoExtraHtml = JSON.parse(document.getElementById("demo-extra-html").textContent);
  var demoExtraScripts = JSON.parse(document.getElementById("demo-extra-scripts").textContent);
  var demoExtraStyles = JSON.parse(document.getElementById("demo-extra-styles").textContent);
  var activeMood = "すべて";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildIframeDoc(entry) {
    var needsScrollFiller = scrollDemoSlugs.indexOf(entry.slug) !== -1;
    var config = scrollDemoConfig[entry.slug] || { top: 120, bottom: 80 };
    var fillerTop = needsScrollFiller
      ? '<div style="height:' + config.top + 'px;"></div>'
      : "";
    var fillerBottom = needsScrollFiller ? '<div style="height:' + config.bottom + 'px;"></div>' : "";
    var justify = needsScrollFiller ? "flex-start" : "center";

    // 自動スクロールはしない。ユーザーが実際にiframe内をスクロールした時だけ動く。
    var autoScrollScript = "";

    return "<!doctype html><html><head><meta charset=\\"UTF-8\\"><style>"
      + "body{margin:0;min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:" + justify + ";font-family:-apple-system,sans-serif;background:#fafafa;padding:16px;box-sizing:border-box;}"
      + (entry.cssCode || "")
      + (autoDemoStyles[entry.slug] || "")
      + (demoExtraStyles[entry.slug] || "")
      + "</style></head><body>"
      + fillerTop
      + (entry.htmlSnippet || "")
      + (demoExtraHtml[entry.slug] || "")
      + fillerBottom
      + "<script>" + (entry.jsCode || "") + ";" + (autoDemoScripts[entry.slug] || "") + (demoExtraScripts[entry.slug] || "") + autoScrollScript + "<\\/script>"
      + "</body></html>";
  }

  var grouped = {};
  var order = [];
  animations.forEach(function (entry) {
    if (!grouped[entry.category]) {
      grouped[entry.category] = [];
      order.push(entry.category);
    }
    grouped[entry.category].push(entry);
  });

  var root = document.getElementById("root");

  order.forEach(function (category) {
    var items = grouped[category];

    var h2 = document.createElement("h2");
    h2.className = "category";
    h2.textContent = (categoryLabels[category] || category) + " (" + items.length + ")";
    root.appendChild(h2);

    var grid = document.createElement("div");
    grid.className = "grid";

    items.forEach(function (entry) {
      var moods = entry.moodTags || [];
      var card = document.createElement("div");
      card.className = "card";
      card.dataset.moods = entry.category;

      var demo = document.createElement("div");
      demo.className = "demo";

      var iframe = document.createElement("iframe");
      iframe.srcdoc = buildIframeDoc(entry);
      demo.appendChild(iframe);

      setInterval(function () {
        iframe.srcdoc = buildIframeDoc(entry);
      }, 12000);

      demo.addEventListener("mouseenter", function () {
        iframe.srcdoc = buildIframeDoc(entry);
      });

      var replay = document.createElement("button");
      replay.className = "replay";
      replay.textContent = "再生";
      replay.addEventListener("click", function () {
        iframe.srcdoc = buildIframeDoc(entry);
      });
      demo.appendChild(replay);

      if (hoverHintSlugs.indexOf(entry.slug) !== -1) {
        var hint = document.createElement("div");
        hint.className = "hover-hint";
        hint.textContent = "↖ ホバーしてください";
        demo.appendChild(hint);
      }

      if (scrollDemoSlugs.indexOf(entry.slug) !== -1) {
        var scrollHint = document.createElement("div");
        scrollHint.className = "hover-hint";
        scrollHint.textContent = "↓ スクロールしてください";
        demo.appendChild(scrollHint);
      }

      var tagsHtml = (entry.tags || [])
        .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
        .join("");
      var moodTagsHtml = moods
        .map(function (m) { return '<span class="mood-tag">' + escapeHtml(m) + "</span>"; })
        .join("");
      var useCaseHtml = entry.useCase
        ? '<div class="use-case">用途: ' + escapeHtml(entry.useCase) + "</div>"
        : "";

      var body = document.createElement("div");
      body.className = "cardbody";
      body.innerHTML =
        '<div class="name">' + escapeHtml(entry.name) + "</div>"
        + '<div class="slug">' + escapeHtml(entry.slug) + "</div>"
        + '<div class="desc">' + escapeHtml(entry.description) + "</div>"
        + useCaseHtml
        + '<div class="tags">' + moodTagsHtml + tagsHtml + "</div>";

      card.appendChild(demo);
      card.appendChild(body);
      grid.appendChild(card);
    });

    root.appendChild(grid);
  });

  function applyMoodFilter(mood) {
    activeMood = mood;
    document.querySelectorAll(".mood-filter button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.mood === mood);
    });
    document.querySelectorAll(".card").forEach(function (card) {
      var moods = (card.dataset.moods || "").split(",").filter(Boolean);
      var show = mood === "すべて" || moods.indexOf(mood) !== -1;
      card.classList.toggle("is-hidden", !show);
    });
    document.querySelectorAll(".category").forEach(function (h2) {
      var grid = h2.nextElementSibling;
      var visibleCount = Array.prototype.filter.call(grid.children, function (card) {
        return !card.classList.contains("is-hidden");
      }).length;
      var showSection = visibleCount > 0;
      h2.style.display = showSection ? "" : "none";
      grid.style.display = showSection ? "" : "none";
    });
  }

  var filterBar = document.getElementById("mood-filter");
  ["すべて"].concat(moodOrder).forEach(function (mood) {
    var btn = document.createElement("button");
    btn.textContent = mood === "すべて" ? "すべて" : (categoryLabels[mood] || mood);
    btn.dataset.mood = mood;
    if (mood === "すべて") btn.classList.add("is-active");
    btn.addEventListener("click", function () { applyMoodFilter(mood); });
    filterBar.appendChild(btn);
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT_PATH, html, "utf8");
console.log(`プレビューを生成しました: ${OUT_PATH}`);
