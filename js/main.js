// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Theme
const toggle = document.getElementById('themeToggle');
let dark = false;
toggle.onclick = () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  toggle.textContent = dark ? '🌙' : '☀️';
};

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

// Contact form
function handleSubmit() {
  const name = document.getElementById('fname');
  const email = document.getElementById('femail');
  const message = document.getElementById('fmessage');
  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errMessage = document.getElementById('err-message');

  // Reset errors
  [name, email, message].forEach(el => el.classList.remove('input-error'));
  [errName, errEmail, errMessage].forEach(el => el.classList.remove('visible'));

  // Validate
  let valid = true;
  if (!name.value.trim()) {
    name.classList.add('input-error');
    errName.classList.add('visible');
    valid = false;
  }
  const emailVal = email.value.trim();
  const emailOk = emailVal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  if (!emailOk) {
    email.classList.add('input-error');
    errEmail.classList.add('visible');
    valid = false;
  }
  if (!message.value.trim()) {
    message.classList.add('input-error');
    errMessage.classList.add('visible');
    valid = false;
  }

  if (!valid) return;

  // Open mailto with pre-filled content
  const subject = encodeURIComponent(`Portfolio contact from ${name.value.trim()}`);
  const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${emailVal}\n\n${message.value.trim()}`);
  window.location.href = `mailto:ylee862ylee@gmail.com?subject=${subject}&body=${body}`;

  // Show success and clear form
  const el = document.getElementById('formSuccess');
  el.style.display = 'block';
  setTimeout(() => el.classList.add('show'), 10);
  name.value = '';
  email.value = '';
  message.value = '';
}

// Modal data
let projects = {};

fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    projects = data;
  });

function openModal(key) {
  const p = projects[key];
  const stepsHtml = p.steps.map(s => `
    <div class="case-step">
      <div class="step-num">${s.num}</div>
      <div>
        <div class="step-heading">${s.heading}</div>
        <div class="step-body">${s.body}</div>
      </div>
    </div>
  `).join('');
  const tagsHtml = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-eyebrow">${p.category}</div>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-summary">${p.summary}</p>
    <div class="modal-visual ${p.visualClass}">${p.glyph}</div>
    <div class="tag-row">${tagsHtml}</div>
    ${stepsHtml}
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });