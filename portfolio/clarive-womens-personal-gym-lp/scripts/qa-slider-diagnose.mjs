// スライダーが実マウスで動かない原因を切り分ける診断スクリプト
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/qa-slider-diagnose.mjs
import { spawn } from "node:child_process";

const PORT = 9334;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, "--disable-gpu", "--hide-scrollbars",
  "--window-size=1400,1000", "--user-data-dir=/tmp/clarive-cdp-diag", "http://localhost:8811/",
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
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description || ""));
  return r.result.value;
}
const mouse = (type, x, y) =>
  send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1, buttons: type === "mouseReleased" ? 0 : 1 });

try {
  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try {
      target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json())
        .find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    } catch { /* 起動待ち */ }
  }
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

  await evaluate(`
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelector('#results').scrollIntoView({ behavior: 'instant', block: 'start' });
    'ok';
  `);
  await sleep(900);

  // 1) ヒットテスト: その座標で実際に拾われる要素は何か
  const probe = await evaluate(`
    (function () {
      var root = document.querySelector('[data-ba]');
      var r = root.getBoundingClientRect();
      var cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      var el = document.elementFromPoint(cx, cy);
      window.__log = [];
      ['pointerdown','pointermove','pointerup','pointercancel','dragstart','mousedown'].forEach(function (t) {
        root.addEventListener(t, function () { window.__log.push(t); }, true);
      });
      window.__err = null;
      window.addEventListener('error', function (e) { window.__err = String(e.message); });
      return {
        hit: el ? (el.className || el.tagName) : null,
        isInsideRoot: el ? root.contains(el) : false,
        pointerEvents: getComputedStyle(root).pointerEvents,
        touchAction: getComputedStyle(root).touchAction,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height }
      };
    })()
  `);
  console.log("ヒットテスト:", JSON.stringify(probe));

  const { x, y, w, h } = probe.rect;
  await mouse("mousePressed", x + w * 0.5, y + h * 0.5);
  await sleep(80);
  await mouse("mouseMoved", x + w * 0.3, y + h * 0.5);
  await sleep(80);
  await mouse("mouseReleased", x + w * 0.3, y + h * 0.5);
  await sleep(200);

  const result = await evaluate(`
    JSON.stringify({
      events: window.__log,
      pos: document.querySelector('[data-ba]').style.getPropertyValue('--pos'),
      err: window.__err
    })
  `);
  console.log("結果:", result);
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  try { ws?.close(); } catch { /* 無視 */ }
  chrome.kill();
}
