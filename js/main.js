document.addEventListener('DOMContentLoaded', () => {
  // Initialise gallery; if this throws, it does NOT affect signup
  initGallery();
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialise signup toggle completely independently
  initSignupDisclosure();
});

//Teacher gallery / photo swap
function initGallery() {
  const lang = document.documentElement.lang || 'en';

  // Detect reduced motion
  const supportsMatchMedia = typeof window.matchMedia === 'function';
  const prefersReduced = supportsMatchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

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

  // DOM elements
  const swapImageElement = document.getElementById('swap_image');
  const imageCaption     = document.getElementById('Photo_Swap_caption');
  const dotsContainer    = document.getElementById('photo_dots');

  // If this page has no gallery, bail out quietly
  if (!swapImageElement || !imageCaption || !dotsContainer) return;

  // Preload
  imgswaps.forEach(src => {
    const im = new Image();
    im.src = src;
  });

  let currentIndex = 0;
  let timer = null;

  // Fallback if an image fails to load
  swapImageElement.onerror = () => {
    currentIndex = (currentIndex + 1) % imgswaps.length;
    swapImageElement.src = imgswaps[currentIndex];
  };

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

  function render() {
    const reduceMotion = prefersReduced && prefersReduced.matches;
    if (!reduceMotion) swapImageElement.classList.add('is-fading');

    const delay = reduceMotion ? 0 : 120;

    setTimeout(() => {
      swapImageElement.src = imgswaps[currentIndex];
      imageCaption.textContent = captions[currentIndex] || '';

      Array.from(dotsContainer.children).forEach((d, i) =>
        d.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false')
      );

      if (!reduceMotion) swapImageElement.classList.remove('is-fading');
    }, delay);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % imgswaps.length;
    render();
  }

  function prevImage() {
    currentIndex = (currentIndex + imgswaps.length - 1) % imgswaps.length;
    render();
  }

  function goTo(i) {
    currentIndex = i % imgswaps.length;
    render();
  }

  function start() {
    stop();
    timer = setInterval(nextImage, 4000);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Pause on hover
  const figure = swapImageElement.closest('figure');
  if (figure) {
    figure.addEventListener('mouseenter', stop);
    figure.addEventListener('mouseleave', start);
  }

  // Pause when tab/window is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Respect reduced motion for autoplay
  if (prefersReduced && prefersReduced.matches) {
    render(); // show first slide; do not start autoplay
  } else {
    render();
    start(); // start once
  }

  // React to setting changes live (if supported)
  if (prefersReduced && typeof prefersReduced.addEventListener === 'function') {
    prefersReduced.addEventListener('change', (e) => {
      if (e.matches) {
        stop();
        render();
      } else {
        start();
      }
    });
  }

  // Keyboard support on dots (left/right)
  dotsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    }
  });

  // Screen reader: announce caption changes
  imageCaption.setAttribute('aria-live', 'polite');
}

// Sign-up disclosure (expand / collapse grade choices)
function initSignupDisclosure() {
  const signupToggle = document.getElementById('signup_toggle');
  const signupPanel  = document.getElementById('signup_options');

  // If this page has no sign-up section, do nothing
  if (!signupToggle || !signupPanel) return;

  // Remember original display so we can restore it when showing again
  const computed = window.getComputedStyle(signupPanel);
  const originalDisplay = computed.display === 'none' ? 'block' : computed.display;
  signupPanel.dataset.originalDisplay = originalDisplay;

  // Progressive enhancement:
  // - HTML keeps the panel visible by default (for no-JS users).
  // - JS hides it on load, and only shows it after the user clicks.
  signupPanel.style.display = 'none';
  signupToggle.setAttribute('aria-expanded', 'false');

  signupToggle.addEventListener('click', (event) => {
    // Handle toggle instead of following the link
    event.preventDefault();

    const isHidden = signupPanel.style.display === 'none';

    if (isHidden) {
      // Open
      signupPanel.style.display = signupPanel.dataset.originalDisplay || 'block';
      signupToggle.setAttribute('aria-expanded', 'true');

      const firstChoice = signupPanel.querySelector('.signup-grade');
      if (firstChoice) {
        firstChoice.focus();
      }
    } else {
      // Close
      signupPanel.style.display = 'none';
      signupToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
