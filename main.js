(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, time = 0;

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

  function drawAurora() {
    // Slow drifting aurora blobs
    const blobs = [
      { x: 0.25 + 0.15 * Math.sin(time * 0.0004), y: 0.3 + 0.1 * Math.cos(time * 0.0003), color: '56,189,248' },
      { x: 0.75 + 0.12 * Math.cos(time * 0.0003), y: 0.5 + 0.12 * Math.sin(time * 0.0005), color: '129,140,248' },
      { x: 0.5  + 0.1  * Math.sin(time * 0.0005), y: 0.15 + 0.08 * Math.cos(time * 0.0004), color: '34,211,238' },
    ];

    blobs.forEach(b => {
      const grd = ctx.createRadialGradient(
        b.x * W, b.y * H, 0,
        b.x * W, b.y * H, W * 0.35
      );
      grd.addColorStop(0, `rgba(${b.color},0.09)`);
      grd.addColorStop(1, `rgba(${b.color},0)`);
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


const TYPING = ["build ML models.", "write code.", "do random stuff.", "love data."];
const typingEl = document.querySelector(".typing");
let tIdx = 0, cIdx = 0, forward = true;

function typeLoop() {
  const word = TYPING[tIdx];
  if (forward) {
    cIdx++;
    typingEl.textContent = word.slice(0, cIdx);
    if (cIdx >= word.length) {
      forward = false;
      setTimeout(typeLoop, 1400);
      return;
    }
    setTimeout(typeLoop, 90);
  } else {
    cIdx--;
    typingEl.textContent = word.slice(0, cIdx);
    if (cIdx <= 0) {
      forward = true;
      tIdx = (tIdx + 1) % TYPING.length;
      setTimeout(typeLoop, 350);
      return;
    }
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


/* ─── Card Mouse Glow ─────────────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
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
    grid.appendChild(card);

    // stagger the observer trigger by re-observing after delay
    setTimeout(() => observer.observe(card), i * 80);
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
