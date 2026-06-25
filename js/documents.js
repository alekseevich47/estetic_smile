(function () {
  const DEFAULT_TAB = "user-agreement";

  function getTabFromHash() {
    const hash = window.location.hash.replace(/^#/, "");
    const tabs = document.querySelectorAll("[data-doc-tab]");
    const ids = Array.from(tabs, (tab) => tab.getAttribute("data-doc-tab"));
    return ids.includes(hash) ? hash : DEFAULT_TAB;
  }

  function activateTab(slug, { updateHash = true } = {}) {
    const tabs = document.querySelectorAll("[data-doc-tab]");
    const panels = document.querySelectorAll("[data-doc-panel]");

    tabs.forEach((tab) => {
      const isActive = tab.getAttribute("data-doc-tab") === slug;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.getAttribute("data-doc-panel") === slug;
      panel.hidden = !isActive;
    });

    if (updateHash) {
      const nextHash = `#${slug}`;
      if (window.location.hash !== nextHash) {
        history.pushState(null, "", nextHash);
      }
    }
  }

  function initDocuments() {
    const root = document.querySelector("[data-documents-tabs]");
    if (!root) {
      return;
    }

    const tabs = root.querySelectorAll("[data-doc-tab]");
    if (!tabs.length) {
      return;
    }

    activateTab(getTabFromHash(), { updateHash: false });

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateTab(tab.getAttribute("data-doc-tab"));
      });

      tab.addEventListener("keydown", (event) => {
        const list = Array.from(tabs);
        const index = list.indexOf(tab);
        let next = -1;

        if (event.key === "ArrowRight") {
          next = (index + 1) % list.length;
        } else if (event.key === "ArrowLeft") {
          next = (index - 1 + list.length) % list.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = list.length - 1;
        }

        if (next >= 0) {
          event.preventDefault();
          list[next].focus();
          activateTab(list[next].getAttribute("data-doc-tab"));
        }
      });
    });

    window.addEventListener("hashchange", () => {
      activateTab(getTabFromHash(), { updateHash: false });
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }

      const slug = link.getAttribute("href").replace(/^#/, "");
      const ids = Array.from(tabs, (tab) => tab.getAttribute("data-doc-tab"));
      if (!ids.includes(slug)) {
        return;
      }

      event.preventDefault();
      activateTab(slug);
    });
  }

  window.initDocuments = initDocuments;
})();
