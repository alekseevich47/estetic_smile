
(function () {
  function initHeader() {
    const header = document.getElementById("header");
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".header__nav");
    const dropdownItem = document.querySelector(".header__menu-item--dropdown");
    const dropdownToggle = document.querySelector(".header__dropdown-toggle");

    if (!header || header.dataset.initialized === "true") {
      return;
    }

    header.dataset.initialized = "true";

    const setScrolledState = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };

    const setMenuState = (isOpen) => {
      document.body.classList.toggle("menu-open", isOpen);

      if (burger) {
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
      }
    };

    const closeDropdown = () => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      dropdownItem.classList.remove("is-open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    };

    const toggleDropdown = () => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      const isOpen = dropdownItem.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
    };

    setScrolledState();
    window.addEventListener("scroll", setScrolledState, { passive: true });

    if (burger) {
      burger.addEventListener("click", () => {
        const isOpen = !document.body.classList.contains("menu-open");
        setMenuState(isOpen);
      });
    }

    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown();
      });
    }

    document.addEventListener("click", (event) => {
      if (dropdownItem && !dropdownItem.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
        closeDropdown();
      }
    });

    if (nav) {
      nav.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
          return;
        }

        setMenuState(false);
        closeDropdown();
      });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        setMenuState(false);
      }
    });
  }

  window.initHeader = initHeader;
})();

