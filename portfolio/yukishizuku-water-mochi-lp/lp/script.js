const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((section) => observer.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }),
);

const backToTop = document.querySelector(".back-to-top");
window.addEventListener(
  "scroll",
  () => backToTop.classList.toggle("is-visible", window.scrollY > 500),
  { passive: true },
);
backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }),
);

document.querySelector("[data-order]").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const note = document.querySelector(".note");
  button.disabled = true;
  button.querySelector("span").textContent = "ストアを準備しています";
  note.textContent = "こちらは架空商品のため、実際の購入はできません。";
  window.setTimeout(() => {
    button.disabled = false;
    button.querySelector("span").textContent = "オンラインストアへ";
  }, 1800);
});
