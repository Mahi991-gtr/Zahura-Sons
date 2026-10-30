(function () {
  'use strict';

  // Everything here is decoration. If anything fails, the page still works and nothing stays hidden.
  var doc = document, win = window;
  var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in win;

  /* 1. Wrap card photos so they can zoom on hover without spilling out of the card */
  doc.querySelectorAll('.pz > img.ph, .pc > img.pt').forEach(function (img) {
    var wrap = doc.createElement('span');
    wrap.className = 'imw';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
  });

  /* 2. Scroll progress bar and back-to-top button */
  var bar = doc.createElement('div');
  bar.className = 'prog';
  bar.setAttribute('aria-hidden', 'true');
  var toTop = doc.createElement('button');
  toTop.type = 'button';
  toTop.className = 'totop';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '&uarr;';
  doc.body.appendChild(bar);
  doc.body.appendChild(toTop);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      var max = doc.documentElement.scrollHeight - win.innerHeight;
      var y = win.pageYOffset || doc.documentElement.scrollTop || 0;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      toTop.classList.toggle('show', y > win.innerHeight * 0.9);
      ticking = false;
    });
  }
  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', function () {
    win.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  if (reduce || !hasIO) return;

  /* 3. Count-up for the big numbers (years are left alone) */
  function parseNumber(text) {
    var m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(text.trim());
    if (!m) return null;
    var raw = m[2];
    var num = parseFloat(raw.replace(/,/g, ''));
    if (!isFinite(num)) return null;
    if (!/[,.]/.test(raw) && num >= 1900 && num <= 2100) return null;
    return { pre: m[1], num: num, dec: (raw.split('.')[1] || '').length, comma: raw.indexOf(',') > -1, post: m[3] };
  }
  function format(p, n) {
    var s = n.toFixed(p.dec);
    if (p.comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec });
    return p.pre + s + p.post;
  }
  function countUp(el, p, finalText) {
    var start = null, duration = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = t < 1 ? format(p, p.num * eased) : finalText;
      if (t < 1) win.requestAnimationFrame(step);
    }
    win.requestAnimationFrame(step);
  }
  var counters = [];
  doc.querySelectorAll('.stats strong, .eqs strong').forEach(function (el) {
    var finalText = el.textContent;
    var p = parseNumber(finalText);
    if (!p) return;
    el.textContent = format(p, 0);
    counters.push({ el: el, p: p, finalText: finalText });
  });
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        for (var i = 0; i < counters.length; i++) {
          if (counters[i].el === e.target) { countUp(e.target, counters[i].p, counters[i].finalText); break; }
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c.el); });
  }

  /* 4. Scroll reveal. Only blocks that start BELOW the screen are prepared, so nothing ever
        flashes on page load and nothing in the first screen is hidden. */
  var DESCEND = '.two,.lead,.pjt,.sg,.pzg,.pcs,.cg,.stats,.eqs,.vals,.pg,.wg';
  var targets = [];
  function collect(parent) {
    Array.prototype.forEach.call(parent.children, function (el) {
      if (el.matches(DESCEND)) collect(el);
      else targets.push(el);
    });
  }
  function finish(el) {
    el.classList.remove('rv', 'in');
    el.style.removeProperty('--d');
  }

  try {
    doc.querySelectorAll('main > section > .w').forEach(collect);
    doc.querySelectorAll('main > .gal').forEach(function (g) { targets.push(g); });
    var vh = win.innerHeight || 800;
    targets = targets.filter(function (el) { return el.getBoundingClientRect().top > vh * 0.96; });
    targets.forEach(function (el) { el.classList.add('rv'); });
    void doc.body.offsetHeight; // lock in the hidden state so the transition runs

    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting || e.boundingClientRect.top < 0; });
      batch.sort(function (a, b) {
        return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left);
      });
      batch.forEach(function (e, i) {
        var el = e.target;
        io.unobserve(el);
        if (!e.isIntersecting) { finish(el); return; } // already scrolled past (e.g. jumped to an anchor)
        el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
        el.classList.add('in');
        var done = function () { finish(el); };
        el.addEventListener('transitionend', function h(ev) {
          if (ev.target === el && ev.propertyName === 'opacity') { el.removeEventListener('transitionend', h); done(); }
        });
        win.setTimeout(done, 2000);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } catch (err) {
    doc.querySelectorAll('.rv').forEach(finish); // fail open: show everything
  }
})();
