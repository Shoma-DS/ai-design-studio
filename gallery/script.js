(() => {
  const data = window.PORTFOLIO_GALLERY_DATA || [];
  const searchInput = document.getElementById("search-input");
  const cardGrid = document.getElementById("card-grid");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty-state");
  const typeTabs = document.getElementById("type-tabs");
  const typeTabButtons = typeTabs ? typeTabs.querySelectorAll(".type-tab") : [];

  const initialTabEl = typeTabs ? typeTabs.querySelector(".type-tab.active") : null;
  let activeType = initialTabEl ? initialTabEl.dataset.type : "lp";

  function typeData() {
    return data.filter((item) => item.type === activeType);
  }

  // overflow:hiddenだけだとホイール操作で背景がスクロールしてしまうため、
  // bodyをfixedにして現在位置を固定し、解除時に元のスクロール位置へ戻す。
  let lockedScrollY = 0;
  let scrollLockCount = 0;

  function lockBodyScroll() {
    if (scrollLockCount === 0) {
      lockedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }
    scrollLockCount += 1;
  }

  function unlockBodyScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, lockedScrollY);
    }
  }

  const previewModal = document.getElementById("preview-modal");
  const previewTitle = document.getElementById("preview-modal-title");
  const previewOpenLink = document.getElementById("preview-modal-open");
  const previewIframe = document.getElementById("preview-iframe");
  const deviceFrame = document.getElementById("device-frame");
  const deviceButtons = previewModal.querySelectorAll(".device-btn");

  const imageModal = document.getElementById("image-modal");
  const imageModalTitle = document.getElementById("image-modal-title");
  const imageModalOpenLink = document.getElementById("image-modal-open");
  const imageModalImg = document.getElementById("image-modal-img");

  function setDevice(device) {
    deviceFrame.dataset.device = device;
    deviceButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.device === device);
    });
  }

  // スマホ幅固定のスワイプ型LP（PC非対応）は、PCタブ自体を出さずスマホ表示に固定する。
  function isMobileOnlyItem(item) {
    return Array.isArray(item.featureTags) && item.featureTags.includes("スワイプ");
  }

  function openPreview(item) {
    previewTitle.textContent = item.title;
    previewOpenLink.href = item.url;
    previewIframe.src = item.url;
    const mobileOnly = isMobileOnlyItem(item);
    deviceButtons.forEach((btn) => {
      btn.hidden = mobileOnly && btn.dataset.device === "pc";
    });
    setDevice(mobileOnly ? "mobile" : "pc");
    previewModal.hidden = false;
    lockBodyScroll();
  }

  function closePreview() {
    previewModal.hidden = true;
    previewIframe.src = "about:blank";
    unlockBodyScroll();
  }

  function openImagePreview(item) {
    imageModalTitle.textContent = item.title;
    imageModalOpenLink.href = item.url;
    imageModalImg.src = item.url;
    imageModalImg.alt = item.title;
    imageModal.hidden = false;
    lockBodyScroll();
  }

  function closeImagePreview() {
    imageModal.hidden = true;
    imageModalImg.src = "";
    unlockBodyScroll();
  }

  function openCard(item) {
    if (item.linkType === "image") {
      openImagePreview(item);
    } else {
      openPreview(item);
    }
  }

  previewModal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close")) closePreview();
  });

  imageModal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close")) closeImagePreview();
  });

  deviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => setDevice(btn.dataset.device));
  });

  let query = "";

  // 中カテゴリ（大カテゴリ＝雰囲気/商品/機能の下にある、乗り物・飲食・コスメなどの括り）。
  // ここに載っていないタグは自動的に「その他」中カテゴリへ回す。
  const moodMidCategories = [
    { mid: "キュート系", tags: ["可愛い", "ポップ"] },
    { mid: "クール系", tags: ["カッコイイ", "クール"] },
    { mid: "上品・エレガント系", tags: ["上品", "ロマンティック", "ラグジュアリー"] },
    { mid: "ナチュラル・信頼系", tags: ["ナチュラル", "信頼感"] },
    { mid: "幻想系", tags: ["幻想的"] }
  ];

  const productMidCategories = [
    { mid: "乗り物・モビリティ", tags: ["自動車", "SUV", "モビリティ", "自転車"] },
    { mid: "飲食・食品", tags: ["食品", "味噌", "梅酒", "健康食品", "サプリメント"] },
    { mid: "美容・コスメ", tags: ["美容", "サロン", "コスメ", "ヘアケア", "スキンケア"] },
    { mid: "教育・学習", tags: ["教育", "スクール", "Webデザイン", "オンライン講座"] },
    { mid: "ビジネス・IT", tags: ["BtoB", "データサービス", "IT"] },
    { mid: "キャリア・人材", tags: ["人材", "転職"] },
    { mid: "エンタメ", tags: ["エンタメ", "占い"] },
    { mid: "自治体・公共", tags: ["自治体", "啓発", "SDGs"] },
    { mid: "建築", tags: ["建築", "倉庫建築"] }
  ];

  // 機能で探す＝LPに実装されている技術的なUI機能のみを対象にする（ビジネス上の訴求は商品タグ側で扱う）。
  const featureMidCategories = [
    { mid: "ナビゲーション", tags: ["ハンバーガーメニュー", "固定ヘッダー"] },
    { mid: "動き・演出", tags: ["アニメーション"] },
    { mid: "コンテンツ切替", tags: ["カルーセル", "アコーディオン"] },
    { mid: "表示対応", tags: ["レスポンシブ"] }
  ];

  function buildTaxonomy(midCategories, allTags) {
    const covered = new Set(midCategories.flatMap((group) => group.tags));
    const rest = allTags.filter((tag) => !covered.has(tag));
    return rest.length ? [...midCategories, { mid: "その他", tags: rest }] : midCategories;
  }

  // facetKey → { itemField: item上のタグ配列プロパティ名, taxonomy: 中カテゴリ定義, active/draft: 選択状態 }
  // タブ（制作タイプ）を切り替えるたびに、そのタイプのデータだけを対象にtaxonomy/選択状態を作り直す。
  const facets = {
    mood: { itemField: "moodTags", taxonomy: [], active: new Set(), draft: new Set() },
    product: { itemField: "productTags", taxonomy: [], active: new Set(), draft: new Set() },
    feature: { itemField: "featureTags", taxonomy: [], active: new Set(), draft: new Set() }
  };

  function rebuildFacets() {
    const scoped = typeData();
    facets.mood.taxonomy = buildTaxonomy(moodMidCategories, [...new Set(scoped.flatMap((item) => item.moodTags || []))]);
    facets.product.taxonomy = buildTaxonomy(productMidCategories, [...new Set(scoped.flatMap((item) => item.productTags || []))]);
    facets.feature.taxonomy = buildTaxonomy(featureMidCategories, [...new Set(scoped.flatMap((item) => item.featureTags || []))]);
    Object.keys(facets).forEach((key) => {
      facets[key].active = new Set();
      facets[key].draft = new Set();
      updateActiveFilterBadge(key);
    });
  }

  function matchesTagSet(itemTags, activeSet) {
    if (activeSet.size === 0) return true;
    return (itemTags || []).some((tag) => activeSet.has(tag));
  }

  function matchesQuery(item, q) {
    if (!q) return true;
    const haystack = [
      item.title,
      item.heading,
      item.category,
      ...(item.moodTags || []),
      ...(item.productTags || []),
      ...(item.featureTags || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q.toLowerCase());
  }

  // key で指定した面だけ draftSet を使い、他の面は確定済み(active)の値で判定する。
  // モーダルごとに絞り込み対象を分けたので、編集中でないタグ面は active を使う。
  function countMatches(editingKey, draftSet) {
    return typeData().filter((item) => {
      return (
        Object.keys(facets).every((key) => {
          const set = key === editingKey ? draftSet : facets[key].active;
          return matchesTagSet(item[facets[key].itemField], set);
        }) &&
        matchesQuery(item, query)
      );
    }).length;
  }

  function renderCheckboxGroup(container, taxonomy, draftSet, onChange) {
    container.innerHTML = "";
    taxonomy.forEach((group) => {
      const midBlock = document.createElement("div");
      midBlock.className = "mid-category";

      const header = document.createElement("button");
      header.type = "button";
      header.className = "mid-category-header";

      const name = document.createElement("span");
      name.className = "mid-category-name";
      name.textContent = group.mid;

      const badge = document.createElement("span");
      badge.className = "mid-category-badge";

      const chevron = document.createElement("span");
      chevron.className = "mid-category-chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "▾";

      const grid = document.createElement("div");
      grid.className = "checkbox-grid";

      group.tags.forEach((tag) => {
        const label = document.createElement("label");
        label.className = "checkbox-item";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = tag;
        input.checked = draftSet.has(tag);
        input.addEventListener("change", () => {
          if (input.checked) {
            draftSet.add(tag);
          } else {
            draftSet.delete(tag);
          }
          updateGroupBadge();
          onChange();
        });

        const text = document.createElement("span");
        text.textContent = tag;

        label.appendChild(input);
        label.appendChild(text);
        grid.appendChild(label);
      });

      function updateGroupBadge() {
        const selectedCount = group.tags.filter((tag) => draftSet.has(tag)).length;
        badge.textContent = selectedCount > 0 ? selectedCount : "";
        badge.hidden = selectedCount === 0;
      }

      function setExpanded(expanded) {
        grid.hidden = !expanded;
        header.setAttribute("aria-expanded", String(expanded));
        midBlock.classList.toggle("is-expanded", expanded);
      }

      header.addEventListener("click", () => {
        setExpanded(grid.hidden);
      });

      const hasActiveSelection = group.tags.some((tag) => draftSet.has(tag));
      setExpanded(hasActiveSelection);
      updateGroupBadge();

      header.appendChild(name);
      header.appendChild(badge);
      header.appendChild(chevron);
      midBlock.appendChild(header);
      midBlock.appendChild(grid);
      container.appendChild(midBlock);
    });
  }

  function updateActiveFilterBadge(key) {
    const badgeEl = document.getElementById(`${key}-active-count`);
    const total = facets[key].active.size;
    badgeEl.textContent = total;
    badgeEl.hidden = total === 0;
  }

  // 雰囲気/商品/機能は同じ1つのドロップダウンパネルを共有し、
  // どのトリガーボタンを押したかで中身（対象facet）だけ差し替える。
  const filterDropdown = document.querySelector(".filter-dropdown");
  const filterPanel = document.getElementById("filter-panel");
  const filterPanelOptions = document.getElementById("filter-panel-options");
  const filterPreviewCountEl = document.getElementById("filter-preview-count");
  const filterClearBtn = document.getElementById("filter-clear-btn");
  const filterApplyBtn = document.getElementById("filter-apply-btn");
  const triggerButtons = document.querySelectorAll(".filter-trigger");

  let activeFacetKey = null;

  function updatePreviewCount() {
    if (!activeFacetKey) return;
    filterPreviewCountEl.textContent = countMatches(activeFacetKey, facets[activeFacetKey].draft);
  }

  function renderPanel() {
    if (!activeFacetKey) return;
    const facet = facets[activeFacetKey];
    renderCheckboxGroup(filterPanelOptions, facet.taxonomy, facet.draft, updatePreviewCount);
    updatePreviewCount();
  }

  function setTriggerActive(key) {
    triggerButtons.forEach((btn) => {
      const isActive = btn.dataset.facet === key;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-expanded", String(isActive));
    });
  }

  function openPanelFor(key) {
    const wasOpen = activeFacetKey !== null;
    activeFacetKey = key;
    facets[key].draft = new Set(facets[key].active);
    renderPanel();
    filterPanel.hidden = false;
    setTriggerActive(key);
    if (!wasOpen) lockBodyScroll();
  }

  function closePanel() {
    if (activeFacetKey !== null) unlockBodyScroll();
    activeFacetKey = null;
    filterPanel.hidden = true;
    setTriggerActive(null);
  }

  triggerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.facet;
      if (activeFacetKey === key) {
        closePanel();
      } else {
        openPanelFor(key);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (filterPanel.hidden) return;
    if (filterDropdown.contains(event.target)) return;
    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filterPanel.hidden) closePanel();
    if (event.key === "Escape" && !imageModal.hidden) closeImagePreview();
  });

  filterApplyBtn.addEventListener("click", () => {
    if (!activeFacetKey) return;
    const key = activeFacetKey;
    facets[key].active = new Set(facets[key].draft);
    updateActiveFilterBadge(key);
    renderCards();
    closePanel();
  });

  filterClearBtn.addEventListener("click", () => {
    if (!activeFacetKey) return;
    facets[activeFacetKey].draft.clear();
    renderPanel();
  });

  function renderCards() {
    const scoped = typeData();
    const filtered = scoped.filter((item) => {
      return (
        Object.keys(facets).every((key) => matchesTagSet(item[facets[key].itemField], facets[key].active)) &&
        matchesQuery(item, query)
      );
    });

    cardGrid.innerHTML = "";
    filtered.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";

      const tagsHtml = [
        ...(item.moodTags || []).map((tag) => `<span class="tag-mood">${tag}</span>`),
        ...(item.productTags || []).map((tag) => `<span class="tag-product">${tag}</span>`),
        ...(item.featureTags || []).map((tag) => `<span class="tag-feature">${tag}</span>`)
      ].join("");

      card.innerHTML = `
        <img class="card-thumb" src="${item.thumbnail}" alt="${item.title}" />
        <div class="card-body">
          <span class="card-category">${item.category}</span>
          <p class="card-title">${item.title}</p>
          <p class="card-heading">${item.heading || ""}</p>
          <div class="card-tags">
            ${tagsHtml}
          </div>
        </div>
      `;
      card.addEventListener("click", () => openCard(item));
      cardGrid.appendChild(card);
    });

    resultCount.textContent = `${filtered.length}件 / 全${scoped.length}件`;
    emptyState.hidden = filtered.length !== 0;
  }

  searchInput.addEventListener("input", (event) => {
    query = event.target.value.trim();
    renderCards();
  });

  typeTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.type === activeType) return;
      activeType = btn.dataset.type;
      typeTabButtons.forEach((b) => b.classList.toggle("active", b === btn));
      query = "";
      searchInput.value = "";
      closePanel();
      rebuildFacets();
      renderCards();
    });
  });

  rebuildFacets();
  renderCards();
})();
