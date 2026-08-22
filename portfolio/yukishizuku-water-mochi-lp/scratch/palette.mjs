function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToHsl(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function luminance(hex) {
  const rgb = [1, 3, 5].map((i) => {
    const value = parseInt(hex.slice(i, i + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((high + 0.05) / (low + 0.05)).toFixed(2);
}

const base = "#159DB8";
const { h, s } = hexToHsl(base);
const steps = { 50: [97, 0.5], 100: [94, 0.6], 200: [86, 0.75], 300: [76, 0.9], 400: [64, 1], 600: [42, 1], 700: [33, 0.95], 800: [24, 0.9], 900: [16, 0.85], 950: [10, 0.8] };
const palette = { 500: base };
for (const [step, [lightness, saturation]] of Object.entries(steps)) {
  palette[step] = hslToHex(h, s * saturation, lightness);
}
const accent = hslToHex((h + 150) % 360, s, 52);
console.log({ palette, accent, textContrast: contrast(palette[900], "#ffffff"), accentOnWhite: contrast(accent, "#ffffff") });
