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
