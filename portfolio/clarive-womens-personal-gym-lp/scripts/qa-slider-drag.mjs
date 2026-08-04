// ビフォーアフタースライダーを「実際のマウス入力」でドラッグして検証する
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/qa-slider-drag.mjs [url]
//
// 合成の PointerEvent では、ブラウザ標準の画像ドラッグやヒットテストが再現されないため
// 「コード上は動くのに実機で動かない」を見逃す。CDP の Input.dispatchMouseEvent は
// 本物の入力として扱われるので、実ブラウザと同じ経路で確認できる。

import { spawn } from "node:child_process";

const URL_TARGET = process.argv[2] || "http://localhost:8811/";
const PORT = 9333;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1400,1000",
  "--user-data-dir=/tmp/clarive-cdp-profile",
  URL_TARGET,
], { stdio: "ignore" });

let ws;
let nextId = 1;
const pending = new Map();

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description || ""));
  return r.result.value;
}

async function mouse(type, x, y, extra = {}) {
  await send("Input.dispatchMouseEvent", {
    type, x, y, button: "left", clickCount: 1, buttons: type === "mouseReleased" ? 0 : 1, ...extra,
  });
}

try {
  // DevTools が起動するまで待つ
  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      target = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    } catch { /* まだ起動していない */ }
  }
  if (!target) throw new Error("DevTools に接続できませんでした");

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("WebSocket 接続に失敗しました"));
  });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await sleep(2500); // 画像読み込みとJS初期化を待つ

  // スライダーを画面内に入れる
  await evaluate(`
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelector('#results').scrollIntoView({ behavior: 'instant', block: 'start' });
    'ok';
  `);
  await sleep(900);

  const rect = await evaluate(`
    (function () {
      var el = document.querySelector('[data-ba]');
      if (!el) return null;
      var r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, pos: el.style.getPropertyValue('--pos') };
    })()
  `);
  if (!rect) throw new Error("[data-ba] が見つかりません");
  console.log(`スライダー位置: x=${rect.x.toFixed(0)} y=${rect.y.toFixed(0)} ${rect.w.toFixed(0)}x${rect.h.toFixed(0)} 初期=${rect.pos}`);

  const y = rect.y + rect.h / 2;
  const startX = rect.x + rect.w * 0.5;

  // 実際のマウスでつかんで左へドラッグする
  await mouse("mousePressed", startX, y);
  await sleep(60);
  for (const p of [0.44, 0.36, 0.28, 0.22]) {
    await mouse("mouseMoved", rect.x + rect.w * p, y);
    await sleep(60);
  }
  await mouse("mouseReleased", rect.x + rect.w * 0.22, y);
  await sleep(200);

  const after = await evaluate(`document.querySelector('[data-ba]').style.getPropertyValue('--pos')`);
  const valuenow = await evaluate(`document.querySelector('[data-ba-handle]').getAttribute('aria-valuenow')`);
  console.log(`ドラッグ後: --pos=${after} / aria-valuenow=${valuenow}（期待値 約22%）`);

  const value = parseFloat(after);
  const ok = Number.isFinite(value) && Math.abs(value - 22) < 6;
  console.log(ok ? "PASS: 実際のマウスでつまみが動きました" : "FAIL: つまみが動いていません");
  process.exitCode = ok ? 0 : 1;
} catch (err) {
  console.error("ERROR:", err.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch { /* 無視 */ }
  chrome.kill();
}
