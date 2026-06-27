
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initLoader === "function") {
    window.initLoader();
  }

  if (typeof window.initHeader === "function") {
    window.initHeader();
  }

  if (typeof window.initModal === "function") {
    window.initModal();
  }

  if (typeof window.initForm === "function") {
    window.initForm();
  }

  if (typeof window.initGallery === "function") {
    window.initGallery();
  }

  if (typeof window.initSlider === "function") {
    window.initSlider();
  }

  if (typeof window.initReviewForm === "function") {
    window.initReviewForm();
  }

  if (typeof window.initHeroSlideshow === "function") {
    window.initHeroSlideshow();
  }

  if (typeof window.initAccordion === "function") {
    window.initAccordion();
  }

  if (typeof window.initAnimations === "function") {
    window.initAnimations();
  }

  if (typeof window.initDocuments === "function") {
    window.initDocuments();
  }

  if (typeof window.initCookie === "function") {
    window.initCookie();
  }

  if (typeof window.initSpecialists === "function") {
    window.initSpecialists();
  }

  if (typeof window.initPrices === "function") {
    window.initPrices();
  }
});

