/*!
 * WP GSAP Animate — core
 * 共通の土台。プリセットはこの上に載る。
 * 依存: gsap, ScrollTrigger
 */
(function (root) {
  "use strict";
  if (root.WPGSAP) return; // 二重読み込み防止

  // このバージョンを上げたら、既存サイトのCoreスニペットも入れ替えること。
  // 存在確認だけで「入っているからスキップ」すると、古いCoreが残り続けて
  // 直したはずのバグが再発する。
  var VERSION = "1.1.0";

  var D = {
    duration: 0.9, delay: 0, ease: "power2.out", stagger: 0.08,
    distance: 40, start: "top 85%", once: true, direction: "left",
    speed: 0.3, scale: 1.05, immediate: false
  };

  // options の値を取り出す。未指定なら既定値。
  function o(a, k) {
    var x = a.options || {};
    return x[k] !== undefined && x[k] !== null ? x[k] : D[k];
  }

  function q(sel, ctx) {
    try {
      return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
    } catch (e) { return []; }
  }

  // ScrollTrigger 設定。immediate:true（見本帳のリプレイ）のときは付けない。
  function trig(a, el) {
    if (o(a, "immediate")) return undefined;
    if (typeof ScrollTrigger === "undefined") return undefined;
    return {
      trigger: el,
      start: o(a, "start"),
      toggleActions: o(a, "once") ? "play none none none" : "play none none reverse"
    };
  }

  function base(a) {
    return { duration: o(a, "duration"), delay: o(a, "delay"), ease: o(a, "ease") };
  }

  function children(a, el) {
    if (a.children) return q(a.children).filter(function (k) { return el.contains(k) || k === el; });
    return Array.prototype.slice.call(el.children);
  }

  /* ---- テキスト分割（SplitTextに依存しない自前実装） ---- */

  function cacheText(el) { if (!el.dataset.wpgOrig) el.dataset.wpgOrig = el.innerHTML; }
  function restore(el) { if (el.dataset.wpgOrig) el.innerHTML = el.dataset.wpgOrig; }

  // テキストノードだけを分割し、要素（<strong> <a> <br> など）はそのまま残す。
  // el.textContent から作り直すと中のタグが消えてしまうので、絶対にやらないこと。
  function splitTextNodes(el, makePieces) {
    cacheText(el); restore(el);
    var out = [];

    function walk(node) {
      // ライブなNodeListを走査中に置換すると崩れるので、先にコピーする
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) {                 // テキストノード
          var pieces = makePieces(child.textContent);
          if (!pieces.frag) return;
          node.replaceChild(pieces.frag, child);
          out = out.concat(pieces.spans);
        } else if (child.nodeType === 1) {          // 要素 → 中に潜る
          walk(child);
        }
      });
    }
    walk(el);
    return out;
  }

  function makeSpan(text) {
    var s = document.createElement("span");
    s.style.display = "inline-block";
    s.style.willChange = "transform,opacity";
    s.textContent = text;
    return s;
  }

  function splitChars(el) {
    return splitTextNodes(el, function (text) {
      var frag = document.createDocumentFragment(), spans = [];
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (/\s/.test(c)) { frag.appendChild(document.createTextNode(c)); continue; }
        var s = makeSpan(c);
        frag.appendChild(s); spans.push(s);
      }
      return { frag: frag, spans: spans };
    });
  }

  // 日本語・中国語には単語の区切り（空白）が無い。
  // 空白だけで区切ると「文章まるごとが1単語」になり、
  // split-lines は「1行」と誤判定し、text-fill は一気に塗られてしまう。
  // そこで CJK は1文字ずつ、ラテン系は単語ごとに分ける。
  var CJK = "\\u3000-\\u303F\\u3040-\\u30FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uFF00-\\uFFEF";
  var UNIT_RE = new RegExp(
    "(\\s+)" +                    // 空白
    "|([" + CJK + "])" +          // CJKは1文字が1単位
    "|([^\\s" + CJK + "]+)",      // それ以外は連続した塊（英単語・数字）が1単位
    "g"
  );

  function splitWords(el) {
    return splitTextNodes(el, function (text) {
      var frag = document.createDocumentFragment(), spans = [];
      var m;
      UNIT_RE.lastIndex = 0;
      while ((m = UNIT_RE.exec(text)) !== null) {
        if (m[1]) {                                   // 空白はそのまま残す
          frag.appendChild(document.createTextNode(m[1]));
        } else {
          var s = makeSpan(m[2] || m[3]);
          frag.appendChild(s); spans.push(s);
        }
      }
      return { frag: frag, spans: spans };
    });
  }

  // 「行」に分けて、行ごとにマスクで包む。
  //
  // 重要: 文字をspanで包んでから位置を測ってはいけない。
  // inline-blockのspanにすると禁則処理が効かなくなり、
  // 「っ」や「す。」が行頭に来るような不自然な改行になる。
  //
  // 正しくは、DOMを一切変えずに Range で各文字の位置を測る。
  // こうすればブラウザ本来の改行（禁則処理つき）がそのまま得られる。
  //
  // 制約: 行を組み直すので、中の <strong> や <a> の装飾は失われる。
  // リッチテキストには text-mask を使うこと。
  function splitLines(el) {
    if (el.querySelector("strong, b, em, i, a, span, mark, code")) {
      console.warn("[wp-gsap] split-lines: 要素の中のタグ（<strong> など）は" +
        "行の組み直しで失われます。装飾を残したい場合は text-mask を使ってください。", el);
    }
    cacheText(el); restore(el);

    // テキストノードを集める（DOMは変えない）
    var nodes = [];
    (function walk(n) {
      Array.prototype.forEach.call(n.childNodes, function (c) {
        if (c.nodeType === 3) nodes.push(c);
        else if (c.nodeType === 1) walk(c);
      });
    })(el);
    if (!nodes.length) return [];

    // 1文字ずつ Range で位置を測り、行ごとにまとめる
    var range = document.createRange();
    var lines = [], cur = "", top = null;

    nodes.forEach(function (node) {
      var text = node.textContent;
      for (var i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        var rects = range.getClientRects();
        if (!rects.length) { cur += text[i]; continue; }   // 改行文字など
        var t = Math.round(rects[0].top);
        if (top === null) top = t;
        if (Math.abs(t - top) > 2) {                        // 行が変わった
          lines.push(cur);
          cur = "";
          top = t;
        }
        cur += text[i];
      }
    });
    if (cur !== "") lines.push(cur);

    lines = lines.map(function (l) { return l.trim(); }).filter(function (l) { return l !== ""; });
    if (!lines.length) return [];

    // 行ごとに outer(マスク) + inner(動かす) を組み立て直す
    var inners = [];
    el.textContent = "";
    lines.forEach(function (line) {
      var outer = document.createElement("span");
      outer.style.display = "block";
      outer.style.overflow = "hidden";      // これが行マスクになる
      var inner = document.createElement("span");
      inner.style.display = "block";
      inner.style.willChange = "transform";
      inner.textContent = line;             // 素のテキストなので禁則処理も保たれる
      outer.appendChild(inner);
      el.appendChild(outer);
      inners.push(inner);
    });
    return inners;
  }

  /* ---- FOUC対策の解除 ---- */
  // 初期状態で要素を隠すCSSを外す。どの経路でも必ず通すこと。
  // 通らないと要素が隠れたままになる。
  //
  // 隠しCSSはアニメーションのスニペットごとに1枚ずつ出る（＝複数枚ある）。
  // idではなくclassで全部まとめて外すこと。1枚しか外さないと、
  // 残りの要素が永久に見えないままになる。
  function clearGuard() {
    var list = document.querySelectorAll("style.wpgsap-fouc");
    Array.prototype.forEach.call(list, function (s) {
      if (s.parentNode) s.parentNode.removeChild(s);
    });
    document.documentElement.classList.remove("wpgsap-js");
  }

  var P = {};      // プリセット置き場。各プリセットがここに自分を登録する
  var queue = [];  // 適用待ちのアニメーション
  var started = false;

  function apply(a, el) {
    var fn = P[a.type];
    if (!fn) { console.warn("[wp-gsap] 未知のtype:", a.type); return; }
    try { fn(a, el); } catch (e) { console.warn("[wp-gsap] 失敗:", a.type, e); }
  }

  function runOne(a) {
    if (!a || !a.selector || !a.type) return;
    var els = q(a.selector);
    if (!els.length) {
      console.warn("[wp-gsap] 要素が見つかりません:", a.selector);
      return;
    }
    els.forEach(function (el) { apply(a, el); });
  }

  function ready() {
    if (typeof gsap === "undefined") {
      console.warn("[wp-gsap] gsapが未読込");
      clearGuard();
      return;
    }
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    // 「視差効果を減らす」設定の人にはアニメを適用しない。
    // その場合も隠しCSSは必ず外す（外さないと本文が永久に見えない）。
    if (root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queue = [];
      clearGuard();
      return;
    }

    queue.forEach(runOne);
    queue = [];
    started = true;

    clearGuard();
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }

  // 各スニペットはこれを呼ぶだけでよい。
  // DOM構築前に呼ばれても、キューに積んで後でまとめて実行する。
  function add(a) {
    if (started) { runOne(a); return; }
    queue.push(a);
  }

  function init(config) {
    (config && config.animations || []).forEach(add);
  }

  root.WPGSAP = {
    version: VERSION,
    presets: P, add: add, apply: apply, init: init,
    defaults: D, o: o, q: q, trig: trig, base: base, children: children,
    splitChars: splitChars, splitWords: splitWords, splitLines: splitLines,
    cacheText: cacheText
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
  root.addEventListener("load", function () {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  });
})(window);
