// CLARIVE 配色パレット生成
// skills/design/color-palette-generator/SKILL.md のアルゴリズムに準拠
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/palette.mjs

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function relLuminance(hex) {
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(1 + i, 3 + i), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(a, b) {
  const L1 = relLuminance(a), L2 = relLuminance(b);
  const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}

const STEPS = {
  50: [97, 0.5], 100: [94, 0.6], 200: [86, 0.75], 300: [76, 0.9],
  400: [64, 1.0], 600: [42, 1.0], 700: [33, 0.95], 800: [24, 0.9],
  900: [16, 0.85], 950: [10, 0.8],
};

function buildScale(baseHex, { hueShift = 0, satOverride = null } = {}) {
  const { h, s, l } = hexToHsl(baseHex);
  const hue = (h + hueShift + 360) % 360;
  const sat = satOverride ?? s;
  const scale = { 500: hueShift === 0 && satOverride === null ? baseHex : hslToHex(hue, sat, l) };
  for (const [step, [targetL, mul]] of Object.entries(STEPS)) {
    scale[step] = hslToHex(hue, sat * mul, targetL);
  }
  return scale;
}

// ベースカラー: スモーキーローズ（女性向け・高級感・ピンクの甘さを抑えた深み）
const BASE = "#9E4F58";

const primary = buildScale(BASE);
// アクセント: ブラスゴールド。
// 三角配色（+150°）は緑（#4f9e6e）になり、深緑はAI生成っぽい印象を与えるため不採用。
// 代わりに色相を +50° 側（暖色域）へ寄せたゴールドを明示指定する。
const ACCENT_BASE = "#C08A3E";
const accent = buildScale(ACCENT_BASE);
// ニュートラル: 同一色相の低彩度グレージュ（冷たいグレーにしない）
const neutral = buildScale(BASE, { satOverride: 7 });

const out = { primary, accent, neutral };

console.log("=== CLARIVE PALETTE ===");
for (const [name, scale] of Object.entries(out)) {
  console.log(`\n--- ${name} (base ${BASE}) ---`);
  for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
    console.log(`  ${String(step).padStart(3)}: ${scale[step]}`);
  }
}

const BG = neutral[50];
const checks = [
  ["本文テキスト neutral900 on bg", neutral[900], BG, 4.5],
  ["本文テキスト neutral800 on bg", neutral[800], BG, 4.5],
  ["補助テキスト neutral700 on bg", neutral[700], BG, 4.5],
  ["見出し primary800 on bg", primary[800], BG, 3.0],
  ["ブランド primary600 on bg", primary[600], BG, 3.0],
  ["白文字 on primary700 (CTA)", "#ffffff", primary[700], 4.5],
  ["白文字 on primary600", "#ffffff", primary[600], 4.5],
  ["白文字 on accent700", "#ffffff", accent[700], 4.5],
  ["neutral950文字 on accent400", neutral[950], accent[400], 4.5],
  ["白文字 on neutral950 (フッター)", "#ffffff", neutral[950], 4.5],
];

console.log("\n=== WCAG CONTRAST (bg = " + BG + ") ===");
for (const [label, fg, bg, need] of checks) {
  const ratio = contrastRatio(fg, bg);
  const pass = ratio >= need ? "PASS" : "FAIL";
  console.log(`  [${pass}] ${label}: ${ratio.toFixed(2)}:1 (need ${need}:1)`);
}
