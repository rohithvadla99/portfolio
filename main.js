/* ─── Aurora / Particle Background Canvas ────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, time = 0;

  const blobDefs = [
    { bx: 0.25, by: 0.3,  sx: 0.15, sy: 0.10, fx: 0.0004, fy: 0.0003, hue: 200 },
    { bx: 0.75, by: 0.5,  sx: 0.12, sy: 0.12, fx: 0.0003, fy: 0.0005, hue: 250 },
    { bx: 0.5,  by: 0.15, sx: 0.10, sy: 0.08, fx: 0.0005, fy: 0.0004, hue: 185 },
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `${Math.round(f(0)*255)},${Math.round(f(8)*255)},${Math.round(f(4)*255)}`;
  }

  function drawAurora() {
    blobDefs.forEach(b => {
      const hue = (b.hue + 30 * Math.sin(time * 0.0002)) % 360;
      const rgb = hslToRgb(hue, 80, 65);
      const x = (b.bx + b.sx * Math.sin(time * b.fx)) * W;
      const y = (b.by + b.sy * Math.cos(time * b.fy)) * H;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, W * 0.38);
      grd.addColorStop(0, `rgba(${rgb},0.10)`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148,210,255,${p.opacity})`;
      ctx.fill();
    });
  }

  function loop(ts) {
    time = ts;
    ctx.clearRect(0, 0, W, H);
    drawAurora();
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  requestAnimationFrame(loop);
})();


/* ─── Hero Word-by-Word Entrance ─────────────────────────── */
(function () {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  h1.innerHTML = h1.innerHTML
    .replace(/I'm/g, '<span class="word-reveal" style="--i:0">I\'m</span>')
    .replace(/<span class="highlight">(.*?)<\/span>/,
      '<span class="word-reveal highlight" style="--i:1">$1</span>');
  setTimeout(() => {
    document.querySelectorAll('.word-reveal').forEach(el => el.classList.add('in'));
  }, 150);
})();


/* ─── Typing Animation ────────────────────────────────────── */
const TYPING = ["build ML models.", "write code.", "do random stuff.", "love data."];
const typingEl = document.querySelector(".typing");
let tIdx = 0, cIdx = 0, forward = true;

function typeLoop() {
  const word = TYPING[tIdx];
  if (forward) {
    cIdx++;
    typingEl.textContent = word.slice(0, cIdx);
    if (cIdx >= word.length) { forward = false; setTimeout(typeLoop, 1400); return; }
    setTimeout(typeLoop, 90);
  } else {
    cIdx--;
    typingEl.textContent = word.slice(0, cIdx);
    if (cIdx <= 0) { forward = true; tIdx = (tIdx + 1) % TYPING.length; setTimeout(typeLoop, 350); return; }
    setTimeout(typeLoop, 45);
  }
}
typeLoop();


/* ─── Scroll Reveal ───────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


/* ─── Timeline Draw Animation ────────────────────────────── */
(function () {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const tObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('draw');
        tObs.unobserve(timeline);
      }
    });
  }, { threshold: 0.1 });
  tObs.observe(timeline);
})();


/* ─── Card Tilt + Glow on Hover ──────────────────────────── */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const tiltX = ((y / rect.height) - 0.5) * -10;
      const tiltY = ((x / rect.width)  - 0.5) *  10;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  });
});

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ─── Load Projects ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  fetch('projects.json')
    .then(r => r.json())
    .then(populateProjects)
    .catch(() => {
      document.getElementById('projects-grid').innerHTML =
        '<p style="color:var(--text-muted)">Could not load projects.</p>';
    });

  fetch('certifications.json')
    .then(r => r.json())
    .then(populateCertifications)
    .catch(() => {
      const el = document.getElementById('cert-list');
      if (el) el.innerHTML = '<p style="color:var(--text-muted)">Could not load certifications.</p>';
    });
});

function populateProjects(projects) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';
  projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'card project-card reveal';
    card.innerHTML = `
      <div class="card-tag">${(proj.tags || []).slice(0,2).join(' · ')}</div>
      <h3>${proj.title}</h3>
      <p>${proj.short}</p>
    `;
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      showProjectDetail(proj);
      document.getElementById('projects-detail').scrollIntoView({ behavior: 'smooth' });
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    grid.appendChild(card);
    setTimeout(() => observer.observe(card), i * 80);
  });
}

function populateCertifications(certs) {
  const list = document.getElementById('cert-list');
  if (!list) return;
  list.innerHTML = '';

  certs.forEach((cert, i) => {
    const row = document.createElement('a');
    row.className = 'cert-row reveal';
    row.href = cert.url;
    row.target = '_blank';
    row.rel = 'noopener noreferrer';
    row.innerHTML = `
      <div class="cert-info">
        <span class="cert-title">${cert.title}</span>
        <span class="cert-issuer">${cert.issuer}</span>
      </div>
      <span class="cert-link">
        View Certificate
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </span>
    `;
    list.appendChild(row);
    setTimeout(() => observer.observe(row), i * 80);
  });
}

function showProjectDetail(project) {
  const section = document.getElementById('projects-detail');
  section.innerHTML = `
    <div class="section-label">Project Detail</div>
    <h2 class="section-title">${project.title}</h2>
    <div class="project-detail-inner">
      <div>${project.long}</div>
      <div class="project-links">
        ${project.project_link ? `<a href="${project.project_link}" target="_blank" class="cta-primary">Live Demo →</a>` : ''}
        ${project.link ? `<a href="${project.link}" target="_blank" class="btn-outline">View on GitHub</a>` : ''}
      </div>
    </div>
  `;
}


/* ─── Contact Form (Formspree) ────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const status = document.getElementById('form-status');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.textContent = "Message sent! I'll get back to you soon.";
        status.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      status.textContent = 'Something went wrong. Try emailing me directly.';
      status.className = 'form-status error';
    }

    btn.textContent = 'Send Message';
    btn.disabled = false;
  });
}
