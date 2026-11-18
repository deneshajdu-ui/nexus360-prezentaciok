/* NEXUS360 – sablonból épülő ügyfélprezentáció.
   Az ügyfél oldala csak egy rövid csonk (márkanév + sablon), a tartalom a
   /sablonok/<iparág>/ oldalról jön, így a sablon javítása minden ügyfélnél él.
   A cím (/<iparág>/<márka>-<sorszám>/) nem változik, a követés ugyanúgy működik. */
(function () {
  var s = document.currentScript;
  var src = s.getAttribute('data-sablon');
  var marka = s.getAttribute('data-marka') || '';
  var esc = function (t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  fetch(src, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (h) {
      h = h.split('{{MARKA}}').join(esc(marka));
      document.open();
      document.write(h);
      document.close();
    })
    .catch(function () {
      document.body.innerHTML = '<p style="font-family:system-ui;padding:40px">A prezentáció most nem tölthető be. Kérjük, próbálja újra pár perc múlva.</p>';
    });
})();
