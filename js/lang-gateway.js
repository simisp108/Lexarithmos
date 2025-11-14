/* /js/lang-gateway.js */
(function () {
  const PREF_KEY = 'lex_lang_pref';
  const routes = { en: 'lexarithmos.html', el: 'lexarithmos-el.html' };
  const PREVIEW = /\bpreview=1\b/i.test(location.search) || /#preview\b/i.test(location.hash);

  function isOwnPath(path) { try { return new URL(path, location.origin).origin === location.origin; } catch { return false; } }
  function go(to, remember) {
    if (remember && !PREVIEW) localStorage.setItem(PREF_KEY, to);
    location.assign(to);
  }
  function fadeThenGo(to,remember) {
    document.documentElement.classList.add('leaving');
    setTimeout(() => go(to,remember),180);
  }

  // If a remembered page exists and we're on the gateway, go there immediately.
  const remembered = localStorage.getItem(PREF_KEY);
  if (remembered && location.pathname.replace(/\/index\.html?$/, '/') === '/') {
    if (!PREVIEW && isOwnPath(remembered)) {
      document.documentElement.classList.add('leaving');
      return setTimeout(() => go(remembered,false),180)
    }
    localStorage.removeItem(PREF_KEY);
  }

  // Store preference on click
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('a.lang-tile[data-lang]');
    if (!tile) return;
    const lang = tile.getAttribute('data-lang');
    const target = routes[lang] || tile.getAttribute('href');
    e.preventDefault();
    if (PREVIEW) {
      // In preview mode do not remember and stay on page
      return;
    }
    fadeThenGo(target,true);
  });
})();
