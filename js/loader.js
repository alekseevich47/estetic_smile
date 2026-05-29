const LOADER_ANIMATION_DURATION = 3800;
const REDUCED_MOTION_DURATION = 100;
const PATH_HIDDEN_OFFSET_BUFFER = 1;

function getAnimationDuration() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? REDUCED_MOTION_DURATION
    : LOADER_ANIMATION_DURATION;
}

function getClickableLink(event) {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;

  return target?.closest("a[href]") || null;
}

function shouldHandleLink(link) {
  const href = link.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    link.target === "_blank" ||
    link.hasAttribute("download")
  ) {
    return false;
  }

  const url = new URL(href, window.location.href);
  const isHttpLink = url.protocol === "http:" || url.protocol === "https:";
  const isSameOrigin = url.origin === window.location.origin;
  const isSamePageHash =
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    Boolean(url.hash);

  return isHttpLink && isSameOrigin && !isSamePageHash;
}

export function initLoader() {
  const loader = document.getElementById("page-loader");

  if (!loader || loader.dataset.initialized === "true") {
    return;
  }

  loader.dataset.initialized = "true";

  let hideTimer = null;
  let navigateTimer = null;
  let isNavigating = false;
  const paths = Array.from(loader.querySelectorAll("path"));

  const getHiddenOffset = (path) => {
    return Number(path.dataset.hiddenOffset) || path.getTotalLength() + PATH_HIDDEN_OFFSET_BUFFER;
  };

  const initPaths = () => {
    paths.forEach((path) => {
      const length = path.getTotalLength();
      const hiddenOffset = length + PATH_HIDDEN_OFFSET_BUFFER;

      path.removeAttribute("pathLength");
      path.dataset.hiddenOffset = `${hiddenOffset}`;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${hiddenOffset}`;
    });
  };

  const restartAnimation = () => {
    paths.forEach((path) => {
      path.style.animation = "none";
      path.style.strokeDashoffset = `${getHiddenOffset(path)}`;
    });

    void loader.offsetWidth;

    paths.forEach((path) => {
      path.style.animation = "";
    });
  };

  const hideAfterAnimation = () => {
    window.clearTimeout(hideTimer);
    restartAnimation();

    hideTimer = window.setTimeout(() => {
      loader.classList.add("hidden");
    }, getAnimationDuration());
  };

  const showAndNavigate = (href) => {
    isNavigating = true;
    window.clearTimeout(hideTimer);
    window.clearTimeout(navigateTimer);

    loader.classList.remove("hidden");
    restartAnimation();

    navigateTimer = window.setTimeout(() => {
      window.location.href = href;
    }, getAnimationDuration());
  };

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      isNavigating
    ) {
      return;
    }

    const link = getClickableLink(event);

    if (!link || !shouldHandleLink(link)) {
      return;
    }

    event.preventDefault();
    showAndNavigate(link.href);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      isNavigating = false;
      hideAfterAnimation();
    }
  });

  if (document.readyState === "loading") {
    initPaths();
    document.addEventListener("DOMContentLoaded", hideAfterAnimation, { once: true });
  } else {
    initPaths();
    hideAfterAnimation();
  }
}

window.initLoader = initLoader;
initLoader();
