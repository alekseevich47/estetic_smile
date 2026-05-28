(function () {
  function initGallery() {
    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");

    if (!gallery || !lightbox || gallery.dataset.initialized === "true") {
      return;
    }

    const triggers = Array.from(gallery.querySelectorAll(".gallery-card"));
    const image = lightbox.querySelector(".lightbox__image");
    const closeButton = lightbox.querySelector(".lightbox__close");
    const prevButton = lightbox.querySelector(".lightbox__prev");
    const nextButton = lightbox.querySelector(".lightbox__next");
    const counter = lightbox.querySelector(".lightbox__counter");

    if (!triggers.length || !image || !closeButton || !prevButton || !nextButton || !counter) {
      return;
    }

    gallery.dataset.initialized = "true";

    const items = triggers.map((trigger) => {
      const itemImage = trigger.querySelector("img");

      return {
        src: itemImage ? itemImage.getAttribute("src") : "",
        alt: itemImage ? itemImage.getAttribute("alt") : "",
      };
    });

    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastFocusedElement = null;

    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    const isOpen = () => lightbox.classList.contains("is-open");

    const getFocusableElements = () => Array.from(lightbox.querySelectorAll(focusableSelector));

    const setPageInert = (shouldInert) => {
      Array.from(document.body.children).forEach((element) => {
        if (element === lightbox || element.tagName === "SCRIPT") {
          return;
        }

        if (shouldInert) {
          element.dataset.lightboxPreviousAriaHidden = element.getAttribute("aria-hidden") || "";
          element.setAttribute("aria-hidden", "true");
          element.inert = true;
          return;
        }

        const previousAriaHidden = element.dataset.lightboxPreviousAriaHidden;

        if (previousAriaHidden) {
          element.setAttribute("aria-hidden", previousAriaHidden);
        } else {
          element.removeAttribute("aria-hidden");
        }

        delete element.dataset.lightboxPreviousAriaHidden;
        element.inert = false;
      });
    };

    const trapFocus = (event) => {
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const updateLightbox = () => {
      const currentItem = items[currentIndex];

      image.src = currentItem.src;
      image.alt = currentItem.alt;
      counter.textContent = `${currentIndex + 1} / ${items.length}`;
    };

    const showItem = (index) => {
      currentIndex = (index + items.length) % items.length;
      updateLightbox();
    };

    const openLightbox = (index) => {
      lastFocusedElement = document.activeElement;
      showItem(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      setPageInert(true);
      document.body.classList.add("lightbox-open");

      window.setTimeout(() => {
        closeButton.focus({ preventScroll: true });
      }, 50);
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      image.removeAttribute("src");
      image.alt = "";
      setPageInert(false);

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    const showPrev = () => showItem(currentIndex - 1);
    const showNext = () => showItem(currentIndex + 1);

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        const parsedIndex = Number(trigger.dataset.galleryIndex);
        openLightbox(Number.isFinite(parsedIndex) ? parsedIndex : index);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", showPrev);
    nextButton.addEventListener("click", showNext);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        const diffX = touch.clientX - touchStartX;
        const diffY = touch.clientY - touchStartY;

        if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) {
          return;
        }

        if (diffX > 0) {
          showPrev();
        } else {
          showNext();
        }
      },
      { passive: true }
    );

    document.addEventListener("keydown", (event) => {
      if (!isOpen()) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }
    });
  }

  window.initGallery = initGallery;
})();

