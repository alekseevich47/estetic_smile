(function () {
  const COOKIE_ACCEPTED_KEY = "estetic_smile_cookie_accepted";
  const SCROLL_THRESHOLD = 300;

  function getStoredConsent() {
    try {
      return window.localStorage.getItem(COOKIE_ACCEPTED_KEY);
    } catch (error) {
      return null;
    }
  }

  function setStoredConsent() {
    try {
      window.localStorage.setItem(COOKIE_ACCEPTED_KEY, "true");
    } catch (error) {
      // Баннер все равно скрывается, даже если localStorage недоступен.
    }
  }

  function initCookieNotice() {
    const notice = document.getElementById("cookie-notice");
    const acceptButton = notice?.querySelector("[data-cookie-accept]");

    if (!notice || !acceptButton) {
      return;
    }

    const hideNotice = () => {
      notice.classList.remove("is-visible");
      notice.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cookie-notice-visible");
    };

    if (getStoredConsent() === "true") {
      hideNotice();
      return;
    }

    notice.classList.add("is-visible");
    notice.setAttribute("aria-hidden", "false");
    document.body.classList.add("cookie-notice-visible");

    acceptButton.addEventListener("click", () => {
      setStoredConsent();
      hideNotice();
      acceptButton.blur();
    });
  }

  function initScrollTopButton() {
    const scrollTopButton = document.getElementById("scroll-top-btn");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchUi = window.matchMedia("(hover: none)").matches;
    const SPIN_MS = 900;

    if (!scrollTopButton) {
      return;
    }

    const clearTouchPressState = () => {
      scrollTopButton.classList.remove("is-pressed", "is-arrow-spinning");
      scrollTopButton.blur();
    };

    const playArrowSpin = () => {
      scrollTopButton.classList.remove("is-arrow-spinning");
      void scrollTopButton.offsetWidth;
      scrollTopButton.classList.add("is-arrow-spinning");
    };

    const waitForScrollEnd = (callback, maxMs = 2200) => {
      let lastY = window.scrollY;
      let idleFrames = 0;
      const startedAt = Date.now();

      const tick = () => {
        if (window.scrollY === lastY) {
          idleFrames += 1;
        } else {
          idleFrames = 0;
          lastY = window.scrollY;
        }

        if (idleFrames >= 4 || Date.now() - startedAt >= maxMs) {
          callback();
          return;
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const setScrollTopButtonState = () => {
      scrollTopButton.classList.toggle("is-visible", window.scrollY > SCROLL_THRESHOLD);
    };

    scrollTopButton.addEventListener("click", () => {
      if (isTouchUi && !prefersReducedMotion) {
        playArrowSpin();
        scrollTopButton.classList.add("is-pressed");
      }

      scrollTopButton.blur();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

      if (!isTouchUi) {
        return;
      }

      if (prefersReducedMotion) {
        clearTouchPressState();
        return;
      }

      waitForScrollEnd(clearTouchPressState);
    });

    setScrollTopButtonState();
    window.addEventListener("scroll", setScrollTopButtonState, { passive: true });
  }

  function initCookie() {
    if (document.body.dataset.cookieInitialized === "true") {
      return;
    }

    document.body.dataset.cookieInitialized = "true";
    initCookieNotice();
    initScrollTopButton();
  }

  window.initCookie = initCookie;
})();

