/* JMael V4.1 | A single scroll controller and progressive enhancements.
 * Native scrolling always works. The cinematic stage is optional.
 * No dependency, wheel interception or permanent content hiding. */
(() => {
  'use strict';

  const root = document.documentElement;
  const surface = document.querySelector('.editorial-story');
  const stage = document.querySelector('.editorial-stage');
  if (!surface || !stage) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storyQuery = window.matchMedia(
    '(min-width: 1100px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)'
  );
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const hero = document.querySelector('#inicio .hero-stage');
  const heroWord = document.querySelector('#inicio .hero-word');
  const portrait = document.querySelector('#inicio .hero-portrait');
  const lab = document.querySelector('#laboratorio.lab-preview');
  const scenes = [
    hero,
    document.querySelector('#servicios.services-band'),
    ...document.querySelectorAll('#proyectos .project-card'),
    lab
  ];

  if (scenes.length !== 6 || scenes.some(element => !element)) return;

  scenes.forEach((scene, index) =>
    scene.setAttribute('data-story-scene', String(index)));

  const rail = Array.from(stage.querySelectorAll('.story-rail > span'));
  const navLinks = Array.from(document.querySelectorAll('#navigation a[href^="#"]'));
  const projectCards = scenes.slice(2, 5);
  const sceneAnchors = new Map([
    ['inicio', 0], ['servicios', 1], ['proyectos', 2], ['laboratorio', 5]
  ]);

  let active = false;
  let current = -1;
  let scheduled = false;
  let headerHeight = 82;
  let sceneStep = 550;
  let resizeFrame = 0;

  const clamp = n => Math.max(0, Math.min(1, n));
  const eased = n => {
    const t = clamp(n);
    return t * t * (3 - 2 * t);
  };
  const storyStart = () =>
    surface.getBoundingClientRect().top + window.scrollY - headerHeight;

  function setCurrentScene(index) {
    if (index === current) return;
    current = index;

    scenes.forEach((scene, i) => {
      const visible = i === index;
      // Prevent focus from remaining in an inert scene after a keyboard scroll.
      if (!visible && scene.contains(document.activeElement) &&
          document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      scene.inert = !visible;
      scene.classList.toggle('story-interactive', visible);
      scene.classList.toggle('story-near', Math.abs(i - index) <= 1);
    });
    rail.forEach((dot, i) => dot.classList.toggle('is-current', i === index));
  }

  function updateProgress() {
    const scrollMax = Math.max(0, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--reading-progress',
      String(scrollMax ? clamp(window.scrollY / scrollMax) : 0));
  }

  function render() {
    scheduled = false;
    updateProgress();

    if (!active) {
      // Lightweight parallax for fallback desktop mode. It does not run in
      // the pinned scene, so there are no competing scroll transforms.
      if (!motionQuery.matches && window.innerWidth >= 901 &&
          hero.getBoundingClientRect().bottom > 0) {
        const offset = Math.min(750, Math.max(0, window.scrollY));
        if (heroWord) heroWord.style.setProperty('--hero-word-shift',
          (offset * .16).toFixed(1) + 'px');
        if (portrait) portrait.style.setProperty('--hero-portrait-shift',
          (-offset * .08).toFixed(1) + 'px');
      }
      return;
    }

    const progress = Math.max(0,
      Math.min(5, (window.scrollY - storyStart()) / sceneStep));
    const selected = Math.max(0, Math.min(5, Math.round(progress)));

    scenes.forEach((scene, index) => {
      const opacity = index === 0 ? 1 : eased((progress - (index - 1) - .06) / .86);
      scene.style.setProperty('--scene-opacity', opacity.toFixed(4));
      scene.style.setProperty('--scene-y', ((1 - opacity) * 46).toFixed(2) + 'px');
      scene.style.setProperty('--scene-scale', (1.025 - opacity * .025).toFixed(4));
    });
    setCurrentScene(selected);

    // Only the story controller owns story chapter navigation.
    const activeId = selected === 0 ? 'inicio'
      : selected === 1 ? 'servicios'
      : selected <= 4 ? 'proyectos' : 'laboratorio';
    const bounds = surface.getBoundingClientRect();
    if (bounds.top <= window.innerHeight && bounds.bottom >= headerHeight) {
      navLinks.forEach(link =>
        link.classList.toggle('active', link.hash === '#' + activeId));
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(render);
  }

  function clearStory() {
    active = false;
    current = -1;
    root.classList.remove('story-active');
    root.style.removeProperty('--story-header-height');
    surface.style.removeProperty('--story-total-height');
    scenes.forEach(scene => {
      scene.inert = false;
      scene.classList.remove('story-interactive', 'story-near');
      for (const key of ['--scene-opacity', '--scene-y', '--scene-scale']) {
        scene.style.removeProperty(key);
      }
    });
    rail.forEach(dot => dot.classList.remove('is-current'));
  }

  function measureContentFit() {
    const bounds = stage.getBoundingClientRect();
    if (bounds.height < 535) return false;

    const fits = (selector, margin = 16) => {
      const element = stage.querySelector(selector);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.height > 0 &&
        rect.top >= bounds.top - margin &&
        rect.bottom <= bounds.bottom + margin;
    };

    const servicesFit = fits('#servicios .services-heading', 20) &&
      fits('#servicios .service-cards', 20);
    const cardsFit = projectCards.every(card => {
      const cardBounds = card.getBoundingClientRect();
      if (card.scrollHeight > card.clientHeight + 6) return false;
      return ['.project-art', '.card-body'].every(selector => {
        const item = card.querySelector(selector);
        if (!item) return false;
        const r = item.getBoundingClientRect();
        return r.height > 0 &&
          r.top >= cardBounds.top - 16 &&
          r.bottom <= cardBounds.bottom + 16;
      });
    });
    const laboratoryFits = fits('#laboratorio .lab-preview-heading', 20) &&
      fits('#laboratorio .lab-preview-content', 20);
    const heroFits = fits('#inicio .hero-copy', 26);
    return servicesFit && cardsFit && laboratoryFits && heroFits;
  }

  function applyMode() {
    if (!storyQuery.matches || !('inert' in HTMLElement.prototype) ||
        !window.CSS || !CSS.supports('position', 'sticky') ||
        !CSS.supports('height', '100svh')) {
      clearStory();
      schedule();
      return;
    }

    // During resize, preserve the existing sticky layout. Removing it even
    // briefly can clamp scrollY and throw the visitor into another section.
    if (!active) clearStory();
    headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 82;
    const stageHeight = Math.round(window.innerHeight - headerHeight);
    // Shorter scroll distance than V4: deliberate, but not rushed.
    sceneStep = Math.max(380, Math.round(stageHeight * .82));
    root.style.setProperty('--story-header-height', headerHeight + 'px');
    surface.style.setProperty('--story-total-height',
      (stageHeight + 5 * sceneStep) + 'px');
    root.classList.add('story-active');

    // Measure in the final, neutral layout, not while invisible panels
    // are translated and enlarged. Otherwise V4 produced false negatives.
    scenes.forEach(scene => {
      scene.style.setProperty('--scene-y', '0px');
      scene.style.setProperty('--scene-scale', '1');
    });
    const fits = measureContentFit();
    scenes.forEach(scene => {
      scene.style.removeProperty('--scene-y');
      scene.style.removeProperty('--scene-scale');
    });
    if (!fits) {
      clearStory();
      schedule();
      return;
    }

    active = true;
    render();
  }

  function goToScene(index, behavior = 'smooth') {
    if (!active) return;
    window.scrollTo({
      top: Math.round(storyStart() + index * sceneStep),
      behavior
    });
  }

  document.addEventListener('click', event => {
    if (!active || event.defaultPrevented ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.target === '_blank') return;
    const id = link.getAttribute('href').slice(1);
    if (!sceneAnchors.has(id)) return;
    event.preventDefault();
    if (window.location.hash !== '#' + id) {
      window.history.pushState(null, '', '#' + id);
    }
    goToScene(sceneAnchors.get(id));
  });

  window.addEventListener('popstate', () => {
    if (!active) return;
    const id = window.location.hash.slice(1);
    if (sceneAnchors.has(id)) goToScene(sceneAnchors.get(id), 'instant');
  });

  // Hover glow uses a separate tiny RAF per card only when the pointer moves.
  if (finePointer.matches) {
    projectCards.forEach(card => {
      const art = card.querySelector('.project-art');
      if (!art) return;
      let pointerFrame = false;
      let x = 50, y = 50;
      card.addEventListener('pointermove', event => {
        if (motionQuery.matches) return;
        const bounds = art.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        x = clamp((event.clientX - bounds.left) / bounds.width) * 100;
        y = clamp((event.clientY - bounds.top) / bounds.height) * 100;
        if (pointerFrame) return;
        pointerFrame = true;
        window.requestAnimationFrame(() => {
          art.style.setProperty('--pointer-x', x.toFixed(1) + '%');
          art.style.setProperty('--pointer-y', y.toFixed(1) + '%');
          pointerFrame = false;
        });
      }, { passive: true });
    });
  }

  // A single reveal observer replaces editorial-v2.js's second scroll loop.
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.section-heading, .services-heading, .service-cards > button, ' +
      '.project-card, .lab-preview-heading, .lab-preview-content, ' +
      '.profile-column, .process-column, .consulting-panel, ' +
      '.contact-intro, .contact-links, .closing-art'
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(target => {
      target.classList.add('reveal');
      observer.observe(target);
    });
    if (!motionQuery.matches) root.classList.add('motion-ready');
    const updatePreference = () =>
      root.classList.toggle('motion-ready', !motionQuery.matches);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', updatePreference);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(updatePreference);
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      applyMode();
    });
  }, { passive: true });
  if (storyQuery.addEventListener) storyQuery.addEventListener('change', applyMode);
  else if (storyQuery.addListener) storyQuery.addListener(applyMode);

  applyMode();
  if (active && window.location.hash) {
    const id = window.location.hash.slice(1);
    if (sceneAnchors.has(id)) {
      window.requestAnimationFrame(() => goToScene(sceneAnchors.get(id), 'instant'));
    }
  }
  // Retry only when first-pass layout was rejected, for late-loading fonts.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!active && storyQuery.matches) applyMode();
    }).catch(() => {});
  }
})();
