const LOADER_ANIMATION_DURATION = 1000;
const REDUCED_MOTION_DURATION = 100;

function getAnimationDuration() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? REDUCED_MOTION_DURATION
    : LOADER_ANIMATION_DURATION;
}

export function initLoader() {
  const loader = document.getElementById("page-loader");

  if (!loader || loader.dataset.initialized === "true") {
    return;
  }

  loader.dataset.initialized = "true";

  let hideTimer = null;
  const loaderLogo = loader.querySelector("svg");

  const restartAnimation = () => {
    if (!loaderLogo) {
      return;
    }

    loaderLogo.style.animation = "none";
    void loaderLogo.offsetWidth;

    loaderLogo.style.animation = "";
  };

  const hideAfterAnimation = () => {
    window.clearTimeout(hideTimer);
    restartAnimation();

    hideTimer = window.setTimeout(() => {
      loader.classList.add("hidden");
    }, getAnimationDuration());
  };

  hideAfterAnimation();
}

window.initLoader = initLoader;
document.addEventListener("DOMContentLoaded", initLoader, { once: true });
