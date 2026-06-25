function getHeaderScrollOffset() {
  const header = document.querySelector(".site-header");
  if (!header) {
    return 96;
  }

  return Math.ceil(header.getBoundingClientRect().bottom) + 16;
}

function initSpecialists() {
  const navLinks = document.querySelectorAll(".specialists-nav__link");
  const sections = document.querySelectorAll(".specialists-section[id]");

  if (!navLinks.length || !sections.length) {
    return;
  }

  const scrollToHash = (hash, behavior = "smooth") => {
    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderScrollOffset();
    window.scrollTo({ top, behavior });
  };

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const syncFromScroll = () => {
    const offset = getHeaderScrollOffset();
    let currentId = sections[0].id;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) {
        currentId = section.id;
      }
    });

    setActiveLink(currentId);
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) {
        return;
      }

      event.preventDefault();
      history.replaceState(null, "", hash);
      scrollToHash(hash);
      setActiveLink(hash.slice(1));
    });
  });

  if (location.hash) {
    requestAnimationFrame(() => {
      scrollToHash(location.hash, "auto");
      setActiveLink(location.hash.slice(1));
    });
  }

  window.addEventListener("scroll", syncFromScroll, { passive: true });
  syncFromScroll();
}

window.initSpecialists = initSpecialists;
