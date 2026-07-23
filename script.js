const body = document.body;
const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const floatingActions = document.querySelector(".floating-actions");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setFloatingActionsState = () => {
  if (!floatingActions) return;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;
  floatingActions.classList.toggle("is-visible", !isMobile || window.scrollY > heroHeight * 0.62);
};

setHeaderState();
setFloatingActionsState();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("scroll", setFloatingActionsState, { passive: true });
window.addEventListener("resize", setFloatingActionsState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  body.classList.toggle("menu-open", Boolean(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const slides = [...track.children];
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  let index = 0;

  const update = () => {
    const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    track.style.transform = `translateX(${-index * (slideWidth + gap)}px)`;
  };

  prev?.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  next?.addEventListener("click", () => {
    index = Math.min(slides.length - 1, index + 1);
    update();
  });

  window.addEventListener("resize", update, { passive: true });
});

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const closeLightbox = () => {
  lightbox?.classList.remove("is-open");
  lightbox?.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
  if (lightboxImage) {
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
};

document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const image = trigger.querySelector("img");
    const src = trigger.getAttribute("data-lightbox");
    if (!src || !lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = image?.alt || "Фото";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

const reviewCards = [...document.querySelectorAll(".review-card")];
const reviewDots = document.querySelector("[data-review-dots]");
let reviewIndex = 0;

const showReview = (nextIndex) => {
  reviewIndex = nextIndex;
  reviewCards.forEach((card, index) => card.classList.toggle("is-active", index === reviewIndex));
  reviewDots?.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === reviewIndex);
  });
};

reviewCards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Показати відгук ${index + 1}`);
  dot.addEventListener("click", () => showReview(index));
  reviewDots?.append(dot);
});

showReview(0);
window.setInterval(() => showReview((reviewIndex + 1) % reviewCards.length), 5200);

document.querySelector("[data-booking-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector("[data-form-message]");
  if (message) message.textContent = "Дякуємо! Ми зв'яжемося з вами найближчим часом.";
  form.reset();
});

const privacyModal = document.querySelector("[data-privacy-modal]");
const privacyOpen = document.querySelector("[data-privacy-open]");
const privacyClose = document.querySelector("[data-privacy-close]");

const openPrivacy = () => {
  privacyModal?.classList.add("is-open");
  privacyModal?.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
};

const closePrivacy = () => {
  privacyModal?.classList.remove("is-open");
  privacyModal?.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
};

privacyOpen?.addEventListener("click", openPrivacy);
privacyClose?.addEventListener("click", closePrivacy);
privacyModal?.addEventListener("click", (event) => {
  if (event.target === privacyModal) closePrivacy();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closePrivacy();
    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }
});
