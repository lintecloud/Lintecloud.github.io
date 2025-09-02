/* ======= Helper utilities ======= */
// small safe debounce
const debounce = (fn, delay = 10) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

/* ======= Particles initialization (performance-aware) ======= */
/*
 - Only initialize particles on devices >= 600px wide (desktop/tablet)
 - Reduce particle count on narrower widths if still used
*/
function initParticlesIfAllowed(){
  // if library missing, skip (graceful)
  if (typeof particlesJS !== 'function') return;

  const w = window.innerWidth || document.documentElement.clientWidth;
  // disable on tiny phones
  if (w < 600) {
    // ensure canvas area hidden for tiny devices
    const p = document.getElementById('particles-js');
    if (p) p.style.display = 'none';
    return;
  }

  const count = w < 992 ? 35 : 80; // fewer particles on medium screens, full on large
  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: count, density: { enable: true, value_area: 900 } },
        color: { value: ["#f4c430", "#ffffff", "#1f7a6b"] },
        shape: { type: "circle", stroke: { width: 0 } },
        opacity: { value: 0.28, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, color: "#f4c430", opacity: 0.12, width: 1 },
        move: { enable: true, speed: 1.2, direction: "none", out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false, mode: "push" }, resize: true },
        modes: { grab: { distance: 120, line_linked: { opacity: 0.25 } }, push: { particles_nb: 3 } }
      },
      retina_detect: true
    });
  } catch (err) {
    // fail silently if particles lib has issues
    // console.warn('particles init failed', err);
  }
}

// run on load (deferred script) and also on resize (debounced)
document.addEventListener('DOMContentLoaded', initParticlesIfAllowed);
window.addEventListener('resize', debounce(() => {
  // re-init might be expensive; simplest approach here is a reload if user crosses threshold
  // but we won't reload automatically — keep it simple and try re-init
  initParticlesIfAllowed();
}, 300), { passive: true });


/* ======= Header scroll & back-to-top ======= */
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

const onScroll = debounce(() => {
  const y = window.scrollY || window.pageYOffset;
  if (y > 100) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  if (y > 300) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
}, 15);
window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ======= Mobile menu toggle (accessible) ======= */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  nav.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', (!expanded).toString());
});

// close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// close on nav link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});


/* ======= Smooth anchor scroll (robust) ======= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    // compute target offset taking header height into account
    const headerHeight = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
  });
});


/* ======= Service card expand/collapse (unchanged behaviour) ======= */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
  });
});

/* ======= Fade-in & service card reveal (IntersectionObserver, efficient) ======= */
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

const cardEls = document.querySelectorAll('.service-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

cardEls.forEach(el => cardObserver.observe(el));


/* ======= Preload hero image only on larger screens ======= */
if (window.innerWidth > 768) {
  const preload = new Image();
  preload.src = 'lintecloud03.png';
}

/* ======= Respect prefers-reduced-motion: stop or reduce moving visuals if user asked ======= */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // we can reduce animations by hiding rotating floats and not initializing particles
  const floats = document.querySelectorAll('.floating-element');
  floats.forEach(f => { f.style.animation = 'none'; f.style.opacity = '0.06'; });
  const pArea = document.getElementById('particles-js');
  if (pArea) pArea.style.display = 'none';
}
