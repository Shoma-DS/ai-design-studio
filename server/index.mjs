/**
 * LP編集GUIのローカルサーバーです。
 * Viteの画面配信と、Markdown・画像・Vercel操作APIを同じポートで提供します。
 */
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import { lpStore, REPO_ROOT, HISTORY_ROOT } from "./lpStore.mjs";
import { getRefImages, saveRefImage, generateRefImage, deleteRefImage, REF_IMAGE_DIR } from "./refImageStore.mjs";
import { getLinkAreas, saveLinkAreas, getUrlPresets, saveUrlPresets, exportFullPageLinkAreas } from "./linkAreaStore.mjs";
import { loopSectionStore } from "./loopSectionStore.mjs";
import { getTestimonialSlides, saveTestimonialPhotoPosition, saveTestimonialPositions, saveStoryNavSettings } from "./testimonialStore.mjs";
import {
  COMPOSITION_ROOT,
  deleteComposition,
  getSelectedCompositions,
  listCompositions,
  saveComposition,
  selectComposition
} from "./compositionStore.mjs";

await loadLocalEnv();

const app = express();
const port = Number(process.env.PORT || 5177);
const isProduction = process.env.NODE_ENV === "production";
const isVercel = Boolean(process.env.VERCEL);

async function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const envPath = path.join(REPO_ROOT, fileName);
    let raw = "";
    try {
      raw = await fs.readFile(envPath, "utf8");
    } catch {
      continue;
    }

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

app.use(express.json({ limit: "60mb" }));
if (!isVercel) {
  app.use("/lp-assets", express.static(lpStore.LP_DIR, {
    etag: false,
    maxAge: 0
  }));
  app.use("/history-assets", express.static(HISTORY_ROOT, {
    etag: false,
    maxAge: 0
  }));
  app.use("/ref-image-assets", express.static(REF_IMAGE_DIR, {
    etag: false,
    maxAge: 0
  }));
  app.use("/composition-assets", express.static(COMPOSITION_ROOT, {
    etag: false,
    maxAge: 0
  }));
}

function asyncRoute(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

let activeAbortController = null;
let mutationLock = Promise.resolve();

function lockedRoute(handler) {
  return asyncRoute(async (req, res) => {
    const previous = mutationLock;
    let release;
    mutationLock = new Promise((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      await handler(req, res);
    } finally {
      release();
    }
  });
}

app.get("/api/state", asyncRoute(async (_req, res) => {
  const [state, gitStatus] = await Promise.all([
    lpStore.buildSections(),
    lpStore.getGitStatus()
  ]);
  res.json({
    ...state,
    gitStatus,
    imageGeneration: lpStore.getCodexImageServerStatus(),
    vercelCommand: process.env.LP_VERCEL_COMMAND || "npx vercel --prod --yes"
  });
}));

app.get("/api/sections/:id/history", asyncRoute(async (req, res) => {
  res.json({ snapshots: await lpStore.listSnapshots(req.params.id, req.query?.field) });
}));

app.post("/api/history/undo", lockedRoute(async (_req, res) => {
  res.json(await lpStore.undoOperation());
}));

app.post("/api/history/redo", lockedRoute(async (_req, res) => {
  res.json(await lpStore.redoOperation());
}));

app.get("/api/state-snapshots", asyncRoute(async (_req, res) => {
  res.json({ snapshots: await lpStore.listStateSnapshots() });
}));

app.post("/api/state-snapshots", lockedRoute(async (req, res) => {
  res.json(await lpStore.createStateSnapshot(req.body ?? {}));
}));

app.post("/api/state-snapshots/:id/restore", lockedRoute(async (req, res) => {
  res.json(await lpStore.restoreStateSnapshot(req.params.id));
}));

app.delete("/api/state-snapshots/:id", lockedRoute(async (req, res) => {
  res.json(await lpStore.deleteStateSnapshot(req.params.id));
}));

app.post("/api/sections", lockedRoute(async (req, res) => {
  res.json(await lpStore.addSection(req.body ?? {}));
}));

app.delete("/api/sections/:id", lockedRoute(async (req, res) => {
  res.json(await lpStore.deleteSection(req.params.id));
}));

app.post("/api/sections/:id/save", lockedRoute(async (req, res) => {
  res.json(await lpStore.saveSection(req.params.id, req.body ?? {}));
}));

app.post("/api/structure/apply", lockedRoute(async (req, res) => {
  const sections = Array.isArray(req.body?.sections) ? req.body.sections : [];
  res.json(await lpStore.applySectionStructure(sections));
}));

app.post("/api/sections/:id/restore", lockedRoute(async (req, res) => {
  res.json(await lpStore.restoreSection(req.params.id, req.body?.field));
}));

app.post("/api/sections/:id/restore-snapshot", lockedRoute(async (req, res) => {
  res.json(await lpStore.restoreSnapshot(req.params.id, req.body?.snapshotFile, req.body?.field));
}));

app.post("/api/sections/:id/image", lockedRoute(async (req, res) => {
  res.json(await lpStore.replaceImage(req.params.id, req.body?.dataUrl));
}));

app.post("/api/sections/:id/generate-image", asyncRoute(async (req, res) => {
  const refImageNames = Array.isArray(req.body?.refImageNames) ? req.body.refImageNames : [];
  const compositionId = String(req.body?.compositionId ?? "");
  const promptOverride = typeof req.body?.promptOverride === "string" ? req.body.promptOverride : "";
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.generateImage(req.params.id, refImageNames, { signal: ac.signal, compositionId, promptOverride }));
  } finally {
    activeAbortController = null;
  }
}));

app.post("/api/sections/:id/regenerate-prompt", asyncRoute(async (req, res) => {
  const instruction = String(req.body?.instruction ?? "");
  const refImageNames = Array.isArray(req.body?.refImageNames) ? req.body.refImageNames : [];
  const compositionId = String(req.body?.compositionId ?? "");
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.regeneratePrompt(req.params.id, instruction, refImageNames, { signal: ac.signal, compositionId }));
  } finally {
    activeAbortController = null;
  }
}));

app.post("/api/sections/:id/regenerate-copy", asyncRoute(async (req, res) => {
  const instruction = String(req.body?.instruction ?? "");
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.regenerateCopy(req.params.id, instruction, { signal: ac.signal }));
  } finally {
    activeAbortController = null;
  }
}));

app.get("/api/global-prompt-rules", asyncRoute(async (_req, res) => {
  res.json({ rules: await lpStore.getGlobalPromptRules() });
}));

app.post("/api/global-prompt-rules", lockedRoute(async (req, res) => {
  res.json(await lpStore.saveGlobalPromptRules(req.body?.rules ?? ""));
}));

app.post("/api/prompts/regenerate-bulk", asyncRoute(async (req, res) => {
  const sectionIds = Array.isArray(req.body?.sectionIds) ? req.body.sectionIds : [];
  const globalInstruction = String(req.body?.globalInstruction ?? "");
  const refImageNames = Array.isArray(req.body?.refImageNames) ? req.body.refImageNames : [];
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.regeneratePromptsBulk(sectionIds, globalInstruction, {
      refImageNames,
      includeExistingPrompts: req.body?.includeExistingPrompts !== false,
      signal: ac.signal
    }));
  } finally {
    activeAbortController = null;
  }
}));

app.post("/api/copy/regenerate-bulk", asyncRoute(async (req, res) => {
  const sectionIds = Array.isArray(req.body?.sectionIds) ? req.body.sectionIds : [];
  const globalInstruction = String(req.body?.globalInstruction ?? "");
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.regenerateCopyBulk(sectionIds, globalInstruction, {
      includeExistingCopy: req.body?.includeExistingCopy !== false,
      signal: ac.signal
    }));
  } finally {
    activeAbortController = null;
  }
}));

app.post("/api/batch-generate", asyncRoute(async (req, res) => {
  const sectionIds = Array.isArray(req.body?.sectionIds) ? req.body.sectionIds : [];
  const draftCopies = req.body?.draftCopies ?? {};
  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json(await lpStore.batchGenerateImages(sectionIds, draftCopies, { signal: ac.signal }));
  } finally {
    activeAbortController = null;
  }
}));

app.get("/api/ref-images", asyncRoute(async (_req, res) => {
  res.json({ refImages: await getRefImages() });
}));

app.post("/api/ref-images", lockedRoute(async (req, res) => {
  const { name, dataUrl } = req.body ?? {};
  res.json(await saveRefImage(name, dataUrl));
}));

app.post("/api/ref-images/generate", asyncRoute(async (req, res) => {
  res.json(await generateRefImage(req.body ?? {}));
}));

app.delete("/api/ref-images/:name", lockedRoute(async (req, res) => {
  await deleteRefImage(decodeURIComponent(req.params.name));
  res.json({ ok: true });
}));

app.get("/api/compositions", asyncRoute(async (req, res) => {
  res.json({
    compositions: await listCompositions(req.query?.styleKey, req.query?.sectionId)
  });
}));

app.get("/api/compositions/selected", asyncRoute(async (req, res) => {
  res.json({
    selected: await getSelectedCompositions(req.query?.styleKey)
  });
}));

app.post("/api/compositions", asyncRoute(async (req, res) => {
  const payload = req.body ?? {};
  let sourceImagePath = "";

  if (!payload.dataUrl) {
    const sectionId = String(payload.sectionId ?? "");
    const state = await lpStore.buildSections();
    const section = state.sections.find((item) => item.id === sectionId);
    if (!section) throw new Error(`セクション ${sectionId || "(未指定)"} が見つかりません。`);
    if (!section.imagePath) throw new Error(`${section.id} は保存できる画像がありません。`);

    sourceImagePath = path.resolve(REPO_ROOT, section.imagePath);
    const repoRootWithSep = `${REPO_ROOT}${path.sep}`;
    if (sourceImagePath !== REPO_ROOT && !sourceImagePath.startsWith(repoRootWithSep)) {
      throw new Error("構図化する画像パスがリポジトリ外を指しています。");
    }

    try {
      await fs.access(sourceImagePath);
    } catch {
      throw new Error(`${section.id} の画像ファイルが見つかりません: ${section.imagePath}`);
    }
  }

  const ac = new AbortController();
  activeAbortController = ac;
  try {
    res.json({ composition: await saveComposition(payload, { sourceImagePath, signal: ac.signal }) });
  } finally {
    activeAbortController = null;
  }
}));

app.post("/api/compositions/select", lockedRoute(async (req, res) => {
  res.json({
    selected: await selectComposition(req.body?.styleKey, req.body?.sectionId, req.body?.compositionId)
  });
}));

app.delete("/api/compositions/:id", lockedRoute(async (req, res) => {
  await deleteComposition(decodeURIComponent(req.params.id));
  res.json({ ok: true });
}));

app.get("/api/sections/:id/link-areas", asyncRoute(async (req, res) => {
  res.json({ areas: await getLinkAreas(decodeURIComponent(req.params.id)) });
}));

app.post("/api/sections/:id/link-areas", lockedRoute(async (req, res) => {
  const areas = Array.isArray(req.body?.areas) ? req.body.areas : [];
  const savedAreas = await saveLinkAreas(decodeURIComponent(req.params.id), areas);
  const state = await lpStore.buildSections();
  const exportedAreas = await exportFullPageLinkAreas(state.sections, lpStore.LP_DIR);
  res.json({ areas: savedAreas, exportedAreas });
}));

app.get("/api/testimonials", asyncRoute(async (_req, res) => {
  const { slides, storyNav } = await getTestimonialSlides();
  res.json({ slides, storyNav });
}));

app.post("/api/testimonials/:id/photo-position", lockedRoute(async (req, res) => {
  const { slides, storyNav } = await saveTestimonialPhotoPosition(req.params.id, req.body?.photoYPercent);
  res.json({ slides, storyNav });
}));

app.post("/api/testimonials/:id/positions", lockedRoute(async (req, res) => {
  const { slides, storyNav } = await saveTestimonialPositions(req.params.id, {
    photoYPercent: req.body?.photoYPercent,
    voiceIconXPercent: req.body?.voiceIconXPercent,
    voiceIconYPercent: req.body?.voiceIconYPercent
  });
  res.json({ slides, storyNav });
}));

app.post("/api/testimonials/story-nav", lockedRoute(async (req, res) => {
  const storyNav = await saveStoryNavSettings(req.body);
  res.json({ storyNav });
}));

app.get("/api/link-areas/url-presets", asyncRoute(async (_req, res) => {
  res.json({ presets: await getUrlPresets() });
}));

app.post("/api/link-areas/url-presets", lockedRoute(async (req, res) => {
  const presets = Array.isArray(req.body?.presets) ? req.body.presets : [];
  res.json({ presets: await saveUrlPresets(presets) });
}));

app.get("/api/loop-sections", asyncRoute(async (req, res) => {
  res.json(await loopSectionStore.buildLoopSections({
    includeAssets: req.query.assets === "1" || req.query.assets === "true"
  }));
}));

app.post("/api/loop-sections/:id", lockedRoute(async (req, res) => {
  res.json(await loopSectionStore.updateLoopSection(decodeURIComponent(req.params.id), req.body ?? {}));
}));

app.post("/api/cancel", asyncRoute(async (_req, res) => {
  if (activeAbortController && !activeAbortController.signal.aborted) {
    activeAbortController.abort();
    res.json({ cancelled: true });
  } else {
    res.json({ cancelled: false });
  }
  activeAbortController = null;
}));

app.post("/api/rebuild", lockedRoute(async (_req, res) => {
  const result = await lpStore.rebuildFullImage();
  const state = await lpStore.buildSections();
  await exportFullPageLinkAreas(state.sections, lpStore.LP_DIR);
  res.json(result);
}));

app.post("/api/deploy", lockedRoute(async (req, res) => {
  await lpStore.rebuildFullImage();
  const state = await lpStore.buildSections();
  await exportFullPageLinkAreas(state.sections, lpStore.LP_DIR);
  res.json(await lpStore.deployToVercel({ allowDirty: Boolean(req.body?.allowDirty) }));
}));

app.use((error, _req, res, _next) => {
  console.error("[api-error]", error);
  res.status(error.statusCode || 500).json({
    error: error instanceof Error ? error.message : String(error),
    code: error.code,
    gitStatus: error.gitStatus
  });
});

if (isProduction && !isVercel) {
  app.use(express.static(path.join(REPO_ROOT, "dist")));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(REPO_ROOT, "dist", "index.html"));
  });
} else if (!isProduction) {
  const hmrPort = Number(process.env.HMR_PORT || 0);
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      allowedHosts: true,
      ...(hmrPort ? { hmr: { port: hmrPort } } : {})
    },
    appType: "spa"
  });
  app.use(vite.middlewares);
}

if (!isVercel) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`LP Section Studio: http://127.0.0.1:${port}`);
  });
}

export default app;
