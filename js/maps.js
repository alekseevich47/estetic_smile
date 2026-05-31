(function () {
  const MOBILE_BREAKPOINT = 600;
  const APP_OPEN_TIMEOUT = 800;
  const OPEN_CLASS = "maps-dropdown--open";

  function initMaps() {
    const addressCard = document.getElementById("address-card");
    const dropdown = document.getElementById("maps-dropdown");

    if (!addressCard || !dropdown || dropdown.dataset.initialized === "true") {
      return;
    }

    const dropdownItems = Array.from(dropdown.querySelectorAll(".maps-dropdown__item"));

    if (!dropdownItems.length) {
      return;
    }

    dropdown.dataset.initialized = "true";
    document.body.appendChild(dropdown);
    dropdown.hidden = false;
    dropdown.style.display = "none";

    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
    let isOpen = false;
    let closeTimeout = null;

    const finishHide = () => {
      if (isOpen) {
        return;
      }

      dropdown.style.display = "none";
      closeTimeout = null;
    };

    const positionDropdown = () => {
      dropdown.style.position = "fixed";

      if (isMobile()) {
        dropdown.style.top = "";
        dropdown.style.left = "";
        dropdown.style.width = "";
        return;
      }

      const cardRect = addressCard.getBoundingClientRect();
      dropdown.style.top = `${cardRect.bottom + 8}px`;
      dropdown.style.left = `${cardRect.left}px`;
      dropdown.style.width = `${cardRect.width}px`;
    };

    const showDropdown = () => {
      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      isOpen = true;
      dropdown.style.display = "flex";
      positionDropdown();
      addressCard.setAttribute("aria-expanded", "true");

      window.requestAnimationFrame(() => {
        if (isOpen) {
          dropdown.classList.add(OPEN_CLASS);
        }
      });
    };

    const hideDropdown = (animated = true) => {
      if (!isOpen && dropdown.style.display === "none") {
        return;
      }

      isOpen = false;
      dropdown.classList.remove(OPEN_CLASS);
      addressCard.setAttribute("aria-expanded", "false");

      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      if (!animated) {
        finishHide();
        return;
      }

      closeTimeout = window.setTimeout(finishHide, 250);
    };

    const toggleDropdown = () => {
      if (isOpen) {
        hideDropdown();
      } else {
        showDropdown();
      }
    };

    const openMap = (appUrl, webUrl) => {
      if (!appUrl || !webUrl) {
        return;
      }

      const link = document.createElement("a");
      link.href = appUrl;
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        if (document.hasFocus()) {
          window.open(webUrl, "_blank", "noopener");
        }
      }, APP_OPEN_TIMEOUT);
    };

    addressCard.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDropdown();
    });

    dropdown.addEventListener("click", (event) => {
      const item = event.target instanceof Element
        ? event.target.closest(".maps-dropdown__item")
        : null;

      if (!item) {
        return;
      }

      event.stopPropagation();
      hideDropdown();
      openMap(item.dataset.app, item.dataset.web);
    });

    document.addEventListener("click", (event) => {
      if (!addressCard.contains(event.target) && !dropdown.contains(event.target)) {
        hideDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        hideDropdown();
        addressCard.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (isOpen && !isMobile()) {
        positionDropdown();
      }
    });

    window.addEventListener("scroll", () => {
      if (isOpen) {
        hideDropdown();
      }
    }, { passive: true });

    dropdown.addEventListener("transitionend", (event) => {
      if (event.target === dropdown && !isOpen) {
        finishHide();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMaps);
  } else {
    initMaps();
  }

  window.initMaps = initMaps;
})();
