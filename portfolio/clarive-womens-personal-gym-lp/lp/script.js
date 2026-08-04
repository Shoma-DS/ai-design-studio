/* ==========================================================================
   CLARIVE 渋谷店 LP — インタラクション
   - スクロールリビール / 実績カウントアップ
   - ヘッダー開閉・追従CTAバー・トップへ戻る
   - ビフォーアフター比較スライダー（ドラッグ + キーボード）
   - お客様の声カルーセル（矢印 / ドット / スワイプ）
   - FAQアコーディオン
   - 予約フォーム（デモ動作）
   すべて prefers-reduced-motion: reduce を尊重する
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     0. ヒーロー背景ループ動画
     ポスター画像をLCPとして先に見せ、動画は読み込みが済んでから
     フェードインで差し替える。表示速度を落とさないための遅延読み込み。
     ------------------------------------------------------------------ */
  (function initHeroVideo() {
    var video = document.querySelector('.hero__video');
    var hero = document.getElementById('hero');
    if (!video || !hero) return;

    // 動きを減らす設定、データセーバー、低速回線では動画を読み込まない
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var slow = !!conn && (conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || ''));
    if (reduceMotion || slow) return;

    function load() {
      var sp = window.matchMedia('(max-width: 767px)').matches;
      var sources = sp
        ? [[video.dataset.spWebm, 'video/webm'], [video.dataset.spMp4, 'video/mp4']]
        : [[video.dataset.pcWebm, 'video/webm'], [video.dataset.pcMp4, 'video/mp4']];

      sources.forEach(function (pair) {
        if (!pair[0]) return;
        var s = document.createElement('source');
        s.src = pair[0];
        s.type = pair[1];
        video.appendChild(s);
      });

      video.addEventListener('canplay', function () {
        var played = video.play();
        // 自動再生が拒否された場合はポスター画像のまま据え置く
        if (played && typeof played.catch === 'function') {
          played.catch(function () { return; });
        }
        hero.classList.add('has-video');
        video.classList.add('is-ready');
      }, { once: true });

      video.addEventListener('error', function () {
        // 動画が無い・壊れている場合はポスター画像のままにする
        video.remove();
      }, { once: true });

      video.load();
    }

    // 初期表示の描画を邪魔しないよう、load後にさらに1フレーム遅らせる
    if (document.readyState === 'complete') requestAnimationFrame(load);
    else window.addEventListener('load', function () { requestAnimationFrame(load); });
  })();

  /* ------------------------------------------------------------------
     1. スクロールリビール
     ------------------------------------------------------------------ */
  (function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------------
     2. 実績数値のカウントアップ
     ------------------------------------------------------------------ */
  (function initCountUp() {
    var stats = document.getElementById('stats');
    if (!stats) return;
    var nums = stats.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function format(value, decimals) {
      return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    }

    function settle() {
      nums.forEach(function (el) {
        el.textContent = format(parseFloat(el.dataset.count), parseInt(el.dataset.decimals || '0', 10));
      });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) { settle(); return; }

    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();

        var duration = 1600;
        var startTime = null;

        function tick(now) {
          if (startTime === null) startTime = now;
          var progress = Math.min((now - startTime) / duration, 1);
          // easeOutCubic
          var eased = 1 - Math.pow(1 - progress, 3);
          nums.forEach(function (el) {
            var target = parseFloat(el.dataset.count);
            var decimals = parseInt(el.dataset.decimals || '0', 10);
            el.textContent = format(target * eased, decimals);
          });
          if (progress < 1) requestAnimationFrame(tick);
          else settle();
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });

    io.observe(stats);
  })();

  /* ------------------------------------------------------------------
     3. ハンバーガーメニュー
     ------------------------------------------------------------------ */
  (function initNav() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('spNav');
    if (!btn || !nav) return;

    function open() {
      nav.hidden = false;
      // hidden 解除直後に transition を効かせる
      requestAnimationFrame(function () { nav.classList.add('is-open'); });
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      nav.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
      if (reduceMotion) { nav.hidden = true; return; }
      window.setTimeout(function () {
        if (!nav.classList.contains('is-open')) nav.hidden = true;
      }, 300);
    }

    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') close(); else open();
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close();
    });
  })();

  /* ------------------------------------------------------------------
     4. ヘッダーの表示制御 / 追従CTAバー / トップへ戻る
     ------------------------------------------------------------------ */
  (function initScrollUI() {
    var header = document.getElementById('siteHeader');
    var spBar = document.getElementById('spBar');
    var toTop = document.getElementById('toTop');
    var hero = document.getElementById('hero');
    var hamburger = document.getElementById('hamburger');

    var lastY = window.pageYOffset;
    var ticking = false;

    function update() {
      var y = window.pageYOffset;
      var menuOpen = hamburger && hamburger.getAttribute('aria-expanded') === 'true';

      if (header) {
        // 下スクロールで隠し、上スクロールで戻す（メニュー展開中は常に表示）
        if (!menuOpen && y > 240 && y > lastY) header.classList.add('is-hidden');
        else header.classList.remove('is-hidden');
      }

      if (toTop) toTop.classList.toggle('is-shown', y > 600);

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    // 追従CTAバー: ヒーローを抜けたら表示
    if (spBar && hero) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            spBar.classList.toggle('is-shown', !entry.isIntersecting);
            spBar.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
          });
        }, { threshold: 0, rootMargin: '-60px 0px 0px 0px' });
        io.observe(hero);
      } else {
        spBar.classList.add('is-shown');
        spBar.setAttribute('aria-hidden', 'false');
      }
    }

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ------------------------------------------------------------------
     5. ビフォーアフター比較スライダー
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     ビフォーアフターの表示切り替え（2枚並べ ⇔ 重ねてスライダー）
     既定は2枚並べ。縦バーで重ねると全身を一度も見られず変化が読み取りにくいため。
     ------------------------------------------------------------------ */
  (function initCompareToggle() {
    document.querySelectorAll('[data-compare-toggle]').forEach(function (btn) {
      var card = btn.closest('.result');
      if (!card) return;
      var pair = card.querySelector('[data-compare]');
      var overlay = card.querySelector('[data-ba]');
      if (!pair || !overlay) return;

      btn.addEventListener('click', function () {
        var toOverlay = overlay.hidden;
        overlay.hidden = !toOverlay;
        pair.hidden = toOverlay;
        btn.setAttribute('aria-pressed', String(toOverlay));
        btn.innerHTML = toOverlay
          ? '<span class="result__toggle-icon" aria-hidden="true">▥</span>2枚を並べて見る'
          : '<span class="result__toggle-icon" aria-hidden="true">⇔</span>重ねて比べる';
      });
    });
  })();

  (function initBeforeAfter() {
    document.querySelectorAll('[data-ba]').forEach(function (root) {
      var handle = root.querySelector('[data-ba-handle]');
      if (!handle) return;
      var dragging = false;

      function setPos(percent) {
        var value = Math.max(0, Math.min(100, percent));
        root.style.setProperty('--pos', value + '%');
        var rounded = Math.round(value);
        handle.setAttribute('aria-valuenow', String(rounded));
        handle.setAttribute('aria-valuetext', rounded + 'パーセント');
      }

      function posFromEvent(e) {
        var rect = root.getBoundingClientRect();
        if (!rect.width) return 50;
        return ((e.clientX - rect.left) / rect.width) * 100;
      }

      // 初回に画面へ入ったとき、つまみを一度だけ左右に振って操作できることを伝える
      var hinted = false;
      function hint() {
        if (hinted || reduceMotion) return;
        hinted = true;
        root.classList.add('is-hinting');
        setTimeout(function () { root.classList.remove('is-hinting'); }, 1400);
      }
      if ('IntersectionObserver' in window) {
        var hintIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            hintIo.unobserve(entry.target);
            setTimeout(hint, 400);
          });
        }, { threshold: 0.4 });
        hintIo.observe(root);
      }

      // 画像の上で掴むとブラウザ標準の画像ドラッグが走り、pointercancel で
      // 追従が止まってしまうため、ドラッグ開始そのものを止める
      root.addEventListener('dragstart', function (e) { e.preventDefault(); });

      root.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // 画像のネイティブドラッグを止める。ただし preventDefault でフォーカスも
        // 失われるため、キーボード操作用に自前でつまみへ移す
        e.preventDefault();
        handle.focus({ preventScroll: true });
        dragging = true;
        hinted = true;
        root.classList.remove('is-hinting');
        root.setPointerCapture(e.pointerId);
        setPos(posFromEvent(e));
      });

      root.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        setPos(posFromEvent(e));
      });

      ['pointerup', 'pointercancel'].forEach(function (type) {
        root.addEventListener(type, function (e) {
          if (!dragging) return;
          dragging = false;
          if (root.hasPointerCapture && root.hasPointerCapture(e.pointerId)) {
            root.releasePointerCapture(e.pointerId);
          }
        });
      });

      handle.addEventListener('keydown', function (e) {
        var current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
        var step = e.shiftKey ? 10 : 2;
        var next = null;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = current - step;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = current + step;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = 100;
        if (next === null) return;
        e.preventDefault();
        setPos(next);
      });
    });
  })();

  /* ------------------------------------------------------------------
     6. お客様の声カルーセル
     ------------------------------------------------------------------ */
  (function initCarousel() {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-carousel-track]');
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      var dotsWrap = root.querySelector('[data-carousel-dots]');
      var ctrl = root.querySelector('[data-carousel-ctrl]');
      if (!track) return;

      var slides = Array.prototype.slice.call(track.children);
      if (!slides.length) return;

      var index = 0;
      var maxIndex = 0;
      var step = 0;

      function measure() {
        var first = slides[0];
        var gap = parseFloat(window.getComputedStyle(track).columnGap || '0') || 0;
        var slideWidth = first.getBoundingClientRect().width;
        step = slideWidth + gap;
        var viewport = track.parentElement.getBoundingClientRect().width;
        var perView = step > 0 ? Math.max(1, Math.round((viewport + gap) / step)) : 1;
        maxIndex = Math.max(0, slides.length - perView);
        if (index > maxIndex) index = maxIndex;
      }

      function renderDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        for (var i = 0; i <= maxIndex; i++) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-label', (i + 1) + '番目へ');
          dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
          (function (target) {
            dot.addEventListener('click', function () { go(target); });
          })(i);
          dotsWrap.appendChild(dot);
        }
      }

      function apply() {
        track.style.transform = 'translateX(' + (-index * step) + 'px)';
        if (prev) prev.disabled = index <= 0;
        if (next) next.disabled = index >= maxIndex;
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
          });
        }
        if (ctrl) ctrl.hidden = maxIndex === 0;
      }

      function go(target) {
        index = Math.max(0, Math.min(maxIndex, target));
        apply();
      }

      function refresh() {
        measure();
        renderDots();
        apply();
      }

      if (prev) prev.addEventListener('click', function () { go(index - 1); });
      if (next) next.addEventListener('click', function () { go(index + 1); });

      // スワイプ
      var startX = null;
      var startY = null;
      track.addEventListener('pointerdown', function (e) {
        startX = e.clientX; startY = e.clientY;
      });
      track.addEventListener('pointerup', function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        startX = null; startY = null;
        if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
        go(dx < 0 ? index + 1 : index - 1);
      });
      track.addEventListener('pointercancel', function () { startX = null; startY = null; });

      var resizeTimer = null;
      window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(refresh, 150);
      });

      refresh();
      // Webフォント読み込み後に幅が変わるケースに備える
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      window.addEventListener('load', refresh);
    });
  })();

  /* ------------------------------------------------------------------
     6.5 背景ループ動画（16:9・無音・8秒）
     prefers-reduced-motion: reduce のときは自動再生を止め、
     poster 画像を静止表示する。
     ------------------------------------------------------------------ */
  (function initLoopVideo() {
    var videos = document.querySelectorAll('.movie-player');
    if (!videos.length) return;

    videos.forEach(function (video) {
      if (reduceMotion) {
        video.autoplay = false;
        video.removeAttribute('autoplay');
        video.loop = false;
        try { video.pause(); } catch (e) { /* noop */ }
        // 読み込み後に自動で走り出すのを防ぐ
        video.addEventListener('play', function () { video.pause(); });
        return;
      }
      // iOS Safari では属性だけで再生されないことがあるため明示的に試行する
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () { /* 自動再生がブロックされた場合は poster のまま */ });
      }
    });
  })();

  /* ------------------------------------------------------------------
     7. FAQアコーディオン
     ------------------------------------------------------------------ */
  (function initFaq() {
    document.querySelectorAll('.faq-item__q').forEach(function (btn) {
      var item = btn.closest('.faq-item');
      if (!item) return;
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        item.classList.toggle('is-open', !isOpen);
      });
    });
  })();

  /* ------------------------------------------------------------------
     8. 予約フォーム（デモ動作）
     実案件では、ここで予約システム（RESERVA / STORES予約 等）または
     自社バックエンドの API へ POST する。現状は送信を行わない。
     ------------------------------------------------------------------ */
  (function initForm() {
    var form = document.getElementById('reserveForm');
    var thanks = document.getElementById('formThanks');
    if (!form || !thanks) return;

    function clearError(field) {
      field.classList.remove('is-error');
      field.removeAttribute('aria-invalid');
      var next = field.parentElement.querySelector('.form__error');
      if (next) next.remove();
    }

    function showError(field, message) {
      field.classList.add('is-error');
      field.setAttribute('aria-invalid', 'true');
      if (field.parentElement.querySelector('.form__error')) return;
      var p = document.createElement('p');
      p.className = 'form__error';
      p.textContent = message;
      field.parentElement.appendChild(p);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // デモのため実送信は行わない

      var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var firstInvalid = null;

      fields.forEach(function (field) {
        clearError(field);
        var value = field.value.trim();
        var message = '';
        if (!value) {
          message = 'ご入力ください。';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = 'メールアドレスの形式をご確認ください。';
        } else if (field.type === 'tel' && !/^[0-9+\-() ]{10,}$/.test(value)) {
          message = '電話番号の形式をご確認ください。';
        }
        if (message) {
          showError(field, message);
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.hidden = true;
      thanks.hidden = false;
      thanks.focus && thanks.focus();
      thanks.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () { clearError(field); });
    });
  })();

})();
