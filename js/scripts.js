// =============================================
// COBACH PLANTEL 10 - Scripts principales
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Menú móvil (hamburguesa) ──────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu    = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      navMenu.classList.toggle('abierto');
    });
  }

  // ── Cerrar menú al hacer clic en un enlace ────
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('abierto');
    });
  });

  // ── Marcar enlace activo según scroll ─────────
  const secciones = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');
  function marcarActivo() {
    let actual = '';
    secciones.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) actual = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('activo', link.getAttribute('href') === '#' + actual);
    });
  }
  window.addEventListener('scroll', marcarActivo);
  marcarActivo();

  // ── Carrusel / Hero ───────────────────────────
  const slider = document.querySelector('.hero-slider');
  const dots   = document.querySelectorAll('.hero-dot');
  const btnPrev = document.querySelector('.hero-btn.prev');
  const btnNext = document.querySelector('.hero-btn.next');
  let slideActual = 0;
  let autoPlay;

  function irASlide(n) {
    const total = document.querySelectorAll('.hero-slide').length;
    slideActual = (n + total) % total;
    if (slider) slider.style.transform = `translateX(-${slideActual * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('activo', i === slideActual));
  }

  function iniciarAutoPlay() {
    autoPlay = setInterval(() => irASlide(slideActual + 1), 5000);
  }
  function detenerAutoPlay() { clearInterval(autoPlay); }

  if (btnPrev) btnPrev.addEventListener('click', () => { detenerAutoPlay(); irASlide(slideActual - 1); iniciarAutoPlay(); });
  if (btnNext) btnNext.addEventListener('click', () => { detenerAutoPlay(); irASlide(slideActual + 1); iniciarAutoPlay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { detenerAutoPlay(); irASlide(i); iniciarAutoPlay(); }));
  iniciarAutoPlay();

  // ── Animación de números / cifras ─────────────
  function animarNumero(el, destino, duracion) {
    let inicio = 0;
    const paso = (timestamp) => {
      if (!inicio) inicio = timestamp;
      const progreso = Math.min((timestamp - inicio) / duracion, 1);
      el.textContent = Math.floor(progreso * destino).toLocaleString();
      if (progreso < 1) requestAnimationFrame(paso);
      else el.textContent = destino.toLocaleString();
    };
    requestAnimationFrame(paso);
  }

  const observadorCifras = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animarNumero(el, parseInt(el.dataset.destino), 1500);
        observadorCifras.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.cifra-numero[data-destino]').forEach(el => {
    observadorCifras.observe(el);
  });

  // ── Botón "volver arriba" ─────────────────────
  const btnTop = document.getElementById('btn-top');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.classList.toggle('visible', window.scrollY > 400);
    });
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Año actual en el footer ───────────────────
  const spanAno = document.getElementById('ano-actual');
  if (spanAno) spanAno.textContent = new Date().getFullYear();

  // ── Mostrar elementos al hacer scroll (fade-in) ─
  const observadorFade = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observadorFade.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.oferta-card, .noticia-card, .galeria-item, .personal-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observadorFade.observe(el);
  });

});
