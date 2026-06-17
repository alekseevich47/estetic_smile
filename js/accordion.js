(function () {
  function initAccordion() {
    const accordion = document.querySelector("[data-accordion]");

    if (!accordion || accordion.dataset.initialized === "true") {
      return;
    }

    const items = Array.from(accordion.querySelectorAll(".faq__item"));

    if (!items.length) {
      return;
    }

    accordion.dataset.initialized = "true";

    const setItemState = (item, isOpen) => {
      const button = item.querySelector(".faq__question");
      const answer = item.querySelector(".faq__answer");

      item.classList.toggle("is-open", isOpen);

      if (button) {
        button.setAttribute("aria-expanded", String(isOpen));
      }

      if (answer) {
        answer.setAttribute("aria-hidden", String(!isOpen));
      }
    };

    items.forEach((item) => {
      const button = item.querySelector(".faq__question");

      if (!button) {
        return;
      }

      button.addEventListener("click", () => {
        const shouldOpen = !item.classList.contains("is-open");

        items.forEach((currentItem) => {
          setItemState(currentItem, currentItem === item && shouldOpen);
        });
      });
    });
  }

  function initFooterAccordion() {
    const accordions = document.querySelectorAll("[data-footer-accordion]");

    accordions.forEach((accordion) => {
      if (accordion.dataset.initialized === "true") {
        return;
      }

      const toggle = accordion.querySelector("[data-footer-accordion-toggle]");
      const body = accordion.querySelector("[data-footer-accordion-body]");

      if (!toggle || !body) {
        return;
      }

      accordion.dataset.initialized = "true";

      const group = accordion.closest(".nav__mobile-list, .footer__middle");

      const syncHeight = () => {
        if (accordion.classList.contains("is-open")) {
          accordion.style.setProperty("--footer-accordion-height", `${body.scrollHeight}px`);
        }
      };

      toggle.addEventListener("click", () => {
        const willOpen = !accordion.classList.contains("is-open");

        if (willOpen && group) {
          group.querySelectorAll("[data-footer-accordion].is-open").forEach((other) => {
            if (other !== accordion) {
              other.classList.remove("is-open");
            }
          });
        }

        accordion.classList.toggle("is-open");
        syncHeight();
      });

      window.addEventListener("resize", syncHeight);
    });
  }

  function initAccordionAll() {
    initAccordion();
    initFooterAccordion();
  }

  window.initAccordion = initAccordionAll;
})();

