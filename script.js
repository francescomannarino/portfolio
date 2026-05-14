'use strict';

/* ================================================================
   GSAP REGISTRATION
   ================================================================ */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const dot   = document.getElementById('cursor-dot');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();

/* ================================================================
   PARTICLE CANVAS
   ================================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const COUNT = 70;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.r     = Math.random() * 1.4 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = -(Math.random() * 0.45 + 0.15);
      this.alpha = Math.random() * 0.45 + 0.1;
      this.color = Math.random() > 0.55 ? '#7C3AED' : '#00F5D4';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 110) * 0.1;
          ctx.strokeStyle = '#00F5D4';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  loop();
  window.addEventListener('resize', resize, { passive: true });
})();

/* ================================================================
   TYPEWRITER
   ================================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Senior Software Engineer',
    'Development Team Leader',
    'Front-End Specialist',
    'PWA Architect',
    'Problem Solver',
  ];

  let ri = 0, ci = 0, deleting = false;
  const TYPE_SPEED = 85, DEL_SPEED = 48, PAUSE = 1800;

  function tick() {
    const cur = roles[ri];
    if (!deleting) {
      ci++;
      el.textContent = cur.slice(0, ci);
      if (ci === cur.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      ci--;
      el.textContent = cur.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? DEL_SPEED : TYPE_SPEED);
  }
  setTimeout(tick, 1400);
})();

/* ================================================================
   NAVBAR – scroll glass + active links + hamburger
   ================================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const links     = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('section[id]');

  function updateActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActive();
  }, { passive: true });

  updateActive();

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) closeMenu();
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
  });
})();

/* ================================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================================ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => obs.observe(el));
})();

/* ================================================================
   GSAP SCROLL ANIMATIONS
   ================================================================ */
(function initGSAP() {
  if (!window.gsap || !window.ScrollTrigger) return;

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 28, duration: .8, ease: 'power3.out',
    });
  });

  // About columns
  gsap.from('.about-avatar-wrap', {
    scrollTrigger: { trigger: '#about', start: 'top 78%' },
    opacity: 0, x: -50, duration: 1, ease: 'power3.out',
  });
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '#about', start: 'top 78%' },
    opacity: 0, x: 50, duration: 1, ease: 'power3.out',
  });

  // Animated counters
  gsap.utils.toArray('.stat-number').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
        });
      },
    });
  });

  // Project cards stagger
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 40, duration: .7,
      delay: i * 0.12, ease: 'power3.out',
    });
  });

  // Skills categories stagger
  gsap.utils.toArray('.skills-category').forEach((cat, i) => {
    gsap.from(cat, {
      scrollTrigger: { trigger: cat, start: 'top 88%' },
      opacity: 0, y: 30, duration: .6,
      delay: i * 0.1, ease: 'power3.out',
    });
  });
})();

/* ================================================================
   SKILL BADGES STAGGER ANIMATION
   ================================================================ */
(function initBadges() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.badge');
        badges.forEach((b, i) => setTimeout(() => b.classList.add('visible'), i * 55));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skills-category').forEach(c => obs.observe(c));
})();

/* ================================================================
   3D CARD TILT
   ================================================================ */
(function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      const rx = -(y / r.height) * 10;
      const ry =  (x / r.width)  * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
})();

/* ================================================================
   COPY EMAIL + TOAST
   ================================================================ */
(function initCopyEmail() {
  const btn   = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (!btn || !toast) return;

  function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  btn.addEventListener('click', () => {
    const email = btn.dataset.email;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showToast).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      showToast();
    }
  });
})();
