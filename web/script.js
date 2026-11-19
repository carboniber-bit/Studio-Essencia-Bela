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

  const progressBar = document.getElementById('scroll-progress');
  let progressFrame = 0;

  const writeProgress = () => {
    progressFrame = 0;
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressBar.style.setProperty('--scroll-p', value.toFixed(4));
  };

  const queueProgress = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(writeProgress);
  };

  if (progressBar) {
    queueProgress();
    window.addEventListener('scroll', queueProgress, { passive: true });
    window.addEventListener('resize', queueProgress);
  }

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
    if (event.key !== 'Escape') return;
    if (menu.classList.contains('is-open')) {
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

  const hero = document.querySelector('.hero');
  const heroTitle = hero ? hero.querySelector('h1') : null;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (hero && heroTitle && finePointer.matches && !motionMq.matches) {
    let titleX = 0;
    let titleY = 0;
    let targetX = 0;
    let targetY = 0;
    let titleFrame = 0;

    const writeTitle = () => {
      titleFrame = 0;
      titleX += (targetX - titleX) * 0.12;
      titleY += (targetY - titleY) * 0.12;
      heroTitle.style.setProperty('--title-pointer-x', `${titleX.toFixed(2)}px`);
      heroTitle.style.setProperty('--title-pointer-y', `${titleY.toFixed(2)}px`);
      if (Math.abs(targetX - titleX) > 0.2 || Math.abs(targetY - titleY) > 0.2) {
        titleFrame = requestAnimationFrame(writeTitle);
      }
    };

    const queueTitle = () => {
      if (!titleFrame) titleFrame = requestAnimationFrame(writeTitle);
    };

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = nx * -16;
      targetY = ny * -12;
      queueTitle();
    });

    hero.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      queueTitle();
    });
  }

  const openStatus = document.querySelector('[data-open-status]');

  if (openStatus) {
    const OPEN_DAYS = [2, 3, 4, 5, 6]; // terça a sábado
    const OPEN_MIN = 8 * 60;
    const CLOSE_MIN = 21 * 60;
    const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const label = openStatus.querySelector('[data-open-status-label]');
    const detail = openStatus.querySelector('[data-open-status-detail]');
    const clock = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    const nowInStudio = () => {
      const parts = {};
      clock.formatToParts(new Date()).forEach((part) => {
        parts[part.type] = part.value;
      });
      return {
        day: WEEKDAYS.indexOf(parts.weekday),
        minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10),
      };
    };

    const nextOpening = (day, minutes) => {
      if (OPEN_DAYS.includes(day) && minutes < OPEN_MIN) return 'abre hoje às 8h';
      for (let step = 1; step <= 7; step += 1) {
        const next = (day + step) % 7;
        if (OPEN_DAYS.includes(next)) {
          return step === 1 ? 'abre amanhã às 8h' : `abre ${DAY_NAMES[next]} às 8h`;
        }
      }
      return '';
    };

    const renderOpenStatus = () => {
      const { day, minutes } = nowInStudio();
      const isOpen = OPEN_DAYS.includes(day) && minutes >= OPEN_MIN && minutes < CLOSE_MIN;
      openStatus.classList.toggle('is-open', isOpen);
      openStatus.classList.toggle('is-closed', !isOpen);
      openStatus.hidden = false;
      if (label) label.textContent = isOpen ? 'Aberto agora' : 'Fechado agora';
      if (detail) detail.textContent = isOpen ? 'fecha às 21h' : nextOpening(day, minutes);
    };

    renderOpenStatus();
    setInterval(renderOpenStatus, 30000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) renderOpenStatus();
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
    const sectionIds = ['servicos', 'galeria', 'sobre', 'avaliacoes', 'localizacao'];
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

  const map = document.querySelector('[data-map]');
  const mapBtn = document.querySelector('[data-map-activate]');
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');

  if (map && mapBtn) {
    const mapLabel = mapBtn.querySelector('[data-map-label]');

    const setMapLocked = (locked) => {
      map.classList.toggle('is-map-locked', locked);
      mapBtn.setAttribute('aria-pressed', String(!locked));
      if (mapLabel) mapLabel.textContent = locked ? 'Explorar o mapa' : 'Recolher mapa';
    };

    setMapLocked(coarsePointer.matches);

    mapBtn.addEventListener('click', () => {
      setMapLocked(!map.classList.contains('is-map-locked'));
    });

    const onCoarseChange = (event) => setMapLocked(event.matches);
    if (coarsePointer.addEventListener) coarsePointer.addEventListener('change', onCoarseChange);
    else coarsePointer.addListener(onCoarseChange);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!map.classList.contains('is-map-locked') && coarsePointer.matches) {
        setMapLocked(true);
        mapBtn.focus();
      }
    });
  }

  const ribbon = document.querySelector('[data-gallery-ribbon]');

  if (ribbon) {
    const SLICES = 16;
    const CAMERA = 1.6;
    const MAX_WIDTH = 55;
    const SPEED = 6;
    const TILE_HEIGHT = 62;
    const ASPECT = 0.8;
    const GAP = 7;
    const AXIS = 50;
    const BEND = (70 * Math.PI) / 180;
    const IMAGES = ['09', '04', '02', '05', '08', '07', '01', '03', '06'].map(
      (n) => `assets/img/gallery-${n}.jpg`
    );

    const arc = (bend) => (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));

    const measure = (width, height) => {
      const h = Math.min((TILE_HEIGHT / 100) * height, ((MAX_WIDTH / 100) * width) / ASPECT);
      const radius = width * arc(BEND);
      if (!(h > 0) || !(radius > 0)) return { columns: 4, sweep: 0, unit: 0, limit: 0 };
      const deg = (rad) => (rad * 180) / Math.PI;
      const unit = deg(h / radius);
      const pitch = (ASPECT + GAP / 100) * unit;
      const limit = deg(BEND) + (ASPECT * unit) / 2;
      const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
      return { columns, sweep: (columns * pitch) / 2, unit, limit };
    };

    const u = (n) =>
      `calc(${+n.toFixed(4)} * min(${TILE_HEIGHT}cqh, ${+(MAX_WIDTH / ASPECT).toFixed(4)}cqw))`;

    const turn = (deg, radius) =>
      `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

    const frameStyle = document.createElement('style');
    document.head.appendChild(frameStyle);

    let band = null;
    let key = '';
    let shownReady = false;

    const build = () => {
      const layout = measure(ribbon.clientWidth, ribbon.clientHeight);
      const nextKey = `${layout.columns}|${layout.sweep.toFixed(2)}|${layout.unit.toFixed(2)}`;
      if (nextKey === key) return;
      key = nextKey;

      const { columns, sweep, unit, limit } = layout;
      const r = 100 * arc(BEND);
      const radius = `${+r.toFixed(3)}cqw`;
      const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
      const duration = columns * SPEED;

      frameStyle.textContent =
        `@keyframes ribbon-orbit{` +
        `from{transform:${turn(-sweep, radius)}}to{transform:${turn(sweep, radius)}}` +
        `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
        `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}`;

      const nextBand = document.createElement('div');
      nextBand.className = 'gallery-ribbon-band';
      nextBand.style.perspective = `${+(r * CAMERA).toFixed(3)}cqw`;
      nextBand.style.perspectiveOrigin = `50% ${AXIS}%`;

      const share = ASPECT / SLICES;
      const used = new Array(columns).fill(0);
      let lastPicked = 0;

      for (let t = 0; t < columns; t++) {
        const first = columns - 1 - t;
        const tile = document.createElement('div');
        tile.className = 'ribbon-tile';
        tile.style.left = `calc(50% - ${u(ASPECT / 2)})`;
        tile.style.top = `calc(${AXIS}% - ${u(0.5)})`;
        tile.style.width = u(ASPECT);
        tile.style.height = u(1);
        tile.style.animation = `ribbon-orbit ${duration}s linear ${-t * SPEED}s infinite`;

        const pics = [];
        const start = first % IMAGES.length;
        used[t] = start;

        for (let k = 0; k < SLICES; k++) {
          const slice = document.createElement('div');
          slice.className = 'ribbon-slice';
          slice.style.left = u((ASPECT - share) / 2);
          slice.style.width = k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`;
          slice.style.height = u(1);
          slice.style.transform = turn((ASPECT / 2 - (k + 0.5) * share) * unit, radius);

          const img = document.createElement('img');
          img.src = IMAGES[start];
          img.alt = '';
          img.draggable = false;
          img.decoding = 'async';
          img.style.left = u(-k * share);
          img.style.width = u(ASPECT);
          img.style.height = u(1);

          slice.appendChild(img);
          tile.appendChild(slice);
          pics.push(img);
        }

        tile.addEventListener('animationiteration', () => {
          let next = lastPicked;
          for (let i = 0; i < IMAGES.length; i++) {
            next = (next + 1) % IMAGES.length;
            if (!used.includes(next)) break;
          }
          lastPicked = next;
          used[t] = next;
          pics.forEach((img) => {
            img.src = IMAGES[next];
          });
        });

        nextBand.appendChild(tile);
      }

      if (band) band.remove();
      band = nextBand;
      ribbon.appendChild(band);
      ribbon.style.setProperty('--ribbon-duration', `${duration}s`);

      if (!shownReady) {
        shownReady = true;
        requestAnimationFrame(() => requestAnimationFrame(() => ribbon.classList.add('is-ready')));
      }
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      IMAGES.forEach((src) => {
        const preload = new Image();
        preload.src = src;
      });
      build();
      if ('ResizeObserver' in window) new ResizeObserver(build).observe(ribbon);
    };

    if ('IntersectionObserver' in window) {
      const trigger = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          trigger.disconnect();
          start();
        },
        { rootMargin: '700px 0px' }
      );
      trigger.observe(ribbon);
    } else {
      start();
    }
  }

  const ribbonToggle = document.querySelector('[data-gallery-toggle]');

  if (ribbon && ribbonToggle) {
    const toggleLabel = ribbonToggle.querySelector('.gallery-toggle-label');

    ribbonToggle.addEventListener('click', () => {
      const paused = ribbonToggle.getAttribute('aria-pressed') !== 'true';
      ribbon.classList.toggle('is-paused', paused);
      ribbonToggle.setAttribute('aria-pressed', String(paused));
      if (toggleLabel) toggleLabel.textContent = paused ? 'Retomar animação' : 'Pausar animação';
    });
  }
})();
