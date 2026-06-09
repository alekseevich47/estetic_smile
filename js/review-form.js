(function () {
  function initReviewForm() {
    const dialog = document.getElementById("review-dialog");
    const openButton = document.querySelector("[data-open-review]");
    const form = document.querySelector("[data-review-form]");
    const closeButton = dialog ? dialog.querySelector(".review-dialog__close") : null;
    const submitButton = form ? form.querySelector(".review-form__submit") : null;
    const submitText = submitButton ? submitButton.querySelector("span") : null;
    const track = document.querySelector(".reviews__track");

    if (!dialog || !openButton || !form || !closeButton || !submitButton || !submitText || !track) {
      return;
    }

    const fields = {
      name: form.elements.name,
      text: form.elements.text
    };

    const showError = (field) => {
      dialog.classList.remove("bounce-modal");
      window.requestAnimationFrame(() => {
        dialog.classList.add("bounce-modal");
      });

      if (field) {
        field.focus({ preventScroll: true });
      }
    };

    const resetSubmit = () => {
      submitButton.classList.remove("sending");
      submitButton.disabled = false;
      submitText.textContent = "Отправить отзыв";
    };

    const closeDialog = () => {
      if (dialog.open) {
        dialog.close();
      }

      form.reset();
      resetSubmit();
    };

    const createReviewCard = ({ name, text, rating }) => {
      const card = document.createElement("article");
      card.className = "review-card";

      const ratingElement = document.createElement("div");
      ratingElement.className = "review-card__rating";
      ratingElement.setAttribute("aria-label", `Оценка ${rating} из 5`);

      const stars = document.createElement("span");
      stars.setAttribute("aria-hidden", "true");
      stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

      const quote = document.createElement("blockquote");
      quote.textContent = text;

      const author = document.createElement("p");
      author.className = "review-card__author";
      author.textContent = name || "Пациент Estetic Smile";

      ratingElement.append(stars);
      card.append(ratingElement, quote, author);

      return card;
    };

    const validate = () => {
      const checkedRating = form.querySelector('input[name="rating"]:checked');
      const text = fields.text.value.trim();

      if (!checkedRating) {
        showError(form.querySelector('input[name="rating"]'));
        return null;
      }

      if (text.length < 10) {
        showError(fields.text);
        return null;
      }

      return {
        rating: Number(checkedRating.value),
        name: fields.name.value.trim(),
        text
      };
    };

    openButton.addEventListener("click", () => {
      dialog.showModal();
    });

    closeButton.addEventListener("click", closeDialog);

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog.addEventListener("cancel", () => {
      form.reset();
      resetSubmit();
    });

    dialog.addEventListener("animationend", () => {
      dialog.classList.remove("bounce-modal");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const review = validate();

      if (!review) {
        return;
      }

      submitButton.classList.add("sending");
      submitButton.disabled = true;
      submitText.textContent = "Успешно отправлено!";
      track.append(createReviewCard(review));
      track.dispatchEvent(new CustomEvent("reviews:updated", { bubbles: true }));

      window.setTimeout(closeDialog, 1500);
    });
  }

  window.initReviewForm = initReviewForm;
})();
