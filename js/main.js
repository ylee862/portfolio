// ── Cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
});
function animateRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
  requestAnimationFrame(animateRing);
}
animateRing();

// ── Theme ──
const toggle = document.getElementById('themeToggle');
let dark = false;
toggle.onclick = () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  toggle.textContent = dark ? '🌙' : '☀️';
};

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

// ── Case Study Pages ──
let activePage = null;

function openCasePage(key) {
  const page = document.getElementById('case-' + key);
  if (!page) return;
  if (activePage) activePage.classList.remove('open');
  activePage = page;
  page.scrollTop = 0;
  page.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('caseBack').classList.add('visible');
  // Push browser history so back button works naturally
  history.pushState({ caseStudy: key }, '', '#' + key);
}

function closeCasePage() {
  if (activePage) {
    activePage.classList.remove('open');
    activePage = null;
  }
  document.body.style.overflow = '';
  document.getElementById('caseBack').classList.remove('visible');
  history.pushState({}, '', window.location.pathname);
}

// Handle browser back button
window.addEventListener('popstate', (e) => {
  if (!e.state || !e.state.caseStudy) {
    closeCasePage();
  }
});

// Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCasePage(); });

// ── Contact form ──
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