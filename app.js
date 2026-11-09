document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('#header');
const nav = document.querySelector('#nav');
const toggle = document.querySelector('.menu-toggle');
const navLinks = [...nav.querySelectorAll('.nav-links a')];
const navMedia = nav.querySelector('.nav-media');

// Menú desplegable: la foto cambia según el enlace
function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.setAttribute('aria-hidden', String(!open));
  if (open) header.classList.remove('hidden');
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
navLinks.forEach((link, index) => {
  link.style.setProperty('--i', index);
  link.addEventListener('click', () => setMenu(false));
  link.addEventListener('mouseenter', () => showNavImage(link.dataset.img));
  link.addEventListener('focus', () => showNavImage(link.dataset.img));
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.addEventListener('click', event => { if (nav.classList.contains('open') && !header.contains(event.target)) setMenu(false); });

function showNavImage(src) {
  const current = navMedia.querySelector('img.on');
  if (!src || !current || current.getAttribute('src') === src) return;
  const next = document.createElement('img');
  next.src = src;
  next.alt = '';
  next.decoding = 'async';
  navMedia.appendChild(next);
  next.decode().catch(() => {}).then(() => requestAnimationFrame(() => {
    next.classList.add('on');
    current.classList.remove('on');
    setTimeout(() => current.remove(), 700);
  }));
}

// Scroll: header que se esconde al bajar y parallax de fotos grandes
const heroContent = document.querySelector('.hero-content');
const heroFoot = document.querySelector('.hero-foot');
let lastY = window.scrollY;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  if (!nav.classList.contains('open')) header.classList.toggle('hidden', y > lastY && y > window.innerHeight * 0.6);
  lastY = y;
  if (!reduceMotion) {
    if (y < window.innerHeight * 1.1) {
      heroContent.style.transform = `translateY(${(y * 0.22).toFixed(1)}px)`;
      heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.65)).toFixed(3);
      heroFoot.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.35)).toFixed(3);
    }
    document.querySelectorAll('.parallax-wrap').forEach(frame => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      frame.querySelector('.parallax-image').style.setProperty('--parallax', `${Math.max(-15, Math.min(0, -15 + progress * 15)).toFixed(2)}%`);
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Fotos grandes: se descubren de arriba abajo con un ligero zoom
document.querySelectorAll('.manifesto-photo, .feature-photo, .room-photo, .contact-photo').forEach(element => {
  element.classList.remove('reveal');
  element.classList.add('img-reveal');
});
// Listas que aparecen en cascada
document.querySelectorAll('.facts, .signature-list, .hours tbody, .footer-top, .contact-details').forEach(list => {
  list.classList.remove('reveal');
  list.classList.add('stagger');
  [...list.children].forEach((child, index) => { child.classList.remove('reveal'); child.style.setProperty('--i', Math.min(index, 10)); });
});
// Retardo escalonado entre bloques hermanos (platos, galería…)
document.querySelectorAll('.reveal').forEach(element => {
  const siblings = [...element.parentElement.children].filter(child => child.classList.contains('reveal'));
  if (siblings.length > 1) element.style.setProperty('--d', `${Math.min(siblings.indexOf(element), 5) * 90}ms`);
});

// Entradas al hacer scroll. Títulos y fotos con máscara se recortan a cero, así que se observa su contenedor
const revealTargets = new Map();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealTargets.get(entry.target).forEach(element => element.classList.add('visible'));
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .mask-reveal, .img-reveal, .stagger').forEach(element => {
  const trigger = element.matches('.mask-reveal, .img-reveal') ? element.parentElement : element;
  if (!revealTargets.has(trigger)) revealTargets.set(trigger, []);
  revealTargets.get(trigger).push(element);
});
revealTargets.forEach((elements, trigger) => observer.observe(trigger));

// Sección activa en el menú
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Vídeo del hero: sin reproducción automática si se pide menos movimiento
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && reduceMotion) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
}
if (heroVideo) {
  const ready = () => heroVideo.classList.add('ready');
  if (heroVideo.readyState >= 3) ready();
  heroVideo.addEventListener('playing', ready, { once: true });
  heroVideo.addEventListener('canplay', ready, { once: true });
}

// Nota de Google: cuenta hasta 4,6 al aparecer
const score = document.querySelector('.score strong');
if (score && !reduceMotion) {
  score.textContent = '0,0';
  new IntersectionObserver((entries, scoreObserver) => {
    if (!entries[0].isIntersecting) return;
    scoreObserver.disconnect();
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 1400, 1);
      score.textContent = (4.6 * (1 - Math.pow(1 - progress, 3))).toFixed(1).replace('.', ',');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.6 }).observe(score);
}

// Cerrar diálogos con animación de salida
function closeDialog(dialog) {
  if (!dialog.open || dialog.classList.contains('closing')) return;
  if (reduceMotion) { dialog.close(); return; }
  dialog.classList.add('closing');
  const done = () => { dialog.classList.remove('closing'); dialog.close(); };
  dialog.addEventListener('animationend', done, { once: true });
  setTimeout(() => { if (dialog.classList.contains('closing')) done(); }, 500);
}
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); }));

// Abierto ahora / cerrado (minutos desde medianoche). Mismo horario todos los días
const shifts = [[810, 960], [1260, 1410]];
const clock = minutes => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
function openStatus(date = new Date()) {
  const now = date.getHours() * 60 + date.getMinutes();
  const current = shifts.find(([start, close]) => now >= start && now < close);
  if (current) return { open: true, text: `Abierto ahora · cerramos a las ${clock(current[1])}` };
  const later = shifts.find(([start]) => start > now);
  if (later) return { open: false, text: `Cerrado ahora · abrimos a las ${clock(later[0])}` };
  return { open: false, text: `Cerrado ahora · abrimos mañana a las ${clock(shifts[0][0])}` };
}
const status = openStatus();
document.querySelectorAll('[data-status]').forEach(element => {
  element.textContent = status.text;
  element.classList.toggle('is-open', status.open);
});

// Reservas (DISH) y carta (Kekomo) en modal: el iframe se carga la primera vez que se abre.
// La carta vive en Kekomo para que siempre esté al día
function openFrameModal(modal) {
  setMenu(false);
  if (!modal.open) modal.showModal();
  document.documentElement.classList.add('modal-open');
  const body = modal.querySelector('.reserve-body');
  if (body.querySelector('iframe')) return;
  const frame = document.createElement('iframe');
  frame.src = body.dataset.src;
  frame.title = body.dataset.title;
  frame.addEventListener('load', () => body.classList.add('loaded'));
  body.appendChild(frame);
}
[['#reservar', '#reserve-modal'], ['#carta', '#carta-modal']].forEach(([hash, selector]) => {
  const modal = document.querySelector(selector);
  document.querySelectorAll(`a[href="${hash}"]`).forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openFrameModal(modal);
  }));
  modal.querySelector('.reserve-close').addEventListener('click', () => closeDialog(modal));
  modal.addEventListener('click', event => { if (event.target === modal) closeDialog(modal); });
  modal.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));
  if (location.hash === hash) openFrameModal(modal);
});

// Google Maps solo se carga si se pide (sin cookies de terceros por defecto)
document.querySelectorAll('.map-load').forEach(button => button.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = button.dataset.src;
  frame.title = 'Mapa de Doble M en Gelves';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  button.replaceWith(frame);
}));

const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const image = lightbox.querySelector('img');
  image.src = button.dataset.image;
  image.alt = button.querySelector('img').alt;
  lightbox.showModal();
}));
lightbox.querySelector('.close-dialog').addEventListener('click', () => closeDialog(lightbox));
lightbox.addEventListener('click', event => { if (event.target !== lightbox.querySelector('.close-dialog')) closeDialog(lightbox); });

document.querySelector('#year').textContent = new Date().getFullYear();

// Marca el día de hoy en el horario
const today = document.querySelector(`.hours [data-day="${new Date().getDay()}"]`);
if (today) today.classList.add('today');
