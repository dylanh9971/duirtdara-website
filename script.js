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

  // Bind the lightbox only on pages that include it (home + blog posts with photos)
  if (lightbox) {
    document.querySelectorAll(".photo-trigger").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(btn));
    });

    document.querySelectorAll("[data-close-lightbox]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

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

  /* ---------- Focal an Lae — word of the day (home page only) ---------- */

  const focalCard = document.getElementById("focalCard");

  if (focalCard) {
    // Edit this list freely — add as many words as you like. Dara, please
    // check the pronunciations suit your dialect; they're rough guides.
    const WORDS = [
      { word: "dúchas",        pron: "DOO-khəs",        meaning: "heritage; one's native place and innate nature", note: "The pull of where you're from — belonging and instinct wrapped into a single word English can't quite hold." },
      { word: "meitheal",      pron: "MEH-hal",         meaning: "neighbours banding together to share the work",   note: "Community as a verb — the old custom of gathering to save the hay or dig the turf, all hands to the one task." },
      { word: "aduantas",      pron: "AD-oo-un-tus",    meaning: "the unease of being somewhere unfamiliar",        note: "That prickle you feel arriving among strangers, far from anything you know." },
      { word: "sceitimíní",    pron: "SHKET-ih-mee-nee", meaning: "fluttering excitement; giddy anticipation",      note: "The butterflies before something you can hardly wait for." },
      { word: "seanchaí",      pron: "SHAN-a-khee",     meaning: "a traditional storyteller and keeper of lore",    note: "The heart of the oral tradition — the one who carries the stories from one generation to the next." },
      { word: "uaigneas",      pron: "OO-ig-nyus",      meaning: "loneliness edged with longing",                   note: "Not just being alone, but the ache of it — a homesickness of the soul." },
      { word: "alltar",        pron: "AL-tur",          meaning: "the otherworld, just beyond the veil",            note: "The netherworld parallel to our own — thin at crossroads, wells and certain times of year. (See 'Broadcasts from the In-Between'.)" },
      { word: "draíocht",      pron: "DREE-okht",       meaning: "magic; enchantment",                              note: "The old word for wonder and spellcraft — the stuff of the Tuatha Dé Danann." },
      { word: "flaithiúlacht", pron: "FLA-hool-okht",   meaning: "open-handed generosity",                          note: "The princely instinct to give freely — from 'flaith', a prince or chief." },
      { word: "grá",           pron: "graw",            meaning: "love, plain and deep",                            note: "Small word, whole world — 'mo ghrá' (my love) is about as tender as Irish gets." },
    ];

    const elWord = document.getElementById("focalWord");
    const elPron = document.getElementById("focalPron");
    const elMeaning = document.getElementById("focalMeaning");
    const elNote = document.getElementById("focalNote");
    const nextBtn = document.getElementById("focalNext");

    // Turn today's date into a stable number so the word changes at local midnight
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayNumber = Math.floor(startOfToday.getTime() / 86400000);
    let index = ((dayNumber % WORDS.length) + WORDS.length) % WORDS.length;

    function renderFocal() {
      const w = WORDS[index];
      elWord.textContent = w.word;
      elPron.textContent = "/" + w.pron + "/";
      elMeaning.textContent = w.meaning;
      elNote.textContent = w.note;

      // gentle fade each time the word changes
      focalCard.classList.remove("focal-in");
      void focalCard.offsetWidth; // reflow so the animation can replay
      focalCard.classList.add("focal-in");
    }

    renderFocal();

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % WORDS.length;
      renderFocal();
    });
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
