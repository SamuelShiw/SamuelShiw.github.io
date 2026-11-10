/* JMael Creative Portfolio | restrained motion, native scroll and accessible fallback. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const dialog = document.getElementById('options-dialog');
  const open = document.querySelector('[data-options]');
  const close = document.querySelector('[data-close-options]');
  const motion = document.getElementById('reduce-motion');
  const intro = document.querySelector('.intro');
  const sections = Array.from(document.querySelectorAll('section.panel[id]'));
  const navLinks = Array.from(document.querySelectorAll('.screen-nav a'));

  function resetParallax() {
    if (!intro) return;
    ['--jm-title-x', '--jm-title-y', '--jm-photo-x', '--jm-photo-y', '--jm-photo-scale']
      .forEach(property => intro.style.removeProperty(property));
  }

  if (dialog && open && close && motion) {
    let saved = null;
    try { saved = localStorage.getItem('jmael-reduce-motion'); } catch (_) { /* storage disabled */ }
    const reduced = saved === null ? reducedMotionQuery.matches : saved === 'true';
    motion.checked = reduced;
    root.classList.toggle('no-motion', reduced);

    open.addEventListener('click', () => dialog.showModal());
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    motion.addEventListener('change', () => {
      const enabled = motion.checked;
      root.classList.toggle('no-motion', enabled);
      resetParallax();
      try { localStorage.setItem('jmael-reduce-motion', String(enabled)); }
      catch (_) { /* private browsing */ }
    });
  }

  // Progressive enhancement: content remains visible without JavaScript or IntersectionObserver.
  if ('IntersectionObserver' in window && sections.length) {
    root.classList.add('js-enhanced');
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px 32px 0px', threshold: 0.08 });
    sections.forEach(section => reveal.observe(section));

    const visibleSections = new Map();
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
        else visibleSections.delete(entry.target.id);
      });
      let selected = null;
      let topRatio = -1;
      for (const [id, ratio] of visibleSections) {
        if (ratio > topRatio) { selected = id; topRatio = ratio; }
      }
      if (selected === null) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + selected;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold:[0.1,0.25,0.5,0.75] });
    sections.forEach(section => navObserver.observe(section));
  } else {
    sections.forEach(section => section.classList.add('is-visible'));
  }

  // Subtle desktop-only parallax, no wheel hijack or forced scroll positions.
  // Use CSS custom properties so the picture's centering transform is never overwritten.
  if (!intro || !finePointerQuery.matches) return;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  intro.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || root.classList.contains('no-motion') ||
        reducedMotionQuery.matches) {
      resetParallax();
      return;
    }
    const bounds = intro.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointerX = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
    pointerY = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      intro.style.setProperty('--jm-title-x', (pointerX * 10).toFixed(2) + 'px');
      intro.style.setProperty('--jm-title-y', (pointerY * 7).toFixed(2) + 'px');
      intro.style.setProperty('--jm-photo-x', (-pointerX * 7).toFixed(2) + 'px');
      intro.style.setProperty('--jm-photo-y', (-pointerY * 6).toFixed(2) + 'px');
      intro.style.setProperty('--jm-photo-scale', '1.016');
    });
  }, { passive: true });
  intro.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    resetParallax();
  });
  reducedMotionQuery.addEventListener?.('change', resetParallax);
})();