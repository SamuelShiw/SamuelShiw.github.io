/* JMael / Portfolio 2026
   Native navigation first; motion and pointer effects are progressive enhancements. */
(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("nav-primary");
  const menu = document.querySelector(".menu-toggle");
  const menuLabel = menu?.querySelector(".menu-text");
  const progress = document.querySelector(".reading-progress span");
  const motionButton = document.querySelector("[data-motion-toggle]");
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const heroArt = document.querySelector(".hero-art");
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const menuMediaQuery = window.matchMedia("(min-width: 721px)");
  let stored = null;
  try { stored = window.localStorage.getItem("jmael-reduce-motion"); } catch (_) { /* storage optional */ }

  let reduceMotion = stored === "true" || (stored === null && reducedQuery.matches);

  function updateMotion(enabled) {
    reduceMotion = enabled;
    root.classList.toggle("reduce-motion", enabled);
    if (motionButton) {
      motionButton.setAttribute("aria-pressed", String(enabled));
      motionButton.setAttribute("aria-label", enabled ? "Activar movimiento" : "Reducir movimiento");
      motionButton.textContent = enabled ? "MOVIMIENTO: OFF" : "MOVIMIENTO: ON";
    }
    if (heroArt) {
      heroArt.style.removeProperty("--photo-x");
      heroArt.style.removeProperty("--photo-y");
      heroArt.style.removeProperty("--art-x");
      heroArt.style.removeProperty("--art-y");
    }
    if (enabled) {
      reveals.forEach(element => element.classList.add("is-visible"));
    }
  }

  updateMotion(reduceMotion);
  motionButton?.addEventListener("click", () => {
    updateMotion(!reduceMotion);
    try { window.localStorage.setItem("jmael-reduce-motion", String(reduceMotion)); }
    catch (_) { /* storage optional */ }
  });

  function closeMenu(restoreFocus = false) {
    if (!menu || !nav) return;
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menú");
    if (menuLabel) menuLabel.textContent = "MENÚ";
    nav.classList.remove("open");
    if (restoreFocus) menu.focus();
  }

  menu?.addEventListener("click", () => {
    if (!nav) return;
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (menuLabel) menuLabel.textContent = open ? "CERRAR" : "MENÚ";
    nav.classList.toggle("open", open);
  });

  nav?.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => closeMenu());
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") closeMenu(true);
  });
  document.addEventListener("click", event => {
    if (menu?.getAttribute("aria-expanded") !== "true") return;
    if (event.target instanceof Element && !event.target.closest(".header-inner")) closeMenu();
  });
  menuMediaQuery.addEventListener?.("change", () => closeMenu());

  // A section becomes visible once and stays visible. Content works without JS.
  if ("IntersectionObserver" in window && !reduceMotion && !reducedQuery.matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px 40px 0px", threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
    root.classList.add("motion-ready");
  } else {
    reveals.forEach(element => element.classList.add("is-visible"));
  }

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const navSections = navLinks
    .map(link => ({link,section:document.querySelector(link.getAttribute("href"))}))
    .filter(item => item.section);

  let scrollFrame = 0;
  function renderScroll() {
    scrollFrame = 0;
    const max = Math.max(0, root.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = "scaleX(" +
      (max ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : "0") + ")";
    const offset = (header?.getBoundingClientRect().height || 80) + 75;
    let current = null;
    for (const item of navSections) {
      if (item.section.getBoundingClientRect().top <= offset) current = item;
    }
    navLinks.forEach(link => {
      const active = !!current && link === current.link;
      if (active) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll);
  }, {passive:true});
  window.addEventListener("resize", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll);
  });
  renderScroll();

  // Only a few pixels of parallax, restricted to precise pointer devices.
  if (heroArt && pointerQuery.matches) {
    let pointerFrame = 0;
    let mx = 0, my = 0;

    heroArt.addEventListener("pointermove", event => {
      if (event.pointerType === "touch" || reduceMotion || reducedQuery.matches) return;
      const rect = heroArt.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mx = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
      my = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        heroArt.style.setProperty("--photo-x", (mx * 12).toFixed(2) + "px");
        heroArt.style.setProperty("--photo-y", (my * 9).toFixed(2) + "px");
        heroArt.style.setProperty("--art-x", (-mx * 15).toFixed(2) + "px");
        heroArt.style.setProperty("--art-y", (-my * 10).toFixed(2) + "px");
      });
    }, {passive:true});

    heroArt.addEventListener("pointerleave", () => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      heroArt.style.removeProperty("--photo-x");
      heroArt.style.removeProperty("--photo-y");
      heroArt.style.removeProperty("--art-x");
      heroArt.style.removeProperty("--art-y");
    });
  }
})();