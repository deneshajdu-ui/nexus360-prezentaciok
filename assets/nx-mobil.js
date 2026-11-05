/* NEXUS360 – automatikus asztali / mobil nézet.
   A <head>-ben, defer nélkül kell betölteni (a nx-mobil.css után). */
(function () {
  var MQ = '(max-width: 900px), (pointer: coarse) and (max-width: 1100px) and (orientation: portrait)';
  var mobil = window.matchMedia && matchMedia(MQ).matches;
  if (/[?&]nezet=asztali/.test(location.search)) mobil = false;
  if (/[?&]nezet=mobil/.test(location.search)) mobil = true;
  if (!mobil) return;
  document.documentElement.classList.add('nx-m');

  // a diás lapozás gesztusait mobilon kikapcsoljuk (függőleges görgetés van helyette)
  ['touchend', 'wheel', 'keydown'].forEach(function (t) {
    window.addEventListener(t, function (e) {
      if (t === 'touchend' && e.target.closest && e.target.closest('#cmp')) return;
      if (t === 'keydown' && !/Arrow|Page|Home|End|^ $/.test(e.key)) return;
      e.stopPropagation();
    }, true);
  });

  function init() {
    var S = [].slice.call(document.querySelectorAll('#deck section'));
    if (!S.length) return;

    // a „dia aktív” animációk mobilon görgetésre indulnak: section.on → section.nxin
    var css = [];
    [].forEach.call(document.styleSheets, function (sh) {
      var R; try { R = sh.cssRules; } catch (e) { return; }
      [].forEach.call(R || [], function (r) {
        if (r.selectorText && r.selectorText.indexOf('section.on') > -1) {
          css.push(r.selectorText.split(',').map(function (s) { return s.indexOf('section.on') > -1 ? 'html.nx-m ' + s.trim().replace(/section\.on/g, 'section.nxin') : null; }).filter(Boolean).join(',') + '{' + r.style.cssText + '}');
        }
      });
    });
    var st = document.createElement('style'); st.textContent = css.join('\n'); document.head.appendChild(st);

    // keskenyre szorult rácsok (pl. beégetett kétoszlopos elrendezés) egy oszlopba
    function racs() {
      [].forEach.call(document.querySelectorAll('#deck section *'), function (el) {
        var cs = getComputedStyle(el); if (cs.display.indexOf('grid') < 0) return;
        var cols = cs.gridTemplateColumns.split(' ').filter(Boolean).length; if (cols < 2) return;
        var keskeny = [].some.call(el.children, function (c) { return c.getBoundingClientRect().width < 150 && (c.textContent || '').trim().length > 40; });
        if (keskeny || (cols >= 2 && el.clientWidth / cols < 140 && el.textContent.trim().length > 120)) el.style.setProperty('grid-template-columns', '1fr', 'important');
      });
    }
    racs(); setTimeout(racs, 800);
    var bar = document.createElement('div'); bar.className = 'nxprog'; document.body.appendChild(bar);
    var top = document.createElement('button'); top.className = 'nxtop'; top.setAttribute('aria-label', 'Vissza a tetejére'); top.textContent = '↑';
    top.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }; document.body.appendChild(top);

    var io = new IntersectionObserver(function (E) {
      E.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('nxin'); });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    S.forEach(function (s) { io.observe(s); });

    var cur = -1, tick = false;
    function aktiv() {
      tick = false;
      var mid = innerHeight * 0.45, i = 0;
      for (var k = 0; k < S.length; k++) { var r = S[k].getBoundingClientRect(); if (r.top <= mid) i = k; else break; }
      var vege = (innerHeight + scrollY) >= document.documentElement.scrollHeight - 4;
      if (vege) i = S.length - 1;
      bar.style.width = ((i + 1) / S.length * 100) + '%';
      top.classList.toggle('on', scrollY > innerHeight);
      if (i === cur) return;
      if (cur >= 0) S[cur].classList.remove('nxcur');
      cur = i; S[i].classList.add('nxcur', 'nxin');
      S.forEach(function (s, k) { s.querySelectorAll('video').forEach(function (v) { try { if (k === i) { v.muted = true; v.play().catch(function () {}); } else v.pause(); } catch (e) {} }); });
      try { history.replaceState(null, '', location.pathname + location.search + '#dia-' + (i + 1)); } catch (e) {}
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(aktiv); } }, { passive: true });
    addEventListener('resize', aktiv);

    var m = /^#dia-(\d+)$/.exec(location.hash);
    if (m && S[+m[1] - 1] && +m[1] > 1) setTimeout(function () { S[+m[1] - 1].scrollIntoView(); aktiv(); }, 60);
    aktiv();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
