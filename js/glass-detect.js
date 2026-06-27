(function () {
  var DESKTOP_MIN_WIDTH = 993;
  var ANDROID_MIN_DEVICE_MEMORY = 4;
  var ANDROID_MIN_HARDWARE_CONCURRENCY = 4;
  var STORAGE_KEY = "estetic-glass-disabled";

  function supportsBackdropFilter() {
    return (
      typeof CSS !== "undefined" &&
      (CSS.supports("backdrop-filter", "blur(8px)") ||
        CSS.supports("-webkit-backdrop-filter", "blur(8px)"))
    );
  }

  function shouldEnableGlassHeader() {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }

      if (window.matchMedia("(min-width: " + DESKTOP_MIN_WIDTH + "px)").matches) {
        return true;
      }

      var ua = navigator.userAgent || "";

      if (/iPhone|iPad|iPod/i.test(ua)) {
        return true;
      }

      if (!/Android/i.test(ua)) {
        return false;
      }

      if (!supportsBackdropFilter()) {
        return false;
      }

      var memory = navigator.deviceMemory;

      if (memory === undefined) {
        return false;
      }

      if (memory <= 2) {
        return false;
      }

      if (memory < ANDROID_MIN_DEVICE_MEMORY) {
        return false;
      }

      var cores = navigator.hardwareConcurrency;

      if (
        memory === ANDROID_MIN_DEVICE_MEMORY &&
        cores !== undefined &&
        cores < ANDROID_MIN_HARDWARE_CONCURRENCY
      ) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  function isGlassDisabledByUser() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function setGlassDisabledByUser(disabled) {
    try {
      if (disabled) {
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      /* ignore */
    }
  }

  function applyGlassHeader() {
    var root = document.documentElement;

    if (shouldEnableGlassHeader() && !isGlassDisabledByUser()) {
      root.classList.add("glass-header-enabled");
    } else {
      root.classList.remove("glass-header-enabled");
    }
  }

  function isGlassEnabled() {
    return document.documentElement.classList.contains("glass-header-enabled");
  }

  function setGlassEnabled(enabled) {
    if (!shouldEnableGlassHeader()) {
      return;
    }

    setGlassDisabledByUser(!enabled);
    applyGlassHeader();

    document.documentElement.dispatchEvent(
      new CustomEvent("glass-header-change", {
        detail: { enabled: isGlassEnabled() },
      })
    );
  }

  window.glassHeader = {
    isCapable: shouldEnableGlassHeader,
    isEnabled: isGlassEnabled,
    setEnabled: setGlassEnabled,
    toggle: function () {
      setGlassEnabled(!isGlassEnabled());
    },
  };

  applyGlassHeader();
})();
