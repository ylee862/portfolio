(function () {
  var root = document.documentElement;

  /* Theme: shares the 'theme' key in localStorage so it carries across pages */
  var toggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    if (toggle) toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var dot = document.getElementById('cursor');
  var ring = document.getElementById('cursor-ring');
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (dot && ring && finePointer) {
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + (mx - dot.offsetWidth / 2) + 'px,' + (my - dot.offsetHeight / 2) + 'px)';
    });
    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px)';
      requestAnimationFrame(follow);
    })();
  }

  var overlay = document.getElementById('lightboxOverlay');
  var bigImg = document.getElementById('lightboxImg');
  if (!overlay || !bigImg) return;

  function openLightbox(src, alt) {
    bigImg.src = src;
    bigImg.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    overlay.classList.remove('active');
    bigImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.case-content img').forEach(function (img) {
    if (img.closest('a')) return;
    img.classList.add('lightbox-trigger');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', function () { openLightbox(img.currentSrc || img.src, img.alt); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.currentSrc || img.src, img.alt); }
    });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target !== bigImg) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
  });
})();
