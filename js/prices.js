(function () {
  const OPEN_CLASS = "is-open";
  const SELECTED_CLASS = "is-selected";
  const CLOSE_DELAY_MS = 200;

  function normalize(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function initCategorySelect(root) {
    const selectRoot = root.querySelector("[data-prices-select]");
    if (!selectRoot || selectRoot.dataset.initialized === "true") {
      return null;
    }

    const trigger = selectRoot.querySelector("[data-prices-category-trigger]");
    const list = selectRoot.querySelector("[data-prices-category-list]");
    const valueInput = selectRoot.querySelector("[data-prices-category]");
    const valueLabel = selectRoot.querySelector("[data-prices-category-label]");
    const options = Array.from(selectRoot.querySelectorAll(".prices-select__option"));

    if (!trigger || !list || !valueInput || !valueLabel || !options.length) {
      return null;
    }

    selectRoot.dataset.initialized = "true";

    let isOpen = false;
    let closeTimeout = null;

    const finishHide = () => {
      if (isOpen) {
        return;
      }

      list.hidden = true;
      list.style.display = "";
      closeTimeout = null;
    };

    const setSelectedOption = (option) => {
      const nextValue = option.getAttribute("data-value") || "";
      const nextLabel = option.textContent.trim();

      valueInput.value = nextValue;
      valueLabel.textContent = nextLabel;

      options.forEach((item) => {
        const isSelected = item === option;
        item.classList.toggle(SELECTED_CLASS, isSelected);
        item.setAttribute("aria-selected", String(isSelected));
      });
    };

    const openList = () => {
      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      isOpen = true;
      list.hidden = false;
      list.style.display = "block";
      trigger.setAttribute("aria-expanded", "true");
      selectRoot.classList.add(OPEN_CLASS);

      window.requestAnimationFrame(() => {
        if (isOpen) {
          list.classList.add(OPEN_CLASS);
        }
      });
    };

    const closeList = (animated = true) => {
      if (!isOpen && list.hidden) {
        return;
      }

      isOpen = false;
      list.classList.remove(OPEN_CLASS);
      trigger.setAttribute("aria-expanded", "false");
      selectRoot.classList.remove(OPEN_CLASS);

      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      if (!animated) {
        finishHide();
        return;
      }

      closeTimeout = window.setTimeout(finishHide, CLOSE_DELAY_MS);
    };

    const toggleList = () => {
      if (isOpen) {
        closeList();
        return;
      }

      openList();
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleList();
    });

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelectedOption(option);
        closeList();
        valueInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    document.addEventListener("click", (event) => {
      if (!selectRoot.contains(event.target)) {
        closeList();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeList();
        trigger.focus();
      }
    });

    return valueInput;
  }

  function initPrices() {
    const root = document.querySelector("[data-prices]");
    if (!root) {
      return;
    }

    const categorySelect = initCategorySelect(root) || root.querySelector("[data-prices-category]");
    const searchInput = root.querySelector("[data-prices-search]");
    const table = root.querySelector("[data-prices-table]");
    const emptyState = root.querySelector("[data-prices-empty]");

    if (!categorySelect || !searchInput || !table) {
      return;
    }

    const rows = Array.from(table.querySelectorAll("tbody tr[data-category]"));

    function applyFilters() {
      const query = normalize(searchInput.value);
      const category = categorySelect.value;
      const isSearching = query.length > 0;
      const showAllCategories = category === "all";

      table.classList.toggle("prices-table--show-category", isSearching || showAllCategories);

      let visibleCount = 0;

      rows.forEach((row) => {
        const haystack = row.getAttribute("data-search") || "";
        const matchesSearch = !isSearching || haystack.includes(query);
        const matchesCategory =
          showAllCategories || isSearching || row.getAttribute("data-category") === category;
        const isVisible = matchesSearch && matchesCategory;

        row.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    categorySelect.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);
    applyFilters();
  }

  window.initPrices = initPrices;
})();
