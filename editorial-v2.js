/* Progressive enhancement only: the existing navigation, project dialogs and contact stay in app.js. */
(() => {
  const root = document.documentElement;
  let frameScheduled = false;

  const updateProgress = () => {
    frameScheduled = false;
    const maxScroll = root.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    root.style.setProperty('--reading-progress', String(progress));
  };

  const scheduleProgress = () => {
    if (frameScheduled) return;
    frameScheduled = true;
    window.requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  scheduleProgress();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

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
  }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

  targets.forEach(target => {
    target.classList.add('reveal');
    observer.observe(target);
  });
  root.classList.add('motion-ready');
})();
