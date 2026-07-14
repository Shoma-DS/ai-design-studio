(() => {
  const track = document.getElementById("track");
  const cards = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicator = document.getElementById("indicator");
  const carousel = document.getElementById("carousel");
  const stickyCtaButton = document.getElementById("stickyCtaButton");

  let index = 0;
  let cardHeight = carousel.clientHeight;

  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "indicator-dot" + (i === 0 ? " active" : "");
    indicator.appendChild(dot);
  });
  const dots = Array.from(indicator.children);

  function render() {
    track.style.transform = `translateY(${-index * cardHeight}px)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cards.length - 1;
  }

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(cards.length - 1, nextIndex));
    render();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  stickyCtaButton.addEventListener("click", () => goTo(cards.length - 1));

  window.addEventListener("resize", () => {
    cardHeight = carousel.clientHeight;
    render();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") goTo(index + 1);
    if (e.key === "ArrowUp") goTo(index - 1);
  });

  // Pointer Events + setPointerCapture でマウス/タッチ/ペンを一括対応（縦スワイプ）。
  // キャプチャすることで、指やカーソルがカード外に出ても pointerup/cancel を確実に拾える。
  let startY = 0;
  let currentY = 0;
  let dragging = false;
  let activePointerId = null;

  function pointerDown(y, pointerId) {
    dragging = true;
    activePointerId = pointerId;
    startY = y;
    currentY = y;
    track.style.transition = "none";
  }

  function pointerMove(y) {
    if (!dragging) return;
    currentY = y;
    const delta = currentY - startY;
    track.style.transform = `translateY(${-index * cardHeight + delta}px)`;
  }

  function pointerUp(y) {
    if (!dragging) return;
    dragging = false;
    activePointerId = null;
    track.style.transition = "";
    // pointermove が来ない/間引かれる環境でも判定できるよう、release時の座標も終点として採用する。
    const endY = typeof y === "number" ? y : currentY;
    const delta = endY - startY;
    const threshold = cardHeight * 0.18;
    if (delta < -threshold) {
      goTo(index + 1);
    } else if (delta > threshold) {
      goTo(index - 1);
    } else {
      render();
    }
  }

  carousel.addEventListener("pointerdown", (e) => {
    // ボタン類の上から始まった場合はスワイプ検知しない（ボタンの click を握りつぶさないため）
    if (e.target.closest("button")) return;
    carousel.setPointerCapture(e.pointerId);
    pointerDown(e.clientY, e.pointerId);
  });
  carousel.addEventListener("pointermove", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerMove(e.clientY);
  });
  carousel.addEventListener("pointerup", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerUp(e.clientY);
  });
  carousel.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerUp(e.clientY);
  });

  render();
})();
