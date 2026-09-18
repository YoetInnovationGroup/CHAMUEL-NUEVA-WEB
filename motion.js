(() => {
  // Clean URL hash to prevent abrupt jumping
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });

  const reduced = false;
  const control = document.getElementById('motion-toggle');
  document.documentElement.classList.toggle('motion-paused', reduced);
  if (control) {
    control.textContent = reduced ? 'Activar animaciones' : 'Pausar animaciones';
    control.setAttribute('aria-pressed', String(reduced));
    control.addEventListener('click', () => {
      localStorage.setItem('chamuel-motion', reduced ? 'active' : 'paused');
      location.reload();
    });
  }

  // ==========================================================
  // SILKY SMOOTH INERTIA SCROLL ON PC (LENIS)
  // ==========================================================
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice && typeof Lenis !== 'undefined') {
    try {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Never hijack touch on touchscreens
        wheelMultiplier: 0.95,
        infinite: false
      });
      window.chamuelLenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis fallback to native smooth scroll:', err);
    }
  }

  // ==========================================================
  // UNIFIED SMOOTH SCROLL HELPER
  // ==========================================================
  function scrollToTarget(selector) {
    if (!selector) return;
    const target = document.querySelector(selector);
    if (!target) return;

    const header = document.querySelector('.header-wrapper');
    const headerHeight = header ? header.offsetHeight : 80;
    const offset = -(headerHeight + 12);

    if (window.chamuelLenis) {
      window.chamuelLenis.scrollTo(target, { offset: offset, duration: 1.15 });
    } else {
      const top = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
  window.scrollToSection = scrollToTarget;

  // ==========================================================
  // TOP PROGRESS BAR, DYNAMIC HEADER & SCROLL SPY
  // ==========================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const headerEl = document.querySelector('.header-wrapper');
  const backTopBtn = document.getElementById('back-to-top');

  const spySections = [
    { id: '#inicio', btn: '[data-scroll-to="#inicio"]' },
    { id: '#servicios', btn: '[data-scroll-to="#servicios"]' },
    { id: '#nosotros', btn: '[data-scroll-to="#nosotros"]' },
    { id: '#profesional', btn: '[data-scroll-to="#profesional"]' },
    { id: '#opiniones', btn: '[data-scroll-to="#opiniones"]' },
    { id: '#preguntas', btn: '[data-scroll-to="#preguntas"]' },
    { id: '#contacto', btn: '[data-scroll-to="#contacto"]' }
  ];

  function updateActiveSpy(scrollPos) {
    const probe = scrollPos + 130;
    let currentId = '#inicio';
    for (const item of spySections) {
      const sec = document.querySelector(item.id);
      if (sec && sec.offsetTop <= probe) {
        currentId = item.id;
      }
    }
    document.querySelectorAll('.header-nav-btn, .drawer-nav-item').forEach(btn => {
      if (btn.getAttribute('data-scroll-to') === currentId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Progress bar
    if (progressBar && maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      progressBar.style.width = pct + '%';
    }

    // Header glass & shrink
    if (headerEl) {
      if (scrollTop > 25) {
        headerEl.classList.add('header-scrolled');
      } else {
        headerEl.classList.remove('header-scrolled');
      }
    }

    // Back to top
    if (backTopBtn) {
      backTopBtn.style.display = scrollTop > 380 ? 'grid' : 'none';
    }

    // Active link highlight
    updateActiveSpy(scrollTop);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      scrollToTarget('#inicio');
    });
  }

  // ==========================================================
  // HAMBURGER 3-LINES MENU DRAWER
  // ==========================================================
  const drawer = document.getElementById('chamuel-drawer');
  const triggerBtn = document.getElementById('chamuel-menu-trigger');
  const closeBtn = document.getElementById('chamuel-drawer-close');
  const overlay = document.getElementById('chamuel-drawer-overlay');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('open-sidebox');
    triggerBtn?.classList.add('is-active');
    triggerBtn?.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflowY = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('open-sidebox');
    triggerBtn?.classList.remove('is-active');
    triggerBtn?.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflowY = 'auto';
  }

  triggerBtn?.addEventListener('click', () => {
    if (drawer?.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // ==========================================================
  // NAVIGATION & SMOOTH SCROLL CLICKS
  // ==========================================================
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const selector = btn.getAttribute('data-scroll-to');
      if (drawer?.classList.contains('is-open')) {
        closeDrawer();
        setTimeout(() => {
          scrollToTarget(selector);
        }, 180);
      } else {
        scrollToTarget(selector);
      }
    });
  });

  // ==========================================================
  // ANIMATED PROGRESS BARS & SCROLL REVEALS
  // ==========================================================
  const bars = document.querySelector('.dl-skill-items');
  if (bars) {
    const fill = () => {
      for (const bar of bars.querySelectorAll('.dl-skill-level')) {
        const value = Number(bar.dataset.level),
          label = bar.querySelector('.dl-skill-level-text');
        if (reduced) {
          bar.style.width = value + '%';
          label.textContent = value + '%';
          continue;
        }
        const start = performance.now();
        const frame = time => {
          const elapsed = time - start;
          const widthEase = 0.5 - Math.cos(Math.PI * Math.min(elapsed / 500, 1)) / 2;
          const countEase = 0.5 - Math.cos(Math.PI * Math.min(elapsed / 1300, 1)) / 2;
          bar.style.width = value * widthEase + '%';
          label.textContent = Math.round(value * countEase) + '%';
          if (elapsed < 1300) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }
    };
    const observer = new IntersectionObserver(
      records => {
        if (records.some(r => r.isIntersecting)) {
          fill();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(bars);
  }

  if (reduced) return;

  const entries = document.querySelectorAll('[data-reveal]');
  for (const el of entries) {
    const animation = el.dataset.reveal;
    const offset = Number(el.dataset.wowOffset) || 80;
    el.classList.add('reveal-wait');
    const observer = new IntersectionObserver(
      records => {
        if (!records.some(r => r.isIntersecting)) return;
        const names = {
          'dt-fadeInLeft': 'sgFadeInLeft',
          'dt-fadeInRight': 'sgFadeInRight',
          'dt-fadeInBottom': 'sgFadeInBottom',
          'dt-fadeInTop': 'sgFadeInTop',
          'dt-fadeIn': 'sgFadeIn'
        };
        el.style.setProperty(
          'animation',
          `${names[animation] || animation} ${el.dataset.duration || 1400}ms cubic-bezier(0.16, 1, 0.3, 1) ${el.dataset.delay || 0}ms 1 both`,
          'important'
        );
        el.classList.remove('reveal-wait');
        el.classList.add('animated', animation);
        observer.disconnect();
      },
      { rootMargin: `0px 0px -${Math.min(offset, innerHeight / 5)}px 0px`, threshold: 0.05 }
    );
    observer.observe(el);
  }
})();
