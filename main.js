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
