/**
 * 実績者カルーセルの後乗せ写真位置を管理します。
 * 背景画像は生成物、本人写真だけHTML/CSSで重ねるため、縦位置をJSONで永続化します。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LP_DIR = path.join(REPO_ROOT, "projects/ai-income-course/ver01-fresh-green/lp");
const SETTINGS_FILE_NAME = "testimonial-photo-settings.json";
const SETTINGS_PATH = path.join(LP_DIR, SETTINGS_FILE_NAME);

export const TESTIMONIAL_SECTION_ID = "SEC-07";
export const TESTIMONIAL_SETTINGS_FILE_NAME = SETTINGS_FILE_NAME;

const SLIDE_DEFS = [
  {
    id: "tsukino",
    label: "月野さん",
    storySrc: "images/testimonials/tsukino-story.webp",
    voiceSrc: "images/testimonials/tsukino-voice.webp",
    photoSrc: "assets/testimonials/tsukino.png"
  },
  {
    id: "kato",
    label: "加藤さん",
    storySrc: "images/testimonials/kato-story.webp",
    voiceSrc: "images/testimonials/kato-voice.webp",
    photoSrc: "assets/testimonials/kato.png"
  },
  {
    id: "yuna",
    label: "ゆなさん",
    storySrc: "images/testimonials/yuna-story.webp",
    voiceSrc: "images/testimonials/yuna-voice.webp",
    photoSrc: "assets/testimonials/yuna.png"
  },
  {
    id: "nakamura",
    label: "中村さん",
    storySrc: "images/testimonials/nakamura-story.webp",
    voiceSrc: "images/testimonials/nakamura-voice.webp",
    photoSrc: "assets/testimonials/nakamura.png"
  },
  {
    id: "shimizu",
    label: "清水さん",
    storySrc: "images/testimonials/shimizu-story.webp",
    voiceSrc: "images/testimonials/shimizu-voice.webp",
    photoSrc: "assets/testimonials/shimizu.png"
  },
  {
    id: "sasaki",
    label: "佐々木さん",
    storySrc: "images/testimonials/sasaki-story.webp",
    voiceSrc: "images/testimonials/sasaki-voice.webp",
    photoSrc: "assets/testimonials/sasaki.png"
  },
  {
    id: "yamamoto",
    label: "山本さん",
    storySrc: "images/testimonials/yamamoto-story.webp",
    voiceSrc: "images/testimonials/yamamoto-voice.webp",
    photoSrc: "assets/testimonials/yamamoto.png"
  }
];

const DEFAULT_NAV_GROUP = { prevX: 18, prevYOffset: 0, nextX: 18, nextYOffset: 0 };
const DEFAULT_TESTIMONIAL_NAV = {
  center: { prevX: 58, prevYOffset: 0, nextX: 58, nextYOffset: 0 },
  story: { prevX: 3, prevYOffset: 0, nextX: 8, nextYOffset: 0 },
  voice: { prevX: 10, prevYOffset: 0, nextX: 10, nextYOffset: 0 }
};

function clampNav(value, min = 0, max = 120) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(min, Math.min(max, number));
}

function clamp(value, min = -8, max = 8) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(min, Math.min(max, number));
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizePosition(value) {
  return round(clamp(value), 2);
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function assetMtime(src) {
  try {
    return (await fs.stat(path.join(LP_DIR, src))).mtimeMs;
  } catch {
    return 0;
  }
}

function assetUrl(src, mtime = 0) {
  return `/lp-assets/${src}${mtime ? `?v=${mtime}` : ""}`;
}

function defaultSettings() {
  return {
    version: 1,
    storyNav: {
      center: { ...DEFAULT_TESTIMONIAL_NAV.center },
      story: { ...DEFAULT_TESTIMONIAL_NAV.story },
      voice: { ...DEFAULT_TESTIMONIAL_NAV.voice }
    },
    slides: Object.fromEntries(SLIDE_DEFS.map((slide) => [
      slide.id,
      {
        photoYPercent: 0,
        voiceIconXPercent: 0,
        voiceIconYPercent: 0
      }
    ]))
  };
}

function normalizeNavGroup(raw, defaults = DEFAULT_NAV_GROUP) {
  return {
    prevX: round(clampNav(raw?.prevX ?? defaults.prevX, 0, 120), 1),
    prevYOffset: round(clamp(raw?.prevYOffset ?? 0, -20, 20), 2),
    nextX: round(clampNav(raw?.nextX ?? defaults.nextX, 0, 120), 1),
    nextYOffset: round(clamp(raw?.nextYOffset ?? 0, -20, 20), 2)
  };
}

function normalizeStoryNav(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const legacyStory = source.prevX !== undefined || source.nextX !== undefined || source.prevYOffset !== undefined || source.nextYOffset !== undefined;
  return {
    center: normalizeNavGroup(source.center, DEFAULT_TESTIMONIAL_NAV.center),
    story: normalizeNavGroup(legacyStory ? source : source.story, DEFAULT_TESTIMONIAL_NAV.story),
    voice: normalizeNavGroup(source.voice, DEFAULT_TESTIMONIAL_NAV.voice)
  };
}

export async function getTestimonialSettings() {
  if (!(await pathExists(SETTINGS_PATH))) return defaultSettings();
  try {
    const parsed = JSON.parse(await fs.readFile(SETTINGS_PATH, "utf8"));
    const defaults = defaultSettings();
    return {
      version: 1,
      storyNav: normalizeStoryNav(parsed?.storyNav),
      slides: Object.fromEntries(SLIDE_DEFS.map((slide) => [
        slide.id,
        {
          photoYPercent: normalizePosition(parsed?.slides?.[slide.id]?.photoYPercent ?? defaults.slides[slide.id].photoYPercent),
          voiceIconXPercent: normalizePosition(parsed?.slides?.[slide.id]?.voiceIconXPercent ?? defaults.slides[slide.id].voiceIconXPercent),
          voiceIconYPercent: normalizePosition(parsed?.slides?.[slide.id]?.voiceIconYPercent ?? defaults.slides[slide.id].voiceIconYPercent)
        }
      ]))
    };
  } catch {
    return defaultSettings();
  }
}

export async function saveTestimonialSettings(settings) {
  const normalized = {
    version: 1,
    storyNav: normalizeStoryNav(settings?.storyNav),
    slides: Object.fromEntries(SLIDE_DEFS.map((slide) => [
      slide.id,
      {
        photoYPercent: normalizePosition(settings?.slides?.[slide.id]?.photoYPercent),
        voiceIconXPercent: normalizePosition(settings?.slides?.[slide.id]?.voiceIconXPercent),
        voiceIconYPercent: normalizePosition(settings?.slides?.[slide.id]?.voiceIconYPercent)
      }
    ]))
  };
  await fs.writeFile(SETTINGS_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

export async function saveTestimonialPhotoPosition(slideId, photoYPercent) {
  return saveTestimonialPositions(slideId, { photoYPercent });
}

export async function saveTestimonialPositions(slideId, positions = {}) {
  const slide = SLIDE_DEFS.find((item) => item.id === slideId);
  if (!slide) throw new Error(`実績者スライドが見つかりません: ${slideId}`);
  const settings = await getTestimonialSettings();
  settings.slides[slide.id] = {
    ...settings.slides[slide.id],
    photoYPercent: normalizePosition(positions.photoYPercent ?? settings.slides[slide.id]?.photoYPercent),
    voiceIconXPercent: normalizePosition(positions.voiceIconXPercent ?? settings.slides[slide.id]?.voiceIconXPercent),
    voiceIconYPercent: normalizePosition(positions.voiceIconYPercent ?? settings.slides[slide.id]?.voiceIconYPercent)
  };
  await saveTestimonialSettings(settings);
  return getTestimonialSlides();
}

export async function saveStoryNavSettings(storyNav) {
  const settings = await getTestimonialSettings();
  settings.storyNav = normalizeStoryNav(storyNav);
  await saveTestimonialSettings(settings);
  return settings.storyNav;
}

export async function getTestimonialSlides() {
  const settings = await getTestimonialSettings();
  const slides = await Promise.all(SLIDE_DEFS.map(async (slide) => {
    const [storyMtime, voiceMtime, photoMtime] = await Promise.all([
      assetMtime(slide.storySrc),
      assetMtime(slide.voiceSrc),
      assetMtime(slide.photoSrc)
    ]);
    return {
      ...slide,
      backgroundSrc: slide.storySrc,
      backgroundImageName: slide.storySrc.replace(/^images\//, ""),
      backgroundUrl: assetUrl(slide.storySrc, storyMtime),
      storyImageName: slide.storySrc.replace(/^images\//, ""),
      storyUrl: assetUrl(slide.storySrc, storyMtime),
      voiceImageName: slide.voiceSrc.replace(/^images\//, ""),
      voiceUrl: assetUrl(slide.voiceSrc, voiceMtime),
      photoUrl: assetUrl(slide.photoSrc, photoMtime),
      photoYPercent: settings.slides[slide.id]?.photoYPercent ?? 0,
      voiceIconXPercent: settings.slides[slide.id]?.voiceIconXPercent ?? 0,
      voiceIconYPercent: settings.slides[slide.id]?.voiceIconYPercent ?? 0
    };
  }));
  return { slides, storyNav: settings.storyNav };
}
