// Deepak Portfolio  — script.js

// Sticky navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const elevated = window.scrollY > 8;
  navbar.style.boxShadow = elevated ? '0 6px 24px rgba(0,0,0,0.35)' : 'none';
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = open ? 'none' : 'flex';
    hamburger.setAttribute('aria-expanded', String(!open));
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (!open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
      hamburger.setAttribute('aria-expanded', 'false');
      
      // Reset hamburger icon
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

// Rotating role text (your custom roles)
const roles = ['Data Analyst', 'Power BI Developer', 'Machine Learning', 'Researcher'];
const rotator = document.getElementById('rotator');
let idx = 0;

setInterval(() => {
  idx = (idx + 1) % roles.length;
  if (rotator){
    rotator.style.opacity = 0;
    setTimeout(() => {
      rotator.textContent = roles[idx];
      rotator.style.opacity = 1;
    }, 250);
  }
}, 2200);

// Contact form handler
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (form && formNote) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop redirect
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formNote.textContent = "✅ Message sent successfully!";
        formNote.style.color = "green";
        form.reset();

        // Clear the message after 3 seconds
        setTimeout(() => {
          formNote.textContent = "";
        }, 3000);

      } else {
        formNote.textContent = "⚠️ Oops! Something went wrong.";
        formNote.style.color = "red";

        // Clear error after 3 seconds too
        setTimeout(() => {
          formNote.textContent = "";
        }, 3000);
      }
    } catch (err) {
      formNote.textContent = "⚠️ Network error. Please try again later.";
      formNote.style.color = "red";

      setTimeout(() => {
        formNote.textContent = "";
      }, 3000);
    }
  });
}

// Hover tilt effect for hero card
const tilt = document.querySelector('.card-3d');
if (tilt) {
  const damp = 12;
  tilt.addEventListener('mousemove', (e) => {
    const rect = tilt.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * damp;
    const rotateX = -((y / rect.height) - 0.5) * damp;
    tilt.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  tilt.addEventListener('mouseleave', () => {
    tilt.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
}

// Skills accordion
(function(){
  const cats = document.querySelectorAll('.skills-accordion .cat-head');
  cats.forEach(head => {
    head.addEventListener('click', () => {
      const cat = head.closest('.cat');
      // collapse all
      document.querySelectorAll('.skills-accordion .cat').forEach(c => c.classList.remove('active'));
      // expand clicked
      cat.classList.add('active');
    });
  });
  // open the first group by default
  if (cats[0]) cats[0].click();
})();

// Reveal animation on scroll
const animEls = document.querySelectorAll('.animate');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // animate once
    }
  });
},{ threshold: 0.2 });

animEls.forEach(el => observer.observe(el));

// Hero parallax glows follow the cursor (subtle)
(function(){
  const hero = document.querySelector('.hero-pro');
  const g1 = document.querySelector('.hero-glow.g1');
  const g2 = document.querySelector('.hero-glow.g2');
  if (!hero || !g1 || !g2) return;

  // Throttle mouse movement for better performance
  let ticking = false;
  const move = (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        g1.style.setProperty('--x', x + '%');
        g1.style.setProperty('--y', y + '%');
        // slight lag for depth
        g2.style.setProperty('--x', (x*0.8 + 10) + '%');
        g2.style.setProperty('--y', (y*0.8 + 10) + '%');
        ticking = false;
      });
      ticking = true;
    }
  };
  
  // Only enable on non-touch devices for better performance
  if (!('ontouchstart' in window)) {
    hero.addEventListener('mousemove', move);
  }
})();

// theme toggle
(function(){
  const KEY = 'site-theme';
  const btn = document.getElementById('themeToggle');
  const iconMoon = document.getElementById('iconMoon');
  const iconSun  = document.getElementById('iconSun');

  // 1) initial theme: saved -> system preference -> default (dark/current)
  const saved = localStorage.getItem(KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const start = saved || (prefersLight ? 'light' : 'dark');
  setTheme(start);

  // 2) toggle on click
  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(KEY, next);
  });

  function setTheme(name){
    if(name === 'dark') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', name);

    // icon swap
    const isLight = name === 'light';
    iconSun.style.display  = isLight ? '' : 'none';
    iconMoon.style.display = isLight ? 'none' : '';
  }
})();

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  
  if (mobileMenu && hamburger && 
      mobileMenu.style.display === 'flex' && 
      !mobileMenu.contains(e.target) && 
      !hamburger.contains(e.target)) {
    mobileMenu.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
    
    // Reset hamburger icon
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Optimize animations for mobile devices
const isMobile = window.innerWidth <= 768;
if (isMobile) {
  // Reduce animation complexity on mobile
  document.documentElement.style.setProperty('--reduced-motion', '1');
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Recalculate heights after orientation change
    const hero = document.querySelector('.hero-pro');
    if (hero) {
      hero.style.minHeight = window.innerHeight * 0.8 + 'px';
    }
  }, 100);
});