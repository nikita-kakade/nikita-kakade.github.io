/* Nikita Kakade — progressive enhancement only. The page is complete without this file.
   Every hidden or collapsed state in styles.css is gated on a class this file adds itself
   (.js-nav, .js-reveal), so if this file fails to load, nothing stays hidden. Gallery tiles are
   plain links to the full image, video or YouTube page until this file turns them into a lightbox. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var toArray = function (list) { return Array.prototype.slice.call(list); };

  /* ---------- 1. Mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  if (header && toggle && menu) {
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });

    // Close after choosing a link, on Escape, on a click outside, or when focus leaves the header.
    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setOpen(false);
    });
    header.addEventListener('focusout', function (e) {
      if (isOpen() && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false);
    });

    var desktop = window.matchMedia('(min-width: 52.0625rem)');
    var onBreakpoint = function () { if (desktop.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);

    toggle.hidden = false;
    doc.classList.add('js-nav');   // only now collapse the links behind the button
  }

  /* ---------- 2. Gallery lightbox (native <dialog>) ---------- */
  var dialog = document.getElementById('lightbox');
  var tiles = toArray(document.querySelectorAll('.g-tile[data-type]'));

  if (dialog && typeof dialog.showModal === 'function' && tiles.length) {
    var lbMedia = dialog.querySelector('.lb-media');
    var lbTitle = dialog.querySelector('.lb-title');
    var lbMeta = dialog.querySelector('.lb-meta');
    var lbDesc = dialog.querySelector('.lb-desc');
    var lbCount = dialog.querySelector('.lb-count');
    var lbClose = dialog.querySelector('.lb-close');
    // Previous / Next keep focus on the button, so announce the new item for screen readers.
    var lbLive = document.createElement('p');
    lbLive.className = 'visually-hidden';
    lbLive.setAttribute('aria-live', 'polite');
    dialog.appendChild(lbLive);
    var current = 0;
    var returnTo = null;
    var byId = {};
    tiles.forEach(function (t, i) { byId[t.id] = i; });

    var textOf = function (root, sel) {
      var el = root && root.querySelector(sel);
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    };

    // Pause and unload any video (stops the download too) and drop any YouTube iframe.
    var clearMedia = function () {
      var video = lbMedia.querySelector('video');
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      var hadFocus = lbMedia.contains(document.activeElement);
      lbMedia.textContent = '';
      if (hadFocus) lbClose.focus();
    };

    var render = function (index) {
      clearMedia();
      current = (index + tiles.length) % tiles.length;
      var tile = tiles[current];
      var item = tile.closest('.g-item');
      var type = tile.getAttribute('data-type');
      var title = textOf(item, '.g-title');
      var el;

      if (type === 'image') {
        var thumb = tile.querySelector('img');
        el = document.createElement('img');
        el.src = tile.getAttribute('href');
        el.alt = thumb ? thumb.alt : title;
        if (tile.getAttribute('data-w')) el.width = +tile.getAttribute('data-w');
        if (tile.getAttribute('data-h')) el.height = +tile.getAttribute('data-h');
      } else if (type === 'video') {
        el = document.createElement('video');
        el.controls = true;
        el.playsInline = true;
        el.preload = 'metadata';
        el.poster = tile.getAttribute('data-poster') || '';
        el.setAttribute('aria-label', title);
        el.src = tile.getAttribute('href');
      } else {
        // YouTube: privacy-enhanced embed, created on open and removed on close
        el = document.createElement('iframe');
        el.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(tile.getAttribute('data-yt')) + '?autoplay=1&rel=0';
        el.title = title + ' (YouTube video)';
        el.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
        el.setAttribute('allowfullscreen', '');
        el.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      }

      lbMedia.appendChild(el);
      lbTitle.textContent = title;
      lbMeta.textContent = textOf(item, '.g-meta');
      lbDesc.textContent = tile.getAttribute('data-desc') || '';
      lbCount.textContent = (current + 1) + ' / ' + tiles.length;
      lbLive.textContent = dialog.open ? (current + 1) + ' of ' + tiles.length + ': ' + title : '';

      if (type === 'video') {
        var playing = el.play();
        if (playing && playing.catch) playing.catch(function () {});   // the controls are still there
      }
    };

    var openAt = function (index, trigger) {
      returnTo = trigger || tiles[index];
      render(index);
      if (!dialog.open) {
        dialog.showModal();
        doc.classList.add('lb-open');
      }
      lbClose.focus();
    };

    // Escape fires the dialog's own cancel → close, so every way out ends here.
    dialog.addEventListener('close', function () {
      clearMedia();
      doc.classList.remove('lb-open');
      if (returnTo && typeof returnTo.focus === 'function') returnTo.focus();
      returnTo = null;
    });

    lbClose.addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.lb-prev').addEventListener('click', function () { render(current - 1); });
    dialog.querySelector('.lb-next').addEventListener('click', function () { render(current + 1); });

    // A click on the dark background (not on the picture, video or controls) closes it.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target === lbMedia || e.target.classList.contains('lb-inner')) dialog.close();
    });

    dialog.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var tag = e.target && e.target.tagName;
      if (tag === 'VIDEO' || tag === 'IFRAME') return;   // leave arrow keys to the video's own seeking
      e.preventDefault();
      render(current + (e.key === 'ArrowRight' ? 1 : -1));
    });

    // Tiles, and links elsewhere on the page that point at a tile, open the lightbox.
    // Modified clicks (new tab, etc.) keep the plain link behaviour.
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest('.g-tile[data-type], a[data-gallery-open]');
      if (!link) return;
      var index = link.hasAttribute('data-gallery-open') ? byId[link.getAttribute('data-gallery-open')] : tiles.indexOf(link);
      if (index === undefined || index < 0) return;
      e.preventDefault();
      openAt(index, link);
    });

    // Now that these open in place, drop the "opens YouTube in a new tab" notes and the ↗ cues.
    toArray(document.querySelectorAll('.nojs-note')).forEach(function (n) { n.parentNode.removeChild(n); });
    toArray(document.querySelectorAll('a[data-gallery-open] .ext-cue')).forEach(function (n) { n.hidden = true; });
    tiles.concat(toArray(document.querySelectorAll('a[data-gallery-open]'))).forEach(function (a) {
      a.setAttribute('aria-haspopup', 'dialog');
    });
  }

  /* ---------- 3. Print: show every "Read more" and every revealed block ---------- */
  var reveals = toArray(document.querySelectorAll('.reveal'));
  var openedForPrint = [];
  window.addEventListener('beforeprint', function () {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    openedForPrint = toArray(document.querySelectorAll('details:not([open])'));
    openedForPrint.forEach(function (d) { d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
  });

  /* ---------- 4. Scroll reveal ---------- */
  if (reduceMotion || !('IntersectionObserver' in window) || !reveals.length) return;

  var inView = function (el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  // Anything already on screen is marked visible first, so switching on the hidden state never flashes it.
  var pending = [];
  reveals.forEach(function (el) {
    if (inView(el)) el.classList.add('is-in');
    else pending.push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  pending.forEach(function (el) {
    // Stagger siblings slightly so rows and lists settle in sequence; clear the delay once shown
    // so later transitions on the same element are not held back.
    var index = 0;
    var sib = el.previousElementSibling;
    while (sib) {
      if (sib.classList.contains('reveal')) index += 1;
      sib = sib.previousElementSibling;
    }
    if (index > 0) {
      el.style.transitionDelay = Math.min(index, 5) * 70 + 'ms';
      var clearDelay = function (e) {
        if (e.target !== el) return;
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', clearDelay);
      };
      el.addEventListener('transitionend', clearDelay);
    }
    io.observe(el);
  });

  doc.classList.add('js-reveal');

  // Safety net for in-page jumps: reveal whatever lands on screen.
  window.addEventListener('hashchange', function () {
    window.setTimeout(function () {
      reveals.forEach(function (el) { if (inView(el)) el.classList.add('is-in'); });
    }, 60);
  });
})();
