/**
 * 株式会社ソラリンク 2028年卒 採用LP
 * 動きはすべてポートフォリオDB（Neon animations テーブル）に登録済みのスニペットを利用。
 * scroll-progress-bar / sticky-header-shrink / scroll-fade-up / count-up-number /
 * timeline-scroll-draw / accordion-toggle / sticky-cta-bar-slideup /
 * ripple-click-effect / toast-notification-slide / back-to-top-fade
 */

// ---- スクロール進行バー（scroll-progress-bar） ----
const progressBar = document.querySelector(".scroll-progress");

// ---- スクロールで縮む固定ヘッダー（sticky-header-shrink） ----
const header = document.querySelector("[data-sticky-header]");

// ---- スマホ固定CTAバー（sticky-cta-bar-slideup） ----
const stickyCta = document.querySelector(".sticky-cta-bar");

// ---- トップへ戻る（back-to-top-fade） ----
const backToTopBtn = document.querySelector(".back-to-top");

// ---- 選考フロー（timeline-scroll-draw） ----
const timeline = document.querySelector("[data-timeline]");
const timelineProgress = document.querySelector("[data-timeline-progress]");
const timelineItems = timeline ? [...timeline.querySelectorAll(".timeline-item")] : [];

function updateTimeline() {
  if (!timeline || !timelineProgress) return;
  const rect = timeline.getBoundingClientRect();
  const viewportCenter = window.innerHeight * 0.6;
  const percent = Math.min(100, Math.max(0, ((viewportCenter - rect.top) / rect.height) * 100));
  timelineProgress.style.height = `${percent}%`;
  timelineItems.forEach((item) => {
    item.classList.toggle("is-passed", item.getBoundingClientRect().top < viewportCenter);
  });
}

function onScroll() {
  const scrollTop = document.documentElement.scrollTop || window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && scrollHeight > 0) {
    progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
  }
  if (header) header.classList.toggle("is-shrunk", scrollTop > 40);
  if (stickyCta) stickyCta.classList.toggle("is-visible", scrollTop > 400);
  if (backToTopBtn) backToTopBtn.classList.toggle("is-visible", scrollTop > 400);
  updateTimeline();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ---- スクロールで下から表示（scroll-fade-up） ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---- 数字カウントアップ（count-up-number） ----
function countUp(el, duration = 1600) {
  const target = Number(el.dataset.target);
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".count-up").forEach((el) => countUp(el));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll(".stats").forEach((el) => statsObserver.observe(el));

// ---- アコーディオン開閉（accordion-toggle） ----
document.querySelectorAll(".accordion-head").forEach((head) => {
  head.setAttribute("aria-expanded", "false");
  head.addEventListener("click", () => {
    const item = head.parentElement;
    const opened = item.classList.toggle("is-open");
    head.setAttribute("aria-expanded", String(opened));
  });
});

// ---- トースト通知（toast-notification-slide） ----
function showToast(message, duration = 4000) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), duration);
}

// ---- クリックリップル（ripple-click-effect） ----
function spawnRipple(el, x, y) {
  const rect = el.getBoundingClientRect();
  const circle = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  circle.className = "ripple-circle";
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${x - rect.left - size / 2}px`;
  circle.style.top = `${y - rect.top - size / 2}px`;
  el.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());
}

document.querySelectorAll(".cta-trigger").forEach((el) => {
  el.addEventListener("click", (event) => {
    spawnRipple(el, event.clientX, event.clientY);
    showToast(el.dataset.toast || "エントリー受付は2027年3月開始予定です。公開までお待ちください。");
  });
});
