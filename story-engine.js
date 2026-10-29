/* JMael V4 | Scroll-directed, single-stage narrative.
 * Keeps native scrolling, preserves all original sections and controls,
 * and never activates on narrow/short/reduced-motion viewports.
 * No wheel interception, timers, animation libraries or canvas needed. */
(() => {
  'use strict';

  const root = document.documentElement;
  const surface = document.querySelector('.editorial-story');
  const stage = document.querySelector('.editorial-stage');
  if (!surface || !stage) return;

  const query = window.matchMedia(
    '(min-width: 1100px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)'
  );
  const header = document.querySelector('.header');
  const sceneElements = [
    document.querySelector('#inicio .hero-stage'),
    document.querySelector('#servicios.services-band'),
    ...document.querySelectorAll('#proyectos .project-card'),
    document.querySelector('#laboratorio.lab-preview')
  ];

  if (sceneElements.length !== 6 || sceneElements.some(element => !element)) return;
  if (!('inert' in HTMLElement.prototype)) return;

  sceneElements.forEach((scene, index) => scene.setAttribute('data-story-scene', String(index)));

  const sceneAnchors = new Map([
    ['inicio', 0],
    ['servicios', 1],
    ['proyectos', 2],
    ['laboratorio', 5]
  ]);
  const rail = Array.from(stage.querySelectorAll('.story-rail > span'));
  const navLinks = Array.from(document.querySelectorAll('#navigation a[href^="#"]'));

  let active = false;
  let scheduled = false;
  let headerHeight = 82;
  let stageHeight = 700;
  let span = 650;
  let current = -1;
  let resizeFrame = 0;

  const clamp = value => Math.min(1, Math.max(0, value));
  const eased = value => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  const storyStart = () =>
    surface.getBoundingClientRect().top + window.scrollY - headerHeight;

  function setInteractive(next) {
    if (current === next) return;
    current = next;

    sceneElements.forEach((scene, index) => {
      const selected = index === next;
      scene.inert = !selected;
      scene.classList.toggle('story-interactive', selected);
      // Inert handles the accessibility tree and keyboard without changing
      // visibility during a visual crossfade.
    });

    rail.forEach((dot, index) => dot.classList.toggle('is-current', index === next));
  }

  function render() {
    scheduled = false;
    if (!active) return;

    const position = Math.max(0, Math.min(5, (window.scrollY - storyStart()) / span));
    const nextInteractive = Math.max(0, Math.min(5, Math.round(position)));

    sceneElements.forEach((scene, index) => {
      // First layer is the uninterrupted backdrop. Every subsequent layer
      // gradually covers its predecessor over one natural scroll segment.
      const reveal = index === 0 ? 1 : eased((position - (index - 1) - .06) / .86);
      scene.style.setProperty('--scene-opacity', reveal.toFixed(4));
      scene.style.setProperty('--scene-y', ((1 - reveal) * 54).toFixed(2) + 'px');
      scene.style.setProperty('--scene-scale', (1.035 - reveal * .035).toFixed(4));
    });

    setInteractive(nextInteractive);

    // Existing header links remain meaningful at every position.
    let targetId = 'inicio';
    if (nextInteractive === 1) targetId = 'servicios';
    if (nextInteractive >= 2 && nextInteractive <= 4) targetId = 'proyectos';
    if (nextInteractive === 5) targetId = 'laboratorio';
    const viewport = surface.getBoundingClientRect();
    if (viewport.bottom >= headerHeight && viewport.top <= window.innerHeight) {
      navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === '#' + targetId)
      );
    }
  }

  function schedule() {
    if (!active || scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(render);
  }

  function clear() {
    active = false;
    current = -1;
    root.classList.remove('story-active');
    root.style.removeProperty('--story-header-height');
    root.style.removeProperty('--story-total-height');
    surface.style.removeProperty('--story-total-height');
    sceneElements.forEach(scene => {
      scene.inert = false;
      scene.classList.remove('story-interactive');
      scene.style.removeProperty('--scene-opacity');
      scene.style.removeProperty('--scene-y');
      scene.style.removeProperty('--scene-scale');
    });
    rail.forEach(dot => dot.classList.remove('is-current'));
  }

  function fitsStage() {
    const bounds = stage.getBoundingClientRect();
    const height = bounds.height;
    if (height < 535) return false;

    const measure = (selector, margin = 14) => {
      const item = stage.querySelector(selector);
      if (!item) return false;
      const rect = item.getBoundingClientRect();
      return rect.height > 0 &&
        rect.top >= bounds.top - margin &&
        rect.bottom <= bounds.bottom + margin;
    };

    const serviceFits = measure('#servicios .services-heading', 22) &&
      measure('#servicios .service-cards', 18);
    const projectFits = sceneElements.slice(2, 5).every(card => {
      const cardRect = card.getBoundingClientRect();
      const body = card.querySelector('.card-body');
      const art = card.querySelector('.project-art');
      if (!body || !art) return false;
      return card.scrollHeight <= card.clientHeight + 6 &&
        [body, art].every(item => {
          const r = item.getBoundingClientRect();
          return r.top >= cardRect.top - 15 &&
            r.bottom <= cardRect.bottom + 15;
        });
    });
    const labFits = measure('#laboratorio .lab-preview-heading', 20) &&
      measure('#laboratorio .lab-preview-content', 20);
    const heroFits = measure('#inicio .hero-copy', 24);
    return serviceFits && projectFits && labFits && heroFits;
  }

  function applyMode() {
    if (!query.matches ||
        !window.CSS ||
        !CSS.supports('position', 'sticky') ||
        !CSS.supports('height', '100svh')) {
      clear();
      return;
    }

    clear();
    headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 82;
    stageHeight = Math.round(window.innerHeight - headerHeight);
    span = Math.round(stageHeight * .98);
    root.style.setProperty('--story-header-height', headerHeight + 'px');
    // Sticky releases at exactly the final complete scene.
    surface.style.setProperty(
      '--story-total-height',
      (stageHeight + 5 * span) + 'px'
    );
    root.classList.add('story-active');

    if (!fitsStage()) {
      clear();
      return;
    }

    active = true;
    render();
  }

  function goToScene(index, behavior = 'smooth') {
    if (!active) return;
    const start = storyStart();
    window.scrollTo({
      top: Math.round(start + index * span),
      behavior
    });
  }

  document.addEventListener('click', event => {
    if (!active || event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || anchor.target === '_blank') return;
    const id = anchor.getAttribute('href').slice(1);
    if (!sceneAnchors.has(id)) return;
    event.preventDefault();
    const hash = '#' + id;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    goToScene(sceneAnchors.get(id));
  });

  window.addEventListener('popstate', () => {
    if (!active) return;
    const id = window.location.hash.slice(1);
    if (sceneAnchors.has(id)) goToScene(sceneAnchors.get(id), 'instant');
  });

  window.addEventListener('scroll', schedule, { passive: true });

  window.addEventListener('resize', () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      applyMode();
    });
  }, { passive: true });

  if (query.addEventListener) query.addEventListener('change', applyMode);
  else if (query.addListener) query.addListener(applyMode);

  applyMode();
  if (active && window.location.hash) {
    const id = window.location.hash.slice(1);
    if (sceneAnchors.has(id)) {
      window.requestAnimationFrame(() => goToScene(sceneAnchors.get(id), 'instant'));
    }
  }
})();
