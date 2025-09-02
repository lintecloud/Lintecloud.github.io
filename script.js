// Particles background
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ["#f4c430", "#ffffff", "#1f7a6b"] },
    shape: { type: "circle", stroke: { width: 0 } },
    opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
    size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.3 } },
    line_linked: { enable: true, distance: 150, color: "#f4c430", opacity: 0.15, width: 1 },
    move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } }, push: { particles_nb: 4 } }
  },
  retina_detect: true
});

// Header scroll & back to top toggle
const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");
const debounce = (fn, delay) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn.apply(this,args), delay); }; };
const onScroll = debounce(() => {
  window.scrollY > 100 ? header.classList.add("scrolled") : header.classList.remove("scrolled");
  window.scrollY > 300 ? backToTop.classList.add("visible") : backToTop.classList.remove("visible");
}, 10);
window.addEventListener("scroll", onScroll);

// Back to top button
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  const icon = menuToggle.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
  const expanded = menuToggle.getAttribute("aria-expanded")==="true";
  menuToggle.setAttribute("aria-expanded",!expanded);
});
document.addEventListener("click",(e)=>{
  if(!nav.contains(e.target) && !menuToggle.contains(e.target)){
    nav.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
    menuToggle.setAttribute("aria-expanded","false");
  }
});
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click",()=>{
    nav.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
    menuToggle.setAttribute("aria-expanded","false");
  });
});

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click",e=>{
    e.preventDefault();
    const target=document.querySelector(anchor.getAttribute("href"));
    if(target) window.scrollTo({top:target.offsetTop-header.offsetHeight,behavior:"smooth"});
  });
});

// Service card expand/collapse
document.querySelectorAll(".service-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const isActive=card.classList.contains("active");
    document.querySelectorAll(".service-card").forEach(c=>c.classList.remove("active"));
    if(!isActive) card.classList.add("active");
  });
});

// Fade-in Intersection Observer
const fadeElements=document.querySelectorAll(".fade-in");
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("visible");});
},{threshold:0.1,rootMargin:"0px 0px -50px 0px"});
fadeElements.forEach(el=>observer.observe(el));

// Service card stagger animation
const serviceObserver=new IntersectionObserver((entries)=>{
  entries.forEach((entry,idx)=>{
    if(entry.isIntersecting){
      setTimeout(()=>{
        entry.target.style.opacity="1";
        entry.target.style.transform="translateY(0)";
      },idx*100);
    }
  });
},{threshold:0.1});
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".service-card").forEach(card=>{
    card.style.opacity=0;
    card.style.transform="translateY(30px)";
    card.style.transition="all 0.6s ease";
    serviceObserver.observe(card);
  });
});

// Preload images
function preloadImages(){["lintecloud03.png"].forEach(src=>{const img=new Image();img.src=src;});}
document.addEventListener("DOMContentLoaded",preloadImages);
