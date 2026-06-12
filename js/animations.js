(function () {
  const REVEAL_SELECTOR = [
    "main > section",
    ".advantages__card",
    ".service-card",
    ".promo__content",
    ".promo__media",
    ".about__media",
    ".about__content",
    ".about-feature",
    ".about-stat",
    ".booking__content",
    ".booking__media",
    ".step-card",
    ".gallery-card",
    ".review-card",
    ".faq__item",
    ".contacts__map",
    ".contact-card",
    ".footer__top",
    ".footer__col"
  ].join(",");

  const STAGGER_GROUP_SELECTOR = [
    ".advantages__grid",
    ".services__grid",
    ".about__features",
    ".about__stats",
    ".steps__grid",
    ".gallery__grid",
    ".reviews__track",
    ".faq__list",
    ".contacts__list",
    ".footer__middle"
  ].join(",");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initAnimations() {
    if (document.body.dataset.animationsInitialized === "true") {
      return;
    }

    document.body.dataset.animationsInitialized = "true";

    initRevealAnimations();
    const counters = document.querySelectorAll("[data-counter]");
    initCounters(counters);
  }

  function initRevealAnimations() {
    if (prefersReducedMotion) {
      return;
    }

    const revealItems = Array.from(document.querySelectorAll(REVEAL_SELECTOR));

    if (!revealItems.length) {
      return;
    }

    setStaggerDelays(revealItems);

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(showRevealItem);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          showRevealItem(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.15
      }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }

  function setStaggerDelays(items) {
    const revealSet = new Set(items);

    document.querySelectorAll(STAGGER_GROUP_SELECTOR).forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!revealSet.has(child)) {
          return;
        }

        child.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 0.1}s`);
      });
    });
  }

  function showRevealItem(item) {
    const delay = parseFloat(getComputedStyle(item).getPropertyValue("--reveal-delay")) || 0;

    item.classList.add("is-visible");

    window.setTimeout(() => {
      item.classList.remove("reveal", "is-visible");
      item.style.removeProperty("--reveal-delay");
    }, 800 + delay * 1000);
  }

  function initCounters(counters) {
    if (!counters.length) {
      return;
    }

    const setCounterValue = (counter, value) => {
      const suffix = counter.dataset.suffix || "";
      counter.textContent = `${value}${suffix}`;
    };

    const animateCounter = (counter) => {
      if (counter.dataset.animated === "true") {
        return;
      }

      counter.dataset.animated = "true";

      const target = Number(counter.dataset.counter);

      if (!Number.isFinite(target)) {
        return;
      }

      if (prefersReducedMotion) {
        setCounterValue(counter, target);
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      const tick = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easedProgress);

        setCounterValue(counter, currentValue);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    counters.forEach((counter) => {
      setCounterValue(counter, 0);
    });

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  window.initAnimations = initAnimations;
})();
