const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (cursor && ring && finePointer) {
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });
  (function animateRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(animateRing);
  })();
}

const toggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  if (toggle) toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
if (toggle) {
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

const caseRedirects = { fitoday: 'fitoday.html', usri: 'usri.html', hihello: 'hihello.html', word: 'wordtropolis.html' };
const hashKey = window.location.hash.replace('#', '');
if (caseRedirects[hashKey]) window.location.replace(caseRedirects[hashKey]);

const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

function handleSubmit() {
  const name = document.getElementById('fname');
  const email = document.getElementById('femail');
  const message = document.getElementById('fmessage');
  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errMessage = document.getElementById('err-message');
  [name, email, message].forEach(el => el.classList.remove('input-error'));
  [errName, errEmail, errMessage].forEach(el => el.classList.remove('visible'));
  let valid = true;
  if (!name.value.trim()) { name.classList.add('input-error'); errName.classList.add('visible'); valid = false; }
  const emailVal = email.value.trim();
  if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    email.classList.add('input-error'); errEmail.classList.add('visible'); valid = false;
  }
  if (!message.value.trim()) { message.classList.add('input-error'); errMessage.classList.add('visible'); valid = false; }
  if (!valid) return;
  const subject = encodeURIComponent(`Portfolio contact from ${name.value.trim()}`);
  const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${emailVal}\n\n${message.value.trim()}`);
  window.location.href = `mailto:ylee862ylee@gmail.com?subject=${subject}&body=${body}`;
  const el = document.getElementById('formSuccess');
  el.style.display = 'block';
  setTimeout(() => el.classList.add('show'), 10);
  name.value = ''; email.value = ''; message.value = '';
}

function openLightbox(src, alt) {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  img.alt = alt || '';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
const lightboxImg = document.getElementById('lightboxImg');
if (lightboxImg) lightboxImg.addEventListener('click', e => e.stopPropagation());
