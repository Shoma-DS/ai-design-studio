(() => {
  const data = window.LP_GALLERY_DATA || [];
  const searchInput = document.getElementById("search-input");
  const categoryFilters = document.getElementById("category-filters");
  const cardGrid = document.getElementById("card-grid");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");

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
      const card = document.createElement("a");
      card.className = "card";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

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
