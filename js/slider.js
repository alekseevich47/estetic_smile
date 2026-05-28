(function () {
  function initSlider() {
    const slider = document.querySelector("[data-reviews-slider]");

    if (!slider) {
      return;
    }

    const viewport = slider.querySelector(".reviews__viewport");
    const track = slider.querySelector(".reviews__track");
    const slides = Array.from(slider.querySelectorAll(".review-card"));
    const prevButton = slider.querySelector("[data-slider-prev]");
    const nextButton = slider.querySelector("[data-slider-next]");
    const dotsContainer = slider.querySelector("[data-slider-dots]");

    if (!viewport || !track || !slides.length || !prevButton || !nextButton || !dotsContainer) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentIndex = 0;
    let slidesPerView = 1;
    let maxIndex = 0;
    let autoplayId = null;
    let dots = [];
    let touchStartX = 0;
    let touchCurrentX = 0;
    let resizeFrame = null;

    const getSlidesPerView = () => {
      if (window.innerWidth >= 993) {
        return 3;
      }

      if (window.innerWidth >= 769) {
        return 2;
      }

      return 1;
    };

    const getTrackGap = () => {
      const styles = window.getComputedStyle(track);
      return Number.parseFloat(styles.columnGap || styles.gap) || 0;
    };

    const stopAutoplay = () => {
      if (!autoplayId) {
        return;
      }

      window.clearInterval(autoplayId);
      autoplayId = null;
    };

    const updateSlider = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const offset = currentIndex * (slideWidth + getTrackGap());

      track.style.transform = `translateX(-${offset}px)`;

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle("is-active", isActive);

        if (isActive) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const goToSlide = (index) => {
      const stepsCount = maxIndex + 1;

      if (stepsCount <= 1) {
        currentIndex = 0;
      } else {
        currentIndex = (index + stepsCount) % stepsCount;
      }

      updateSlider();
    };

    const goToNextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const goToPrevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    const startAutoplay = () => {
      if (prefersReducedMotion || maxIndex === 0 || document.hidden) {
        return;
      }

      stopAutoplay();
      autoplayId = window.setInterval(goToNextSlide, 5000);
    };

    const renderDots = () => {
      dotsContainer.innerHTML = "";

      for (let index = 0; index <= maxIndex; index += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "reviews__dot";
        dot.setAttribute("aria-label", `Показать отзывы ${index + 1}`);

        dot.addEventListener("click", () => {
          stopAutoplay();
          goToSlide(index);
          startAutoplay();
        });

        dotsContainer.append(dot);
      }

      dots = Array.from(dotsContainer.querySelectorAll(".reviews__dot"));
    };

    const recalculateSlider = () => {
      slidesPerView = Math.min(getSlidesPerView(), slides.length);
      maxIndex = Math.max(slides.length - slidesPerView, 0);
      currentIndex = Math.min(currentIndex, maxIndex);
      renderDots();
      updateSlider();
    };

    prevButton.addEventListener("click", () => {
      stopAutoplay();
      goToPrevSlide();
      startAutoplay();
    });

    nextButton.addEventListener("click", () => {
      stopAutoplay();
      goToNextSlide();
      startAutoplay();
    });

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);

    viewport.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
        touchCurrentX = touchStartX;
        stopAutoplay();
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchmove",
      (event) => {
        touchCurrentX = event.touches[0].clientX;
      },
      { passive: true }
    );

    viewport.addEventListener("touchend", () => {
      const distance = touchCurrentX - touchStartX;

      if (Math.abs(distance) > 45) {
        if (distance < 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }
      }

      startAutoplay();
    });

    window.addEventListener("resize", () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(() => {
        stopAutoplay();
        recalculateSlider();
        startAutoplay();
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    recalculateSlider();
    startAutoplay();
  }

  window.initSlider = initSlider;
})();

