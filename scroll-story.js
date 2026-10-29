/* JMael V3 pinned storytelling. No wheel hijacking and no external libraries. */
(() => {
  'use strict';

  const root = document.documentElement;
  const sceneQuery = window.matchMedia(
    '(min-width: 1100px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)'
  );
  const projects = Array.from(document.querySelectorAll('#proyectos .project-card'));
  const header = document.querySelector('.header');
  let scheduled = false;
  let active = false;

  const clamp = n => Math.min(1, Math.max(0, n));

  const update = () => {
    scheduled = false;
    if (!active || projects.length < 2) return;

    const top = header ? header.getBoundingClientRect().height : 82;
    const available = Math.max(1, window.innerHeight - top);
    projects.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      // Each incoming panel makes its own progress bar advance, from the
      // viewport bottom to the pinned header.
      const entry = clamp((window.innerHeight - rect.top) / available);
      card.style.setProperty('--story-progress', entry.toFixed(3));

      const next = projects[index + 1];
      const retreat = next
        ? clamp((window.innerHeight - next.getBoundingClientRect().top) / available)
        : 0;
      card.style.setProperty('--story-image-scale', (1 - retreat * .035).toFixed(3));
      card.style.setProperty('--story-image-light', (1 - retreat * .16).toFixed(3));
    });
  };

  const schedule = () => {
    if (scheduled || !active) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };

  const reset = () => {
    projects.forEach(card => {
      card.style.removeProperty('--story-progress');
      card.style.removeProperty('--story-image-scale');
      card.style.removeProperty('--story-image-light');
    });
  };

  const applyMode = () => {
    const shouldPin = sceneQuery.matches
      && projects.length === 3
      && typeof window.CSS !== 'undefined'
      && CSS.supports('position', 'sticky')
      && CSS.supports('height', '100svh');

    if (!shouldPin) {
      active = false;
      root.classList.remove('story-pinned');
      reset();
      return;
    }

    root.classList.add('story-pinned');
    // Content-fit guard: if text or media would be cropped (including at
    // browser zoom), keep the ordinary scroll flow instead.
    const overflows = projects.some(card => card.scrollHeight > card.clientHeight + 5);
    if (overflows) {
      root.classList.remove('story-pinned');
      active = false;
      reset();
      return;
    }

    active = true;
    schedule();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', applyMode, { passive: true });
  if (sceneQuery.addEventListener) sceneQuery.addEventListener('change', applyMode);
  else if (sceneQuery.addListener) sceneQuery.addListener(applyMode);

  applyMode();
})();
