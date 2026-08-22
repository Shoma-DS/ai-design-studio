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
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document.querySelectorAll(".select-btn").forEach((button) =>
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    document.querySelectorAll(".select-btn").forEach((item) => {
      item.setAttribute("aria-pressed", "false");
      item.querySelector("span").textContent = "この商品を選ぶ";
    });
    button.setAttribute("aria-pressed", "true");
    button.querySelector("span").textContent = "選択しました";
    document.querySelector("#selection").textContent =
      `${name}を選択しました。※このLPは架空ブランドのため、購入画面には進みません。`;
  }),
);
