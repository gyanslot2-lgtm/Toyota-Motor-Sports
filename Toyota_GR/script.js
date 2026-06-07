/**
 * TOYOTA GR SPORTS CARS — script.js
 * All interactive functionality: loader, particles, counters,
 * 3D tilt, filters, compare tool, favorites, video modal,
 * dark/light mode, toast, share buttons, AOS init.
 */

/* ============================================================
   1. LOADING SCREEN
============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for the loading bar animation (~2.2s) then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    initCounters(); // start counters after load
  }, 2600);
});

/* ============================================================
   2. NAVBAR SCROLL EFFECT
============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================================
   3. HAMBURGER MOBILE MENU
============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   4. DARK / LIGHT MODE TOGGLE
============================================================ */
const body = document.getElementById('body');
const themeToggle = document.getElementById('themeToggle');

// Load saved preference
const savedTheme = localStorage.getItem('toyota-theme');
if (savedTheme === 'light') {
  body.classList.remove('dark-mode');
  body.classList.add('light-mode');
  themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  const isLight = body.classList.contains('light-mode');
  if (isLight) {
    body.classList.replace('light-mode', 'dark-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('toyota-theme', 'dark');
  } else {
    body.classList.replace('dark-mode', 'light-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('toyota-theme', 'light');
  }
});

/* ============================================================
   5. PARTICLE CANVAS BACKGROUND
============================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 80;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  // Mouse parallax
  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Slow drift toward mouse
      p.vx += (mouse.x / canvas.width - 0.5) * 0.001;
      p.vy += (mouse.y / canvas.height - 0.5) * 0.001;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 168, 75, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 168, 75, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}
initParticles();

/* ============================================================
   6. ANIMATED COUNTERS
============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ============================================================
   7. 3D TILT CARDS
============================================================ */
function initTiltCards() {
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px)
        rotateX(${-y * 6}deg)
        rotateY(${x * 6}deg)
        scale(1.01)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
initTiltCards();

/* ============================================================
   8. SEARCH & FILTER SYSTEM
============================================================ */
const searchInput = document.getElementById('searchInput');
const filterTags = document.querySelectorAll('.filter-tag');
const carCards = document.querySelectorAll('.car-card');

let activeFilter = 'all';
let searchQuery = '';

function applyFilters() {
  carCards.forEach(card => {
    const category = card.dataset.category;
    const price = card.dataset.price;
    const name = card.dataset.name.toLowerCase();
    const cardText = card.textContent.toLowerCase();

    // Search match
    const matchesSearch = searchQuery === '' ||
      cardText.includes(searchQuery) ||
      name.includes(searchQuery);

    // Filter match
    let matchesFilter = false;
    if (activeFilter === 'all') matchesFilter = true;
    else if (activeFilter === 'gr') matchesFilter = category === 'gr';
    else if (activeFilter === 'classic') matchesFilter = category === 'classic';
    else if (activeFilter === 'under50k') matchesFilter = price === 'under50k';
    else if (activeFilter === 'over50k') matchesFilter = price === 'over50k';

    card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
  });
}

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  applyFilters();
});

filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    filterTags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    activeFilter = tag.dataset.filter;
    applyFilters();
  });
});

/* ============================================================
   9. FAVORITES SYSTEM
============================================================ */
let favorites = JSON.parse(localStorage.getItem('toyota-favs') || '[]');

function initFavorites() {
  favorites.forEach(id => {
    const btn = document.querySelector(`.btn-favorite[data-id="${id}"]`);
    if (btn) {
      btn.classList.add('active');
      btn.querySelector('i').className = 'fa-solid fa-heart';
    }
  });
}
initFavorites();

document.querySelectorAll('.btn-favorite').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const id = btn.dataset.id;
    const icon = btn.querySelector('i');
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
      btn.classList.remove('active');
      icon.className = 'fa-regular fa-heart';
      showToast('Removed from favorites');
    } else {
      favorites.push(id);
      btn.classList.add('active');
      icon.className = 'fa-solid fa-heart';
      showToast('❤️ Added to favorites!');
    }
    localStorage.setItem('toyota-favs', JSON.stringify(favorites));
  });
});

/* ============================================================
   10. CAR COMPARISON TOOL
============================================================ */
const CAR_DATA = {
  supra: {
    name: 'GR Supra 2025',
    price: '$58,645',
    img: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=400&q=80',
  },
  gr86: {
    name: 'GR86 2024',
    price: '$29,995',
    img: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=400&q=80',
  },
  grcorolla: {
    name: 'GR Corolla 2025',
    price: '$39,495',
    img: 'https://images.unsplash.com/photo-1696446701796-da61efab1f97?w=400&q=80',
  },
  celica: {
    name: 'Celica GT-Four',
    price: '$15–35K',
    img: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=400&q=80',
  },
  mr2: {
    name: 'MR2 Turbo',
    price: '$10–30K',
    img: 'https://images.unsplash.com/photo-1514867644123-6385d58d3cd4?w=400&q=80',
  },
};

let compareList = [];
const compareTray = document.getElementById('compareTray');

document.querySelectorAll('.btn-compare').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    if (compareList.includes(id)) {
      removeFromCompare(id);
      btn.classList.remove('active');
      btn.textContent = 'Add to Compare';
      return;
    }
    if (compareList.length >= 3) {
      showToast('Max 3 cars can be compared at once');
      return;
    }
    compareList.push(id);
    btn.classList.add('active');
    btn.textContent = '✓ Added';
    renderCompareTray();
    showToast(`${CAR_DATA[id].name} added to comparison`);
    document.getElementById('compare').scrollIntoView({ behavior: 'smooth' });
  });
});

function removeFromCompare(id) {
  compareList = compareList.filter(c => c !== id);
  // Reset button
  const btn = document.querySelector(`.btn-compare[data-id="${id}"]`);
  if (btn) { btn.classList.remove('active'); btn.textContent = 'Add to Compare'; }
  renderCompareTray();
}

function renderCompareTray() {
  if (compareList.length === 0) {
    compareTray.innerHTML = `
      <div class="compare-empty">
        <i class="fa-solid fa-scale-balanced"></i>
        <p>No cars selected yet. Add cars to compare.</p>
      </div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'compare-grid';
  compareList.forEach(id => {
    const car = CAR_DATA[id];
    const div = document.createElement('div');
    div.className = 'compare-item';
    div.innerHTML = `
      <button class="compare-remove" onclick="removeFromCompare('${id}')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <img src="${car.img}" alt="${car.name}" />
      <h4>${car.name}</h4>
      <p class="compare-price">${car.price}</p>
    `;
    grid.appendChild(div);
  });
  compareTray.innerHTML = '';
  compareTray.appendChild(grid);
}

/* ============================================================
   11. VIDEO MODAL
============================================================ */
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');

function openVideo(url) {
  videoFrame.src = url + '?autoplay=1';
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  videoFrame.src = '';
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideo();
});

/* ============================================================
   12. CONTACT FORM
============================================================ */
function submitForm(e) {
  e.preventDefault();
  showToast('✅ Enquiry sent! We\'ll contact you within 24 hours.');
  e.target.reset();
}

/* ============================================================
   13. SHARE FUNCTIONS
============================================================ */
function shareFacebook(carName) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check out the ${carName} on Toyota GR Sports Cars!`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareWhatsApp(text) {
  const msg = encodeURIComponent(`${text} — Check it out: ${window.location.href}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

/* ============================================================
   14. TOAST NOTIFICATIONS
============================================================ */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================================
   15. AOS (Animate On Scroll) INIT
============================================================ */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ============================================================
   16. SMOOTH ACTIVE NAV LINK HIGHLIGHTING
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle(
          'active-nav',
          a.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

/* ============================================================
   17. GALLERY LIGHTBOX (simple zoom overlay)
============================================================ */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const imgUrl = item.style.getPropertyValue('--img').replace(/url\(['"]?|['"]?\)/g, '');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9500;
      background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;backdrop-filter:blur(8px);
      animation:fadeInOverlay 0.3s ease;
    `;
    const img = document.createElement('img');
    img.src = imgUrl.replace('w=800', 'w=1400');
    img.style.cssText = 'max-width:90vw;max-height:88vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 80px rgba(0,0,0,0.8)';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});

// Inject gallery lightbox keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
  .active-nav { color: var(--gold) !important; }
  .active-nav::after { width: 100% !important; }
`;
document.head.appendChild(style);

/* ============================================================
   18. HERO VIDEO FALLBACK — poster as animated background
============================================================ */
// If the video element doesn't get a src (no autoplay in some envs),
// the CSS ::before pseudo handles the background image fallback gracefully.

console.log('%cTOYOTA GR SPORTS CARS', 'color:#C8A84B;font-size:20px;font-family:monospace;font-weight:bold');
console.log('%cLet\'s drive.', 'color:#6B6358;font-size:12px;font-family:monospace');