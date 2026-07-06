(() => {
  const data = window.LP_GALLERY_DATA || [];
  const searchInput = document.getElementById("search-input");
  const categoryFilters = document.getElementById("category-filters");
  const cardGrid = document.getElementById("card-grid");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");

  const previewModal = document.getElementById("preview-modal");
  const previewTitle = document.getElementById("preview-modal-title");
  const previewOpenLink = document.getElementById("preview-modal-open");
  const previewIframe = document.getElementById("preview-iframe");
  const deviceFrame = document.getElementById("device-frame");
  const deviceButtons = previewModal.querySelectorAll(".device-btn");

  function setDevice(device) {
    deviceFrame.dataset.device = device;
    deviceButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.device === device);
    });
  }

  function openPreview(item) {
    previewTitle.textContent = item.title;
    previewOpenLink.href = item.url;
    previewIframe.src = item.url;
    setDevice("pc");
    previewModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    previewModal.hidden = true;
    previewIframe.src = "about:blank";
    document.body.style.overflow = "";
  }

  previewModal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close")) closePreview();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !previewModal.hidden) closePreview();
  });

  deviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => setDevice(btn.dataset.device));
  });

  const categories = ["すべて", ...new Set(data.map((item) => item.category))];
  let activeCategory = "すべて";
  let query = "";

  function renderChips() {
    categoryFilters.innerHTML = "";
    categories.forEach((category) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (category === activeCategory ? " active" : "");
      chip.textContent = category;
      chip.addEventListener("click", () => {
        activeCategory = category;
        renderChips();
        renderCards();
      });
      categoryFilters.appendChild(chip);
    });
  }

  function matchesQuery(item, q) {
    if (!q) return true;
    const haystack = [item.title, item.heading, ...item.tags].join(" ").toLowerCase();
    return haystack.includes(q.toLowerCase());
  }

  function renderCards() {
    const filtered = data.filter((item) => {
      const categoryOk = activeCategory === "すべて" || item.category === activeCategory;
      return categoryOk && matchesQuery(item, query);
    });

    cardGrid.innerHTML = "";
    filtered.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";

      card.innerHTML = `
        <img class="card-thumb" src="${item.thumbnail}" alt="${item.title}" />
        <div class="card-body">
          <span class="card-category">${item.category}</span>
          <p class="card-title">${item.title}</p>
          <p class="card-heading">${item.heading}</p>
          <div class="card-tags">
            ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      `;
      card.addEventListener("click", () => openPreview(item));
      cardGrid.appendChild(card);
    });

    resultCount.textContent = `${filtered.length}件 / 全${data.length}件`;
    emptyState.hidden = filtered.length !== 0;
  }

  searchInput.addEventListener("input", (event) => {
    query = event.target.value.trim();
    renderCards();
  });

  renderChips();
  renderCards();
})();
