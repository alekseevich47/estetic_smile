(function () {
  const MOBILE_BREAKPOINT = 600;
  const APP_OPEN_TIMEOUT = 800;
  const OPEN_CLASS = "maps-dropdown--open";
  const OVERLAY_VISIBLE_CLASS = "is-visible";

  function initMaps() {
    const dropdown = document.getElementById("maps-dropdown");

    if (!dropdown || dropdown.dataset.initialized === "true") {
      return;
    }

    const triggers = [
      document.getElementById("address-card"),
      document.getElementById("footer-address-card"),
      document.getElementById("nav-address-card"),
    ].filter(Boolean);

    if (!triggers.length) {
      return;
    }

    const dropdownItems = Array.from(dropdown.querySelectorAll(".maps-dropdown__item"));

    if (!dropdownItems.length) {
      return;
    }

    const overlay = document.getElementById("maps-overlay");

    dropdown.dataset.initialized = "true";
    document.body.appendChild(dropdown);

    if (overlay) {
      document.body.appendChild(overlay);
    }

    dropdown.hidden = false;
    dropdown.style.display = "none";

    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
    let isOpen = false;
    let closeTimeout = null;
    let activeTrigger = null;

    const setTriggersExpanded = (expanded) => {
      triggers.forEach((trigger) => {
        trigger.setAttribute("aria-expanded", String(expanded && trigger === activeTrigger));
      });
    };

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

      if (!activeTrigger) {
        return;
      }

      const cardRect = activeTrigger.getBoundingClientRect();
      dropdown.style.top = `${cardRect.bottom + 8}px`;
      dropdown.style.left = `${cardRect.left}px`;
      dropdown.style.width = `${cardRect.width}px`;
    };

    const showOverlay = () => {
      if (overlay && isMobile()) {
        overlay.classList.add(OVERLAY_VISIBLE_CLASS);
        overlay.setAttribute("aria-hidden", "false");
      }
    };

    const hideOverlay = () => {
      if (overlay) {
        overlay.classList.remove(OVERLAY_VISIBLE_CLASS);
        overlay.setAttribute("aria-hidden", "true");
      }
    };

    const showDropdown = (trigger) => {
      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      activeTrigger = trigger;
      isOpen = true;
      dropdown.style.display = "flex";
      positionDropdown();
      setTriggersExpanded(true);
      showOverlay();

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
      setTriggersExpanded(false);
      hideOverlay();

      activeTrigger = null;

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

    const toggleDropdown = (trigger) => {
      if (isOpen && activeTrigger === trigger) {
        hideDropdown();
        return;
      }

      if (isOpen) {
        activeTrigger = trigger;
        positionDropdown();
        setTriggersExpanded(true);
        return;
      }

      showDropdown(trigger);
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

    const isClickInside = (event) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return false;
      }

      return triggers.some((trigger) => trigger.contains(target))
        || dropdown.contains(target)
        || (overlay && overlay.contains(target));
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown(trigger);
      });
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        hideDropdown();
      });
    }

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
      if (!isClickInside(event)) {
        hideDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        const focusTarget = activeTrigger;
        hideDropdown();

        if (focusTarget) {
          focusTarget.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (isOpen && !isMobile()) {
        positionDropdown();
      }

      if (isOpen && isMobile()) {
        hideOverlay();
        showOverlay();
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
