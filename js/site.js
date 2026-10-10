(function () {
  var root = document.documentElement;

  var toggle = document.getElementById('themeToggle');
  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
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

  var redirects = { fitoday: 'fitoday.html', usri: 'usri.html', hihello: 'hihello.html', word: 'wordtropolis.html' };
  var key = window.location.hash.replace('#', '');
  if (redirects[key]) window.location.replace(redirects[key]);

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var box = document.getElementById('lightbox');
  if (!box) return;
  var big = box.querySelector('img');
  var closeBtn = box.querySelector('.lightbox-close');
  var lastFocus = null;

  function open(src, alt) {
    lastFocus = document.activeElement;
    big.src = src;
    big.alt = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }
  function close() {
    box.classList.remove('open');
    big.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.cs-body img, .case-cover img').forEach(function (img) {
    if (img.closest('a')) return;
    img.classList.add('lightbox-trigger');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(img.currentSrc || img.src, img.alt); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.currentSrc || img.src, img.alt); }
    });
  });

  box.addEventListener('click', function (e) { if (e.target !== big) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) close();
  });
})();
