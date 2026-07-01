/* ===================================================
   Jay Ar Bardeloza Portfolio — script.js
=================================================== */

// ─── THEME TOGGLE ────────────────────────────────────
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') body.classList.add('light-mode');

  btn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme',
      body.classList.contains('light-mode') ? 'light' : 'dark');
  });
})();


// ─── PARTICLE CANVAS ────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 70;
  const ACCENT = 'rgba(245, 197, 24,';
  const DIM    = 'rgba(255, 255, 255,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.isAccent = Math.random() < 0.15;
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    this.reset();
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = `${DIM}${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const col = p.isAccent ? ACCENT : DIM;
      ctx.fillStyle = `${col}${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


// ─── SCROLL REVEAL (with directional variants) ──────
(function initReveal() {
  const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const els = document.querySelectorAll(selectors.join(','));
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Stagger children if parent is a grid/list
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


// ─── ENHANCED SCROLL ANIMATIONS ─────────────────────
(function initScrollEffects() {
  // Parallax on hero photo
  const heroPhoto = document.querySelector('.hero-photo');
  const heroContent = document.querySelector('.hero-content');

  function onScroll() {
    const scrollY = window.scrollY;

    // Subtle parallax on hero
    if (heroPhoto && scrollY < window.innerHeight) {
      heroPhoto.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.04}px)`;
    }

    // Progress bar on timeline items
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85;
      if (inView) item.classList.add('in-view');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ─── NAVBAR SCROLL STATE ─────────────────────────────
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();


// ─── SMOOTH ACTIVE NAV LINKS ─────────────────────────
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              // Only animate underline on the 4 section links, not Contact CTA
              if (!link.classList.contains('nav-cta')) {
                link.classList.add('active');
              }
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => observer.observe(s));
})();


// ─── HAMBURGER MENU ──────────────────────────────────
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();


// ─── PROJECT CAROUSEL ────────────────────────────────
(function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsEl  = document.getElementById('carouselDots');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;
  let startX   = 0;
  let isDragging = false;

  // Build dots
  const dots = [];
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    dots.push(d);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Auto-advance
  function startAuto() { autoTimer = setInterval(next, 4500); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', startAuto);

  // Touch / drag swipe
  track.addEventListener('pointerdown', e => {
    startX = e.clientX; isDragging = true;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
})();


// ─── CARD TILT ───────────────────────────────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.stack-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


// ─── TYPED TAGLINE EFFECT ────────────────────────────
(function initTyped() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  el.style.opacity = '1';
  el.style.borderLeft = '2px solid var(--accent)';
  el.style.paddingLeft = '1rem';
  el.style.display = 'block';
  let i = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i);
      i++;
      if (i > text.length) clearInterval(interval);
    }, 28);
  }, 900);
})();


// ─── CONTACT FORM ────────────────────────────────────
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message →';
      btn.style.opacity = '1';
      btn.disabled = false;
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1500);
  });
})();


// ─── COUNTER ANIMATION (stats) ───────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text);
      if (isNaN(num)) return;
      const suffix = text.replace(/[\d.]/g, '');
      let start = 0;
      const duration = 1200;
      const step = 16;
      const steps = duration / step;
      const inc = num / steps;
      observer.unobserve(el);
      const timer = setInterval(() => {
        start += inc;
        if (start >= num) { start = num; clearInterval(timer); }
        el.textContent = (Number.isInteger(num) ? Math.floor(start) : start.toFixed(0)) + suffix;
      }, step);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();
