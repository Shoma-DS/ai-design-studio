/**
 * LP HTMLに埋め込まれた無限ループセクションの読み書きを扱います。
 * 通常のセクション画像生成とは独立して、ループ素材の差し替えだけを行います。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./lpStore.mjs";

const LP_VERSION_ROOT = path.join(REPO_ROOT, "projects", "ai-income-course", "ver01-fresh-green");
const LP_DIR = path.join(LP_VERSION_ROOT, "lp");
const LP_HTML_PATH = path.join(LP_DIR, "index.html");
const IMAGE_DIR = path.join(LP_DIR, "images");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const LOOP_SECTION_DEFS = [
  {
    id: "showcase-intro",
    label: "制作物を大公開",
    sectionClass: "showcase-intro-loop-section",
    tracks: [
      {
        id: "intro-primary",
        label: "制作物ミックス上段",
        trackClass: "loop-track--intro-primary",
        variant: "mixed",
        position: { top: 39, left: 0, right: 0 },
        duration: 60,
        reverse: false,
        offsetX: -84,
        enabled: true
      },
      {
        id: "intro-secondary",
        label: "制作物ミックス下段",
        trackClass: "loop-track--intro-secondary",
        variant: "mixed",
        position: { top: 55, left: 0, right: 0 },
        duration: 68,
        reverse: true,
        offsetX: -44,
        enabled: true
      }
    ]
  },
  {
    id: "web",
    label: "Webデザイナー",
    sectionClass: "ai-loop-section--web-designer",
    tracks: [
      {
        id: "web-lp",
        label: "LP / FV制作",
        trackClass: "loop-track--web-lp",
        variant: "wide",
        position: { top: 32, left: 0, right: 0 },
        duration: 52,
        reverse: false,
        offsetX: 0,
        enabled: true
      },
      {
        id: "web-mixed",
        label: "スライド / 広告バナー",
        trackClass: "loop-track--web-mixed",
        variant: "mixed",
        position: { top: 58, left: 0, right: 0 },
        duration: 62,
        reverse: true,
        offsetX: -96,
        enabled: true
      }
    ]
  },
  {
    id: "sns",
    label: "SNS運用代行",
    sectionClass: "ai-loop-section--sns-marketer",
    tracks: [
      {
        id: "sns-thumbnail",
        label: "YouTubeサムネイル",
        trackClass: "loop-track--sns-thumbnail",
        variant: "wide",
        position: { top: 29, left: 0, right: 0 },
        duration: 46,
        reverse: false,
        offsetX: -92,
        enabled: true
      },
      {
        id: "sns-social",
        label: "Instagram / X投稿 / ショート台本",
        trackClass: "loop-track--sns-social",
        variant: "portrait",
        position: { top: 58, left: 0, right: 0 },
        duration: 64,
        reverse: true,
        offsetX: -60,
        enabled: true
      }
    ]
  },
  {
    id: "consultant",
    label: "AIコンサルタント",
    sectionClass: "ai-loop-section--consultant",
    tracks: [
      {
        id: "consultant-deck",
        label: "研修 / 提案スライド",
        trackClass: "loop-track--consultant-deck",
        variant: "wide",
        position: { top: 39, left: 0, right: 0 },
        duration: 56,
        reverse: false,
        offsetX: -116,
        enabled: true
      },
      {
        id: "consultant-sheet",
        label: "法人研修スライド",
        trackClass: "loop-track--consultant-sheet",
        variant: "wide",
        position: { bottom: 10, left: 0, right: 0 },
        duration: 52,
        reverse: true,
        offsetX: -86,
        enabled: true
      }
    ]
  }
];

const HTML_SECTION_DEFS = [
  {
    id: "consultant-explain",
    label: "AIコンサルタントとは",
    imageSrc: "images/showcase-final/bg/consultant-explain.webp"
  },
  {
    id: "consultant-template",
    label: "AIコンサル資料モック",
    sectionClass: "consultant-template-section",
    mediaClass: "template-slide",
    mediaContainerClass: "template-screen",
    mediaLabel: "提案資料スライド",
    mediaMode: "image",
    firstMediaClass: "is-template-active"
  },
  {
    id: "video-mockup",
    label: "動画モックアップ",
    sectionClass: "ai-video-section",
    mediaClass: "video-placeholder-card",
    mediaContainerClass: "video-screen",
    mediaLabel: "動画モックアップ",
    mediaMode: "wrapped"
  },
  {
    id: "worker-income",
    label: "AI作業代行の収入化",
    imageSrc: "images/showcase-final/bg/worker-income.webp"
  },
  {
    id: "assistant-explain",
    label: "次世代オンライン秘書",
    imageSrc: "images/showcase-final/bg/assistant-explain.webp"
  },
  {
    id: "route-choice-cta",
    label: "ルート選択CTA",
    imageSrc: "images/showcase-final/bg/route-choice-cta.webp"
  }
];

const safeText = (value) => (typeof value === "string" ? value : "");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function normalizeHtmlSrc(value) {
  let src = safeText(value).trim().replace(/\\/g, "/").replace(/[?#].*$/, "");
  if (src.startsWith("/lp-assets/")) src = src.slice("/lp-assets/".length);
  if (src.startsWith("./")) src = src.slice(2);
  return src.replace(/^\/+/, "");
}

async function normalizeWritableImageSrc(value) {
  const src = normalizeHtmlSrc(value);
  if (!src.startsWith("images/")) {
    throw new Error(`ループ素材は lp/images 配下の画像を指定してください: ${src || "(空)"}`);
  }

  const resolved = path.resolve(LP_DIR, src);
  const imageRoot = path.resolve(IMAGE_DIR);
  if (resolved !== imageRoot && !resolved.startsWith(`${imageRoot}${path.sep}`)) {
    throw new Error(`LP画像ディレクトリ外の素材は指定できません: ${src}`);
  }

  const ext = path.extname(resolved).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) {
    throw new Error(`ループ素材は png / jpg / webp のみ指定できます: ${src}`);
  }

  if (!(await pathExists(resolved))) {
    throw new Error(`ループ素材が見つかりません: ${src}`);
  }

  return src;
}

function classLookahead(className) {
  return `(?=[^>]*class=["'][^"']*\\b${escapeRegExp(className)}\\b[^"']*["'])`;
}

function trackMarqueeClass(trackClass) {
  return trackClass.replace(/^loop-track/, "loop-marquee");
}

function extractLoopSectionBlock(html, def) {
  return extractLoopSectionMatch(html, def)?.block ?? "";
}

function extractLoopSectionMatch(html, def) {
  const re = new RegExp(`<section\\b${classLookahead(def.sectionClass)}[^>]*>[\\s\\S]*?<\\/section>`, "m");
  const match = html.match(re);
  return match ? { block: match[0], index: match.index ?? 0 } : null;
}

function mediaTrackDef(def, imageSrcs = [], images = []) {
  if (!def.mediaClass) return null;
  return {
    id: "media",
    label: def.mediaLabel ?? "モックアップ素材",
    trackClass: def.mediaClass,
    variant: "media",
    mediaOnly: true,
    settingsDisabled: true,
    position: { top: 0, left: 0, right: 0 },
    duration: 0,
    reverse: false,
    offsetX: 0,
    enabled: true,
    imageSrcs,
    images
  };
}

function extractImageSourceFromTag(tag) {
  return normalizeHtmlSrc(
    safeText(tag.match(/\sdata-src=(["'])([^"']+)\1/i)?.[2])
      || safeText(tag.match(/\ssrc=(["'])([^"']+)\1/i)?.[2])
  );
}

function extractImageMatchBySrc(html, src) {
  const normalizedSrc = normalizeHtmlSrc(src);
  const re = /<img\b[^>]*>/gm;
  for (const match of html.matchAll(re)) {
    if (extractImageSourceFromTag(match[0]) === normalizedSrc) {
      return { block: match[0], index: match.index ?? 0 };
    }
  }
  return null;
}

function extractBackgroundSrc(block) {
  const re = new RegExp(`<img\\b${classLookahead("loop-bg-image")}[^>]*\\bsrc=["']([^"']+)["'][^>]*>`, "m");
  const tag = block.match(re)?.[0] ?? "";
  return extractImageSourceFromTag(tag);
}

function uniqueSources(sources) {
  return [...new Set(sources.map(normalizeHtmlSrc).filter(Boolean))];
}

function extractMediaSourcesByClass(block, className) {
  if (!className) return [];
  const sources = [];
  const imageRe = new RegExp(`<img\\b${classLookahead(className)}[^>]*>`, "gm");
  for (const match of block.matchAll(imageRe)) {
    sources.push(extractImageSourceFromTag(match[0]));
  }

  const containerRe = new RegExp(`<[^>]+${classLookahead(className)}[^>]*>[\\s\\S]*?<\\/[^>]+>`, "gm");
  for (const match of block.matchAll(containerRe)) {
    for (const imageMatch of match[0].matchAll(/<img\b[^>]*>/g)) {
      sources.push(extractImageSourceFromTag(imageMatch[0]));
    }
  }

  return uniqueSources(sources);
}

function findDivRangeByClass(html, className) {
  const openRe = new RegExp(`<div\\b${classLookahead(className)}[^>]*>`, "m");
  const openMatch = openRe.exec(html);
  if (!openMatch) return null;

  const openStart = openMatch.index;
  const innerStart = openStart + openMatch[0].length;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = innerStart;
  let depth = 1;

  for (let match = tagRe.exec(html); match; match = tagRe.exec(html)) {
    if (match[0].startsWith("</")) {
      depth -= 1;
    } else {
      depth += 1;
    }
    if (depth === 0) {
      return {
        openStart,
        innerStart,
        innerEnd: match.index,
        closeEnd: tagRe.lastIndex
      };
    }
  }

  return null;
}

function extractTrackSources(block, trackClass) {
  const re = new RegExp(`<div\\b${classLookahead(trackClass)}[^>]*>([\\s\\S]*?)<\\/div>`, "m");
  const inner = block.match(re)?.[1] ?? "";
  return [...inner.matchAll(/<img\b[^>]*>/g)]
    .map((match) => extractImageSourceFromTag(match[0]))
    .filter(Boolean);
}

function extractElementOpenTag(block, className) {
  const re = new RegExp(`<div\\b${classLookahead(className)}[^>]*>`, "m");
  return block.match(re)?.[0] ?? "";
}

function extractStyleAttribute(openTag) {
  return safeText(openTag.match(/\sstyle=(["'])([\s\S]*?)\1/i)?.[2]);
}

function parseStyle(styleText) {
  const style = {};
  for (const rule of safeText(styleText).split(";")) {
    const index = rule.indexOf(":");
    if (index === -1) continue;
    const key = rule.slice(0, index).trim().toLowerCase();
    const value = rule.slice(index + 1).trim();
    if (key) style[key] = value;
  }
  return style;
}

function numberFromCss(value, unit) {
  const source = safeText(value).trim();
  if (!source) return null;
  const escapedUnit = escapeRegExp(unit);
  const match = source.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)${escapedUnit}$`, "i"));
  if (!match) return null;
  const number = Number(match[1]);
  return Number.isFinite(number) ? number : null;
}

function clampNumber(value, fallback, min, max, precision = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  const multiplier = 10 ** precision;
  return Math.min(max, Math.max(min, Math.round(number * multiplier) / multiplier));
}

function extractTrackSettings(block, trackDef) {
  const marqueeStyle = parseStyle(extractStyleAttribute(extractElementOpenTag(block, trackMarqueeClass(trackDef.trackClass))));
  const trackStyle = parseStyle(extractStyleAttribute(extractElementOpenTag(block, trackDef.trackClass)));
  const defaultPosition = trackDef.position ?? {};
  const top = numberFromCss(marqueeStyle.top, "%");
  const bottom = numberFromCss(marqueeStyle.bottom, "%");
  const left = numberFromCss(marqueeStyle.left, "%");
  const right = numberFromCss(marqueeStyle.right, "%");
  const duration = numberFromCss(trackStyle["animation-duration"], "s");
  const offsetX = numberFromCss(trackStyle["margin-left"], "px");
  const direction = safeText(trackStyle["animation-direction"]).toLowerCase();
  const useBottom = bottom != null || (top == null && defaultPosition.bottom != null);

  return {
    position: {
      ...(useBottom ? { bottom: bottom ?? defaultPosition.bottom ?? 0 } : { top: top ?? defaultPosition.top ?? 0 }),
      left: left ?? defaultPosition.left ?? 0,
      right: right ?? defaultPosition.right ?? 0
    },
    duration: duration ?? trackDef.duration ?? 48,
    reverse: direction ? direction === "reverse" : Boolean(trackDef.reverse),
    offsetX: offsetX ?? trackDef.offsetX ?? 0,
    enabled: marqueeStyle.display !== "none" && trackDef.enabled !== false
  };
}

function collapseDuplicatedSequence(sources) {
  if (sources.length > 1 && sources.length % 2 === 0) {
    const half = sources.length / 2;
    const left = sources.slice(0, half);
    const right = sources.slice(half);
    if (left.every((src, index) => src === right[index])) {
      return left;
    }
  }
  return sources;
}

async function imageInfo(src) {
  const resolved = path.resolve(LP_DIR, src);
  let mtime = "";
  try {
    mtime = String((await fs.stat(resolved)).mtimeMs);
  } catch {
    // Missing files are still returned so the UI can show what HTML references.
  }

  const fromImages = src.startsWith("images/") ? src.slice("images/".length) : src;
  const parts = fromImages.split("/");
  const group = parts.length > 1 ? parts.slice(0, -1).join("/") : "images";
  const fileName = path.basename(src);
  const title = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

  return {
    src,
    url: `/lp-assets/${src}${mtime ? `?v=${mtime}` : ""}`,
    name: fileName,
    title,
    group,
    exists: Boolean(mtime)
  };
}

async function walkImages(root, prefix = "") {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...await walkImages(absolute, relative));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    results.push(`images/showcase-final/${relative}`);
  }

  return results;
}

async function listLoopAssets() {
  const root = path.join(IMAGE_DIR, "showcase-final");
  if (!(await pathExists(root))) return [];
  const srcs = (await walkImages(root))
    .filter((src) => !src.startsWith("images/showcase-final/bg/"))
    .sort((a, b) => a.localeCompare(b));
  return Promise.all(srcs.map(imageInfo));
}

async function buildLoopSections(options = {}) {
  const includeAssets = options.includeAssets !== false;
  const html = await fs.readFile(LP_HTML_PATH, "utf8");
  const sections = [];

  for (const def of LOOP_SECTION_DEFS) {
    const match = extractLoopSectionMatch(html, def);
    if (!match) continue;

    const block = match.block;
    const backgroundSrc = extractBackgroundSrc(block);
    const tracks = [];

    for (const trackDef of def.tracks) {
      const imageSrcs = collapseDuplicatedSequence(extractTrackSources(block, trackDef.trackClass));
      const settings = extractTrackSettings(block, trackDef);
      tracks.push({
        ...trackDef,
        ...settings,
        imageSrcs,
        images: await Promise.all(imageSrcs.map(imageInfo))
      });
    }

    sections.push({
      id: def.id,
      label: def.label,
      sectionClass: def.sectionClass,
      htmlOrder: match.index,
      backgroundSrc,
      background: backgroundSrc ? await imageInfo(backgroundSrc) : null,
      tracks
    });
  }

  for (const def of HTML_SECTION_DEFS) {
    const match = def.imageSrc ? extractImageMatchBySrc(html, def.imageSrc) : extractLoopSectionMatch(html, def);
    if (!match) continue;

    const block = match.block;
    const backgroundSrc = def.imageSrc ? normalizeHtmlSrc(def.imageSrc) : extractBackgroundSrc(block);
    const mediaSrcs = extractMediaSourcesByClass(block, def.mediaClass);
    const mediaItems = await Promise.all(mediaSrcs.map(imageInfo));
    const mediaTrack = mediaTrackDef(def, mediaSrcs, mediaItems);
    sections.push({
      id: def.id,
      label: def.label,
      kind: "html",
      badge: "HTML",
      sectionClass: def.sectionClass ?? "",
      htmlOrder: match.index,
      backgroundSrc,
      background: backgroundSrc ? await imageInfo(backgroundSrc) : null,
      mediaItems,
      tracks: mediaTrack ? [mediaTrack] : []
    });
  }

  sections.sort((a, b) => a.htmlOrder - b.htmlOrder);

  const result = { sections };
  if (includeAssets) result.assets = await listLoopAssets();
  return result;
}

function imageTagsForTrack(imageSrcs) {
  const items = imageSrcs
    .map((src) => `                <img data-src="${src}" alt="">`)
    .join("\n");
  return `              <template class="loop-track-source">\n${items}\n              </template>`;
}

function mediaTagsForHtmlSection(def, imageSrcs) {
  return imageSrcs.map((src, index) => {
    if (def.mediaMode === "wrapped") {
      return `                <div class="${def.mediaClass}"><img src="${src}" alt="" loading="lazy" decoding="async" fetchpriority="low"></div>`;
    }

    const className = [def.mediaClass, index === 0 ? def.firstMediaClass : ""].filter(Boolean).join(" ");
    return `                <img class="${className}" src="${src}" alt="" loading="lazy" decoding="async" fetchpriority="low">`;
  }).join("\n");
}

function replaceTrackImages(sectionBlock, trackClass, imageSrcs) {
  const re = new RegExp(`(<div\\b${classLookahead(trackClass)}[^>]*>)[\\s\\S]*?(\\n\\s*<\\/div>)`, "m");
  if (!re.test(sectionBlock)) {
    throw new Error(`ループトラックが見つかりません: ${trackClass}`);
  }
  return sectionBlock.replace(re, (_, open, close) => `${open}\n${imageTagsForTrack(imageSrcs)}${close}`);
}

function replaceHtmlSectionMedia(sectionBlock, def, imageSrcs) {
  if (!def.mediaContainerClass || !def.mediaClass) {
    throw new Error(`${def.label} はGUIから差し替えられるモックアップ素材を持っていません。`);
  }

  const range = findDivRangeByClass(sectionBlock, def.mediaContainerClass);
  if (!range) {
    throw new Error(`モックアップ素材の配置先が見つかりません: ${def.mediaContainerClass}`);
  }

  const mediaTags = mediaTagsForHtmlSection(def, imageSrcs);
  return `${sectionBlock.slice(0, range.innerStart)}\n${mediaTags}\n              ${sectionBlock.slice(range.innerEnd)}`;
}

function normalizeTrackSettings(trackDef, payload = {}) {
  const position = payload.position && typeof payload.position === "object" ? payload.position : {};
  const useBottom = Object.prototype.hasOwnProperty.call(position, "bottom");
  const defaultPosition = trackDef.position ?? {};
  const nextPosition = {
    ...(useBottom
      ? { bottom: clampNumber(position.bottom, defaultPosition.bottom ?? 10, 0, 92, 1) }
      : { top: clampNumber(position.top, defaultPosition.top ?? 32, 0, 92, 1) }),
    left: clampNumber(position.left, defaultPosition.left ?? 0, 0, 45, 1),
    right: clampNumber(position.right, defaultPosition.right ?? 0, 0, 45, 1)
  };

  return {
    position: nextPosition,
    duration: clampNumber(payload.duration, trackDef.duration ?? 48, 8, 120, 1),
    reverse: payload.reverse == null ? Boolean(trackDef.reverse) : Boolean(payload.reverse),
    offsetX: clampNumber(payload.offsetX, trackDef.offsetX ?? 0, -240, 240, 1),
    enabled: payload.enabled == null ? trackDef.enabled !== false : payload.enabled !== false
  };
}

function cssStyleText(style) {
  return Object.entries(style)
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function replaceElementStyle(sectionBlock, className, style) {
  const styleText = cssStyleText(style);
  const re = new RegExp(`(<div\\b${classLookahead(className)}[^>]*)(>)`, "m");
  if (!re.test(sectionBlock)) {
    throw new Error(`ループ要素が見つかりません: ${className}`);
  }
  return sectionBlock.replace(re, (_, open, close) => {
    const withoutStyle = open.replace(/\sstyle=(["'])[\s\S]*?\1/i, "");
    return `${withoutStyle} style="${escapeHtmlAttribute(styleText)}"${close}`;
  });
}

function replaceTrackSettings(sectionBlock, trackDef, settings) {
  const position = settings.position ?? {};
  const marqueeStyle = {
    display: settings.enabled === false ? "none" : "",
    top: position.top != null ? `${position.top}%` : "auto",
    bottom: position.bottom != null ? `${position.bottom}%` : "auto",
    left: `${position.left ?? 0}%`,
    right: `${position.right ?? 0}%`
  };
  const trackStyle = {
    "animation-duration": `${settings.duration ?? trackDef.duration ?? 48}s`,
    "animation-direction": settings.reverse ? "reverse" : "normal",
    "margin-left": `${settings.offsetX ?? trackDef.offsetX ?? 0}px`
  };
  return replaceElementStyle(
    replaceElementStyle(sectionBlock, trackMarqueeClass(trackDef.trackClass), marqueeStyle),
    trackDef.trackClass,
    trackStyle
  );
}

async function updateLoopSection(sectionId, payload = {}) {
  const def = LOOP_SECTION_DEFS.find((item) => item.id === sectionId);
  const htmlDef = HTML_SECTION_DEFS.find((item) => item.id === sectionId);
  if (!def && !htmlDef) {
    throw new Error(`ループセクションが見つかりません: ${sectionId}`);
  }

  const requestedTracks = new Map(
    (Array.isArray(payload.tracks) ? payload.tracks : [])
      .map((track) => [safeText(track?.id), track])
  );

  const html = await fs.readFile(LP_HTML_PATH, "utf8");
  const targetDef = def ?? htmlDef;
  const originalBlock = htmlDef?.imageSrc
    ? extractImageMatchBySrc(html, htmlDef.imageSrc)?.block ?? ""
    : extractLoopSectionBlock(html, targetDef);
  if (!originalBlock) {
    throw new Error(`LP HTML内に対象セクションが見つかりません: ${targetDef.sectionClass ?? targetDef.imageSrc}`);
  }

  if (htmlDef) {
    const trackDef = mediaTrackDef(htmlDef);
    if (!trackDef) {
      throw new Error(`${htmlDef.label} はGUIから差し替えられるモックアップ素材を持っていません。`);
    }

    const rawTrack = requestedTracks.get(trackDef.id);
    const rawSrcs = Array.isArray(rawTrack) ? rawTrack : (Array.isArray(rawTrack?.imageSrcs) ? rawTrack.imageSrcs : []);
    const imageSrcs = [];
    for (const rawSrc of rawSrcs) {
      imageSrcs.push(await normalizeWritableImageSrc(rawSrc));
    }
    if (!imageSrcs.length) {
      throw new Error(`${htmlDef.label} のモックアップ素材を1枚以上選択してください。`);
    }

    const nextBlock = replaceHtmlSectionMedia(originalBlock, htmlDef, imageSrcs);
    if (nextBlock !== originalBlock) {
      await fs.writeFile(LP_HTML_PATH, html.replace(originalBlock, nextBlock), "utf8");
    }
    return buildLoopSections();
  }

  let nextBlock = originalBlock;
  for (const trackDef of def.tracks) {
    if (!requestedTracks.has(trackDef.id)) continue;
    const rawTrack = requestedTracks.get(trackDef.id);
    const rawSrcs = Array.isArray(rawTrack) ? rawTrack : (Array.isArray(rawTrack?.imageSrcs) ? rawTrack.imageSrcs : []);
    const imageSrcs = [];
    for (const rawSrc of rawSrcs) {
      imageSrcs.push(await normalizeWritableImageSrc(rawSrc));
    }
    if (!imageSrcs.length) {
      throw new Error(`${trackDef.label} のループ素材を1枚以上選択してください。`);
    }
    nextBlock = replaceTrackImages(nextBlock, trackDef.trackClass, imageSrcs);
    nextBlock = replaceTrackSettings(nextBlock, trackDef, normalizeTrackSettings(trackDef, rawTrack));
  }

  if (nextBlock !== originalBlock) {
    await fs.writeFile(LP_HTML_PATH, html.replace(originalBlock, nextBlock), "utf8");
  }

  return buildLoopSections();
}

export const loopSectionStore = {
  buildLoopSections,
  updateLoopSection
};
