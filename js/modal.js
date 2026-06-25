(function () {
  function docsUrl(slug) {
    const path = window.location.pathname.replace(/\\/g, "/");
    const clean = path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    const parts = clean.split("/").filter(Boolean);
    const prefix = parts.length ? `${"../".repeat(parts.length)}` : "";
    return `${prefix}documents/#${slug}`;
  }

  function initModal() {
    const modal = mountBookingModal();

    if (!modal || modal.dataset.initialized === "true") {
      return;
    }

    const dialog = modal.querySelector(".modal");
    const closeButton = modal.querySelector(".modal__close");
    const triggers = Array.from(
      document.querySelectorAll("[data-open-booking], a[href='#booking-form']")
    );
    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");
    let lastFocusedElement = null;

    if (!dialog || !closeButton) {
      return;
    }

    modal.dataset.initialized = "true";

    const isOpen = () => modal.classList.contains("is-open");

    const getFocusableElements = () => Array.from(modal.querySelectorAll(focusableSelector));

    const setPageInert = (shouldInert) => {
      Array.from(document.body.children).forEach((element) => {
        if (element === modal || element.tagName === "SCRIPT") {
          return;
        }

        if (shouldInert) {
          element.dataset.modalPreviousAriaHidden = element.getAttribute("aria-hidden") || "";
          element.setAttribute("aria-hidden", "true");
          element.inert = true;
          return;
        }

        const previousAriaHidden = element.dataset.modalPreviousAriaHidden;

        if (previousAriaHidden) {
          element.setAttribute("aria-hidden", previousAriaHidden);
        } else {
          element.removeAttribute("aria-hidden");
        }

        delete element.dataset.modalPreviousAriaHidden;
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

    const showModal = () => {
      lastFocusedElement = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      setPageInert(true);

      window.setTimeout(() => {
        closeButton.focus({ preventScroll: true });
      }, 50);
    };

    const hideModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      setPageInert(false);

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        showModal();
      });
    });

    closeButton.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        hideModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!isOpen()) {
        return;
      }

      if (event.key === "Escape") {
        hideModal();
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }
    });
  }

  function mountBookingModal() {
    const existingModal = document.getElementById("booking-modal");

    if (existingModal) {
      ensureBookingForm(existingModal);
      return existingModal;
    }

    const modal = document.createElement("div");
    modal.id = "booking-modal";
    modal.className = "modal-overlay";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" tabindex="-1">
        <button class="modal__close" type="button" aria-label="Закрыть окно">&times;</button>
        <p class="modal__label">Запись на прием</p>
        <h2 id="booking-modal-title">Подберем удобное время и врача под вашу задачу</h2>
        <p class="modal__text">
          Оставьте контакты, администратор перезвонит, уточнит услугу и предложит ближайшее свободное окно.
        </p>
        <div class="modal__form-slot"></div>
      </div>
    `;

    document.body.appendChild(modal);
    ensureBookingForm(modal);

    return modal;
  }

  function ensureBookingForm(modal) {
    const slot = modal.querySelector(".modal__form-slot");

    if (!slot) {
      return;
    }

    const modalForm = modal.querySelector("[data-booking-form]");

    if (modalForm) {
      return;
    }

    const existingForm = document.querySelector("[data-booking-form]");

    if (existingForm && !modal.contains(existingForm)) {
      slot.appendChild(existingForm);
      return;
    }

    slot.appendChild(createBookingForm());

    const form = slot.querySelector("[data-booking-form]");
    form?.querySelectorAll(".booking-form__consent-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });
  }

  function createBookingForm() {
    const template = document.createElement("template");

    template.innerHTML = `
      <form class="booking-form" action="#" method="post" novalidate data-booking-form>
        <div class="booking-form__field">
          <label for="booking-name">Имя</label>
          <input id="booking-name" name="name" type="text" placeholder="Как к вам обращаться" autocomplete="name" required>
          <span class="booking-form__error" data-error-for="booking-name"></span>
        </div>

        <div class="booking-form__field">
          <label for="booking-phone">Телефон</label>
          <input id="booking-phone" name="phone" type="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" required>
          <span class="booking-form__error" data-error-for="booking-phone"></span>
        </div>

        <div class="booking-form__field">
          <label for="booking-service">Услуга</label>
          <select id="booking-service" name="service" required>
            <option value="">Выберите услугу</option>
            <option value="therapy">Терапевтическое лечение</option>
            <option value="ortopediy">Ортопедическое лечение</option>
            <option value="surgery">Хирургическое лечение</option>
            <option value="prevention">Профилактическое лечение</option>
          </select>
          <span class="booking-form__error" data-error-for="booking-service"></span>
        </div>

        <label class="booking-form__consent" for="booking-consent">
          <input id="booking-consent" name="consent" type="checkbox" required>
          <span>Даю <a class="booking-form__consent-link" href="${docsUrl("personal-data-consent")}" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> и ознакомлен(а) с <a class="booking-form__consent-link" href="${docsUrl("privacy-policy")}" target="_blank" rel="noopener noreferrer">политикой обработки персональных данных</a></span>
        </label>
        <span class="booking-form__error" data-error-for="booking-consent"></span>

        <button class="btn btn-primary booking-form__submit" type="submit">
          <span class="booking-form__submit-text">Записаться</span>
          <span class="booking-form__spinner" aria-hidden="true"></span>
        </button>

        <div class="booking-form__status" role="status" aria-live="polite"></div>
      </form>
    `;

    return template.content.firstElementChild;
  }

  window.initModal = initModal;
})();
