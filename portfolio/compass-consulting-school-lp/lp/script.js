// TODO: 実際のリンク先が決まったら、ここを書き換えるだけで全CTAボタンに反映されます
const CTA_LINKS = {
  line: "#", // 公式LINE無料相談の遷移先
  document: "#", // 資料ダウンロードの遷移先
};

document.querySelectorAll("[data-cta]").forEach((el) => {
  const url = CTA_LINKS[el.dataset.cta];
  if (url && url !== "#") {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  } else {
    el.addEventListener("click", (e) => e.preventDefault());
  }
});

// クリックリップルエフェクト（Neonアニメーション: ripple-click-effect）
document.querySelectorAll(".lp-cta").forEach((button) => {
  button.addEventListener("click", (e) => {
    const rect = button.getBoundingClientRect();
    const circle = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    circle.className = "lp-cta-ripple";
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(circle);
    circle.addEventListener("animationend", () => circle.remove());
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const backToTopBtn = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 400);
});
backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// FAQアコーディオン
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    item.classList.toggle("is-open", !isOpen);
  });
});

// スクロール進行バー（Neonアニメーション: scroll-progress-bar）
const scrollProgressBar = document.querySelector(".scroll-progress");
function updateScrollProgress() {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
}
window.addEventListener("scroll", updateScrollProgress);
