/*!
 * WP GSAP Animate — presets
 *
 * 各プリセットは "@preset <id>" 〜 "@endpreset" で囲む。
 * ビルド時にこのマーカーで切り出し、使うものだけをスニペットへ入れる。
 * マーカーを崩さないこと。
 */
(function () {
  "use strict";
  var W = window.WPGSAP;
  var P = W.presets, o = W.o, trig = W.trig, base = W.base, children = W.children;

  /* @preset fade-up */
  P["fade-up"] = function (a, el) {
    gsap.set(el, { opacity: 0, y: o(a, "distance") });
    gsap.to(el, Object.assign(base(a), { opacity: 1, y: 0, scrollTrigger: trig(a, el) }));
  };
  /* @endpreset */

  /* @preset fade-in */
  P["fade-in"] = function (a, el) {
    gsap.set(el, { opacity: 0 });
    gsap.to(el, Object.assign(base(a), { opacity: 1, scrollTrigger: trig(a, el) }));
  };
  /* @endpreset */

  /* @preset slide-in */
  P["slide-in"] = function (a, el) {
    var dir = o(a, "direction"), d = o(a, "distance") * 2;
    var from = { left: { x: -d }, right: { x: d }, up: { y: d }, down: { y: -d } }[dir] || { x: -d };
    gsap.set(el, Object.assign({ opacity: 0 }, from));
    gsap.to(el, Object.assign(base(a), { opacity: 1, x: 0, y: 0, scrollTrigger: trig(a, el) }));
  };
  /* @endpreset */

  /* @preset scale-in */
  P["scale-in"] = function (a, el) {
    gsap.set(el, { opacity: 0, scale: 0.8 });
    gsap.to(el, Object.assign(base(a), {
      opacity: 1, scale: 1,
      ease: o(a, "ease") === W.defaults.ease ? "back.out(1.4)" : o(a, "ease"),
      scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset blur-in */
  P["blur-in"] = function (a, el) {
    gsap.set(el, { opacity: 0, filter: "blur(14px)" });
    gsap.to(el, Object.assign(base(a), {
      opacity: 1, filter: "blur(0px)", scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset flip-in */
  P["flip-in"] = function (a, el) {
    var p = el.parentElement;
    if (p) p.style.perspective = "900px";
    gsap.set(el, { opacity: 0, rotationX: -75, transformOrigin: "50% 50% -60px" });
    gsap.to(el, Object.assign(base(a), {
      opacity: 1, rotationX: 0, ease: "power3.out", scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset box-reveal */
  // 要素の上に色のボックスが被さっていて、それが横に抜けて中身が現れる。
  //
  // 大事なのは「最初はボックスが覆っていて、中身が見えない」こと。
  // ボックスを画面外から走り込ませる（sweep）と、走り込むまでの間
  // 中身が丸見えになってしまうので、その場合は中身を明示的に隠す。
  P["box-reveal"] = function (a, el) {
    var op = a.options || {};
    var color = op.color || "#111111";
    var dir = op.direction || "right";   // ボックスが抜けていく向き
    var sweep = op.sweep === true;       // 既定はfalse（最初から覆っている）

    var cs = window.getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    el.style.overflow = "hidden";

    // 中身を包む（sweep のとき、覆われるまで隠しておくため）
    W.cacheText(el);
    var inner = document.createElement("span");
    inner.style.display = "block";
    inner.innerHTML = el.innerHTML;
    el.innerHTML = "";
    el.appendChild(inner);

    var box = document.createElement("span");
    box.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;" +
      "background:" + color + ";will-change:transform;z-index:2;pointer-events:none;";
    el.appendChild(box);

    var out = (dir === "left") ? -101 : 101;   // 101%にして境界の線残りを防ぐ

    var tl = gsap.timeline({
      delay: o(a, "delay"),
      scrollTrigger: trig(a, el),
      onComplete: function () { if (box.parentNode) box.parentNode.removeChild(box); }
    });

    if (sweep) {
      // ボックスが反対側から走り込んでくる。到着するまで中身は隠す。
      gsap.set(inner, { opacity: 0 });
      gsap.set(box, { xPercent: -out });
      tl.to(box, { xPercent: 0, duration: o(a, "duration") * 0.55, ease: "power3.out" })
        .set(inner, { opacity: 1 })          // 覆われた状態で中身を出す
        .to(box, { xPercent: out, duration: o(a, "duration") * 0.75, ease: "power3.inOut" }, "+=0.08");
    } else {
      // 最初からボックスが覆っている。そこから抜けるだけ。
      gsap.set(box, { xPercent: 0 });
      tl.to(box, { xPercent: out, duration: o(a, "duration"), ease: "power3.inOut" });
    }
  };
  /* @endpreset */

  /* @preset split-chars */
  P["split-chars"] = function (a, el) {
    var c = W.splitChars(el);
    if (!c.length) return;
    gsap.set(c, { opacity: 0, y: o(a, "distance") * 0.6 });
    gsap.to(c, Object.assign(base(a), {
      opacity: 1, y: 0, duration: o(a, "duration") * 0.7,
      stagger: o(a, "stagger") * 0.5, scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */


  /* @preset split-lines */
  P["split-lines"] = function (a, el) {
    var l = W.splitLines(el);
    if (!l.length) return;
    gsap.set(l, { yPercent: 110 });
    gsap.to(l, Object.assign(base(a), {
      yPercent: 0, ease: "power3.out",
      stagger: o(a, "stagger") * 1.6, scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset typewriter */
  P["typewriter"] = function (a, el) {
    var c = W.splitChars(el);
    if (!c.length) return;
    gsap.set(c, { opacity: 0 });
    gsap.to(c, {
      opacity: 1, duration: 0.01, delay: o(a, "delay"),
      stagger: (a.options && a.options.speed) || 0.045,
      scrollTrigger: trig(a, el)
    });
  };
  /* @endpreset */

  /* @preset text-mask */
  P["text-mask"] = function (a, el) {
    W.cacheText(el);
    var inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.innerHTML = el.innerHTML;
    el.innerHTML = "";
    el.style.display = el.style.display || "block";
    el.style.overflow = "hidden";
    el.appendChild(inner);
    gsap.set(inner, { yPercent: 110 });
    gsap.to(inner, Object.assign(base(a), {
      yPercent: 0, duration: o(a, "duration") * 1.2, ease: "power3.out",
      scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset highlight-marker */
  P["highlight-marker"] = function (a, el) {
    var op = a.options || {};
    var color = op.color || "rgba(255,214,64,.55)";   // 蛍光ペンらしい黄色
    var h = op.thickness || 45;                        // マーカーの太さ(%)
    el.style.backgroundImage = "linear-gradient(" + color + "," + color + ")";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "0 88%";
    el.style.display = "inline";
    gsap.fromTo(el,
      { backgroundSize: "0% " + h + "%" },
      {
        backgroundSize: "100% " + h + "%",
        duration: o(a, "duration"), delay: o(a, "delay"), ease: "power2.out",
        scrollTrigger: trig(a, el)
      });
  };
  /* @endpreset */

  /* @preset text-fill */
  // スクロールに合わせて文字が塗られていく（薄い色 → 濃い色）
  P["text-fill"] = function (a, el) {
    if (typeof ScrollTrigger === "undefined") return;
    var op = a.options || {};
    var from = op.from || "rgba(120,120,120,0.28)";
    var to = op.to || (window.getComputedStyle(el).color || "#111");
    var words = W.splitWords(el);
    if (!words.length) return;
    gsap.set(words, { color: from });
    gsap.to(words, {
      color: to, ease: "none", stagger: 0.4,
      scrollTrigger: {
        trigger: el,
        start: op.start || "top 75%",
        end: op.end || "bottom 45%",
        scrub: true
      }
    });
  };
  /* @endpreset */

  /* @preset parallax */
  P["parallax"] = function (a, el) {
    if (typeof ScrollTrigger === "undefined") return;
    var d = o(a, "speed") * 200;
    gsap.fromTo(el, { y: -d }, {
      y: d, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  };
  /* @endpreset */

  /* @preset scroll-scale */
  P["scroll-scale"] = function (a, el) {
    if (typeof ScrollTrigger === "undefined") return;
    gsap.fromTo(el, { scale: 1 }, {
      scale: 1 + o(a, "speed"), ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  };
  /* @endpreset */

  /* @preset scroll-rotate */
  P["scroll-rotate"] = function (a, el) {
    if (typeof ScrollTrigger === "undefined") return;
    var deg = (a.options && a.options.degrees) || 180;
    gsap.fromTo(el, { rotation: 0 }, {
      rotation: deg, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  };
  /* @endpreset */




  /* @preset section-color */
  P["section-color"] = function (a, el) {
    if (typeof ScrollTrigger === "undefined") return;
    var to = (a.options && a.options.color) || "#1b2029";
    gsap.to(el, {
      backgroundColor: to, ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: true }
    });
  };
  /* @endpreset */

  /* @preset stagger */
  P["stagger"] = function (a, el) {
    var k = children(a, el);
    if (!k.length) return;
    gsap.set(k, { opacity: 0, y: o(a, "distance") });
    gsap.to(k, Object.assign(base(a), {
      opacity: 1, y: 0, stagger: o(a, "stagger") * 1.5, scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */

  /* @preset grid-cascade */
  P["grid-cascade"] = function (a, el) {
    var k = children(a, el);
    if (!k.length) return;
    gsap.set(k, { opacity: 0, scale: 0.85, y: 24 });
    gsap.to(k, Object.assign(base(a), {
      opacity: 1, scale: 1, y: 0, ease: "power2.out",
      stagger: { each: o(a, "stagger"), from: (a.options && a.options.from) || "start", grid: "auto" },
      scrollTrigger: trig(a, el)
    }));
  };
  /* @endpreset */


  /* @preset marquee */
  P["marquee"] = function (a, el) {
    var k = children(a, el);
    if (!k.length) return;
    var spd = (a.options && a.options.speed) || 20; // 秒/1周
    var track = document.createElement("div");
    track.style.cssText = "display:flex;flex-wrap:nowrap;width:max-content;will-change:transform;";
    k.forEach(function (c) { c.style.flex = "0 0 auto"; track.appendChild(c); });
    // 途切れずループさせるため中身を複製する
    var clone = track.cloneNode(true);
    var wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;flex-wrap:nowrap;width:max-content;";
    wrap.appendChild(track); wrap.appendChild(clone);
    el.innerHTML = ""; el.appendChild(wrap);
    el.style.overflow = "hidden";

    var w = track.scrollWidth;
    if (!w) return;
    gsap.to(wrap, {
      x: -w, duration: spd, ease: "none", repeat: -1,
      modifiers: { x: function (x) { return (parseFloat(x) % w) + "px"; } }
    });
  };
  /* @endpreset */

  /* @preset image-reveal */
  P["image-reveal"] = function (a, el) {
    var from = "inset(0 0 100% 0)";
    var p = el.parentElement;
    if (p) p.style.overflow = "hidden";
    gsap.set(el, { clipPath: from, webkitClipPath: from, scale: 1.25 });
    gsap.to(el, {
      clipPath: "inset(0 0 0% 0)", webkitClipPath: "inset(0 0 0% 0)", scale: 1,
      duration: o(a, "duration") * 1.6, delay: o(a, "delay"), ease: "power3.out",
      scrollTrigger: trig(a, el)
    });
  };
  /* @endpreset */

  /* @preset ken-burns */
  // 中心から均等に拡大する。これ以外の方法は不自然になる:
  //   translate で動かす   → 画像が枠の外へ滑っていく
  //   origin を中心から外す → その一点だけ固定されて見える
  P["ken-burns"] = function (a, el) {
    var op = a.options || {};
    var from = op.from || 1;
    var to = op.scale || 1.28;
    var sec = op.speed || 8;
    var p = el.parentElement;
    if (p) p.style.overflow = "hidden";
    el.style.willChange = "transform";
    gsap.fromTo(el,
      { scale: from, transformOrigin: op.origin || "50% 50%" },
      {
        scale: to, transformOrigin: op.origin || "50% 50%",
        duration: sec, ease: "sine.inOut", repeat: -1, yoyo: true
      });
  };
  /* @endpreset */

  /* @preset count-up */
  P["count-up"] = function (a, el) {
    var op = a.options || {};
    var to = op.to !== undefined ? op.to
      : parseFloat((el.textContent || "0").replace(/[^\d.-]/g, "")) || 0;
    var dec = op.decimals || 0;
    var pre = op.prefix || "", suf = op.suffix || "";
    var comma = op.comma !== false;
    var st = { v: op.from || 0 };
    el.textContent = pre + (0).toFixed(dec) + suf;
    gsap.to(st, {
      v: to, duration: o(a, "duration") * 2, delay: o(a, "delay"), ease: "power1.out",
      scrollTrigger: trig(a, el),
      onUpdate: function () {
        var n = st.v.toFixed(dec);
        if (comma) n = Number(n).toLocaleString(undefined, {
          minimumFractionDigits: dec, maximumFractionDigits: dec
        });
        el.textContent = pre + n + suf;
      }
    });
  };
  /* @endpreset */

  /* @preset hover-zoom */
  // 画像が枠の中でゆっくり拡大する（枠は動かない）。カード・サムネイルの定番。
  P["hover-zoom"] = function (a, el) {
    var op = a.options || {};
    var sc = op.scale || 1.08;
    var sec = op.duration || 0.6;

    // はみ出しを隠す枠が必要。親が無ければ自分で作る。
    var frame = el.parentElement;
    if (!frame) return;
    frame.style.overflow = "hidden";
    el.style.willChange = "transform";
    gsap.set(el, { transformOrigin: "50% 50%" });

    // ホバー判定は枠側で取る（画像が拡大しても判定がぶれない）
    frame.addEventListener("mouseenter", function () {
      gsap.to(el, { scale: sc, duration: sec, ease: "power2.out" });
    });
    frame.addEventListener("mouseleave", function () {
      gsap.to(el, { scale: 1, duration: sec, ease: "power2.out" });
    });
  };
  /* @endpreset */

  /* @preset link-underline */
  // 下線が左から伸びる。ホバーを外すと右へ抜ける。
  P["link-underline"] = function (a, el) {
    var op = a.options || {};
    var color = op.color || "currentColor";
    var h = op.thickness || 2;

    var cs = window.getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    el.style.textDecoration = "none";

    var line = document.createElement("span");
    line.style.cssText = "position:absolute;left:0;right:0;bottom:-2px;height:" + h + "px;" +
      "background:" + color + ";transform:scaleX(0);transform-origin:left center;" +
      "will-change:transform;pointer-events:none;";
    el.appendChild(line);

    el.addEventListener("mouseenter", function () {
      gsap.set(line, { transformOrigin: "left center" });
      gsap.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", function () {
      gsap.set(line, { transformOrigin: "right center" });
      gsap.to(line, { scaleX: 0, duration: 0.35, ease: "power2.in" });
    });
  };
  /* @endpreset */

  /* @preset float */
  // ふわふわ浮遊し続ける。装飾のバッジやイラストに。
  P["float"] = function (a, el) {
    var op = a.options || {};
    var dist = op.distance || 10;
    var sec = op.speed || 3;
    el.style.willChange = "transform";
    gsap.to(el, {
      y: -dist, duration: sec, ease: "sine.inOut", repeat: -1, yoyo: true
    });
  };
  /* @endpreset */

  /* @preset spin */
  // スクロールと無関係に、ずっとゆっくり回り続ける。
  // ScrollTriggerを使わないので、画面に入っていなくても回っている。
  P["spin"] = function (a, el) {
    var op = a.options || {};
    var sec = op.speed || 20;                 // 1周にかかる秒数
    var dir = op.direction === "left" ? -1 : 1;  // 既定は右回り
    el.style.willChange = "transform";
    gsap.to(el, {
      rotation: 360 * dir,
      duration: sec,
      ease: "none",        // 等速。加速減速すると「回り続けている」感が壊れる
      repeat: -1
    });
  };
  /* @endpreset */

  /* @preset pulse */
  // ゆっくり呼吸するように拡大縮小。CTAボタンの注意喚起に。
  P["pulse"] = function (a, el) {
    var op = a.options || {};
    var sc = op.scale || 1.05;
    var sec = op.speed || 1.2;
    el.style.willChange = "transform";
    gsap.to(el, {
      scale: sc, duration: sec, ease: "sine.inOut", repeat: -1, yoyo: true
    });
  };
  /* @endpreset */

  /* @preset hover-lift */
  P["hover-lift"] = function (a, el) {
    var sc = o(a, "scale");
    var lift = (a.options && a.options.lift !== undefined) ? a.options.lift : -8;
    el.style.willChange = "transform";
    el.addEventListener("mouseenter", function () {
      gsap.to(el, { scale: sc, y: lift, duration: 0.3, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", function () {
      gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    });
  };
  /* @endpreset */

  /* @preset hover-tilt */
  P["hover-tilt"] = function (a, el) {
    var max = (a.options && a.options.max) || 12;
    var p = el.parentElement;
    if (p) p.style.perspective = "800px";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotationY: px * max * 2, rotationX: -py * max * 2,
        duration: 0.4, ease: "power2.out", transformPerspective: 800
      });
    });
    el.addEventListener("mouseleave", function () {
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" });
    });
  };
  /* @endpreset */

  /* @preset magnetic */
  P["magnetic"] = function (a, el) {
    var str = (a.options && a.options.strength) || 0.4;
    el.style.willChange = "transform";
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * str,
        y: (e.clientY - (r.top + r.height / 2)) * str,
        duration: 0.4, ease: "power3.out"
      });
    });
    el.addEventListener("mouseleave", function () {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    });
  };
  /* @endpreset */

})();
