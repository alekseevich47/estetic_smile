(function () {
  function updateGlassToggleButton(button) {
    if (!button || !window.glassHeader) {
      return;
    }

    var enabled = window.glassHeader.isEnabled();

    button.setAttribute("aria-pressed", enabled ? "true" : "false");
    button.setAttribute(
      "aria-label",
      enabled ? "Отключить эффект стекла" : "Включить эффект стекла"
    );
    button.classList.toggle("is-glass-off", !enabled);
  }

  function initGlassToggle() {
    var button = document.querySelector("[data-glass-toggle]");

    if (!button || !window.glassHeader) {
      return;
    }

    if (!window.glassHeader.isCapable()) {
      button.hidden = true;
      return;
    }

    button.hidden = false;
    updateGlassToggleButton(button);

    button.addEventListener("click", function () {
      window.glassHeader.toggle();
      updateGlassToggleButton(button);
    });

    document.documentElement.addEventListener("glass-header-change", function () {
      updateGlassToggleButton(button);
    });
  }

  window.initGlassToggle = initGlassToggle;
})();
