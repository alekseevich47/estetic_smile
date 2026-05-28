function initForm() {
  const form = document.querySelector("[data-booking-form]");

  if (!form) {
    return;
  }

  const fields = {
    name: form.querySelector("#booking-name"),
    phone: form.querySelector("#booking-phone"),
    service: form.querySelector("#booking-service"),
    consent: form.querySelector("#booking-consent"),
  };
  const submitButton = form.querySelector(".booking-form__submit");
  const submitText = form.querySelector(".booking-form__submit-text");
  const status = form.querySelector(".booking-form__status");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getErrorElement = (field) => form.querySelector(`[data-error-for="${field.id}"]`);

  Object.values(fields).forEach((field) => {
    const errorElement = getErrorElement(field);

    if (!errorElement) {
      return;
    }

    errorElement.id = `${field.id}-error`;
    field.setAttribute("aria-describedby", errorElement.id);
  });

  const setError = (field, message) => {
    const errorElement = getErrorElement(field);

    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = `7${digits.slice(1)}`;
    }

    if (digits && !digits.startsWith("7")) {
      digits = `7${digits}`;
    }

    digits = digits.slice(0, 11);
    const code = digits.slice(1, 4);
    const firstPart = digits.slice(4, 7);
    const secondPart = digits.slice(7, 9);
    const thirdPart = digits.slice(9, 11);

    if (!digits) {
      return "";
    }

    let result = "+7";

    if (code) {
      result += ` (${code}`;
    }

    if (code.length === 3) {
      result += ")";
    }

    if (firstPart) {
      result += ` ${firstPart}`;
    }

    if (secondPart) {
      result += `-${secondPart}`;
    }

    if (thirdPart) {
      result += `-${thirdPart}`;
    }

    return result;
  };

  const validate = () => {
    let isValid = true;
    let firstInvalidField = null;
    const phoneDigits = fields.phone.value.replace(/\D/g, "");

    const markInvalid = (field, message) => {
      setError(field, message);
      if (!firstInvalidField) {
        firstInvalidField = field;
      }
      isValid = false;
    };

    if (fields.name.value.trim().length < 2) {
      markInvalid(fields.name, "Введите имя");
    } else {
      setError(fields.name, "");
    }

    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("7")) {
      markInvalid(fields.phone, "Введите телефон полностью");
    } else {
      setError(fields.phone, "");
    }

    if (!fields.service.value) {
      markInvalid(fields.service, "Выберите услугу");
    } else {
      setError(fields.service, "");
    }

    if (!fields.consent.checked) {
      markInvalid(fields.consent, "Нужно согласие на обработку данных");
    } else {
      setError(fields.consent, "");
    }

    return {
      isValid,
      firstInvalidField
    };
  };

  fields.phone.addEventListener("input", () => {
    fields.phone.value = formatPhone(fields.phone.value);
    setError(fields.phone, "");
  });

  fields.phone.addEventListener("blur", () => {
    if (fields.phone.value.replace(/\D/g, "").length <= 1) {
      fields.phone.value = "";
    }
  });

  Object.values(fields).forEach((field) => {
    const eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, () => {
      setError(field, "");
      status.textContent = "";
      status.classList.remove("is-success");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const validation = validate();

    if (!validation.isValid) {
      if (validation.firstInvalidField) {
        validation.firstInvalidField.focus({ preventScroll: true });
        validation.firstInvalidField.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
      }

      return;
    }

    submitButton.classList.add("is-loading");
    submitButton.disabled = true;
    submitText.textContent = "Отправляем...";
    status.textContent = "";

    window.setTimeout(() => {
      form.reset();
      submitButton.classList.remove("is-loading");
      submitButton.disabled = false;
      submitText.textContent = "Записаться";
      status.textContent = "Спасибо! Заявка отправлена, администратор скоро перезвонит.";
      status.classList.add("is-success");
    }, 900);
  });
}

window.initForm = initForm;

