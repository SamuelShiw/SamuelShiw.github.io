/* JMael 2.1: progressive, pointer-safe, reduced-motion-aware motion. */
(() => {
  'use strict';

  const root = document.documentElement;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = window.matchMedia('(min-width: 901px)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.querySelector('.hero-stage');
  const heroWord = document.querySelector('.hero-word');
  const portrait = document.querySelector('.hero-portrait');
  const lab = document.querySelector('.lab-preview');
  const projectCards = [...document.querySelectorAll('.project-card')];
  let frameScheduled = false;

  function renderScroll() {
    frameScheduled = false;
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const scroll = Math.max(0, window.scrollY);
    root.style.setProperty('--reading-progress', String(maxScroll ? Math.min(1, scroll / maxScroll) : 0));

    if (motionPreference.matches) return;
    if (desktopQuery.matches && hero && hero.getBoundingClientRect().bottom > 0) {
      const offset = Math.min(scroll, 750);
      if (heroWord) heroWord.style.setProperty('--hero-word-shift', (offset * .19).toFixed(1) + 'px');
      if (portrait) portrait.style.setProperty('--hero-portrait-shift', (-offset * .10).toFixed(1) + 'px');
    }
    if (lab) {
      const rect = lab.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        lab.style.setProperty('--lab-shift', ((window.innerHeight - rect.top) * .065).toFixed(1) + 'px');
      }
    }
  }

  function scheduleScroll() {
    if (frameScheduled) return;
    frameScheduled = true;
    window.requestAnimationFrame(renderScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });

  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.section-heading, .services-heading, .service-cards > button, .project-card, ' +
      '.lab-preview-heading, .lab-preview-content, .profile-column, .process-column, ' +
      '.consulting-panel, .contact-intro, .contact-links, .closing-art'
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(target => {
      target.classList.add('reveal');
      observer.observe(target);
    });
    root.classList.add('motion-ready');
  }

  if (finePointerQuery.matches) {
    projectCards.forEach(card => {
      const art = card.querySelector('.project-art');
      if (!art) return;
      let pointerFrame = false;
      let x = 50, y = 50;
      card.addEventListener('pointermove', event => {
        if (motionPreference.matches) return;
        const rect = art.getBoundingClientRect();
        x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
        y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100));
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
  scheduleScroll();
})();
