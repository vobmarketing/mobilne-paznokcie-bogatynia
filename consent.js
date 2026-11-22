// Zgoda na cookies analityczne (Google Tag Manager / Google Analytics).
// GTM ładuje się WYŁĄCZNIE po kliknięciu „Akceptuję”. Wybór: localStorage „mp-consent-v2”, ważny 6 miesięcy.
(function () {
  var KEY = 'mp-consent-v2', GTM_ID = 'GTM-5TH8W74J', MAX_AGE = 180 * 24 * 3600 * 1000;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  try { localStorage.removeItem('mp-cookie-notice-v1'); } catch (e) {}

  var loaded = false;
  function loadGTM() {
    if (loaded) return; loaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }
  function clearGaCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^_ga|^_gid/.test(n)) ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = n + '=; Max-Age=0; path=/' + d;
      });
    });
  }
  function get() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && Date.now() - v.t < MAX_AGE) return v.v; } catch (e) {}
    return null;
  }
  function set(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
    if (v === 'granted') loadGTM();
    else { gtag('consent', 'update', { analytics_storage: 'denied' }); clearGaCookies(); }
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }
  window.mpConsent = { get: get, set: set, reset: reset };
  if (get() === 'granted') loadGTM();

  // Mały baner dla stron bez własnego banera (np. formularz rezerwacji otwarty bezpośrednio).
  document.addEventListener('DOMContentLoaded', function () {
    if (window.top !== window.self || document.getElementById('cookie-banner') || get()) return;
    var b = document.createElement('div');
    b.className = 'mp-consent'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Zgoda na cookies');
    b.innerHTML = '<p>Za Twoją zgodą używamy cookies analitycznych Google (Google Analytics), aby wiedzieć, jak korzystasz ze strony. ' +
      '<a href="./#cookies" target="_blank" rel="noopener">Szczegóły</a></p>' +
      '<div><button type="button" data-c="denied">Odrzucam</button><button type="button" data-c="granted">Akceptuję</button></div>';
    b.querySelectorAll('button').forEach(function (x) { x.onclick = function () { set(x.getAttribute('data-c')); b.remove(); }; });
    var st = document.createElement('style');
    st.textContent = '.mp-consent{position:fixed;left:10px;right:10px;bottom:10px;z-index:9999;max-width:640px;margin:auto;background:#fff;' +
      'border:1px solid #f3c6dc;border-radius:16px;padding:14px 16px;box-shadow:0 8px 30px rgba(120,0,70,.18);font:14px/1.45 system-ui,sans-serif;' +
      'color:#3a1830;display:flex;gap:12px;align-items:center;flex-wrap:wrap}.mp-consent p{margin:0;flex:1 1 260px}.mp-consent a{color:#c2007a}' +
      '.mp-consent div{display:flex;gap:8px;margin-left:auto}.mp-consent button{border:1px solid #ea008f;border-radius:99px;padding:9px 16px;' +
      'font:600 14px system-ui,sans-serif;cursor:pointer;background:#fff;color:#ea008f}.mp-consent button[data-c=granted]{background:#ea008f;color:#fff}';
    document.head.appendChild(st); document.body.appendChild(b);
  });
})();
