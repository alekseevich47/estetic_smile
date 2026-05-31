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

    if (!scrollTopButton) {
      return;
    }

    const setScrollTopButtonState = () => {
      scrollTopButton.classList.toggle("is-visible", window.scrollY > SCROLL_THRESHOLD);
    };

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
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

