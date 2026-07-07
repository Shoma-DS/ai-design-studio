(() => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  const setMenuOpen = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Product carousel
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsWrap = document.getElementById("carousel-dots");

  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards = Array.from(track.children);
    let index = 0;

    const visibleCount = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    const maxIndex = () => Math.max(0, cards.length - visibleCount());

    const renderDots = () => {
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIndex(); i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === index ? " is-active" : "");
        dot.setAttribute("aria-label", `${i + 1}番目の商品を表示`);
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    };

    const update = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || "20");
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex();
      renderDots();
    };

    const goTo = (i) => {
      index = Math.min(Math.max(i, 0), maxIndex());
      update();
    };

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    window.addEventListener("resize", () => goTo(Math.min(index, maxIndex())));
    update();
  }

  // FAQ accordion
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? "0px" : `${panel.scrollHeight}px`;
    });
  });
})();
