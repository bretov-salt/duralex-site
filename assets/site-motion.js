/* DuraLex site motion: a one-time word reveal on the hero headline and a counter on the matters figure.
   Runs once, respects prefers-reduced-motion, and loads the tweak panel only when the URL carries ?tweak. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  // Word reveal: wrap each word of the hero headline in a span; CSS animates them in order.
  function reveal() {
    var h = document.querySelector('.hero h1');
    if (!h || reduce || h.dataset.split) return;
    var i = 0;
    function wrap(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span');
          s.className = 'wd'; s.style.setProperty('--i', i++); s.textContent = part;
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'SPAN') {
        Array.prototype.slice.call(node.childNodes).forEach(wrap);
      }
    }
    wrap(h);
    h.dataset.split = '1';
    requestAnimationFrame(function () { html.classList.add('words-in'); });
  }

  // Counter: the first number with a comma inside .founder p counts up from zero when it scrolls into view.
  function counter() {
    var p = document.querySelector('.founder p');
    if (!p) return;
    var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), n, m;
    while ((n = walker.nextNode())) { m = /\d{1,3}(,\d{3})+/.exec(n.textContent); if (m) break; }
    if (!m) return;
    var target = parseInt(m[0].replace(/,/g, ''), 10), before = n.textContent.slice(0, m.index), after = n.textContent.slice(m.index + m[0].length);
    var span = document.createElement('span'); span.className = 'num'; span.textContent = m[0];
    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(before)); frag.appendChild(span); frag.appendChild(document.createTextNode(after));
    n.parentNode.replaceChild(frag, n);
    if (reduce || !('IntersectionObserver' in window)) return;
    var done = false;
    var io = new IntersectionObserver(function (es) {
      if (done || !es.some(function (e) { return e.isIntersecting; })) return;
      done = true; io.disconnect();
      var t0 = null, dur = 1400;
      function step(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        span.textContent = Math.round(target * e).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(step); else span.textContent = target.toLocaleString('en-US');
      }
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(span);
  }

  function tweak() {
    if (!/[?&]tweak(=|&|$)/.test(location.search)) return;
    var s = document.createElement('script'); s.src = '/assets/tweak.js'; s.defer = true; document.head.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { reveal(); counter(); tweak(); });
  else { reveal(); counter(); tweak(); }
})();

/* Hero demo: four stages that play on their own, pause on hover or focus, and jump when a tab is pressed. */
(function () {
  var box = document.getElementById('heroDemo');
  if (!box) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs = Array.prototype.slice.call(box.querySelectorAll('[role=tab]'));
  var panes = Array.prototype.slice.call(box.querySelectorAll('.hd-pane'));
  var MS = 5200, timer = null, cur = 0, paused = false;
  box.style.setProperty('--hd-ms', MS + 'ms');
  function money(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
  function count(pane) {
    var id = runId;
    pane.querySelectorAll('.hd-num').forEach(function (el, i) {
      var target = parseInt(el.getAttribute('data-n'), 10); el.textContent = money(reduce ? target : 0);
      if (reduce) return;
      var t0 = null, delay = 300 + i * 400, dur = 900;
      function step(t) { if (t0 === null) t0 = t; var k = Math.min(1, Math.max(0, (t - t0 - delay) / dur)), e = 1 - Math.pow(1 - k, 3); el.textContent = money(target * e); if (id !== runId) return; if (k < 1 && pane.classList.contains('on')) requestAnimationFrame(step); else if (k >= 1) el.textContent = money(target); }
      requestAnimationFrame(step);
    });
  }
  function show(i, fromUser) {
    runId++;
    cur = (i + panes.length) % panes.length;
    tabs.forEach(function (t, j) { var on = j === cur; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; if (fromUser && on) t.focus({ preventScroll: true }); });
    panes.forEach(function (p, j) { p.hidden = j !== cur; p.classList.remove('on'); });
    void panes[cur].offsetWidth; panes[cur].classList.add('on'); count(panes[cur]);
    box.classList.remove('run'); void box.offsetWidth; box.classList.add('run');
    schedule();
  }
  function schedule() { clearTimeout(timer); if (reduce || paused) return; timer = setTimeout(function () { show(cur + 1); }, MS); }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(parseInt(t.dataset.s, 10), true); });
    t.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); } if (e.key === 'Home') { e.preventDefault(); show(0, true); } if (e.key === 'End') { e.preventDefault(); show(panes.length - 1, true); } });
  });
  function sync(next) { var hov = box.matches(':hover'), foc = box.contains(next || document.activeElement); var p = hov || foc; if (p === paused) return; paused = p; box.classList.toggle('paused', p); if (p) clearTimeout(timer); else schedule(); }
  box.addEventListener('mouseenter', function () { sync(); }); box.addEventListener('mouseleave', function () { sync(); });
  box.addEventListener('focusin', function () { sync(); }); box.addEventListener('focusout', function (e) { sync(e.relatedTarget); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
  var runId = 0, mq = window.matchMedia ? window.matchMedia('(min-width: 1000px)') : null, live = false;
  function start() { if (live) return; live = true; show(0); }
  function stop() { live = false; clearTimeout(timer); runId++; box.classList.remove('run'); }
  if (mq) { (mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq)); }
  function onMq(e) { if (e.matches) start(); else stop(); }
  if (!mq || mq.matches) start();
})();
