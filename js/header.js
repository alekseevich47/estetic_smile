
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

    const HEADER_HIDE_THRESHOLD = 80;
    const SCROLL_IDLE_DELAY = 180;
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollIdleTimer = null;

    const setScrolledState = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };

    const showHeader = () => {
      header.classList.remove("header--hidden");
    };

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      setScrolledState();

      if (currentScrollY <= 8 || scrollDelta < 0 || document.body.classList.contains("menu-open")) {
        showHeader();
        lastScrollY = currentScrollY;
      } else if (scrollDelta > HEADER_HIDE_THRESHOLD) {
        header.classList.add("header--hidden");
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }

      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        showHeader();
        lastScrollY = window.scrollY;
      }, SCROLL_IDLE_DELAY);
    };

    const setMenuState = (isOpen) => {
      document.body.classList.toggle("menu-open", isOpen);

      if (burger) {
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
      }

      if (isOpen) {
        showHeader();
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", closeDropdown, { passive: true });

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
      nav.addEventListener("scroll", closeDropdown, { passive: true });

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

