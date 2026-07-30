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

// 数字カウントアップ（ネオン登録アニメーション count-up-number）
function countUp(el, duration = 1500) {
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
}, { threshold: 0.4 });

document.querySelectorAll(".stats-badge").forEach((el) => statsObserver.observe(el));

// CTAクリック時のトースト通知（ネオン登録アニメーション toast-notification-slide）
function showToast(message, duration = 4000) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), duration);
}

// クリック位置から波紋が広がる押下フィードバック（ネオン登録アニメーション ripple-click-effect）
function spawnRipple(button, x, y) {
  const rect = button.getBoundingClientRect();
  const circle = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  circle.className = "ripple-circle";
  circle.style.width = circle.style.height = `${size}px`;
  circle.style.left = `${x - rect.left - size / 2}px`;
  circle.style.top = `${y - rect.top - size / 2}px`;
  button.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());
}

document.querySelectorAll(".cta-trigger").forEach((el) => {
  el.addEventListener("click", (event) => {
    spawnRipple(el, event.clientX, event.clientY);
    showToast(el.dataset.toast || "ご興味をお持ちいただきありがとうございます。現在お申し込みフォームを準備中です。");
  });
});
