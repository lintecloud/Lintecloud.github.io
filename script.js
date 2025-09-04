/* ==========================================================
   Helper
   ========================================================== */
const debounce = (fn, delay = 10) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================
     Particles (desktop only)
     ======================================================== */
  function initParticlesIfAllowed() {
    if (typeof particlesJS !== 'function') return;

    const w = window.innerWidth || document.documentElement.clientWidth;
    const container = document.getElementById('particles-js');
    if (!container) return;

    // Disable on small screens
    if (w < 600) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = ''; // clear old canvas

    const count = w < 992 ? 35 : 80;

    try {
      particlesJS('particles-js', {
        particles: {
          number: { value: count, density: { enable: true, value_area: 900 } },
          color: { value: ['#f4c430', '#ffffff', '#1f7a6b'] },
          shape: { type: 'circle' },
          opacity: { value: 0.28, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 140,
            color: '#f4c430',
            opacity: 0.12,
            width: 1
          },
          move: { enable: true, speed: 1.2, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'grab' }, resize: true },
          modes: { grab: { distance: 120, line_linked: { opacity: 0.25 } } }
        },
        retina_detect: true
      });
    } catch (e) {
      console.warn('particles init failed', e);
    }
  }

  initParticlesIfAllowed();
  window.addEventListener(
    'resize',
    debounce(initParticlesIfAllowed, 400),
    { passive: true }
  );

  /* ========================================================
     Header scroll & back-to-top
     ======================================================== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  const onScroll = debounce(() => {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 100);
    backToTop.classList.toggle('visible', y > 300);
  }, 15);

  window.addEventListener('scroll', onScroll, { passive: true });

  backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // Keyboard shortcut: Alt + ArrowUp
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'ArrowUp') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  /* ========================================================
     Mobile menu
     ======================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  function closeMenu() {
    nav.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.toggle('active');

    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');

    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', (!expanded).toString());
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ========================================================
     Smooth anchor scroll
     ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header ? header.offsetHeight : 0);

      window.scrollTo({
        top: Math.max(0, Math.floor(y)),
        behavior: 'smooth'
      });
    });
  });

  /* ========================================================
     Services: expand on click (one at a time)
     ======================================================== */
  const cards = document.querySelectorAll('[data-service]');

  function toggleCard(card) {
    // close others
    cards.forEach(c => {
      if (c !== card) c.classList.remove('expanded');
    });

    // toggle clicked
    card.classList.toggle('expanded');

    // rotate chevron
    cards.forEach(c => {
      const i = c.querySelector('.service-toggle i');
      if (!i) return;
      i.style.transform = c.classList.contains('expanded')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
      i.style.transition = 'transform .25s ease';
    });
  }

  cards.forEach(card => {
    // click anywhere on card except links
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      toggleCard(card);
    });

    // dedicated toggle button
    const t = card.querySelector('.service-toggle');
    if (t) {
      t.addEventListener('click', e => {
        e.stopPropagation();
        toggleCard(card);
      });
    }
  });

  /* ========================================================
     Reveal on scroll
     ======================================================== */
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(el => cardObserver.observe(el));

  /* ========================================================
     Reduced motion support
     ======================================================== */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.floating-element').forEach(f => {
      f.style.animation = 'none';
      f.style.opacity = '.06';
    });

    const p = document.getElementById('particles-js');
    if (p) p.style.display = 'none';
  }
});