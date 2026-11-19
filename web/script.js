(() => {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('menu-open');
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  const story = document.querySelector('.scroll-story');
  const storyMq = window.matchMedia('(min-width: 1000px) and (min-height: 780px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let storyFrame = 0;

  const writeStory = () => {
    storyFrame = 0;
    if (!story) return;
    if (!storyMq.matches || motionMq.matches) {
      story.style.removeProperty('--story-p');
      return;
    }
    const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
    story.style.setProperty('--story-p', progress.toFixed(3));
  };

  const queueStory = () => {
    if (storyFrame) return;
    storyFrame = requestAnimationFrame(writeStory);
  };

  if (story) {
    queueStory();
    window.addEventListener('scroll', queueStory, { passive: true });
    window.addEventListener('resize', queueStory);
    [storyMq, motionMq].forEach((mq) => {
      if (mq.addEventListener) mq.addEventListener('change', queueStory);
      else mq.addListener(queueStory);
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const sectionIds = ['sobre', 'servicos', 'galeria', 'avaliacoes', 'localizacao'];
    const linkMap = new Map();
    sectionIds.forEach((id) => {
      const link = document.querySelector(`.nav a[href="#${id}"]`);
      if (link) linkMap.set(id, link);
    });

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }
})();
