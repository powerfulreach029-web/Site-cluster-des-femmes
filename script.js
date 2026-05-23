/* ============================================================
   AUTONOMISATION PAR LE DIGITAL — script.js
   Animations · Particles · Scroll Effects · Interactions
   ============================================================ */

'use strict';

/* ── 1. NAVBAR SCROLL EFFECT & THEME SWITCH ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const themeSwitch = document.getElementById('theme-switch');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.style.transform = isOpen ? 'rotate(90deg)' : '';
    hamburger.style.transition = 'transform 0.3s ease';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.style.transform = '';
    });
  });

  // Theme Switch Logic
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });
  }

  function updateThemeIcon(isLight) {
    if (!themeSwitch) return;
    const icon = themeSwitch.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }
})();


/* ── 2. TYPEWRITER EFFECT ── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Domination de Marché',
    'Visibilité Mondiale',
    'Formation Stratégique',
    'Suivi de Performance',
    'Réseau Professionnel',
    'Leadership Continental'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTime = 0;

  function type() {
    const current = words[wordIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        pauseTime = 2200;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        pauseTime = 400;
      }
    }

    const speed = isDeleting ? 55 : 80;
    if (pauseTime > 0) {
      const p = pauseTime;
      pauseTime = 0;
      setTimeout(() => requestAnimationFrame(type), p);
    } else {
      setTimeout(() => requestAnimationFrame(type), speed);
    }
  }

  setTimeout(type, 800);
})();


/* ── 3. PARTICLES CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  const PARTICLE_COUNT = 80;
  const COLORS = ['rgba(200,16,46,0.6)', 'rgba(200,16,46,0.3)', 'rgba(255,255,255,0.15)', 'rgba(255,215,0,0.2)'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Mouse interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.vx -= dx * 0.003;
        p.vy -= dy * 0.003;
      }

      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      // Boundaries
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Velocity damping
      p.vx *= 0.99;
      p.vy *= 0.99;
      if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.2;
      if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.2;

      // Draw
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx2 = p.x - q.x;
        const dy2 = p.y - q.y;
        const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(200,16,46,${0.08 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    resize();
    initParticleArray();
  }, { passive: true });

  resize();
  initParticleArray();
  drawParticles();
})();


/* ── 4. SCROLL REVEAL ANIMATIONS ── */
(function initScrollReveal() {
  const selectors = ['.reveal', '.reveal-left', '.reveal-right'];
  const elements = document.querySelectorAll(selectors.join(', '));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ── 5. COUNT-UP ANIMATION ── */
(function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── 6. 3D TILT EFFECT ON MOCKUPS ── */
(function initTilt() {
  const cards = document.querySelectorAll('.mockup-3d, .pillar-card, .problem-card, .kpi-card, .cat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const mx = e.clientX - cx;
      const my = e.clientY - cy;
      const rx = (my / (rect.height / 2)) * -8;
      const ry = (mx / (rect.width / 2)) * 8;

      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
    });
  });
})();


/* ── 7. PHONE SCREEN SLIDESHOW ── */
(function initPhoneSlideshow() {
  const img = document.getElementById('phone-screen-img');
  if (!img) return;

  const slides = [
    { src: "images/fil d'actualité mobile.png",    alt: "Fil d'actualité" },
    { src: "images/page parcours mobile.png",       alt: "Parcours personnel" },
    { src: "images/carte de membres mobile.png",    alt: "Carte des membres" },
    { src: "images/page messagerie.png",            alt: "Messagerie" },
    { src: "images/page formation.png",             alt: "Formations" },
    { src: "images/page tableau de bord.png",       alt: "Tableau de bord" },
  ];

  let current = 0;

  setInterval(() => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    setTimeout(() => {
      current = (current + 1) % slides.length;
      img.src = slides[current].src;
      img.alt = slides[current].alt;
      img.style.opacity = '1';
    }, 600);
  }, 3000);
})();


/* ── 8. SMOOTH ANCHOR SCROLL ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 9. ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '';
          link.style.color   = link.getAttribute('href') === `#${id}` ? 'var(--rouge)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ── 10. FEATURE MOCKUP TILT (ADVANCED) ── */
(function initFeatureDepth() {
  const featureBlocks = document.querySelectorAll('.feature-block');

  featureBlocks.forEach(block => {
    const combined = block.querySelector('.mockups-combined');
    if (combined) {
      const laptop = combined.querySelector('.laptop-mockup');
      const phone = combined.querySelector('.phone-mockup-floating');
      
      block.addEventListener('mousemove', e => {
        const rect = block.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        if (laptop) {
          laptop.style.transform = `perspective(1200px) rotateY(${-12 + x * 15}deg) rotateX(${4 - y * 8}deg) scale(1.02)`;
          laptop.style.transition = 'transform 0.1s ease';
        }
        if (phone) {
          phone.style.transform = `perspective(1200px) rotateY(${8 + x * 20}deg) rotateX(${4 - y * 10}deg) translateZ(50px) scale(1.05)`;
          phone.style.transition = 'transform 0.1s ease';
        }
      });
      
      block.addEventListener('mouseleave', () => {
        if (laptop) {
          laptop.style.transition = 'transform 0.6s ease';
          laptop.style.transform = '';
        }
        if (phone) {
          phone.style.transition = 'transform 0.6s ease';
          phone.style.transform = '';
        }
      });
      return;
    }

    const mockup = block.querySelector('.mockup-3d');
    if (!mockup) return;

    block.addEventListener('mousemove', e => {
      const rect = block.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const isReverse = block.classList.contains('reverse');
      const ry = isReverse ? x * 15 : -x * 15;
      const rx = -y * 8;

      mockup.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
      mockup.style.transition = 'transform 0.1s ease';
    });

    block.addEventListener('mouseleave', () => {
      const isReverse = block.classList.contains('reverse');
      mockup.style.transition = 'transform 0.6s ease';
      mockup.style.transform = isReverse
        ? 'rotateY(10deg) rotateX(3deg)'
        : 'rotateY(-10deg) rotateX(3deg)';
    });
  });
})();


/* ── 11. STATS COUNTER TRIGGER ── */
(function initStatsReveal() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsSection.querySelector('.stats-grid').classList.add('visible');
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();


/* ── 12. URGENCY BAR LIVE COUNTER ── */
(function initUrgencyLive() {
  let count = 22;
  const spotsEl = document.querySelector('.spots-remaining');
  const progressFill = document.querySelector('.progress-fill');

  if (!spotsEl || !progressFill) return;

  // Simulate decreasing spots over time
  setInterval(() => {
    if (count > 1) {
      const chance = Math.random();
      if (chance > 0.85) {
        count--;
        spotsEl.textContent = `⚠️ Seulement ${count} accès disponibles — Ne manquez pas votre place`;
        const pct = Math.round(((50 - count) / 50) * 100);
        progressFill.style.width = `${Math.min(pct, 97)}%`;
      }
    }
  }, 8000);
})();


/* ── 13. BUTTON RIPPLE EFFECT ── */
(function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`,
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple-anim 0.6s ease-out forwards',
        pointerEvents: 'none',
      });

      if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes ripple-anim {
            to { transform: scale(4); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();


/* ── 14. PARALLAX HERO GRID ── */
(function initParallax() {
  const grid = document.querySelector('.hero-grid-overlay');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
})();


/* ── 15. SCROLL PROGRESS INDICATOR ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0', left: '0',
    height: '3px',
    background: 'linear-gradient(90deg, #C8102E, #FFD700)',
    zIndex: '9999',
    width: '0%',
    transition: 'width 0.1s ease',
    pointerEvents: 'none',
  });
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Progression de lecture');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = `${progress}%`;
    bar.setAttribute('aria-valuenow', Math.round(progress));
  }, { passive: true });
})();


/* ── 16. INTERSECTION-TRIGGERED GLOW ON SECTION TAGS ── */
(function initGlowPulse() {
  const tags = document.querySelectorAll('.section-tag');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.boxShadow = '0 0 20px rgba(200,16,46,0.4)';
        entry.target.style.transition = 'box-shadow 0.8s ease';
        setTimeout(() => {
          entry.target.style.boxShadow = '';
        }, 1500);
      }
    });
  }, { threshold: 0.8 });

  tags.forEach(tag => observer.observe(tag));
})();


/* ── 17. FLOATING PHONE SCENE GYRO (MOBILE) ── */
(function initGyro() {
  if (typeof DeviceOrientationEvent === 'undefined') return;
  const scene = document.querySelector('.phone-3d-scene');
  if (!scene) return;

  window.addEventListener('deviceorientation', e => {
    if (!e.gamma || !e.beta) return;
    const rx = Math.min(Math.max(e.beta - 30, -20), 20);
    const ry = Math.min(Math.max(e.gamma, -20), 20);
    scene.style.transform = `rotateX(${rx * 0.3}deg) rotateY(${ry * 0.5}deg)`;
    scene.style.transition = 'transform 0.3s ease';
  }, { passive: true });
})();


/* ── 18. CATEGORY CARD CLICK FEEDBACK ── */
(function initCatCards() {
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 150);
    });
  });
})();


/* ── INIT COMPLETE ── */
console.log('%c🚀 Autonomisation par le Digital — Chargé avec succès', 
  'background:#C8102E;color:#fff;padding:8px 16px;border-radius:8px;font-weight:bold;font-size:14px;');
