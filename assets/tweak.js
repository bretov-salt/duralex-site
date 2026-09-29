/* DuraLex tweak panel. Loads only with ?tweak in the URL. Sliders change the design tokens live on this page;
   "Copy CSS" puts the changed :root block on the clipboard so it can be pasted into site.css. Nothing is saved on the server. */
(function () {
  var root = document.documentElement, cs = getComputedStyle(root);
  var tokens = [
    { k: '--paper', t: 'color', l: 'Paper' }, { k: '--navy', t: 'color', l: 'Ink' }, { k: '--teal', t: 'color', l: 'Olive (links, borders)' },
    { k: '--gold', t: 'color', l: 'Acid (buttons)' }, { k: '--muted', t: 'color', l: 'Muted text' }, { k: '--rule', t: 'color', l: 'Hairlines' },
    { k: '--tw-space', t: 'range', l: 'Section spacing', min: 0.6, max: 1.6, step: 0.05, v: 1 },
    { k: '--tw-radius', t: 'range', l: 'Corner radius', min: 0.4, max: 1.8, step: 0.05, v: 1 },
    { k: '--tw-type', t: 'range', l: 'Headline size', min: 0.8, max: 1.25, step: 0.01, v: 1 },
    { k: '--tw-body', t: 'range', l: 'Body size', min: 0.9, max: 1.15, step: 0.01, v: 1 }
  ];
  var style = document.createElement('style');
  style.textContent = '.tw{position:fixed;right:12px;bottom:12px;z-index:9999;width:min(320px,calc(100vw - 24px));background:#fff;color:#0A0A0A;border:1px solid #D9D9D2;border-radius:14px;box-shadow:0 20px 50px -20px rgba(19,32,41,.5);font:13px/1.4 system-ui,sans-serif;padding:12px 14px;display:grid;gap:8px;max-height:80vh;overflow:auto}' +
    '.tw h2{font:700 14px system-ui,sans-serif;margin:0;display:flex;justify-content:space-between;align-items:center}.tw label{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center}.tw input[type=range]{grid-column:1/-1;width:100%}.tw input[type=color]{width:44px;height:28px;border:1px solid #D9D9D2;border-radius:6px;padding:0;background:none}' +
    '.tw button{font:700 13px system-ui,sans-serif;border:1px solid #3D5000;color:#3D5000;background:#fff;border-radius:999px;padding:6px 12px;cursor:pointer}.tw button.p{background:#C8FF3D;border-color:#C8FF3D;color:#0A0A0A}.tw .row{display:flex;gap:8px;flex-wrap:wrap}.tw small{color:#55606A}' +
    '.tw-on section,.tw-on .hero{padding-block:calc(var(--tw-pad,80px) * var(--tw-space,1))}.tw-on .card,.tw-on .w,.tw-on .win,.tw-on .rec,.tw-on .btn{border-radius:calc(var(--tw-r,12px) * var(--tw-radius,1))}.tw-on .hero h1,.tw-on .h2{font-size:calc(var(--tw-h,48px) * var(--tw-type,1))}.tw-on body,.tw-on .sub,.tw-on p{font-size:calc(1em * var(--tw-body,1))}';
  document.head.appendChild(style);
  var panel = document.createElement('aside'); panel.className = 'tw'; panel.setAttribute('aria-label', 'Design tweaks');
  var h = document.createElement('h2'); h.textContent = 'Tweaks'; var x = document.createElement('button'); x.textContent = 'Close'; x.onclick = function () { resetAll(); panel.remove(); root.classList.remove('tw-on'); }; h.appendChild(x); panel.appendChild(h);
  var changed = {}, initial = {};
  function resetAll() { Object.keys(changed).forEach(function (k) { root.style.removeProperty(k); }); changed = {}; panel.querySelectorAll('input').forEach(function (i) { if (i.dataset.k in initial) { i.value = initial[i.dataset.k]; if (i.oninput) i.oninput(); } }); }
  function hex(c) { var m = /rgb\((\d+),\s*(\d+),\s*(\d+)/.exec(c); if (!m) return c.trim(); return '#' + [m[1], m[2], m[3]].map(function (v) { return ('0' + parseInt(v, 10).toString(16)).slice(-2); }).join(''); }
  tokens.forEach(function (t) {
    var lab = document.createElement('label'), sp = document.createElement('span'), inp = document.createElement('input');
    sp.textContent = t.l; lab.appendChild(sp);
    if (t.t === 'color') { inp.type = 'color'; inp.value = hex(cs.getPropertyValue(t.k) || '#000000'); }
    else { inp.type = 'range'; inp.min = t.min; inp.max = t.max; inp.step = t.step; inp.value = t.v; var val = document.createElement('small'); val.textContent = t.v; lab.appendChild(val); inp.oninput = function () { val.textContent = inp.value; }; }
    inp.dataset.k = t.k; initial[t.k] = inp.value;
    inp.addEventListener('input', function () { root.style.setProperty(t.k, inp.value); changed[t.k] = inp.value; });
    lab.appendChild(inp); panel.appendChild(lab);
  });
  var row = document.createElement('div'); row.className = 'row';
  var copy = document.createElement('button'); copy.className = 'p'; copy.textContent = 'Copy CSS';
  var reset = document.createElement('button'); reset.textContent = 'Reset';
  var out = document.createElement('small'); out.textContent = 'Changes stay on this page only.';
  copy.onclick = function () {
    var lines = Object.keys(changed).map(function (k) { return k + ':' + changed[k] + ';'; });
    var css = ':root{' + lines.join('') + '}';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(css).then(function () { out.textContent = 'Copied: ' + css; }, function () { out.textContent = css; });
      else out.textContent = css;
    } catch (e) { out.textContent = css; }
  };
  reset.onclick = function () { resetAll(); out.textContent = 'Reset.'; };
  row.appendChild(copy); row.appendChild(reset); panel.appendChild(row); panel.appendChild(out);
  root.classList.add('tw-on'); document.body.appendChild(panel);
})();
