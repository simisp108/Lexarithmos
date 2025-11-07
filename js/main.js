document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang;

    //Detect reduced motion preference for users and listen for changes
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    //Captions per language
    const captions = (lang === 'el')
        ? ['Η Φιλόλογος κα Άντρη', 'Η Μαθηματικός κα Ευριδίκη', 'Η Φιλόλογος κα Λία', 'Ο Μαθηματικός κος Αντρέας']
        : ['Our Greek Teacher Andri', 'Our Mathematics Teacher Evridiki', 'Our Greek Teacher Lia', 'Our Mathematics Teacher Andreas'];

    //Image paths
    const imgswaps = [
        'images/teacher_1.jpg',
        'images/teacher_2.jpg',
        'images/teacher_3.jpg',
        'images/teacher_4.jpg'
    ];

    //DOM elements
    const swapImageElement = document.getElementById('swap_image');
    const imageCaption     = document.getElementById('Photo_Swap_caption');
    const dotsContainer    = document.getElementById('photo_dots');

    //Guard: run only if gallery elements exist
    if (!swapImageElement || !imageCaption || !dotsContainer) return;


    let currentIndex = 0;
    let timer = null;

    //Build dots
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

    //Render helpers
    function render() {
        //Fading touch and transition in CSS only if user does not preferred reduced motion
        if (!prefersReduced.matches) {
            swapImageElement.classList.add('is-fading');
        }
        setTimeout(() => {
        swapImageElement.src = imgswaps[currentIndex];
        imageCaption.textContent = captions[currentIndex] || '';
        //Update dots
        Array.from(dotsContainer.children).forEach((d, i) =>
            d.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false')
        );
        if (!prefersReduced.matches) {
            swapImageElement.classList.remove('is-fading');}
        }, prefersReduced.matches ? 0 : 120);//No delay if reduced
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

    //Auto-advance and pause on hover
    function start() { stop(); timer = setInterval(nextImage, 4000); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    const figure = swapImageElement.closest('figure');
    if (figure) {
        figure.addEventListener('mouseenter', stop);
        figure.addEventListener('mouseleave', start);
    }

    //Pause when tab/window is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();});


    //Respect reduced motion for autoplay
    if (prefersReduced.matches) {
        render(); //show first slide
    } else {
        render(); start();
    }

    //React to current changes in user's OS
    prefersReduced.addEventListener?.('change', (e) => {
        if (e.matches) {stop(); render();} else {start();}
    });

    //Keyboard support on dots for left-right arrow
    dotsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); nextImage(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); prevImage(); }
    });

    //Accessibility nicety: Screen Readers announce changes to images
    imageCaption.setAttribute('aria-live', 'polite');

    //Initialise
    render();
    start();
    });
