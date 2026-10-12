(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const page = document.body.dataset.page || "home";
  const pathMap = { home: "index.html", about: "about.html", services: "services.html", gallery: "gallery.html", reviews: "reviews.html", faq: "faq.html", contact: "contact.html" };

  document.documentElement.style.setProperty("--primary", BUSINESS.primaryColor);
  document.documentElement.style.setProperty("--secondary", BUSINESS.secondaryColor);
  document.documentElement.style.setProperty("--dark", BUSINESS.darkColor);

  function setText(selector, value) { $$(selector).forEach(el => { el.textContent = value; }); }
  function setHref(selector, href) { $$(selector).forEach(el => { el.href = href; }); }

  setText("[data-business-name]", BUSINESS.name);
  setText("[data-business-tagline]", BUSINESS.tagline);
  setText("[data-business-description]", BUSINESS.description);
  setText("[data-business-phone]", BUSINESS.phoneDisplay);
  setText("[data-business-address]", BUSINESS.address);
  setHref("[data-phone-link]", `tel:${BUSINESS.phone}`);
  setHref("[data-maps-link]", BUSINESS.googleMaps);
  setHref("[data-whatsapp-link]", `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hello ${BUSINESS.name}, I would like to ask about an appointment.`)}`);
  $$("[data-business-logo]").forEach(img => { img.src = BUSINESS.logo; img.alt = `${BUSINESS.name} logo`; });

  $$("[data-email]").forEach(el => {
    if (BUSINESS.email) { el.textContent = BUSINESS.email; el.href = `mailto:${BUSINESS.email}`; }
    else { el.closest(".contact-item, li, p")?.remove(); }
  });

  ["facebook","tiktok","instagram"].forEach(key => {
    $$(`[data-social="${key}"]`).forEach(el => {
      const url = BUSINESS[key];
      if (url) { el.href = url; el.hidden = false; } else { el.hidden = true; }
    });
  });

  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html')) {
      const current = pathMap[page];
      if (href === current || (page === 'home' && href === 'index.html')) link.setAttribute('aria-current', 'page');
    }
  });

  const menu = $("#mobile-menu");
  const menuToggle = $("#menu-toggle");
  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    $$("a", menu).forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("click", e => { if (menu.classList.contains("is-open") && !menu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  }

  const hours = BUSINESS.openingHours;
  const dayLabels = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
  $$("[data-hours]").forEach(container => {
    container.innerHTML = Object.entries(dayLabels).map(([key,label]) => `<div class="hours-row"><span>${label}</span><span class="${hours[key] === 'Closed' ? 'closed' : ''}">${esc(hours[key])}</span></div>`).join("");
  });

  const maps = $$("[data-map-embed]");
  maps.forEach(frame => { frame.src = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`; frame.title = `Map showing ${BUSINESS.name} at ${BUSINESS.address}`; });

  const galleryRoot = $("[data-gallery]");
  if (galleryRoot) {
    galleryRoot.innerHTML = BUSINESS.gallery.map((item, i) => `<button class="gallery-item" type="button" data-gallery-index="${i}" aria-label="Open image ${i+1}: ${esc(item.caption)}"><img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="${i < 2 ? 'eager' : 'lazy'}"></button>`).join("");
  }

  const lightbox = $("#lightbox");
  if (lightbox && galleryRoot) {
    const lbImage = $("[data-lightbox-image]", lightbox);
    const lbCaption = $("[data-lightbox-caption]", lightbox);
    let index = 0;
    function renderLightbox() {
      const item = BUSINESS.gallery[index];
      lbImage.src = item.src;
      lbImage.alt = item.alt;
      lbCaption.textContent = item.caption;
    }
    function openLightbox(i) { index = i; renderLightbox(); lightbox.classList.add("is-open"); lightbox.setAttribute("aria-hidden","false"); document.body.classList.add("menu-open"); $(".lightbox-close", lightbox)?.focus(); }
    function closeLightbox() { lightbox.classList.remove("is-open"); lightbox.setAttribute("aria-hidden","true"); document.body.classList.remove("menu-open"); }
    function next(dir) { index = (index + dir + BUSINESS.gallery.length) % BUSINESS.gallery.length; renderLightbox(); }
    galleryRoot.addEventListener("click", e => { const btn = e.target.closest("[data-gallery-index]"); if (btn) openLightbox(Number(btn.dataset.galleryIndex)); });
    $(".lightbox-close", lightbox)?.addEventListener("click", closeLightbox);
    $(".lightbox-prev", lightbox)?.addEventListener("click", () => next(-1));
    $(".lightbox-next", lightbox)?.addEventListener("click", () => next(1));
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", e => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") next(-1);
      if (e.key === "ArrowRight") next(1);
    });
  }

  $$("[data-faq-question]").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.contains("is-open");
      $$(".faq-item.is-open").forEach(other => { other.classList.remove("is-open"); $(".faq-question", other)?.setAttribute("aria-expanded", "false"); });
      if (!open) { item.classList.add("is-open"); button.setAttribute("aria-expanded", "true"); }
    });
  });

  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let valid = true;
      $$("[required]", form).forEach(input => {
        const error = $(`[data-error-for="${input.name}"]`, form);
        if (!input.value.trim() || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))) {
          valid = false; input.setAttribute("aria-invalid", "true"); if (error) error.textContent = input.type === "email" ? "Enter a valid email address." : "This field is required.";
        } else { input.removeAttribute("aria-invalid"); if (error) error.textContent = ""; }
      });
      const status = $("#form-status");
      if (!valid) { status.className = "form-status is-visible error"; status.textContent = "Please correct the highlighted fields and try again."; return; }
      status.className = "form-status is-visible success";
      status.textContent = "Thanks — your message is ready. For a live website, connect this form to your preferred email/form service.";
      form.reset();
    });
  }

  const scrollTop = $("#scroll-top");
  if (scrollTop) {
    window.addEventListener("scroll", () => scrollTop.classList.toggle("is-visible", window.scrollY > 500), { passive: true });
    scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 }) : null;
  $$(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("is-visible"));

  const schema = $("#business-schema");
  if (schema) {
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Barbershop",
      "name": BUSINESS.name,
      "description": BUSINESS.description,
      "telephone": BUSINESS.phone,
      "url": BUSINESS.googleMaps,
      "address": {"@type":"PostalAddress","streetAddress":"3246 Broadway","addressLocality":"San Antonio","addressRegion":"TX","postalCode":"78209","addressCountry":"US"},
      "openingHoursSpecification": Object.entries(BUSINESS.openingHours).filter(([,v]) => v !== "Closed").map(([day, value]) => {
        const to24 = (raw) => { const m = raw.trim().match(/(\d{1,2})\s*(AM|PM)/i); if (!m) return raw; let h = Number(m[1]); const ap = m[2].toUpperCase(); if (ap === "PM" && h !== 12) h += 12; if (ap === "AM" && h === 12) h = 0; return `${String(h).padStart(2,"0")}:00`; };
        const [opens, closes] = value.split("–");
        return {"@type":"OpeningHoursSpecification","dayOfWeek":day.charAt(0).toUpperCase()+day.slice(1),"opens":to24(opens),"closes":to24(closes)};
      })
    });
  }

  const year = new Date().getFullYear();
  setText("[data-year]", year);
})();
