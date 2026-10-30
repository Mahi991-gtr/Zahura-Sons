(function () {
  'use strict';
  var CFG = window.ZAHURA_CONFIG || {};
  var doc = document, win = window;
  var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Header, menu and hero parallax ---------- */
  var header = doc.querySelector('.site-header');
  var menu = header && header.querySelector('.menu');
  var links = doc.getElementById('site-nav');
  var hero = doc.querySelector('.hero');
  var bg = hero && hero.querySelector('.hero-bg');
  var hin = hero && hero.querySelector('.hero-in');
  var cue = hero && hero.querySelector('.hero-scroll');
  var heroH = hero ? hero.offsetHeight : 0;
  var lastY = win.pageYOffset || 0;
  var queued = false;

  function menuOpen() { return !!(links && links.classList.contains('open')); }
  function setMenu(open) {
    if (!menu || !links) return;
    links.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    doc.body.classList.toggle('noscroll', open);
    if (open && header) header.classList.remove('hide');
  }
  if (menu && links) {
    menu.addEventListener('click', function () { setMenu(!menuOpen()); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen()) { setMenu(false); menu.focus(); } });
    win.addEventListener('resize', function () { if (win.innerWidth >= 1100 && menuOpen()) setMenu(false); });
  }

  // One scroll handler: header state + hero parallax. The hero photo moves slower than the page,
  // so the next section slides up over it (no zoom animation).
  function frame() {
    queued = false;
    var y = Math.max(0, win.pageYOffset || 0);
    if (header) {
      header.classList.toggle('top', y < 40);
      if (!menuOpen()) {
        if (y > 520 && y > lastY + 4) header.classList.add('hide');
        else if (y < lastY - 4 || y <= 520) header.classList.remove('hide');
      }
    }
    lastY = y;
    if (hero && bg && !reduce && y <= heroH * 1.2) {
      bg.style.transform = 'translate3d(0,' + (y * 0.4).toFixed(1) + 'px,0)';
      if (hin) {
        hin.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0)';
        hin.style.opacity = (1 - Math.min(1, y / (heroH * 0.7))).toFixed(3);
      }
      if (cue) cue.style.opacity = (1 - Math.min(1, y / 160)).toFixed(3);
    }
  }
  function queue() { if (!queued) { queued = true; win.requestAnimationFrame(frame); } }
  win.addEventListener('scroll', queue, { passive: true });
  win.addEventListener('resize', function () { heroH = hero ? hero.offsetHeight : 0; queue(); });
  win.addEventListener('load', function () { heroH = hero ? hero.offsetHeight : 0; frame(); });
  frame();

  if (cue && hero) {
    cue.addEventListener('click', function (e) {
      e.preventDefault();
      win.scrollTo({ top: hero.offsetHeight, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Lightbox gallery: arrows, keyboard, swipe, counter ---------- */
  var box = doc.createElement('div');
  box.className = 'lb';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<button class="lb-x" type="button" aria-label="Close photo">&times;</button>' +
    '<button class="lb-n lb-p" type="button" aria-label="Previous photo">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lb-n lb-f" type="button" aria-label="Next photo">&#8250;</button>' +
    '<div class="lb-c"></div>';
  doc.body.appendChild(box);
  var big = box.querySelector('img'), closeBtn = box.querySelector('.lb-x');
  var prevBtn = box.querySelector('.lb-p'), nextBtn = box.querySelector('.lb-f'), cap = box.querySelector('.lb-c');
  var group = [], idx = 0, lastFocus = null;
  var SEL = '.pg .ph, .cs, .ws, .gal .gs';

  function show(i) {
    idx = (i + group.length) % group.length;
    var img = group[idx];
    big.style.animation = 'none'; void big.offsetWidth; big.style.animation = '';
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    cap.textContent = (img.alt || '') + (group.length > 1 ? '  ·  ' + (idx + 1) + ' / ' + group.length : '');
    prevBtn.hidden = nextBtn.hidden = group.length < 2;
    [group[(idx + 1) % group.length], group[(idx - 1 + group.length) % group.length]].forEach(function (n) {
      var pre = new Image(); pre.src = n.currentSrc || n.src;
    });
  }
  function openBox(img) {
    lastFocus = img;
    var scope = img.closest('.pg, .gal, .cg, .wg') || img.parentNode;
    group = Array.prototype.slice.call(scope.querySelectorAll(SEL));
    box.hidden = false;
    doc.body.classList.add('noscroll');
    show(group.indexOf(img));
    closeBtn.focus();
  }
  function closeBox() {
    box.hidden = true;
    big.removeAttribute('src');
    doc.body.classList.remove('noscroll');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  doc.querySelectorAll(SEL).forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { openBox(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(img); }
    });
  });
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target === closeBtn) closeBox(); });
  doc.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') closeBox();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
  });
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });

  /* ---------- Projects: filter chips + deep links (projects.html#shasha-denims) ---------- */
  function slug(s) { return s.toLowerCase().replace(/&amp;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  var arts = doc.querySelectorAll('article.pjt');
  if (arts.length) {
    var items = [];
    arts.forEach(function (a) {
      var h = a.querySelector('h3'); if (!h) return;
      var name = h.textContent.trim();
      var base = slug(name).replace(/-ltd$/, '').replace(/-bd$/, '');
      a.id = a.id || base;
      items.push({ el: a, name: name, short: name.replace(/\s+Ltd\.?$/i, '').replace(/\s+BD$/i, '') });
    });
    var lede = doc.querySelector('#projects .lede');
    var bar = doc.createElement('div');
    bar.className = 'chips';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Filter projects');
    var mk = function (label, key) {
      var b = doc.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = label; b.dataset.key = key;
      b.setAttribute('aria-pressed', 'false');
      bar.appendChild(b); return b;
    };
    mk('All projects', 'all');
    items.forEach(function (it) { mk(it.short, it.el.id); });
    lede.parentNode.insertBefore(bar, lede.nextSibling);

    // The selector is a normal block at the top of the list: it scrolls away with the page.
    var apply = function (key, scroll) {
      bar.querySelectorAll('.chip').forEach(function (c) {
        var on = c.dataset.key === key;
        c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on));
      });
      items.forEach(function (it) {
        var hide = key !== 'all' && it.el.id !== key;
        it.el.hidden = hide;
        if (!hide) { it.el.classList.remove('rv', 'in'); it.el.classList.add('flt'); }
      });
      if (scroll) bar.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key); } catch (e) {}
    };
    bar.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (c) apply(c.dataset.key, false);
    });
    var hash = decodeURIComponent((location.hash || '').slice(1));
    var valid = items.some(function (it) { return it.el.id === hash; });
    apply(valid ? hash : 'all', valid);
    win.addEventListener('hashchange', function () {
      var h = decodeURIComponent(location.hash.slice(1));
      if (items.some(function (it) { return it.el.id === h; })) apply(h, true);
    });
  }

  /* ---------- Home page project cards link to their project ---------- */
  doc.querySelectorAll('figure.pz').forEach(function (fig) {
    var cap = fig.querySelector('figcaption'); if (!cap) return;
    var name = cap.childNodes[0].textContent.trim();
    var id = slug(name).replace(/-ltd$/, '').replace(/-bd$/, '');
    var a = doc.createElement('a');
    a.href = 'projects.html#' + id;
    a.className = 'pz-l';
    a.setAttribute('aria-label', 'View ' + name + ' project');
    fig.appendChild(a);
  });

  /* ---------- Contact details + form (no backend needed) ---------- */
  var form = doc.getElementById('contact-form');
  if (form) {
    var tel = doc.getElementById('ct-phone'), mail = doc.getElementById('ct-email');
    if (CFG.PHONE && tel) {
      var pa = doc.getElementById('ct-phone-a');
      // PHONE may be a single string or an array of numbers. Keep every number
      // individually clickable instead of treating an array like a string.
      var phones = (Array.isArray(CFG.PHONE) ? CFG.PHONE : [CFG.PHONE])
        .map(function (number) { return String(number || '').trim(); })
        .filter(Boolean);
      if (pa && phones.length) {
        pa.textContent = phones[0];
        pa.href = 'tel:' + phones[0].replace(/[^\d+]/g, '');
        phones.slice(1).forEach(function (number) {
          tel.appendChild(doc.createTextNode(' / '));
          var link = doc.createElement('a');
          link.textContent = number;
          link.href = 'tel:' + number.replace(/[^\d+]/g, '');
          tel.appendChild(link);
        });
        tel.hidden = false;
      }
    }
    if (CFG.EMAIL && mail) {
      var ma = doc.getElementById('ct-email-a');
      ma.textContent = CFG.EMAIL; ma.href = 'mailto:' + CFG.EMAIL; mail.hidden = false;
    }
    var note = doc.getElementById('form-note');
    if (!CFG.WEB3FORMS_KEY && CFG.EMAIL && note) {
      note.textContent = 'Sending will open your email app with the message ready to go.';
      note.hidden = false;
    }

    var status = doc.getElementById('form-status');
    var submit = form.querySelector('button[type="submit"]');
    var say = function (cls, msg) { status.className = cls; status.textContent = msg; };

    // Inline validation feedback as the visitor leaves each field
    form.querySelectorAll('input[required], textarea[required]').forEach(function (f) {
      f.addEventListener('blur', function () { f.classList.toggle('bad', !f.checkValidity()); });
      f.addEventListener('input', function () { if (f.checkValidity()) f.classList.remove('bad'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var d = {};
      new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
      if (d.botcheck) { say('ok', 'Thank you. Your message has been sent.'); form.reset(); return; } // spam trap

      if (CFG.WEB3FORMS_KEY) {
        say('', 'Sending…'); submit.disabled = true; submit.classList.add('loading');
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CFG.WEB3FORMS_KEY,
            subject: 'New website enquiry from ' + d.name,
            from_name: "Zahura & Son's website",
            name: d.name, email: d.email, phone: d.phone || '-', message: d.message
          })
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j && j.success) { form.reset(); say('ok', 'Thank you. Your message has been sent and we will get back to you soon.'); }
            else say('err', (j && j.message) || 'Something went wrong. Please try again.');
          })
          .catch(function () { say('err', 'We could not send your message. Please check your connection and try again' + (CFG.EMAIL ? ', or email us at ' + CFG.EMAIL + '.' : '.')); })
          .then(function () { submit.disabled = false; submit.classList.remove('loading'); });
      } else if (CFG.EMAIL) {
        var body = 'Name: ' + d.name + '\nEmail: ' + d.email + '\nPhone: ' + (d.phone || '-') + '\n\n' + d.message;
        win.location.href = 'mailto:' + CFG.EMAIL + '?subject=' + encodeURIComponent('Website enquiry from ' + d.name) + '&body=' + encodeURIComponent(body);
        say('ok', 'Your email app should now open with the message ready to send.');
      } else {
        say('err', 'The contact form has not been connected yet. Open js/config.js and add an email address or a Web3Forms key.');
      }
    });
  }
})();
