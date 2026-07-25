let banners = window.BANNER_GALLERY_DATA ?? [];
let activeCategory = "すべて";

const search = document.querySelector("#search");
const filters = document.querySelector("#filters");
const grid = document.querySelector("#grid");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const modal = document.querySelector("#modal");

function matches(item) {
  const query = search.value.trim().toLowerCase();
  const haystack = [
    item.title, item.heading, item.category,
    ...item.moodTags, ...item.productTags, ...item.featureTags
  ].join(" ").toLowerCase();
  return (!query || haystack.includes(query))
    && (activeCategory === "すべて" || item.category === activeCategory);
}

function openModal(item) {
  document.querySelector("#modal-image").src = item.imageUrl;
  document.querySelector("#modal-image").alt = item.title;
  document.querySelector("#modal-title").textContent = item.title;
  document.querySelector("#modal-link").href = item.url;
  modal.showModal();
}

function render() {
  const visible = banners.filter(matches);
  count.textContent = `${visible.length}件のバナー`;
  empty.hidden = visible.length > 0;
  grid.innerHTML = "";

  visible.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <button class="thumb" type="button">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      </button>
      <div class="copy">
        <p class="category">${item.category} · ${item.width}×${item.height}</p>
        <h2>${item.title}</h2>
        <p>${item.heading}</p>
        <div class="tags">${[...item.moodTags, ...item.featureTags].map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
    `;
    article.querySelector(".thumb").addEventListener("click", () => openModal(item));
    grid.append(article);
  });
}

function renderFilters() {
  const categories = ["すべて", ...new Set(banners.map((item) => item.category))];
  filters.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter${category === activeCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      render();
    });
    filters.append(button);
  });
}

document.querySelector("#close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
search.addEventListener("input", render);

try {
  const response = await fetch("/api/banners");
  if (response.ok) {
    const rows = await response.json();
    if (Array.isArray(rows) && rows.length) banners = rows;
  }
} catch {
  // data.js をオフラインフォールバックとして利用する。
}

renderFilters();
render();
