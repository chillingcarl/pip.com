// ============================================================
//  main.js — os.pip shared utilities & navigation
// ============================================================

// ── Active nav highlighting ───────────────────────────────────
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

(function () {
  const page = getCurrentPage();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Clock in nav ─────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('nav-clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `SYS:${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ── Typing effect ─────────────────────────────────────────────
function typeWriter(el, text, speed = 40, onDone = null) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
    } else {
      clearInterval(interval);
      if (onDone) onDone();
    }
  }, speed);
}

// ── Animate elements on scroll ────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s, transform 0.4s';
  observer.observe(el);
});

// ── Random terminal noise ─────────────────────────────────────
function randomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|';
  return chars[Math.floor(Math.random() * chars.length)];
}

function scrambleText(el, finalText, duration = 800) {
  if (!el) return;
  let start = null;
  const chars = finalText.split('');

  function step(ts) {
    if (!start) start = ts;
    const progress = (ts - start) / duration;

    el.textContent = chars.map((c, i) => {
      if (progress > i / chars.length) return c;
      return c === ' ' ? ' ' : randomChar();
    }).join('');

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = finalText;
  }

  requestAnimationFrame(step);
}

// ── Boot sequence overlay (used on index) ─────────────────────
function runBootSequence(lines, containerId, onDone) {
  const el = document.getElementById(containerId);
  if (!el) { if (onDone) onDone(); return; }

  let lineIndex = 0;

  function nextLine() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        if (onDone) onDone();
      }, 400);
      return;
    }
    const p = document.createElement('div');
    p.className = 'prompt-line';
    el.appendChild(p);

    const { text, delay = 60, pause = 300 } = typeof lines[lineIndex] === 'string'
      ? { text: lines[lineIndex] }
      : lines[lineIndex];

    typeWriter(p, text, delay, () => {
      lineIndex++;
      setTimeout(nextLine, pause);
    });
  }

  nextLine();
}

// ── Local mock session ────────────────────────────────────────
const SESSION = {
  get user() {
    try { return JSON.parse(localStorage.getItem('pip_user') || 'null'); }
    catch { return null; }
  },
  set user(v) {
    if (v) localStorage.setItem('pip_user', JSON.stringify(v));
    else localStorage.removeItem('pip_user');
  }
};

const OWNER_EMAIL = 'mw2008g@gmail.com';
const ANNOUNCEMENT_EXPIRY_DAYS = 60;

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function isExpiredAnnouncement(entry) {
  const createdAt = Date.parse(entry?.createdAt || '');
  if (!createdAt) return false;
  return (Date.now() - createdAt) > ANNOUNCEMENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
}

const DATA = {
  get announcements() {
    try {
      const parsed = JSON.parse(localStorage.getItem('pip_announcements') || '[]');
      const filtered = (parsed || []).filter(entry => !isExpiredAnnouncement(entry));
      if (filtered.length !== parsed.length) {
        localStorage.setItem('pip_announcements', JSON.stringify(filtered));
      }
      return filtered;
    }
    catch { return []; }
  },
  set announcements(value) {
    localStorage.setItem('pip_announcements', JSON.stringify(value || []));
  },
  addAnnouncement(entry) {
    const existing = DATA.announcements;
    existing.unshift(entry);
    DATA.announcements = existing.slice(0, 12);
  },
  isOwner(user = SESSION.user) {
    return normalizeEmail(user?.email) === OWNER_EMAIL;
  }
};

function shouldRequireLogin(page = getCurrentPage()) {
  return page !== 'login.html';
}

function requirePortalLogin() {
  const page = getCurrentPage();
  if (!shouldRequireLogin(page)) return;
  if (SESSION.user) return;

  sessionStorage.setItem('pip_return_to', page);
  window.location.href = 'login.html';
}

function consumeReturnTo() {
  const stored = sessionStorage.getItem('pip_return_to');
  sessionStorage.removeItem('pip_return_to');
  return stored && stored !== 'login.html' ? stored : 'index.html';
}

function mountMatrixRain() {
  if (document.getElementById('pip-matrix-rain')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'pip-matrix-rain';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '0',
    opacity: '0.24'
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}#@$%/|';
  let drops = [];

  function resizeRain() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.max(1, Math.floor(canvas.width / 16));
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -35));
  }

  function drawRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2eff68';
    ctx.font = "14px 'Share Tech Mono', monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 16;
      const y = drops[i] * 16;
      ctx.fillText(text, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }

    requestAnimationFrame(drawRain);
  }

  resizeRain();
  window.addEventListener('resize', resizeRain);
  requestAnimationFrame(drawRain);
}

document.addEventListener('DOMContentLoaded', () => {
  mountMatrixRain();
  requirePortalLogin();
});

// ── Export helpers ────────────────────────────────────────────
window.PIP = {
  typeWriter,
  scrambleText,
  runBootSequence,
  SESSION,
  DATA,
  OWNER_EMAIL,
  ANNOUNCEMENT_EXPIRY_DAYS,
  consumeReturnTo,
  nowIso,
  normalizeEmail,
  randomChar
};
