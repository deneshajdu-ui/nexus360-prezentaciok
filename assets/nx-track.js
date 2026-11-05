/* NEXUS360 prezentáció-követés (PostHog, EU szerver)
   - süti és helyi tárolás nélkül fut (persistence: memory), így nem kell sütisáv
   - eseményeket ad: prezentacio_megnyitva, dia_megtekintve (diánkénti idővel),
     matterport_megnyitva, kapcsolat_kattintas, prezentacio_bezarva
   - session replay: névtelen felvétel, minden beviteli mező maszkolva */
(function () {
  if (window.__nxTrack) return; window.__nxTrack = true;
  var KEY = 'phc_tZFKPvUU9XJCPjTedwdTLmYvgBWN97tkPNtJQFb4xQBi';
  var HOST = 'https://eu.i.posthog.com';

  // hivatalos PostHog betöltő
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag onFeatureFlags identify alias people.set startSessionRecording stopSessionRecording".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  // a cím szerkezete: /<iparag>/<marka>-<sorszam>/
  var parts = location.pathname.split('/').filter(Boolean);
  var iparag = parts[0] || 'gyoker';
  var azon = parts[1] || '';
  var m = /^(.*?)-(\d+)$/.exec(azon);
  var marka = m ? m[1] : azon;
  var sorszam = m ? m[2] : '';
  var prez = iparag + '/' + azon;

  // helyi megnyitás vagy Claude ellenőrző robotja ne számítson
  var belso = /localhost|127\.0\.0\.1/.test(location.hostname) || /HeadlessChrome|Playwright/i.test(navigator.userAgent) || /[?&]nx_belso=1/.test(location.search);

  posthog.init(KEY, {
    api_host: HOST,
    persistence: 'memory',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: false,
    session_recording: { maskAllInputs: true },
    person_profiles: 'identified_only',
    loaded: function (ph) { if (belso) ph.opt_out_capturing(); }
  });
  posthog.register({ prezentacio: prez, iparag: iparag, marka: marka, sorszam: sorszam, eszkoz: document.documentElement.classList.contains('nx-m') ? 'mobil' : 'asztali' });
  posthog.capture('prezentacio_megnyitva', { forras: document.referrer || 'kozvetlen' });

  // diák követése: melyik dián mennyi időt töltött
  function start() {
    var S = [].slice.call(document.querySelectorAll('#deck section'));
    if (!S.length) return;
    var cur = -1, t0 = Date.now(), osszes = 0, max = 0;
    function zar() {
      if (cur < 0) return;
      var mp = Math.round((Date.now() - t0) / 100) / 10;
      if (document.visibilityState === 'hidden' && mp < 0.5) return;
      if (mp >= 1) posthog.capture('dia_megtekintve', { dia: cur + 1, dia_db: S.length, fejezet: S[cur].dataset.sec || '', ido_mp: mp });
      osszes += mp;
    }
    function aktiv() {
      var i = -1, mob = document.documentElement.classList.contains('nx-m'), cls = mob ? 'nxcur' : 'on'; for (var k = 0; k < S.length; k++) if (S[k].classList.contains(cls)) { i = k; break; }
      if (i === cur || i < 0) return;
      zar(); cur = i; t0 = Date.now(); if (i + 1 > max) max = i + 1;
    }
    var mo = new MutationObserver(aktiv);
    S.forEach(function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    aktiv();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        zar(); posthog.capture('prezentacio_bezarva', { utolso_dia: cur + 1, legtavolabbi_dia: max, dia_db: S.length, osszes_ido_mp: Math.round(osszes) }, { transport: 'sendBeacon' });
      } else { t0 = Date.now(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  // kattintások: 3D séta, e-mail, telefon
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href');
    if (/matterport\.com/.test(h)) posthog.capture('matterport_megnyitva', { seta: h });
    else if (/^mailto:/.test(h)) posthog.capture('kapcsolat_kattintas', { tipus: 'email' });
    else if (/^tel:/.test(h)) posthog.capture('kapcsolat_kattintas', { tipus: 'telefon' });
  }, true);
})();
