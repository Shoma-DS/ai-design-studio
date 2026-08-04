// LPの操作要素を「実際のマウス入力」で一通り検証する
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/qa-interactions.mjs
//
// 合成イベントでは通ってしまう不具合（透明なオーバーレイがクリックを飲み込む等）を
// 見逃さないため、CDP の Input.dispatchMouseEvent で本物の入力として検証する。

import { spawn } from "node:child_process";

const PORT = 9335;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL_TARGET = process.argv[2] || "http://localhost:8811/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--disable-gpu", "--hide-scrollbars",
  "--window-size=2000,1100", "--user-data-dir=/tmp/clarive-cdp-qa", URL_TARGET,
], { stdio: "ignore" });

let ws, nextId = 1;
const pending = new Map();
const send = (method, params = {}) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
}
const mouse = (type, x, y) =>
  send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1, buttons: type === "mouseReleased" ? 0 : 1 });
async function click(x, y) {
  await mouse("mouseMoved", x, y); await sleep(40);
  await mouse("mousePressed", x, y); await sleep(50);
  await mouse("mouseReleased", x, y); await sleep(350);
}
/** セレクタの中心座標を返す（画面内へスクロールしてから） */
async function center(sel) {
  return evaluate(`
    (function () {
      var el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      var r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
    })()
  `);
}

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

try {
  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try {
      target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json())
        .find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    } catch { /* 起動待ち */ }
  }
  if (!target) throw new Error("DevTools に接続できません");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws fail")); });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
    }
  };
  await send("Runtime.enable");
  await sleep(2500);
  await evaluate(`document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); }); 'ok'`);

  // 0) ページ中央が本文の要素で受けられているか（透明オーバーレイの検出）
  const hit = await evaluate(`
    (function () {
      var el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      return el ? (el.className || el.tagName) + '' : 'null';
    })()
  `);
  check("ページ中央がオーバーレイに覆われていない", !String(hit).includes("sp-nav"), `拾った要素: ${hit}`);

  // 1a) ビフォーアフターは既定でスライダー表示（つまみが最初から見える）
  const sliderShown = await evaluate(`
    (function () {
      var pair = document.querySelector('[data-compare]');
      var ba = document.querySelector('[data-ba]');
      var handle = document.querySelector('[data-ba-handle]');
      return !!ba && !ba.hidden && !!pair && pair.hidden
        && !!handle && handle.getBoundingClientRect().width > 0;
    })()
  `);
  check("既定でスライダー（つまみ）が表示されている", sliderShown);

  // 1b) 「2枚を並べて見る」で並べ表示へ切り替わる
  const toggle = await center("[data-compare-toggle]");
  if (toggle) {
    await click(toggle.x, toggle.y);
    const switched = await evaluate(`
      (function () {
        var pair = document.querySelector('[data-compare]');
        var ba = document.querySelector('[data-ba]');
        return !pair.hidden && ba.hidden;
      })()
    `);
    check("「2枚を並べて見る」で並べ表示に切り替わる", switched);
    // スライダー表示へ戻す。切り替えでレイアウトが動くため、座標を取り直してからクリックする
    const toggleBack = await center("[data-compare-toggle]");
    await click(toggleBack.x, toggleBack.y);
    const restored = await evaluate(`!document.querySelector('[data-ba]').hidden`);
    if (!restored) check("スライダー表示に戻せる", false, "戻し操作が効きませんでした");
  } else {
    check("「2枚を並べて見る」で並べ表示に切り替わる", false, "ボタンが見つかりません");
  }

  // 1c) スライダーがドラッグで動く
  const ba = await center("[data-ba]");
  await mouse("mousePressed", ba.x, ba.y); await sleep(60);
  for (const p of [-0.1, -0.18, -0.28]) { await mouse("mouseMoved", ba.x + ba.w * p, ba.y); await sleep(60); }
  await mouse("mouseReleased", ba.x + ba.w * -0.28, ba.y); await sleep(200);
  const pos = parseFloat(await evaluate(`document.querySelector('[data-ba]').style.getPropertyValue('--pos')`));
  check("ビフォーアフターのつまみがドラッグで動く", Math.abs(pos - 22) < 8, `--pos=${pos.toFixed(1)}%`);

  // 2) FAQアコーディオン
  const faq = await center(".faq-item__q, .faq__q, [data-faq-q]");
  if (faq) {
    await click(faq.x, faq.y);
    const expanded = await evaluate(`
      (function () {
        var b = document.querySelector('.faq-item__q, .faq__q, [data-faq-q]');
        return b ? b.getAttribute('aria-expanded') : null;
      })()
    `);
    check("FAQアコーディオンが開く", expanded === "true", `aria-expanded=${expanded}`);
  } else {
    check("FAQアコーディオンが開く", false, "ボタンが見つかりません");
  }

  // 3) お客様の声カルーセル（transform: translateX で送る実装）
  // PC幅ではスライドが全部収まるため矢印は非表示になる（正しい挙動）。その場合は検証をスキップする。
  const carouselNeeded = await evaluate(`
    (function () {
      var ctrl = document.querySelector('[data-carousel-ctrl]');
      return ctrl ? !ctrl.hidden : false;
    })()
  `);
  const nextBtn = carouselNeeded ? await center("[data-carousel-next]") : null;
  if (!carouselNeeded) {
    check("お客様の声カルーセル", true, "この幅では全スライドが収まるため矢印は非表示（正しい挙動）");
  } else if (nextBtn) {
    const readX = `(document.querySelector('[data-carousel-track]') || {}).style ? document.querySelector('[data-carousel-track]').style.transform || 'none' : 'none'`;
    const before = await evaluate(readX);
    await click(nextBtn.x, nextBtn.y); await sleep(600);
    const after = await evaluate(readX);
    check("お客様の声カルーセルが送れる", after !== before && after !== "none", `transform ${before} → ${after}`);
  } else {
    check("お客様の声カルーセルが送れる", false, "次へボタンが見つかりません");
  }

  // 4) CTAボタン（ページ内アンカー）
  const cta = await center('.hero__actions .btn--primary');
  if (cta) {
    const y0 = await evaluate(`window.scrollY`);
    await click(cta.x, cta.y); await sleep(900);
    const y1 = await evaluate(`window.scrollY`);
    check("ヒーローのCTAでフォームまで移動する", y1 !== y0, `scrollY ${Math.round(y0)} → ${Math.round(y1)}`);
  } else {
    check("ヒーローのCTAでフォームまで移動する", false, "ボタンが見つかりません");
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} PASS ===`);
  process.exitCode = failed.length ? 1 : 0;
} catch (e) {
  console.error("ERROR:", e.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch { /* 無視 */ }
  chrome.kill();
}
