/**
 * TOYOTA GR — enhancements.js
 * Premium upgrade layer: Lenis, GSAP ScrollTrigger, parallax,
 * performance gauges, AI assistant, sound system, gallery lightbox,
 * scroll progress, 3D tilt, cinematic hero.
 * Works alongside the existing script.js without conflicts.
 */

/* ============================================================
   WAIT FOR GSAP + LENIS TO BE READY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS BAR ─── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  /* ============================================================
     1. LENIS SMOOTH SCROLL
  ============================================================ */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    });

    lenis.on('scroll', ({ progress }) => {
      progressBar.style.width = (progress * 100) + '%';
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    // Connect GSAP ScrollTrigger to Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth nav anchor links through Lenis
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70, duration: 1.6 }); }
      });
    });
  }

  /* ============================================================
     2. PREMIUM LOADER — percentage counter
  ============================================================ */
  const pctEl = document.getElementById('loaderPct');
  const loader = document.getElementById('loader');
  if (pctEl && loader) {
    let pct = 0;
    const pctTimer = setInterval(() => {
      pct = Math.min(pct + Math.random() * 12 + 3, 99);
      pctEl.textContent = Math.floor(pct) + '%';
    }, 80);
    window.addEventListener('load', () => {
      clearInterval(pctTimer);
      pctEl.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroGSAP();
      }, 700);
    });
  }

  /* ============================================================
     3. GSAP — CINEMATIC HERO ENTRANCE
  ============================================================ */
  function triggerHeroGSAP() {
    if (typeof gsap === 'undefined') return;

    // Stagger title lines up
    gsap.fromTo('.gsap-line', {
      yPercent: 110, opacity: 0,
    }, {
      yPercent: 0, opacity: 1,
      duration: 1.1,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.15,
    });

    // Stats bar
    gsap.fromTo('#heroStats', {
      y: 30, opacity: 0,
    }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.8,
    });
  }

  /* ============================================================
     4. GSAP SCROLL-TRIGGERED ANIMATIONS
  ============================================================ */
  function initGSAPScrollTriggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* Section titles reveal */
    document.querySelectorAll('.section-title').forEach(el => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Section eyebrows */
    document.querySelectorAll('.section-eyebrow').forEach(el => {
      gsap.fromTo(el,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' }
        }
      );
    });

    /* Car cards stagger reveal */
    const cards = document.querySelectorAll('.car-card');
    gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.1,
        duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#carsGrid',
          start: 'top 85%',
          onComplete: () => cards.forEach(c => c.classList.add('gsap-revealed')),
        }
      }
    );

    /* Stats counter trigger on scroll (hero stats on mobile) */
    ScrollTrigger.create({
      trigger: '#heroStats',
      start: 'top 95%',
      once: true,
      onEnter: () => {
        if (typeof initCounters === 'function') initCounters();
      }
    });

    /* Specs table rows */
    gsap.fromTo('.specs-table tbody tr',
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.specs-table', start: 'top 85%' }
      }
    );

    /* Timeline items already AOS-handled, add GSAP depth */
    document.querySelectorAll('.timeline-card').forEach((card, i) => {
      gsap.fromTo(card,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        }
      );
    });

    /* Contact section */
    gsap.fromTo('.contact-form-wrap',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-section', start: 'top 80%' }
      }
    );
    gsap.fromTo('.contact-info',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-section', start: 'top 80%' }
      }
    );

    /* Gallery parallax on items */
    document.querySelectorAll('.gallery-item').forEach(item => {
      gsap.fromTo(item,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 92%' }
        }
      );
    });

    /* Footer brand */
    gsap.fromTo('.footer-brand',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer', start: 'top 90%' }
      }
    );
  }

  /* ============================================================
     5. PARALLAX — Hero background + card images
  ============================================================ */
  function initParallax() {
    if (typeof gsap === 'undefined') return;

    const heroParallax = document.getElementById('heroParallax');
    if (heroParallax) {
      gsap.to(heroParallax, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // Subtle parallax on card images
    document.querySelectorAll('.card-media img').forEach(img => {
      gsap.fromTo(img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.car-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });
  }

  /* ============================================================
     6. PERFORMANCE GAUGES — expand toggle + animate fills
  ============================================================ */
  window.toggleGauges = function(toggleBtn) {
    toggleBtn.classList.toggle('open');
    const gaugePanel = toggleBtn.nextElementSibling;
    gaugePanel.classList.toggle('visible');
    if (gaugePanel.classList.contains('visible')) {
      // Animate fills after a tiny delay
      requestAnimationFrame(() => {
        gaugePanel.querySelectorAll('.gauge-fill').forEach(fill => {
          const val = fill.dataset.val;
          setTimeout(() => {
            fill.style.width = val + '%';
            fill.classList.add('animated');
          }, 80);
        });
      });
    } else {
      gaugePanel.querySelectorAll('.gauge-fill').forEach(fill => {
        fill.style.width = '0%';
        fill.classList.remove('animated');
      });
    }
  };

  /* ============================================================
     7. ENHANCED GALLERY LIGHTBOX with zoom + swipe
  ============================================================ */
  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=1400&q=90', cap: 'GR Supra — Track Edition' },
    { url: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1400&q=90', cap: 'GR86 — Apex White' },
    { url: 'https://images.unsplash.com/photo-1696446701796-da61efab1f97?w=1400&q=90', cap: 'GR Corolla — Circuit Edition' },
    { url: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=1400&q=90', cap: 'Celica GT-Four ST205' },
    { url: 'https://images.unsplash.com/photo-1514867644123-6385d58d3cd4?w=1400&q=90', cap: 'MR2 Turbo SW20' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90', cap: 'GR Heritage Garage' },
  ];

  let lbIndex = 0;
  let lbScale = 1;
  let lbTouchStartX = 0;

  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightboxImg');
  const lbCaption   = document.getElementById('lightboxCaption');
  const lbCounter   = document.getElementById('lightboxCounter');
  const lbClose     = document.getElementById('lightboxClose');
  const lbPrev      = document.getElementById('lightboxPrev');
  const lbNext      = document.getElementById('lightboxNext');
  const lbBackdrop  = document.getElementById('lightboxBackdrop');

  function openLightbox(index) {
    lbIndex = index;
    lbScale = 1;
    lbImg.style.transform = 'scale(1)';
    lbImg.src = galleryImages[index].url;
    lbCaption.textContent = galleryImages[index].cap;
    lbCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + galleryImages.length) % galleryImages.length;
    lbScale = 1;
    lbImg.style.transform = 'scale(1) translateX(' + (dir * -20) + 'px)';
    setTimeout(() => {
      lbImg.src = galleryImages[lbIndex].url;
      lbCaption.textContent = galleryImages[lbIndex].cap;
      lbCounter.textContent = `${lbIndex + 1} / ${galleryImages.length}`;
      lbImg.style.transform = 'scale(1)';
    }, 120);
  }

  window.lightboxZoom = function(factor) {
    if (factor === 0) { lbScale = 1; }
    else { lbScale = Math.max(0.5, Math.min(4, lbScale * factor)); }
    lbImg.style.transform = `scale(${lbScale})`;
    lbImg.style.cursor = lbScale > 1 ? 'zoom-out' : 'zoom-in';
  };

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => lbNavigate(-1));
  lbNext.addEventListener('click', () => lbNavigate(1));
  lbImg.addEventListener('click', () => lightboxZoom(lbScale > 1 ? 0 : 1.5));

  // Keyboard
  window.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') lbNavigate(1);
    if (e.key === 'ArrowLeft')  lbNavigate(-1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // Touch swipe
  lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) lbNavigate(dx < 0 ? 1 : -1);
  }, { passive: true });

  // Wire gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    item.style.cursor = 'pointer';
  });

  /* ============================================================
     8. AI TOYOTA ASSISTANT
  ============================================================ */
  const AI_KB = {
    supra: {
      name: 'GR Supra 2025',
      answer: '🏎️ <strong>Toyota GR Supra 2025</strong><br>Engine: 3.0L Turbocharged I6 (BMW B58)<br>Power: 382 hp @ 5,800 rpm<br>Torque: 368 lb-ft @ 1,800 rpm<br>0–60: 3.9 seconds | Top Speed: 155 mph<br>Drive: RWD | Trans: 8-Speed Auto<br>Price: <strong>$58,645</strong>'
    },
    gr86: {
      name: 'GR86',
      answer: '🏁 <strong>Toyota GR86 2024</strong><br>Engine: 2.4L Naturally Aspirated Flat-4 (FA24)<br>Power: 228 hp @ 7,000 rpm<br>Torque: 184 lb-ft @ 3,700 rpm<br>0–60: 6.1 seconds | Top Speed: 140 mph<br>Drive: RWD | Weight: 2,811 lbs<br>Price: <strong>$29,995</strong>'
    },
    corolla: {
      name: 'GR Corolla',
      answer: '🔥 <strong>Toyota GR Corolla 2025</strong><br>Engine: 1.6L Turbo 3-cylinder (G16E-GTS)<br>Power: 300 hp @ 6,500 rpm<br>Torque: 273 lb-ft @ 3,000 rpm<br>0–60: 4.99 seconds | Top Speed: 143 mph<br>Drive: GR-FOUR AWD | Trans: 6-Speed Manual<br>Price: <strong>$39,495</strong>'
    },
    celica: {
      name: 'Celica GT-Four',
      answer: '🏆 <strong>Toyota Celica GT-Four (ST205)</strong><br>Engine: 2.0L Turbo 4-cyl (3S-GTE)<br>Power: 241 hp @ 6,000 rpm<br>WRC Champion: 1993, 1994, 1999<br>Production: 1971–2006 (7 generations)<br>Drive: AWD | Current Value: <strong>$15K–$35K</strong>'
    },
    mr2: {
      name: 'MR2 Turbo',
      answer: '🚀 <strong>Toyota MR2 Turbo (SW20)</strong><br>Engine: 2.0L Turbo 4-cyl (3S-GTE)<br>Power: 200 hp | Torque: 200 lb-ft<br>0–60: 5.4 seconds | Top Speed: 145 mph<br>Layout: <strong>Mid-engine RWD</strong><br>Production: 1984–2007 (3 generations)<br>Current Value: <strong>$10K–$30K</strong>'
    },
  };

  const aiKBCompare = {
    keywords: ['compare', 'vs', 'versus', 'difference', 'better'],
    answer: '⚖️ <strong>Quick Comparison</strong><br><br>' +
      '🥇 <strong>Most Powerful:</strong> GR Supra (382hp)<br>' +
      '🥈 <strong>Best Value:</strong> GR86 ($29,995)<br>' +
      '🏁 <strong>Best AWD:</strong> GR Corolla (300hp AWD)<br>' +
      '⚡ <strong>Fastest 0–60:</strong> GR Supra (3.9s)<br>' +
      '🏋️ <strong>Lightest:</strong> GR86 (2,811 lbs)<br><br>' +
      'For track: GR Supra or GR86. For daily + track: GR Corolla.'
  };

  const aiGreetings = ['hello','hi','hey','hola','sup'];
  const aiDefault = '🤔 I can help with specs, prices, comparisons, and history of any Toyota GR car. Try asking about the <strong>GR Supra</strong>, <strong>GR86</strong>, <strong>GR Corolla</strong>, <strong>Celica</strong>, or <strong>MR2</strong>!';

  function getAIResponse(query) {
    const q = query.toLowerCase();
    if (aiGreetings.some(g => q.includes(g))) return '👋 Hey there! I\'m the Toyota GR Assistant. Ask me anything about the GR lineup — specs, prices, comparisons!';
    if (q.includes('track') || q.includes('race') || q.includes('circuit')) return '🏁 For track use, the <strong>GR Supra</strong> offers the most power (382hp, 3.9s 0–60). The <strong>GR86</strong> is a purist choice with perfect balance and lighter weight. Both are RWD with world-class chassis tuning from Gazoo Racing.';
    if (q.includes('awd') || q.includes('all wheel') || q.includes('daily')) return '🌧️ For daily driving in all conditions, the <strong>GR Corolla</strong> is unbeatable — 300hp AWD in a practical hatchback. The GR-FOUR AWD system is derived directly from WRC rally racing!';
    if (q.includes('cheap') || q.includes('budget') || q.includes('affordable') || q.includes('price')) return '💰 Most affordable GR: <strong>GR86 at $29,995</strong>. Mid-range: GR Corolla at $39,495. Premium: GR Supra from $58,645. For classics, the MR2 and Celica start under $15K.';
    if (aiKBCompare.keywords.some(k => q.includes(k))) return aiKBCompare.answer;
    if (q.includes('supra')) return AI_KB.supra.answer;
    if (q.includes('86') || q.includes('gr86')) return AI_KB.gr86.answer;
    if (q.includes('corolla') || q.includes('gr-four') || q.includes('gr four')) return AI_KB.corolla.answer;
    if (q.includes('celica')) return AI_KB.celica.answer;
    if (q.includes('mr2') || q.includes('mr 2')) return AI_KB.mr2.answer;
    if (q.includes('toyota') || q.includes('gazoo') || q.includes('gr')) return '🏎️ Toyota Gazoo Racing (GR) is Toyota\'s performance brand. The current lineup: <strong>GR Supra, GR86, GR Corolla, GR Yaris</strong>, plus the legendary classics: Celica and MR2. All built with real motorsport DNA!';
    return aiDefault;
  }

  const aiChatBody = document.getElementById('aiChatBody');
  const aiInput    = document.getElementById('aiInput');

  function addAIMsg(html, type = 'ai') {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${type}`;
    const p = document.createElement('p');
    p.innerHTML = html;
    msg.appendChild(p);
    aiChatBody.appendChild(msg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
    return msg;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'ai-msg ai';
    t.id = 'aiTypingIndicator';
    t.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
    aiChatBody.appendChild(t);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
    return t;
  }

  window.sendAI = function() {
    const q = aiInput.value.trim();
    if (!q) return;
    addAIMsg(q, 'user');
    aiInput.value = '';
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addAIMsg(getAIResponse(q), 'ai');
    }, 700 + Math.random() * 600);
  };

  window.askAI = function(question) {
    aiInput.value = question;
    sendAI();
  };

  window.toggleAI = function() {
    const chat = document.getElementById('aiChat');
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) setTimeout(() => aiInput.focus(), 400);
  };

  /* ============================================================
     9. SOUND SYSTEM
  ============================================================ */
  let soundEnabled = false;
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playEngineSound(type = 'idle') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'idle') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'rev') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.start(); osc.stop(ctx.currentTime + 0.7);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) { /* audio blocked — silent */ }
  }

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('active', soundEnabled);
      soundToggle.innerHTML = soundEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
      if (soundEnabled) {
        playEngineSound('idle');
        showToast('🔊 Engine sounds ON');
      } else {
        showToast('🔇 Sound muted');
      }
    });
  }

  // Rev sound on card hover
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('mouseenter', () => playEngineSound('rev'));
  });

  // Click sound on buttons
  document.querySelectorAll('.btn-primary, .btn-compare, .filter-tag').forEach(btn => {
    btn.addEventListener('click', () => playEngineSound('click'));
  });

  /* ============================================================
     10. 3D TILT — already in script.js but enhanced with shadow
  ============================================================ */
  document.querySelectorAll('.car-card').forEach(card => {
    let rafId;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const rotX = -y * 7;
        const rotY =  x * 7;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
        card.style.boxShadow = `
          ${-x * 20}px ${-y * 20}px 60px rgba(0,0,0,0.5),
          ${x * 4}px ${y * 4}px 30px rgba(200,168,75,0.15)
        `;
        // Reflection highlight
        card.style.setProperty('--rx', (x * 100 + 50) + '%');
        card.style.setProperty('--ry', (y * 100 + 50) + '%');
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* ============================================================
     11. INIT ALL
  ============================================================ */
  // Wait slightly for GSAP CDN to load
  setTimeout(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initGSAPScrollTriggers();
      initParallax();
    }
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }, 300);

});

/* ── Helper: showToast is defined in script.js but we need it here too ── */
function showToastEnhanced(msg) {
  if (typeof showToast === 'function') { showToast(msg); return; }
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
// Patch for sound calls
const _showToast = window.showToast;
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
};