const revealTargets = document.querySelectorAll(
  '.section > .container, .project-card, .resume-highlights > div, .resume-viewer-card, .trend-card, .perspective-box'
);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-target');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const sectionMap = navLinks
  .map((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    return section ? { link, section } : null;
  })
  .filter(Boolean);

if ('IntersectionObserver' in window && sectionMap.length) {
  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        const current = sectionMap.find(({ section }) => section === visibleEntries[0].target);
        if (current) setActiveLink(current.link);
      }
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] }
  );

  sectionMap.forEach(({ section }) => navObserver.observe(section));
}
