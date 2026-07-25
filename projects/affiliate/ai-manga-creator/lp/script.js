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

function trackClick(buttonLabel, targetUrl) {
  fetch("https://lp-portfolio-gallery.vercel.app/api/track-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageSlug: "ai-manga-creator-affiliate-lp",
      buttonLabel,
      targetUrl
    }),
    keepalive: true
  }).catch(() => {});
}

const ctaButton = document.querySelector(".cta-button");
const ctaReaction = document.querySelector(".cta-reaction");
if (ctaButton) {
  ctaButton.addEventListener("click", () => {
    ctaButton.classList.remove("clicked");
    void ctaButton.offsetWidth;
    ctaButton.classList.add("clicked");

    if (ctaReaction) {
      ctaReaction.classList.add("show");
      window.clearTimeout(ctaReaction._hideTimer);
      ctaReaction._hideTimer = window.setTimeout(() => {
        ctaReaction.classList.remove("show");
      }, 1800);
    }

    trackClick(ctaButton.textContent.trim(), ctaButton.href);
  });
}

document.querySelectorAll(".img-hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    hotspot.classList.remove("clicked");
    void hotspot.offsetWidth;
    hotspot.classList.add("clicked");
    trackClick(hotspot.dataset.label || hotspot.getAttribute("aria-label") || "image-hotspot", hotspot.href);
  });
});
