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

  window.initAccordion = initAccordion;
})();

