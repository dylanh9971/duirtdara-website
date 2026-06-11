/* ==========================================================================
   Dúirt Dara — interactions
   Mobile nav · contact modal · journey accordion · forms · scroll reveal
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */

  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close the menu after choosing a destination
  siteNav.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Contact modal ---------- */

  const modal = document.getElementById("contactModal");
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector("input, textarea, button").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    contactFeedback.textContent = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-contact]").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-close-contact]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- Photo lightbox ---------- */

  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let lastFocusedPhoto = null;

  function openLightbox(trigger) {
    const img = trigger.querySelector("img");
    const caption = trigger.closest("figure").querySelector("figcaption");

    lastFocusedPhoto = document.activeElement;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".modal-close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lightboxImage.src = "";
    if (lastFocusedPhoto) lastFocusedPhoto.focus();
  }

  document.querySelectorAll(".visual-journal-gallery .photo-trigger").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn));
  });

  document.querySelectorAll("[data-close-lightbox]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  const CONTACT_ENDPOINT = "https://formspree.io/f/xdabzvbz";

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("cName");
    const email = document.getElementById("cEmail");
    const message = document.getElementById("cMessage");

    if (!name.value.trim() || !isValidEmail(email.value) || !message.value.trim()) {
      contactFeedback.textContent = "Add your name, a valid email and a message.";
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactFeedback.textContent = "Message sent! I'll be in touch soon.";
        contactForm.reset();
        setTimeout(closeModal, 1800);
      } else {
        contactFeedback.textContent = "Something went wrong — please email me directly instead.";
      }
    } catch {
      contactFeedback.textContent = "Something went wrong — please email me directly instead.";
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Journey accordion (only present on the home page) ---------- */

  const journeyItems = document.querySelectorAll(".journey-item");

  journeyItems.forEach((item) => {
    const toggle = item.querySelector(".journey-toggle");
    const story = item.querySelector(".journey-story");

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      // Close any other open story so one place speaks at a time
      journeyItems.forEach((other) => {
        if (other === item) return;
        other.querySelector(".journey-toggle").setAttribute("aria-expanded", "false");
        other.querySelector(".journey-story").style.maxHeight = "0px";
      });

      toggle.setAttribute("aria-expanded", String(!isOpen));
      story.style.maxHeight = isOpen ? "0px" : story.scrollHeight + "px";
    });
  });

  // Keep an open story sized correctly if the window changes
  window.addEventListener("resize", () => {
    journeyItems.forEach((item) => {
      const toggle = item.querySelector(".journey-toggle");
      const story = item.querySelector(".journey-story");
      if (toggle.getAttribute("aria-expanded") === "true") {
        story.style.maxHeight = story.scrollHeight + "px";
      }
    });
  });

  /* ---------- Newsletter (only present on the home page) ---------- */

  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterFeedback = document.getElementById("newsletterFeedback");

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!isValidEmail(newsletterEmail.value)) {
        newsletterFeedback.textContent = "That email doesn't look right — try again.";
        return;
      }

      // Hook your newsletter provider (Mailchimp, Buttondown, etc.) in here.
      newsletterFeedback.textContent = "Go raibh maith agat — you're signed up!";
      newsletterForm.reset();
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* ---------- Scroll reveal ---------- */

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }
})();
