/* JMael Creative Portfolio 2026: native-scroll progressive enhancement. */
(() => {
  'use strict';
  const dialog = document.getElementById('options-dialog');
  const open = document.querySelector('[data-options]');
  const close = document.querySelector('[data-close-options]');
  const motion = document.getElementById('reduce-motion');

  if (dialog && open && close && motion) {
    const reducedBySystem = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let saved;
    try { saved = localStorage.getItem('jmael-reduce-motion'); } catch (_) { saved = null; }
    const initial = saved === null ? reducedBySystem : saved === 'true';
    motion.checked = initial;
    document.documentElement.classList.toggle('no-motion', initial);
    open.addEventListener('click', () => dialog.showModal());
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    motion.addEventListener('change', () => {
      const enabled = motion.checked;
      document.documentElement.classList.toggle('no-motion', enabled);
      try { localStorage.setItem('jmael-reduce-motion', String(enabled)); } catch (_) { /* private mode */ }
    });
  }

  const sections = Array.from(document.querySelectorAll('section.panel[id]'));
  const navLinks = Array.from(document.querySelectorAll('.screen-nav a'));
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      navLinks.forEach(link => {
        const current = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.25, 0.5, 0.75] });
    sections.forEach(section => observer.observe(section));
  }
})();