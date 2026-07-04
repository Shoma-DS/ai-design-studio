/**
 * リンクエリア（画像上のクリック可能領域）と URL プリセットの管理層です。
 * セクション画像・参照画像それぞれのエリアを JSON で永続化します。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./lpStore.mjs";

const LINK_AREA_DIR = path.join(REPO_ROOT, ".lp-editor", "link-areas");
const PRESET_PATH = path.join(LINK_AREA_DIR, "url-presets.json");
const PUBLIC_LINK_AREAS_FILE = "link-areas.json";
const DEFAULT_LINK_RADIUS = 8;
const DEFAULT_SHINE_RADIUS = 50;
const DEFAULT_SHINE_ANGLE = 105;
const DEFAULT_SHINE_WIDTH = 24;
const DEFAULT_SHINE_DURATION = 2.4;
const DEFAULT_SHINE_OPACITY = 88;
const DEFAULT_SHINE_AREAS = new Map([
  ["SEC-01", [{ id: "current-shine-hero", x: 3.0, y: 74.0, width: 94.0, height: 12.6, url: "", label: "キラーん（現在位置）", shine: true }]],
  ["SEC-05", [{ id: "current-shine-why-now", x: 3.8, y: 86.6, width: 92.4, height: 8.8, url: "", label: "キラーん（現在位置）", shine: true }]],
  ["SEC-14", [{ id: "current-shine-final", x: 3.4, y: 88.9, width: 93.2, height: 8.9, url: "", label: "キラーん（現在位置）", shine: true }]],
  ["HTML-route-choice-cta", [{ id: "current-shine-route-choice", x: 3.4, y: 86.8, width: 93.0, height: 9.6, url: "", label: "キラーん（現在位置）", shine: true }]]
]);
const EXTRA_PUBLIC_TARGETS = [
  {
    id: "HTML-route-choice-cta",
    title: "ルート選択CTA",
    imageName: "showcase-final/bg/route-choice-cta.webp"
  }
];

async function pathExists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function ensureDir() {
  await fs.mkdir(LINK_AREA_DIR, { recursive: true });
}

function safeTargetId(targetId) {
  return String(targetId || "target")
    .replace(/[^\w぀-鿿゠-ヿ＀-￯ ._-]/g, "_")
    .trim()
    .slice(0, 96) || "target";
}

function clamp(value, min = 0, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeNumber(value, min, max, fallback, digits = 2) {
  const number = Number(value);
  const source = Number.isFinite(number) ? number : fallback;
  return round(clamp(source, min, max), digits);
}

function areaFilePath(targetId) {
  return path.join(LINK_AREA_DIR, `${safeTargetId(targetId)}.json`);
}

function normalizeRect(rect) {
  if (!rect || typeof rect !== "object") return null;
  const x = clamp(rect.x);
  const y = clamp(rect.y);
  const width = clamp(rect.width, 0, 100 - x);
  const height = clamp(rect.height, 0, 100 - y);
  if (width <= 0 || height <= 0) return null;
  return {
    x: round(x, 2),
    y: round(y, 2),
    width: round(width, 2),
    height: round(height, 2)
  };
}

function normalizeArea(area) {
  const x = clamp(area?.x);
  const y = clamp(area?.y);
  const width = clamp(area?.width, 0, 100 - x);
  const height = clamp(area?.height, 0, 100 - y);
  const normalized = {
    id: String(area?.id || `area-${Date.now()}`),
    x: round(x, 2),
    y: round(y, 2),
    width: round(width, 2),
    height: round(height, 2),
    radius: normalizeNumber(area?.radius, 0, 50, DEFAULT_LINK_RADIUS, 1),
    url: String(area?.url || "").trim(),
    label: String(area?.label || "").trim(),
    shine: area?.shine === true,
    cta: area?.cta === true,
    ctaCopy: String(area?.ctaCopy || "").trim().slice(0, 80)
  };
  const shineRect = normalizeRect(area?.shineRect);
  if (normalized.shine) {
    normalized.shineRadius = normalizeNumber(area?.shineRadius, 0, 50, DEFAULT_SHINE_RADIUS, 1);
    normalized.shineAngle = normalizeNumber(area?.shineAngle, 70, 130, DEFAULT_SHINE_ANGLE, 0);
    normalized.shineWidth = normalizeNumber(area?.shineWidth, 8, 50, DEFAULT_SHINE_WIDTH, 1);
    normalized.shineDuration = normalizeNumber(area?.shineDuration, 1.2, 6, DEFAULT_SHINE_DURATION, 1);
    normalized.shineOpacity = normalizeNumber(area?.shineOpacity, 10, 100, DEFAULT_SHINE_OPACITY, 0);
    if (shineRect) normalized.shineRect = shineRect;
  }
  return normalized;
}

function defaultAreasForTarget(targetId) {
  return (DEFAULT_SHINE_AREAS.get(String(targetId || "")) ?? []).map(normalizeArea);
}

export async function getLinkAreas(targetId) {
  const filePath = areaFilePath(targetId);
  if (!(await pathExists(filePath))) return defaultAreasForTarget(targetId);
  try {
    const data = JSON.parse(await fs.readFile(filePath, "utf8"));
    return Array.isArray(data) ? data.map(normalizeArea).filter((area) => area.width > 0 && area.height > 0) : [];
  } catch { return []; }
}

export async function saveLinkAreas(targetId, areas) {
  await ensureDir();
  const validated = (Array.isArray(areas) ? areas : [])
    .map(normalizeArea)
    .filter((area) => area.width > 0 && area.height > 0);
  await fs.writeFile(
    areaFilePath(targetId),
    JSON.stringify(validated, null, 2) + "\n",
    "utf8"
  );
  return validated;
}

export async function getUrlPresets() {
  if (!(await pathExists(PRESET_PATH))) return [];
  try {
    const data = JSON.parse(await fs.readFile(PRESET_PATH, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function saveUrlPresets(presets) {
  await ensureDir();
  const validated = (Array.isArray(presets) ? presets : [])
    .map((preset) => ({
      id: String(preset.id || `preset-${Date.now()}`),
      label: String(preset.label || "").trim().slice(0, 80),
      url: String(preset.url || "").trim().slice(0, 2000)
    }))
    .filter((preset) => preset.label && preset.url);
  await fs.writeFile(PRESET_PATH, JSON.stringify(validated, null, 2) + "\n", "utf8");
  return validated;
}

export async function exportFullPageLinkAreas(sections, lpDir) {
  const rows = Array.isArray(sections) ? sections : [];
  const heights = rows.map((section) => Number(section?.imageMeta?.height || 0));
  const totalHeight = heights.reduce((sum, height) => sum + Math.max(0, height), 0);
  const exported = [];

  const pushArea = ({ targetId, title, imageName, area, top = 0, height = 0, totalHeightForGlobal = 0 }) => {
    if ((!area.url && !area.shine && !area.cta) || area.width <= 0 || area.height <= 0) return;
    const local = {
      x: round(area.x),
      y: round(area.y),
      width: round(area.width),
      height: round(area.height)
    };
    const hasGlobal = height > 0 && totalHeightForGlobal > 0;
    const shineRect = area.shineRect ? {
      x: round(area.shineRect.x),
      y: round(area.shineRect.y),
      width: round(area.shineRect.width),
      height: round(area.shineRect.height)
    } : null;

    exported.push({
      id: `${targetId}-${area.id}`,
      sectionId: targetId,
      label: area.label || title || targetId,
      url: area.url,
      imageName: imageName || "",
      x: hasGlobal ? round(area.x) : local.x,
      y: hasGlobal ? round(((top + (area.y / 100) * height) / totalHeightForGlobal) * 100) : local.y,
      width: hasGlobal ? round(area.width) : local.width,
      height: hasGlobal ? round(((area.height / 100) * height / totalHeightForGlobal) * 100) : local.height,
      radius: normalizeNumber(area.radius, 0, 50, DEFAULT_LINK_RADIUS, 1),
      local,
      shine: area.shine === true,
      cta: area.cta === true,
      ctaCopy: String(area.ctaCopy || "").trim(),
      ...(area.shine === true ? {
        shineRadius: normalizeNumber(area.shineRadius, 0, 50, DEFAULT_SHINE_RADIUS, 1),
        shineAngle: normalizeNumber(area.shineAngle, 70, 130, DEFAULT_SHINE_ANGLE, 0),
        shineWidth: normalizeNumber(area.shineWidth, 8, 50, DEFAULT_SHINE_WIDTH, 1),
        shineDuration: normalizeNumber(area.shineDuration, 1.2, 6, DEFAULT_SHINE_DURATION, 1),
        shineOpacity: normalizeNumber(area.shineOpacity, 10, 100, DEFAULT_SHINE_OPACITY, 0)
      } : {}),
      ...(shineRect ? { shineRect } : {})
    });
  };

  if (totalHeight > 0) {
    let top = 0;
    for (let index = 0; index < rows.length; index += 1) {
      const section = rows[index];
      const height = Math.max(0, heights[index]);
      const areas = await getLinkAreas(section.id);

      for (const area of areas) {
        if (height <= 0) continue;
        pushArea({
          targetId: section.id,
          title: section.title,
          imageName: section.imageName,
          area,
          top,
          height,
          totalHeightForGlobal: totalHeight
        });
      }

      top += height;
    }
  }

  for (const target of EXTRA_PUBLIC_TARGETS) {
    const areas = await getLinkAreas(target.id);
    for (const area of areas) {
      pushArea({
        targetId: target.id,
        title: target.title,
        imageName: target.imageName,
        area
      });
    }
  }

  await fs.writeFile(
    path.join(lpDir, PUBLIC_LINK_AREAS_FILE),
    JSON.stringify({ generatedAt: new Date().toISOString(), areas: exported }, null, 2) + "\n",
    "utf8"
  );
  return exported;
}
