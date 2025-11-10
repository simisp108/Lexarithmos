document.addEventListener('DOMContentLoaded', () => {
  const lang = document.documentElement.lang;

  // Detect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Captions per language
  const captions = (lang === 'el')
    ? ['Η Φιλόλογος κα Άντρη', 'Η Μαθηματικός κα Ευριδίκη', 'Η Φιλόλογος κα Λία', 'Ο Μαθηματικός κος Αντρέας']
    : ['Our Greek Teacher Andri', 'Our Mathematics Teacher Evridiki', 'Our Greek Teacher Lia', 'Our Mathematics Teacher Andreas'];

  // Image paths
  const imgswaps = [
    'images/teacher_1.jpg',
    'images/teacher_2.jpg',
    'images/teacher_3.jpg',
    'images/teacher_4.jpg'
  ];

  // OPTIONAL: preload images once (helps dev servers)
  const _preloaded = imgswaps.map(src => { const im = new Image(); im.src = src; return im; });

  // DOM
  const swapImageElement = document.getElementById('swap_image');
  const imageCaption     = document.getElementById('Photo_Swap_caption');
  const dotsContainer    = document.getElementById('photo_dots');

  if (!swapImageElement || !imageCaption || !dotsContainer) return;

  // OPTIONAL: fallback if an image fails to load
  swapImageElement.onerror = () => {
    currentIndex = (currentIndex + 1) % imgswaps.length;
    swapImageElement.src = imgswaps[currentIndex];
  };

  let currentIndex = 0;
  let timer = null;

  // Build dots
  dotsContainer.innerHTML = '';
  imgswaps.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', (lang === 'el') ? `Εικόνα ${i + 1}` : `Image ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  // Render
  function render() {
    if (!prefersReduced.matches) swapImageElement.classList.add('is-fading');
    setTimeout(() => {
      swapImageElement.src = imgswaps[currentIndex];
      imageCaption.textContent = captions[currentIndex] || '';
      Array.from(dotsContainer.children).forEach((d, i) =>
        d.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false')
      );
      if (!prefersReduced.matches) swapImageElement.classList.remove('is-fading');
    }, prefersReduced.matches ? 0 : 120);
  }

  function nextImage() { currentIndex = (currentIndex + 1) % imgswaps.length; render(); }
  function prevImage() { currentIndex = (currentIndex + imgswaps.length - 1) % imgswaps.length; render(); }
  function goTo(i) { currentIndex = i % imgswaps.length; render(); }

  // Auto-advance controls
  function start() { stop(); timer = setInterval(nextImage, 4000); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }

  const figure = swapImageElement.closest('figure');
  if (figure) {
    figure.addEventListener('mouseenter', stop);
    figure.addEventListener('mouseleave', start);
  }

  // Pause when tab/window is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Respect reduced motion for autoplay
  if (prefersReduced.matches) {
    render(); // show first slide; do not start autoplay
  } else {
    render(); start(); // start once
  }

  // React to setting changes live
  prefersReduced.addEventListener?.('change', (e) => {
    if (e.matches) { stop(); render(); } else { start(); }
  });

  // Keyboard support
  dotsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nextImage(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevImage(); }
  });

  // Screen reader nicety
  imageCaption.setAttribute('aria-live', 'polite');
});
