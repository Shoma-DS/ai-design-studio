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
  let cardWidth = carousel.clientWidth;

  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "indicator-dot" + (i === 0 ? " active" : "");
    indicator.appendChild(dot);
  });
  const dots = Array.from(indicator.children);

  // 「章」の中に複数カード（デザイン一覧・予告カード→本編カードなど）を持つカードを
  // 横スワイプ対応の「グループ」として扱う。1枚のカードにつき独立したchildIndexを持つ。
  const groups = cards.map((card) => {
    if (!card.classList.contains("card--group")) return null;
    const hTrack = card.querySelector(".h-track");
    const hCards = Array.from(hTrack.children);
    const hIndicator = card.querySelector(".h-indicator");
    const hPrevBtn = card.querySelector(".h-nav--prev");
    const hNextBtn = card.querySelector(".h-nav--next");

    hCards.forEach((_, ci) => {
      const dot = document.createElement("span");
      dot.className = "indicator-dot" + (ci === 0 ? " active" : "");
      hIndicator.appendChild(dot);
    });

    return {
      childIndex: 0,
      hTrack,
      hCards,
      hDots: Array.from(hIndicator.children),
      hPrevBtn,
      hNextBtn,
    };
  });

  function render() {
    track.style.transform = `translateY(${-index * cardHeight}px)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cards.length - 1;
  }

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(cards.length - 1, nextIndex));
    render();
  }

  function renderH(i) {
    const g = groups[i];
    if (!g) return;
    g.hTrack.style.transform = `translateX(${-g.childIndex * cardWidth}px)`;
    g.hDots.forEach((dot, ci) => dot.classList.toggle("active", ci === g.childIndex));
    g.hCards.forEach((hCard, ci) => hCard.classList.toggle("is-active", ci === g.childIndex));
    g.hPrevBtn.disabled = g.childIndex === 0;
    g.hNextBtn.disabled = g.childIndex === g.hCards.length - 1;
  }

  function goToChild(i, nextChildIndex) {
    const g = groups[i];
    if (!g) return;
    g.childIndex = Math.max(0, Math.min(g.hCards.length - 1, nextChildIndex));
    renderH(i);
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  stickyCtaButton.addEventListener("click", () => goTo(cards.length - 1));

  groups.forEach((g, i) => {
    if (!g) return;
    g.hPrevBtn.addEventListener("click", () => goToChild(i, g.childIndex - 1));
    g.hNextBtn.addEventListener("click", () => goToChild(i, g.childIndex + 1));
  });

  window.addEventListener("resize", () => {
    cardHeight = carousel.clientHeight;
    cardWidth = carousel.clientWidth;
    render();
    groups.forEach((g, i) => renderH(i));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") goTo(index + 1);
    if (e.key === "ArrowUp") goTo(index - 1);
    if (groups[index]) {
      if (e.key === "ArrowRight") goToChild(index, groups[index].childIndex + 1);
      if (e.key === "ArrowLeft") goToChild(index, groups[index].childIndex - 1);
    }
  });

  // Pointer Events + setPointerCapture でマウス/タッチ/ペンを一括対応。
  // キャプチャすることで、指やカーソルがカード外に出ても pointerup/cancel を確実に拾える。
  // グループカード表示中だけ、動き始めのdeltaX/deltaYを比較して縦(章の切り替え)か
  // 横(章内カードの切り替え)かを判定する。判定後は軸を切り替えない（斜め移動でのブレを防ぐ）。
  const AXIS_LOCK_THRESHOLD = 6;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let dragging = false;
  let dragAxis = null; // "vertical" | "horizontal" | null（未確定）
  let activePointerId = null;

  function pointerDown(x, y, pointerId) {
    dragging = true;
    activePointerId = pointerId;
    startX = x;
    startY = y;
    currentX = x;
    currentY = y;
    dragAxis = groups[index] ? null : "vertical";
    track.style.transition = "none";
    if (groups[index]) groups[index].hTrack.style.transition = "none";
  }

  function pointerMove(x, y) {
    if (!dragging) return;
    currentX = x;
    currentY = y;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (dragAxis === null) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < AXIS_LOCK_THRESHOLD) return;
      dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    if (dragAxis === "horizontal") {
      const g = groups[index];
      g.hTrack.style.transform = `translateX(${-g.childIndex * cardWidth + deltaX}px)`;
    } else {
      track.style.transform = `translateY(${-index * cardHeight + deltaY}px)`;
    }
  }

  function pointerUp(x, y) {
    if (!dragging) return;
    dragging = false;
    activePointerId = null;
    track.style.transition = "";
    if (groups[index]) groups[index].hTrack.style.transition = "";

    // pointermove が来ない/間引かれる環境でも判定できるよう、release時の座標も終点として採用する。
    const endX = typeof x === "number" ? x : currentX;
    const endY = typeof y === "number" ? y : currentY;

    if (dragAxis === "horizontal") {
      const g = groups[index];
      const deltaX = endX - startX;
      const threshold = cardWidth * 0.18;
      if (deltaX < -threshold) {
        goToChild(index, g.childIndex + 1);
      } else if (deltaX > threshold) {
        goToChild(index, g.childIndex - 1);
      } else {
        renderH(index);
      }
    } else {
      const deltaY = endY - startY;
      const threshold = cardHeight * 0.18;
      if (deltaY < -threshold) {
        goTo(index + 1);
      } else if (deltaY > threshold) {
        goTo(index - 1);
      } else {
        render();
      }
    }
    dragAxis = null;
  }

  carousel.addEventListener("pointerdown", (e) => {
    // ボタン類の上から始まった場合はスワイプ検知しない（ボタンの click を握りつぶさないため）
    if (e.target.closest("button")) return;
    carousel.setPointerCapture(e.pointerId);
    pointerDown(e.clientX, e.clientY, e.pointerId);
  });
  carousel.addEventListener("pointermove", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerMove(e.clientX, e.clientY);
  });
  carousel.addEventListener("pointerup", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerUp(e.clientX, e.clientY);
  });
  carousel.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerUp(e.clientX, e.clientY);
  });

  render();
  groups.forEach((g, i) => renderH(i));
})();
