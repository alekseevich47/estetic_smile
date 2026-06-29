const LOADER_MIN_VISIBLE_MS = 600;
const LOADER_COMPLETE_DELAY_MS = 400;
const LOADER_PROGRESS_CAP = 90;
const LOADER_PROGRESS_TAU_MS = 4000;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isPageLoaded() {
  return document.readyState === "complete";
}

export function initLoader() {
  const loader = document.getElementById("page-loader");

  if (!loader || loader.dataset.initialized === "true") {
    return;
  }

  loader.dataset.initialized = "true";

  const track = loader.querySelector(".page-loader__bar-wrap");
  const progressbar = loader.querySelector('[role="progressbar"]');
  const reducedMotion = prefersReducedMotion();
  const startedAt = performance.now();
  let progress = 0;
  let pageLoaded = isPageLoaded();
  let completing = false;
  let hideTimer = null;
  let rafId = null;

  const setProgress = (value) => {
    const clamped = Math.max(0, Math.min(100, value));
    progress = clamped;
    loader.style.setProperty("--loader-progress", `${clamped}%`);

    if (progressbar) {
      progressbar.setAttribute("aria-valuenow", String(Math.round(clamped)));
    }
  };

  const hideLoader = () => {
    window.clearTimeout(hideTimer);
    loader.classList.add("hidden");
  };

  const finishLoader = () => {
    if (completing) {
      return;
    }

    completing = true;
    track?.classList.add("is-complete");
    setProgress(100);

    const elapsed = performance.now() - startedAt;
    const waitMs = Math.max(0, LOADER_MIN_VISIBLE_MS - elapsed) + LOADER_COMPLETE_DELAY_MS;

    hideTimer = window.setTimeout(hideLoader, reducedMotion ? 50 : waitMs);
  };

  const tick = () => {
    if (completing) {
      return;
    }

    const elapsed = performance.now() - startedAt;

    if (pageLoaded) {
      const remaining = 100 - progress;
      setProgress(progress + remaining * 0.14);
    } else if (reducedMotion) {
      setProgress(LOADER_PROGRESS_CAP);
    } else {
      const target =
        LOADER_PROGRESS_CAP * (1 - Math.exp(-elapsed / LOADER_PROGRESS_TAU_MS));
      setProgress(Math.max(progress, target));
    }

    if (pageLoaded && progress >= 99.5) {
      finishLoader();
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  };

  const onPageLoad = () => {
    pageLoaded = true;
  };

  if (pageLoaded) {
    onPageLoad();
  } else {
    window.addEventListener("load", onPageLoad, { once: true });
  }

  setProgress(0);
  rafId = window.requestAnimationFrame(tick);

  window.addEventListener(
    "pageshow",
    (event) => {
      if (!event.persisted) {
        return;
      }

      window.cancelAnimationFrame(rafId);
      window.clearTimeout(hideTimer);
      completing = false;
      pageLoaded = isPageLoaded();
      track?.classList.remove("is-complete");
      loader.classList.remove("hidden");
      setProgress(0);
      rafId = window.requestAnimationFrame(tick);
    },
    { passive: true },
  );
}

window.initLoader = initLoader;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoader, { once: true });
} else {
  initLoader();
}
