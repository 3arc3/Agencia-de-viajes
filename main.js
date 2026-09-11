(() => {
  'use strict';

  const videoUrls = [
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4'
  ];

  const videos = Array.from(document.querySelectorAll('.hero-video'));
  const switchButtons = Array.from(document.querySelectorAll('.switch-btn'));
  const statusDot = document.getElementById('statusDot');
  const nameDot = document.getElementById('nameDot');
  let activeIndex = 0;

  /* ---------------------------------------------------------
     PRELOAD VIDEOS AS BLOBS (instant playback on switch)
     --------------------------------------------------------- */
  videoUrls.forEach((url, i) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('network response not ok');
        return res.blob();
      })
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        if (videos[i]) {
          videos[i].src = objectUrl;
          videos[i].load();
          videos[i].play().catch(() => {});
        }
      })
      .catch(() => {
        // Fallback: keep the original src already set in the markup
      });
  });

  /* ---------------------------------------------------------
     VIDEO / SLIDE SWITCHER
     --------------------------------------------------------- */
  function setActive(index) {
    activeIndex = index;

    videos.forEach(v => v.classList.toggle('is-active', parseInt(v.dataset.index, 10) === index));
    switchButtons.forEach(b => b.classList.toggle('is-active', parseInt(b.dataset.index, 10) === index));

    const isPink = index === 0;
    if (statusDot) statusDot.classList.toggle('is-pink', isPink);
    if (nameDot) nameDot.classList.toggle('is-pink', isPink);
  }

  switchButtons.forEach(btn => {
    btn.addEventListener('click', () => setActive(parseInt(btn.dataset.index, 10)));
  });

  setActive(0);

  /* ---------------------------------------------------------
     LIVE CLOCK — "CUP HH:MM:SS"
     --------------------------------------------------------- */
  const clockEl = document.getElementById('clock');
  const clockMobileEl = document.getElementById('clockMobile');
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  function tickClock() {
    const text = `CUP ${timeFormatter.format(new Date())}`;
    if (clockEl) clockEl.textContent = text;
    if (clockMobileEl) clockMobileEl.textContent = text;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuToggleLabel = document.getElementById('menuToggleLabel');
  const mobilePanelWrap = document.getElementById('mobilePanelWrap');
  let menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    mobilePanelWrap.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggleLabel.textContent = open ? 'Close' : 'Menu';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => setMenu(!menuOpen));
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL (fires once, threshold 0.35)
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    revealEls.forEach(el => observer.observe(el));
  }
})();

/* =========================================================
   AÑADIDO — secciones de la agencia de viajes "Vuela."
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  // Año en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contadores animados (Nosotros)
  const statEls = document.querySelectorAll('.stat-num');
  let statsStarted = false;

  function animateStats() {
    statEls.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-ES');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
          statsStarted = true;
          animateStats();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsRow);
  }

  // Formulario de contacto -> mailto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('cName');
      const emailEl = document.getElementById('cEmail');
      const destEl = document.getElementById('cDest');
      const messageEl = document.getElementById('cMessage');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const nameOk = nameEl.value.trim().length > 1;
      const emailOk = emailPattern.test(emailEl.value.trim());
      const messageOk = messageEl.value.trim().length > 3;

      document.querySelectorAll('#contactForm .field-error').forEach(el => el.classList.remove('is-visible'));
      if (!nameOk) nameEl.nextElementSibling.classList.add('is-visible');
      if (!emailOk) emailEl.nextElementSibling.classList.add('is-visible');
      if (!messageOk) messageEl.nextElementSibling.classList.add('is-visible');
      if (!nameOk || !emailOk || !messageOk) return;

      const subject = `Consulta de viaje — ${destEl.value.trim() || 'sin destino indicado'}`;
      const body =
        `Nombre: ${nameEl.value.trim()}\n` +
        `Correo: ${emailEl.value.trim()}\n` +
        `Destino de interés: ${destEl.value.trim() || 'No indicado'}\n\n` +
        `Mensaje:\n${messageEl.value.trim()}`;

      window.location.href = `mailto:hola@vuela.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const note = document.getElementById('formNote');
      if (note) note.textContent = 'Se ha abierto tu correo con el mensaje ya redactado.';
    });
  }
});
