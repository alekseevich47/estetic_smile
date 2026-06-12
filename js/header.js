
(function () {
  function initHeader() {
    const header = document.getElementById("header");
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".header__nav");
    const navClose = document.querySelector(".nav__close");
    const navOverlay = document.getElementById("nav-overlay");
    const dropdownItem = document.querySelector(".header__menu-item--dropdown");
    const dropdownToggle = document.querySelector(".header__dropdown-toggle");
    const megaDropdown = document.querySelector(".header__dropdown--mega");
    const desktopMql = window.matchMedia("(min-width: 993px)");
    let megaCloseTimer = null;

    if (!header || header.dataset.initialized === "true") {
      return;
    }

    header.dataset.initialized = "true";

    const SCROLL_DIRECTION_THRESHOLD = 4;
    const SCROLL_IDLE_DELAY = 180;
    let lastScrollY = window.scrollY;
    let lastScrollDirection = null;
    let ticking = false;
    let scrollIdleTimer = null;

    const setScrolledState = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };

    const showHeader = () => {
      header.classList.remove("header--hidden");
    };

    const hideHeader = () => {
      header.classList.add("header--hidden");
    };

    const isHeaderPinned = () => (
      window.scrollY <= 8 ||
      document.body.classList.contains("menu-open")
    );

    const hasHeaderInteraction = () => (
      header.matches(":hover, :focus-within") ||
      (dropdownItem && dropdownItem.classList.contains("is-open"))
    );

    const shouldKeepHeaderVisible = () => (
      isHeaderPinned() ||
      hasHeaderInteraction()
    );

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      setScrolledState();

      if (isHeaderPinned()) {
        showHeader();
        lastScrollDirection = null;
        lastScrollY = currentScrollY;
      } else if (Math.abs(scrollDelta) >= SCROLL_DIRECTION_THRESHOLD) {
        if (scrollDelta < 0) {
          lastScrollDirection = "up";
          showHeader();
        } else {
          lastScrollDirection = "down";
          hideHeader();
        }

        lastScrollY = currentScrollY;
      } else if (hasHeaderInteraction()) {
        showHeader();
      }

      ticking = false;
    };

    const handleScroll = () => {
      closeDropdown({ resetFocus: true });

      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility);
        ticking = true;
      }

      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        if (isHeaderPinned()) {
          showHeader();
        } else if (lastScrollDirection === "down") {
          hideHeader();
        } else if (lastScrollDirection === "up") {
          showHeader();
        } else if (hasHeaderInteraction()) {
          showHeader();
        }

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
      } else if (!shouldKeepHeaderVisible()) {
        hideHeader();
      }
    };

    const clearMegaCloseTimer = () => {
      if (megaCloseTimer) {
        window.clearTimeout(megaCloseTimer);
        megaCloseTimer = null;
      }
    };

    const openDropdown = () => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      clearMegaCloseTimer();
      dropdownItem.classList.add("is-open");
      dropdownToggle.setAttribute("aria-expanded", "true");
    };

    const closeDropdown = ({ resetFocus = false } = {}) => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      clearMegaCloseTimer();
      dropdownItem.classList.remove("is-open");
      dropdownToggle.setAttribute("aria-expanded", "false");

      if (resetFocus && dropdownItem.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    };

    const scheduleMegaClose = () => {
      clearMegaCloseTimer();
      megaCloseTimer = window.setTimeout(() => {
        closeDropdown();
      }, 200);
    };

    const toggleDropdown = () => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      const isOpen = dropdownItem.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
    };

    const initMegaDropdownHover = () => {
      if (!dropdownItem || !dropdownToggle) {
        return;
      }

      dropdownToggle.addEventListener("mouseenter", () => {
        if (desktopMql.matches) {
          openDropdown();
        }
      });

      dropdownItem.addEventListener("mouseleave", () => {
        if (desktopMql.matches) {
          scheduleMegaClose();
        }
      });

      if (megaDropdown) {
        megaDropdown.addEventListener("mouseenter", () => {
          if (desktopMql.matches) {
            clearMegaCloseTimer();
          }
        });

        megaDropdown.addEventListener("mouseleave", () => {
          if (desktopMql.matches) {
            scheduleMegaClose();
          }
        });
      }
    };

    setScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (burger) {
      burger.addEventListener("click", () => {
        const isOpen = !document.body.classList.contains("menu-open");
        setMenuState(isOpen);
      });
    }

    if (navClose) {
      navClose.addEventListener("click", () => {
        setMenuState(false);
        closeDropdown({ resetFocus: true });
      });
    }

    if (navOverlay) {
      navOverlay.addEventListener("click", () => {
        setMenuState(false);
        closeDropdown({ resetFocus: true });
      });
    }

    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!desktopMql.matches) {
          toggleDropdown();
        }
      });
    }

    initMegaDropdownHover();

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
      } else {
        closeDropdown();
      }
    });
  }

  window.initHeader = initHeader;
})();

