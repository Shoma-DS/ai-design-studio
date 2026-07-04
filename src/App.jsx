/**
 * LP Section Studio のメイン画面です。
 * 原稿、画像プロンプト、生成済み画像、履歴、公開比較をセクション単位で操作します。
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CheckSquare,
  Copy,
  Eye,
  EyeOff,
  FileText,
  History,
  Images,
  Layers,
  LayoutList,
  Link,
  LoaderCircle,
  MoveVertical,
  Plus,
  Redo2,
  RefreshCcw,
  Rocket,
  Save,
  Search,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Trash2,
  Undo2,
  Upload,
  Wand2,
  XCircle
} from "lucide-react";

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.error || data.message || `HTTP ${response.status}`;
    const error = new Error(`${detail}（${response.status} ${url}）`);
    Object.assign(error, data);
    throw error;
  }
  return data;
};

const EMPTY_SECTIONS = [];
const EMPTY_LOOP_DATA = { sections: [], assets: [] };
const DEFAULT_LINK_RADIUS = 8;
const DEFAULT_SHINE_RADIUS = 50;
const DEFAULT_SHINE_ANGLE = 105;
const DEFAULT_SHINE_WIDTH = 24;
const DEFAULT_SHINE_DURATION = 2.4;
const DEFAULT_SHINE_OPACITY = 88;
const SPECIAL_LINK_AREA_TARGETS = [
  {
    targetId: "HTML-route-choice-cta",
    imageUrl: "/lp-assets/images/showcase-final/bg/route-choice-cta.webp",
    title: "ルート選択CTA キラーん領域"
  }
];

function clampNumber(value, min = 0, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function roundedNumber(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function boundedNumber(value, min, max, fallback, digits = 1) {
  const number = Number(value);
  const source = Number.isFinite(number) ? number : fallback;
  return roundedNumber(clampNumber(source, min, max), digits);
}

function roundedRect(rect) {
  const x = clampNumber(rect?.x);
  const y = clampNumber(rect?.y);
  return {
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    width: +clampNumber(rect?.width, 0, 100 - x).toFixed(1),
    height: +clampNumber(rect?.height, 0, 100 - y).toFixed(1)
  };
}

function baseAreaRect(area) {
  return roundedRect({
    x: area?.x ?? 0,
    y: area?.y ?? 0,
    width: area?.width ?? 0,
    height: area?.height ?? 0
  });
}

function shineAreaRect(area) {
  return area?.shineRect ? roundedRect(area.shineRect) : baseAreaRect(area);
}

function linkAreaRadius(area) {
  return boundedNumber(area?.radius, 0, 50, DEFAULT_LINK_RADIUS, 1);
}

function shineAreaRadius(area) {
  return boundedNumber(area?.shineRadius, 0, 50, DEFAULT_SHINE_RADIUS, 1);
}

function shineAreaSettings(area) {
  return {
    radius: shineAreaRadius(area),
    angle: boundedNumber(area?.shineAngle, 70, 130, DEFAULT_SHINE_ANGLE, 0),
    width: boundedNumber(area?.shineWidth, 8, 50, DEFAULT_SHINE_WIDTH, 1),
    duration: boundedNumber(area?.shineDuration, 1.2, 6, DEFAULT_SHINE_DURATION, 1),
    opacity: boundedNumber(area?.shineOpacity, 10, 100, DEFAULT_SHINE_OPACITY, 0)
  };
}

function rectStyle(rect, radius = 0, extra = {}) {
  return {
    left: `${rect.x}%`,
    top: `${rect.y}%`,
    width: `${rect.width}%`,
    height: `${rect.height}%`,
    borderRadius: `${radius}%`,
    clipPath: `inset(0 round ${radius}%)`,
    ...extra
  };
}

function loopDraftsFromSections(sections = []) {
  return Object.fromEntries(sections.map((section) => [
    section.id,
    {
      tracks: Object.fromEntries((section.tracks ?? []).map((track) => [
        track.id,
        loopTrackDraft(track, { tracks: {} })
      ]))
    }
  ]));
}

function loopSectionDraft(section, drafts) {
  return drafts?.[section.id] ?? loopDraftsFromSections([section])[section.id] ?? { tracks: {} };
}

function normalizeLoopPosition(track, rawPosition = {}) {
  const source = rawPosition && typeof rawPosition === "object" ? rawPosition : {};
  const fallback = track.position ?? {};
  const useBottom = source.bottom != null || (source.top == null && fallback.bottom != null);
  return {
    ...(useBottom
      ? { bottom: Number(source.bottom ?? fallback.bottom ?? 10) }
      : { top: Number(source.top ?? fallback.top ?? 32) }),
    left: Number(source.left ?? fallback.left ?? 0),
    right: Number(source.right ?? fallback.right ?? 0)
  };
}

function loopTrackDraft(track, draft) {
  const raw = draft?.tracks?.[track.id];
  const rawObject = Array.isArray(raw) ? { imageSrcs: raw } : (raw && typeof raw === "object" ? raw : {});
  return {
    imageSrcs: [...(rawObject.imageSrcs ?? track.imageSrcs ?? [])],
    position: normalizeLoopPosition(track, rawObject.position),
    duration: Number(rawObject.duration ?? track.duration ?? 48),
    reverse: Boolean(rawObject.reverse ?? track.reverse),
    offsetX: Number(rawObject.offsetX ?? track.offsetX ?? 0),
    enabled: rawObject.enabled ?? track.enabled ?? true
  };
}

function loopTrackDraftEqual(track, draft) {
  const current = loopTrackDraft(track, { tracks: { [track.id]: draft } });
  const original = loopTrackDraft(track, { tracks: {} });
  const currentImages = current.imageSrcs ?? [];
  const originalImages = original.imageSrcs ?? [];
  const currentPosition = current.position ?? {};
  const originalPosition = original.position ?? {};

  return (
    originalImages.length === currentImages.length &&
    originalImages.every((src, index) => src === currentImages[index]) &&
    current.enabled === original.enabled &&
    current.reverse === original.reverse &&
    current.duration === original.duration &&
    current.offsetX === original.offsetX &&
    (currentPosition.top ?? null) === (originalPosition.top ?? null) &&
    (currentPosition.bottom ?? null) === (originalPosition.bottom ?? null) &&
    currentPosition.left === originalPosition.left &&
    currentPosition.right === originalPosition.right
  );
}

function loopSectionIsDirty(section, draft) {
  return (section.tracks ?? []).some((track) => !loopTrackDraftEqual(track, draft?.tracks?.[track.id]));
}

function loopAssetUrl(src, assetsBySrc) {
  return assetsBySrc.get(src)?.url ?? `/lp-assets/${src}`;
}

function loopAssetTitle(src, assetsBySrc) {
  return assetsBySrc.get(src)?.title ?? src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? src;
}

function buildLoopAssetsBySrc(assets = [], sections = []) {
  const map = new Map(assets.map((asset) => [asset.src, asset]));
  for (const section of sections) {
    if (section.background?.src && !map.has(section.background.src)) {
      map.set(section.background.src, section.background);
    }
    for (const track of section.tracks ?? []) {
      for (const image of track.images ?? []) {
        if (image.src && !map.has(image.src)) map.set(image.src, image);
      }
    }
    for (const image of section.mediaItems ?? []) {
      if (image.src && !map.has(image.src)) map.set(image.src, image);
    }
  }
  return map;
}

function groupLoopAssets(assets = []) {
  const groups = new Map();
  for (const asset of assets) {
    const group = asset.group || "images";
    groups.set(group, [...(groups.get(group) ?? []), asset]);
  }
  return [...groups.entries()];
}

function sectionMatchesQuery(section, query) {
  if (!query) return true;
  const haystack = [
    section.id,
    section.title,
    section.imageName,
    ...(section.testimonialSlides ?? []).flatMap((slide) => [
      slide.id,
      slide.label,
      slide.backgroundSrc,
      slide.photoSrc
    ])
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function loopSectionMatchesQuery(section, query) {
  if (!query) return true;
  const haystack = [
    "loop",
    section.id,
    section.label,
    section.kind,
    section.badge,
    section.sectionClass,
    section.backgroundSrc,
    ...(section.mediaItems ?? []).flatMap((item) => [item.src, item.title]),
    ...(section.tracks ?? []).flatMap((track) => [track.id, track.label, ...(track.imageSrcs ?? [])])
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function flowOrderValue(item) {
  const htmlOrder = Number(item.htmlOrder);
  if (Number.isFinite(htmlOrder)) return htmlOrder;
  return item.type === "section" ? 100000 + item.index * 10 : 200000 + item.index * 10;
}

function buildEditorFlowItems(sections = [], loopSections = [], filter = "") {
  const query = filter.trim().toLowerCase();
  const items = [
    ...sections
      .map((section, index) => ({ type: "section", key: `section-${section.id}`, section, index, htmlOrder: section.htmlOrder }))
      .filter((item) => sectionMatchesQuery(item.section, query)),
    ...loopSections
      .map((section, index) => ({ type: "loop", key: `loop-${section.id}`, section, index, htmlOrder: section.htmlOrder }))
      .filter((item) => loopSectionMatchesQuery(item.section, query))
  ];

  return items.sort((a, b) => flowOrderValue(a) - flowOrderValue(b) || a.index - b.index);
}

function busyLabel(busy) {
  if (!busy) return "";
  const sectionId = busy.match(/SEC-\d{2}[a-z]?/)?.[0] ?? "";
  if (busy === "reload") return "最新状態を読み込み中です。";
  if (busy === "rebuild") return "全セクション画像を縦長LP画像へ再結合しています。";
  if (busy === "deploy") return "LP再結合 → Vercel公開を実行中です。完了まで画面を閉じずにお待ちください。";
  if (busy === "ref-images-load") return "参照画像を読み込み中です。";
  if (busy === "ref-images-save") return "参照画像を登録しています。";
  if (busy === "ref-images-generate") return "Codex app-server / GPT Image 2 で参照素材を生成して保存しています。数分かかる場合があります。";
  if (busy === "ref-images-delete") return "参照画像を削除しています。";
  if (busy === "bulk-regen-prompts") return "全体方針を使って複数セクションの画像プロンプトを一括再生成しています。";
  if (busy === "bulk-regen-copy") return "全体方針を使って複数セクションのLP原稿を一括再生成しています。";
  if (busy === "add-section") return "新規セクションを追加しています。";
  if (busy === "apply-structure") return "セクション構成を保存しています。";
  if (busy === "state-snapshot-save") return "全セクションの名前付き状態を保存しています。";
  if (busy === "state-snapshot-restore") return "保存済みの全体状態へ復元しています。";
  if (busy === "state-snapshot-delete") return "全体状態の保存データを削除しています。";
  if (busy === "loop-load") return "無限ループセクションを読み込み中です。";
  if (busy.startsWith("loop-save-")) return "HTML演出素材の選択をLP HTMLへ保存しています。";
  if (busy.startsWith("testimonial-photo-")) return "実績者写真と感想顔アイコンの位置を保存しています。";
  if (busy === "batch-generate") return "選択したセクション画像を順番にバックグラウンド生成しています。";
  if (busy.startsWith("composition-save-")) return `${sectionId} の現在画像を Codex app-server / GPT Image 2 で白黒ワイヤーフレーム化しています。数分かかる場合があります。`;
  if (busy.startsWith("composition-select-")) return `${sectionId} の構図選択を保存し、プロンプトへ反映しています。`;
  if (busy === "undo") return "一つ前の状態に戻しています。";
  if (busy === "redo") return "戻した操作をやり直しています。";
  if (busy.startsWith("save-")) return `${sectionId} の原稿とプロンプトを保存しています。`;
  if (busy.startsWith("delete-")) return `${sectionId} をセクション構成から削除しています。`;
  if (busy.startsWith("generate-")) return `${sectionId} の画像を Codex app-server / GPT Image 2 で生成しています。数分かかる場合があります。`;
  if (busy.startsWith("upload-")) return `${sectionId} の画像をアップロードしてLP全体を更新しています。`;
  if (busy.startsWith("history-")) return `${sectionId} の選択した履歴を適用しています。`;
  if (busy.startsWith("restore-")) return `${sectionId} を履歴から復元しています。`;
  if (busy.startsWith("regen-copy-")) return `${sectionId} のLP原稿を Codex app-server で再生成しています。`;
  if (busy.startsWith("regen-prompt-")) return `${sectionId} のプロンプトを Codex app-server で再生成しています。数分かかる場合があります。`;
  return "処理を実行中です。";
}

function ToolbarButton({ icon: Icon, children, loading, className = "", ...props }) {
  return (
    <button className={`toolbar-button ${className}`} title={children} {...props}>
      {loading ? <LoaderCircle className="spin" size={16} /> : <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
}

function IconButton({ icon: Icon, label, loading, kind = "default", showLabel = false, ...props }) {
  return (
    <button
      className={`icon-button ${kind} ${showLabel ? "show-label" : ""}`}
      title={label}
      aria-label={label}
      data-tooltip={label}
      {...props}
    >
      {loading ? <LoaderCircle className="spin" size={16} /> : <Icon size={16} />}
      <span>{label}</span>
    </button>
  );
}

function useSectionDrafts(sections) {
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    setDrafts((current) => {
      const next = {};
      for (const section of sections) {
        next[section.id] = current[section.id] ?? {
          copy: section.copy,
          prompt: section.prompt
        };
      }
      return next;
    });
  }, [sections]);

  const updateDraft = (id, field, value) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? {}),
        [field]: value
      }
    }));
  };

  const resetDrafts = (nextSections) => {
    const next = {};
    for (const section of nextSections) {
      next[section.id] = {
        copy: section.copy,
        prompt: section.prompt
      };
    }
    setDrafts(next);
  };

  return { drafts, updateDraft, resetDrafts };
}

function useFieldNav(sectionId, field, sectionValue, draftValue, onDraftChange) {
  const [nav, setNav] = useState(null);
  const [loading, setLoading] = useState(false);

  const prevSectionValue = useRef(sectionValue);
  useEffect(() => {
    if (prevSectionValue.current !== sectionValue) {
      setNav(null);
      prevSectionValue.current = sectionValue;
    }
  }, [sectionValue]);

  const undo = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (nav === null) {
        const res = await fetch(`/api/sections/${encodeURIComponent(sectionId)}/history?field=${encodeURIComponent(field)}`);
        const data = await res.json();
        const snaps = (data.snapshots ?? []).filter(s =>
          s.changedFields?.includes(field) && typeof s[field] === "string"
        );
        if (snaps.length === 0) return;
        setNav({ snapshots: snaps, idx: 0, original: draftValue });
        onDraftChange(sectionId, field, snaps[0][field]);
      } else {
        const newIdx = nav.idx + 1;
        if (newIdx >= nav.snapshots.length) return;
        setNav(prev => ({ ...prev, idx: newIdx }));
        onDraftChange(sectionId, field, nav.snapshots[newIdx][field]);
      }
    } catch {
      // ignore network errors silently
    } finally {
      setLoading(false);
    }
  }, [sectionId, field, draftValue, nav, loading, onDraftChange]);

  const redo = useCallback(() => {
    if (!nav) return;
    const newIdx = nav.idx - 1;
    if (newIdx < 0) {
      onDraftChange(sectionId, field, nav.original);
      setNav(null);
    } else {
      setNav(prev => ({ ...prev, idx: newIdx }));
      onDraftChange(sectionId, field, nav.snapshots[newIdx][field]);
    }
  }, [sectionId, field, nav, onDraftChange]);

  const resetNav = useCallback(() => setNav(null), []);

  const label = nav ? `${nav.idx + 1}件前` : null;
  const canRedo = nav !== null;
  const atOldest = nav !== null && nav.idx >= nav.snapshots.length - 1;

  return { undo, redo, resetNav, loading, label, canRedo, atOldest };
}

const COMPOSITION_BLOCK_RE = /\n*────────────────\n【構図お気に入り参照】[\s\S]*?【構図お気に入り参照ここまで】\n*/g;

function injectCompositionReference(prompt, composition) {
  const base = String(prompt || "").replace(COMPOSITION_BLOCK_RE, "\n\n").trim();
  const block = [
    "────────────────",
    "【構図お気に入り参照】",
    `選択構図: ${composition.title}`,
    `構図ID: ${composition.id}`,
    "",
    "添付された白黒ワイヤーフレーム画像は、色・画風・コピーではなく構図だけを参照する。",
    "見出し、本文、CTA、人物/商品/背景要素、余白、視線誘導、情報ブロックの相対配置をこの構図に合わせる。",
    "ワイヤーフレーム内の仮文字や仮アイコンはそのまま再現せず、このセクションのLP原稿と画風ルールへ置き換える。",
    "【構図お気に入り参照ここまで】"
  ].join("\n");
  return `${base}\n\n${block}`;
}

function keywordLabelsFromSections(sections, drafts = {}) {
  const text = sections.map((section) => {
    const draft = drafts[section.id] ?? {};
    return [
      section.id,
      section.title,
      draft.copy ?? section.copy,
      draft.prompt ?? section.prompt
    ].join("\n");
  }).join("\n");

  const rules = [
    ["HERO", /hero|ファーストビュー|FV/i],
    ["CTA", /CTA|申し込|ボタン|無料講座/],
    ["AI副業", /AI副業|AI|ChatGPT/],
    ["構図", /構図|ワイヤーフレーム|wireframe/i],
    ["参照画像", /参照画像|@img|@botan|@baji|@instructor/i],
    ["実写", /実写|リアル人物|写真|人物/],
    ["グリーン", /グリーン|#2ECC71|ミント|fresh-green/i],
    ["FAQ", /FAQ|Q[0-9]|よくある/],
    ["比較", /比較|comparison/i],
    ["実績", /実績|受講者|事例/]
  ];

  return rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function buildStateSnapshotSuggestion(sections, drafts, dirtySections) {
  const focusSections = dirtySections.length ? dirtySections : sections;
  const dirtyIds = dirtySections.map((section) => section.id);
  const labels = new Set(["全体"]);

  if (dirtySections.length) {
    labels.add("未保存あり");
    const hasCopyChange = dirtySections.some((section) => drafts[section.id]?.copy !== section.copy);
    const hasPromptChange = dirtySections.some((section) => drafts[section.id]?.prompt !== section.prompt);
    if (hasCopyChange) labels.add("原稿変更");
    if (hasPromptChange) labels.add("プロンプト変更");
  } else {
    labels.add("バックアップ");
  }

  for (const label of keywordLabelsFromSections(focusSections, drafts)) {
    labels.add(label);
  }

  const title = (() => {
    if (dirtySections.length === 1) {
      const section = dirtySections[0];
      return `${section.id} ${section.title} 調整案`;
    }
    if (dirtySections.length > 1 && dirtySections.length <= 3) {
      return `${dirtyIds.join("・")} 調整案`;
    }
    if (dirtySections.length > 3) {
      return `全体調整案 ${dirtySections.length}セクション`;
    }
    const hero = sections.find((section) => /hero|ファーストビュー/i.test(`${section.id} ${section.title}`));
    return hero ? `全体バックアップ ${hero.title}基準` : "全体バックアップ 現状";
  })();

  const imageCount = sections.filter((section) => section.imageName).length;
  const focusSummary = dirtySections.length
    ? dirtySections.slice(0, 6).map((section) => {
        const draft = drafts[section.id] ?? {};
        const changed = [
          draft.copy !== section.copy ? "原稿" : "",
          draft.prompt !== section.prompt ? "プロンプト" : ""
        ].filter(Boolean).join("・") || "変更";
        return `${section.id} ${section.title}（${changed}）`;
      }).join("\n")
    : sections.slice(0, 6).map((section) => `${section.id} ${section.title}`).join("\n");

  const noteLines = dirtySections.length
    ? [
        `未保存ドラフト ${dirtySections.length}件を含む状態保存候補。`,
        focusSummary,
        `セクション ${sections.length}件 / 画像 ${imageCount}件。`
      ]
    : [
        "現在の全セクション構成をそのまま復元するためのバックアップ候補。",
        focusSummary,
        `セクション ${sections.length}件 / 画像 ${imageCount}件。`
      ];

  return {
    title,
    labels: [...labels].slice(0, 7),
    note: noteLines.filter(Boolean).join("\n")
  };
}

function App() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [backgroundTasks, setBackgroundTasks] = useState([]);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("");
  const [generateProgress, setGenerateProgress] = useState({});
  const [showPrompts, setShowPrompts] = useState(true);
  const [viewMode, setViewMode] = useState("editor");
  const [historyTarget, setHistoryTarget] = useState(null);
  const [historySnapshots, setHistorySnapshots] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showStateSnapshots, setShowStateSnapshots] = useState(false);
  const [stateSnapshots, setStateSnapshots] = useState([]);
  const [stateSnapshotsLoading, setStateSnapshotsLoading] = useState(false);
  const [selectedSections, setSelectedSections] = useState(new Set());
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [refImages, setRefImages] = useState([]);
  const [showRefImageManager, setShowRefImageManager] = useState(false);
  const [regenerateTarget, setRegenerateTarget] = useState(null);
  const [showBulkPromptRegenerate, setShowBulkPromptRegenerate] = useState(false);
  const [globalPromptRules, setGlobalPromptRules] = useState("");
  const [addSectionTarget, setAddSectionTarget] = useState(null);
  const [showStructureEditor, setShowStructureEditor] = useState(false);
  const [copyRegenerateTarget, setCopyRegenerateTarget] = useState(null);
  const [showBulkCopyRegenerate, setShowBulkCopyRegenerate] = useState(false);
  const [linkAreaTarget, setLinkAreaTarget] = useState(null);
  const [urlPresets, setUrlPresets] = useState([]);
  const [compositionPickerTarget, setCompositionPickerTarget] = useState(null);
  const [compositionFavorites, setCompositionFavorites] = useState({});
  const [selectedCompositions, setSelectedCompositions] = useState({});
  const [loopData, setLoopData] = useState(EMPTY_LOOP_DATA);
  const [loopDrafts, setLoopDrafts] = useState({});
  const [loopEditTarget, setLoopEditTarget] = useState(null);
  const backgroundTasksRef = useRef([]);

  const sections = state?.sections ?? EMPTY_SECTIONS;
  const loopSections = loopData.sections ?? [];
  const loopAssets = loopData.assets ?? [];
  const operationHistory = state?.operationHistory ?? {};
  const compositionStyleKey = "ver01-fresh-green";
  const { drafts, updateDraft, resetDrafts } = useSectionDrafts(sections);
  const dirtySections = useMemo(() => sections.filter((section) => {
    const draft = drafts[section.id];
    return draft && (draft.copy !== section.copy || draft.prompt !== section.prompt);
  }), [sections, drafts]);
  const stateSnapshotSuggestion = useMemo(
    () => buildStateSnapshotSuggestion(sections, drafts, dirtySections),
    [sections, drafts, dirtySections]
  );
  const isReadOnly = Boolean(state?.project?.readOnly);
  const isBusy = Boolean(busy);
  const hasBackgroundTasks = backgroundTasks.length > 0;
  const activeBackgroundKey = backgroundTasks[0]?.key ?? (batchGenerating ? "batch-generate" : "");
  const activeStatusKey = busy || activeBackgroundKey;
  const isProcessing = Boolean(activeStatusKey);

  useEffect(() => {
    backgroundTasksRef.current = backgroundTasks;
  }, [backgroundTasks]);

  const isBackgroundTaskRunning = useCallback((key) => {
    return backgroundTasksRef.current.some((task) => task.key === key);
  }, []);

  const filteredSections = useMemo(() => {
    const query = filter.trim().toLowerCase();
    return sections.filter((section) => sectionMatchesQuery(section, query));
  }, [sections, filter]);
  const editorFlowItems = useMemo(
    () => buildEditorFlowItems(sections, loopSections, filter),
    [sections, loopSections, filter]
  );
  const nextSectionId = useMemo(() => {
    const max = sections.reduce((value, section) => {
      const number = Number(section.id.match(/^SEC-(\d{2})/)?.[1] ?? 0);
      return Number.isFinite(number) ? Math.max(value, number) : value;
    }, 0);
    return `SEC-${String(max + 1).padStart(2, "0")}`;
  }, [sections]);

  const loadState = async () => {
    const next = await api("/api/state");
    setState(next);
    resetDrafts(next.sections);
    return next;
  };

  const loadLoopSections = async ({ includeAssets = false } = {}) => {
    const next = await api(`/api/loop-sections${includeAssets ? "?assets=1" : ""}`);
    const normalized = {
      sections: next.sections ?? [],
      assets: next.assets ?? loopData.assets ?? []
    };
    setLoopData(normalized);
    setLoopDrafts(loopDraftsFromSections(normalized.sections));
    return normalized;
  };

  useEffect(() => {
    Promise.all([loadState(), loadLoopSections()])
      .catch((error) => setToast({ type: "error", message: error.message }))
      .finally(() => setLoading(false));
    api("/api/ref-images")
      .then((data) => setRefImages(data.refImages ?? []))
      .catch(() => {});
    api("/api/global-prompt-rules")
      .then((data) => setGlobalPromptRules(data.rules ?? ""))
      .catch(() => {});
    api("/api/link-areas/url-presets")
      .then((data) => setUrlPresets(data.presets ?? []))
      .catch(() => {});
    api(`/api/compositions/selected?styleKey=${encodeURIComponent(compositionStyleKey)}`)
      .then((data) => setSelectedCompositions(data.selected ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast || toast.type === "error") return;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  const commitState = (next, message) => {
    if (next.sections) {
      setState((current) => ({ ...(current ?? {}), ...next }));
      resetDrafts(next.sections);
    }
    if (message) {
      setToast({ type: "success", message });
    }
  };

  const runAction = async (key, fn) => {
    if (busy) return;
    setBusy(key);
    setToast(null);
    try {
      return await fn();
    } catch (error) {
      setToast({ type: "error", message: error.message });
      return null;
    } finally {
      setBusy("");
    }
  };

  const startBackgroundTask = (key, fn, options = {}) => {
    if (busy) return Promise.resolve(false);
    if (batchGenerating || backgroundTasksRef.current.length > 0) {
      setToast({ type: "info", message: "別の生成処理が進行中です。完了してからもう一度実行してください。" });
      return Promise.resolve(false);
    }

    const task = {
      id: `${key}-${Date.now()}`,
      key,
      title: options.title || busyLabel(key),
      startedAt: Date.now()
    };
    backgroundTasksRef.current = [...backgroundTasksRef.current, task];
    setBackgroundTasks((current) => [...current, task]);
    setToast({ type: "info", message: `${task.title} バックグラウンドで開始しました。` });

    return Promise.resolve()
      .then(fn)
      .catch((error) => {
        setToast({ type: "error", message: error.message });
        return false;
      })
      .finally(() => {
        backgroundTasksRef.current = backgroundTasksRef.current.filter((item) => item.id !== task.id);
        setBackgroundTasks((current) => current.filter((item) => item.id !== task.id));
      });
  };

  const confirmDiscardDirty = (message) => {
    if (!dirtySections.length) return true;
    return window.confirm(
      `${message}\n\n未保存のドラフトがあります: ${dirtySections.map((section) => section.id).join(", ")}\n続けると、現在のファイル状態で画面を更新します。`
    );
  };

  const reloadAll = () => runAction("reload", async () => {
    await Promise.all([loadState(), loadLoopSections()]);
  });

  const saveSection = (section) => runAction(`save-${section.id}`, async () => {
    const draft = drafts[section.id];
    const next = await api(`/api/sections/${section.id}/save`, {
      method: "POST",
      body: JSON.stringify({
        copy: draft?.copy ?? "",
        prompt: draft?.prompt ?? ""
      })
    });
    commitState(next, `${section.id} を保存しました。`);
  });

  const saveAllDirty = () => runAction("save-all", async () => {
    for (const section of dirtySections) {
      const draft = drafts[section.id];
      await api(`/api/sections/${section.id}/save`, {
        method: "POST",
        body: JSON.stringify({ copy: draft?.copy ?? "", prompt: draft?.prompt ?? "" })
      });
    }
    await loadState();
    setToast({ type: "success", message: `${dirtySections.length} 件のセクションを保存しました。` });
  });

  const updateLoopTrackDraft = (sectionId, trackId, patch) => {
    setLoopDrafts((current) => ({
      ...current,
      [sectionId]: {
        tracks: {
          ...(current[sectionId]?.tracks ?? {}),
          [trackId]: (() => {
            const previous = current[sectionId]?.tracks?.[trackId];
            const previousObject = Array.isArray(previous) ? { imageSrcs: previous } : (previous ?? {});
            const patchObject = Array.isArray(patch) ? { imageSrcs: patch } : (patch ?? {});
            return {
              ...previousObject,
              ...patchObject,
              position: patchObject.position ?? previousObject.position
            };
          })()
        }
      }
    }));
  };

  const saveLoopSection = (loopSection) => runAction(`loop-save-${loopSection.id}`, async () => {
    const draft = loopSectionDraft(loopSection, loopDrafts);
    const result = await api(`/api/loop-sections/${encodeURIComponent(loopSection.id)}`, {
      method: "POST",
      body: JSON.stringify({
        tracks: (loopSection.tracks ?? []).map((track) => ({
          id: track.id,
          ...loopTrackDraft(track, draft)
        }))
      })
    });
    const normalized = {
      sections: result.sections ?? [],
      assets: result.assets ?? []
    };
    setLoopData(normalized);
    setLoopDrafts(loopDraftsFromSections(normalized.sections));
    setToast({ type: "success", message: `${loopSection.label} の${loopSection.kind === "html" ? "モックアップ素材" : "ループ素材"}を保存しました。` });
  });

  const undoOperation = () => {
    if (!confirmDiscardDirty("一つ前の保存済み状態に戻します。")) return;
    runAction("undo", async () => {
      const next = await api("/api/history/undo", { method: "POST" });
      commitState(next, "一つ前の状態に戻しました。");
      setSelectedSections(new Set());
    });
  };

  const redoOperation = () => {
    if (!confirmDiscardDirty("戻した操作をやり直します。")) return;
    runAction("redo", async () => {
      const next = await api("/api/history/redo", { method: "POST" });
      commitState(next, "操作をやり直しました。");
      setSelectedSections(new Set());
    });
  };

  const loadStateSnapshots = async () => {
    setStateSnapshotsLoading(true);
    try {
      const result = await api("/api/state-snapshots");
      setStateSnapshots(result.snapshots ?? []);
      return result.snapshots ?? [];
    } finally {
      setStateSnapshotsLoading(false);
    }
  };

  const openStateSnapshots = () => {
    setShowStateSnapshots(true);
    loadStateSnapshots().catch((error) => setToast({ type: "error", message: error.message }));
  };

  const createNamedStateSnapshot = (payload) => runAction("state-snapshot-save", async () => {
    const sectionDrafts = Object.fromEntries(sections.map((section) => {
      const draft = drafts[section.id] ?? {};
      return [section.id, {
        copy: draft.copy ?? section.copy,
        prompt: draft.prompt ?? section.prompt
      }];
    }));
    const result = await api("/api/state-snapshots", {
      method: "POST",
      body: JSON.stringify({ ...payload, sectionDrafts })
    });
    setStateSnapshots(result.snapshots ?? []);
    const draftNote = dirtySections.length ? " 未保存ドラフトも含めています。" : "";
    setToast({ type: "success", message: `全体状態「${result.snapshot?.title ?? payload.title}」を保存しました。${draftNote}` });
    return true;
  });

  const restoreNamedStateSnapshot = (snapshot) => {
    if (dirtySections.length && !confirmDiscardDirty("保存済みの全体状態へ復元します。")) return;
    if (!window.confirm(`全セクションを「${snapshot.title}」の状態へ戻しますか？\n\n原稿、画像プロンプト、セクション画像をまとめて復元します。`)) return;
    runAction("state-snapshot-restore", async () => {
      const next = await api(`/api/state-snapshots/${encodeURIComponent(snapshot.id)}/restore`, { method: "POST" });
      commitState(next, `全体状態「${snapshot.title}」へ復元しました。`);
      setSelectedSections(new Set());
      setShowStateSnapshots(false);
    });
  };

  const deleteNamedStateSnapshot = (snapshot) => {
    if (!window.confirm(`全体状態「${snapshot.title}」を削除しますか？`)) return;
    runAction("state-snapshot-delete", async () => {
      const result = await api(`/api/state-snapshots/${encodeURIComponent(snapshot.id)}`, { method: "DELETE" });
      setStateSnapshots(result.snapshots ?? []);
      setToast({ type: "success", message: `全体状態「${snapshot.title}」を削除しました。` });
    });
  };

  const addSection = (payload) => {
    if (!confirmDiscardDirty("新規セクションを追加します。")) return;
    runAction("add-section", async () => {
      const next = await api("/api/sections", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      commitState(next, `${payload.id} を追加しました。`);
      setAddSectionTarget(null);
      setFilter("");
      setSelectedSections(new Set());
    });
  };

  const deleteSection = (section) => {
    if (!window.confirm(`【確認】${section.id}「${section.title}」を削除しますか？\n\n・画像ファイルは削除されません\n・原稿とプロンプトの構成から外れます\n・Undoで元に戻せます`)) return;
    if (!confirmDiscardDirty(`${section.id} を削除します。`)) return;
    runAction(`delete-${section.id}`, async () => {
      const next = await api(`/api/sections/${section.id}`, { method: "DELETE" });
      commitState(next, `${section.id} を削除しました。Undoで戻せます。`);
      setSelectedSections((prev) => {
        const nextSelection = new Set(prev);
        nextSelection.delete(section.id);
        return nextSelection;
      });
    });
  };

  const applyStructure = (items) => {
    if (!confirmDiscardDirty("セクション構成を変更します。")) return;
    runAction("apply-structure", async () => {
      const next = await api("/api/structure/apply", {
        method: "POST",
        body: JSON.stringify({ sections: items })
      });
      commitState(next, "セクション構成を保存しました。");
      setShowStructureEditor(false);
      setSelectedSections(new Set());
      setFilter("");
    });
  };

  const openHistory = async (section, field) => {
    setHistoryTarget({
      section,
      field,
      currentCopy: drafts[section.id]?.copy ?? section.copy,
      currentPrompt: drafts[section.id]?.prompt ?? section.prompt
    });
    setHistorySnapshots([]);
    setHistoryLoading(true);
    try {
      const result = await api(`/api/sections/${section.id}/history?field=${encodeURIComponent(field)}`);
      setHistorySnapshots(result.snapshots ?? []);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setHistoryLoading(false);
    }
  };

  const restoreSnapshot = (snapshot) => runAction(`history-${historyTarget.field}-${historyTarget.section.id}`, async () => {
    const next = await api(`/api/sections/${historyTarget.section.id}/restore-snapshot`, {
      method: "POST",
      body: JSON.stringify({
        field: historyTarget.field,
        snapshotFile: snapshot.snapshotFile
      })
    });
    commitState(next, `${historyTarget.section.id} を選択した履歴へ戻しました。`);
    setHistoryTarget(null);
    setHistorySnapshots([]);
  });

  const generateImage = (section, refImageNames = [], promptOverride = "") => {
    const taskKey = `generate-${section.id}`;
    if (isBackgroundTaskRunning(taskKey)) return;
    const compositionId = selectedCompositions[section.id]?.id ?? "";

    let elapsed = 0;
    let timer = null;

    const finish = (success) => {
      if (timer) clearInterval(timer);
      if (success) {
        setGenerateProgress((prev) => ({ ...prev, [section.id]: 100 }));
        setTimeout(() => {
          setGenerateProgress((prev) => {
            const next = { ...prev };
            delete next[section.id];
            return next;
          });
        }, 1400);
      } else {
        setGenerateProgress((prev) => {
          const next = { ...prev };
          delete next[section.id];
          return next;
        });
      }
    };

    return startBackgroundTask(taskKey, async () => {
      setGenerateProgress((prev) => ({ ...prev, [section.id]: 1 }));
      timer = setInterval(() => {
        elapsed += 1;
        const progress = Math.min(93, 100 * (1 - Math.exp(-elapsed / 40)));
        setGenerateProgress((prev) => ({ ...prev, [section.id]: Math.round(progress) }));
      }, 1000);

      try {
        const result = await api(`/api/sections/${section.id}/generate-image`, {
          method: "POST",
          body: JSON.stringify({ refImageNames, compositionId, promptOverride })
        });
        finish(true);
        if (result.state) {
          commitState(result.state, `${section.id} の画像を更新しました。`);
        } else {
          setToast({ type: "info", message: `プロンプトを保存しました: ${result.promptFile}` });
        }
        return true;
      } catch (error) {
        finish(false);
        throw error;
      }
    });
  };

  const regeneratePrompt = (section, instruction, refImageNames) => startBackgroundTask(`regen-prompt-${section.id}`, async () => {
    const result = await api(`/api/sections/${section.id}/regenerate-prompt`, {
      method: "POST",
      body: JSON.stringify({
        instruction,
        refImageNames,
        compositionId: selectedCompositions[section.id]?.id ?? ""
      })
    });
    if (result.newPrompt) {
      updateDraft(section.id, "prompt", result.newPrompt);
      setToast({ type: "success", message: `${section.id} のプロンプトを再生成しました。保存して反映してください。` });
    }
    return true;
  });

  const regenerateCopy = (section, instruction) => startBackgroundTask(`regen-copy-${section.id}`, async () => {
    const result = await api(`/api/sections/${section.id}/regenerate-copy`, {
      method: "POST",
      body: JSON.stringify({ instruction })
    });
    if (result.newCopy) {
      updateDraft(section.id, "copy", result.newCopy);
      setToast({ type: "success", message: `${section.id} のLP原稿を再生成しました。保存して反映してください。` });
    }
    return true;
  });

  const bulkTargets = () => {
    const ids = selectedSections.size
      ? [...selectedSections]
      : filteredSections.map((section) => section.id);
    return ids
      .map((id) => sections.find((section) => section.id === id))
      .filter(Boolean);
  };

  const bulkPromptTargets = bulkTargets;

  const regeneratePromptsBulk = ({ globalInstruction, refImageNames, includeExistingPrompts }) => startBackgroundTask("bulk-regen-prompts", async () => {
    const targets = bulkPromptTargets();
    if (!targets.length) {
      throw new Error("一括再生成するセクションがありません。");
    }

    await api("/api/global-prompt-rules", {
      method: "POST",
      body: JSON.stringify({ rules: globalInstruction })
    });
    setGlobalPromptRules(globalInstruction);

    const result = await api("/api/prompts/regenerate-bulk", {
      method: "POST",
      body: JSON.stringify({
        sectionIds: targets.map((section) => section.id),
        globalInstruction,
        refImageNames,
        includeExistingPrompts
      })
    });

    for (const item of result.prompts ?? []) {
      updateDraft(item.id, "prompt", item.prompt);
    }
    setShowPrompts(true);
    setShowBulkPromptRegenerate(false);
    const missing = result.missingIds?.length ? ` 未生成: ${result.missingIds.join(", ")}` : "";
    setToast({
      type: result.missingIds?.length ? "info" : "success",
      message: `${result.prompts?.length ?? 0} セクションのプロンプトをドラフトへ反映しました。保存するとファイルへ反映されます。${missing}`
    });
    return true;
  });

  const regenerateCopyBulk = ({ globalInstruction, includeExistingCopy }) => startBackgroundTask("bulk-regen-copy", async () => {
    const targets = bulkTargets();
    if (!targets.length) {
      throw new Error("一括再生成するセクションがありません。");
    }

    const result = await api("/api/copy/regenerate-bulk", {
      method: "POST",
      body: JSON.stringify({
        sectionIds: targets.map((section) => section.id),
        globalInstruction,
        includeExistingCopy
      })
    });

    for (const item of result.copies ?? []) {
      updateDraft(item.id, "copy", item.copy);
    }
    setShowBulkCopyRegenerate(false);
    const missing = result.missingIds?.length ? ` 未生成: ${result.missingIds.join(", ")}` : "";
    setToast({
      type: result.missingIds?.length ? "info" : "success",
      message: `${result.copies?.length ?? 0} セクションのLP原稿をドラフトへ反映しました。保存するとファイルへ反映されます。${missing}`
    });
    return true;
  });

  const batchGenerate = async () => {
    if (busy || backgroundTasksRef.current.length > 0 || batchGenerating) {
      setToast({ type: "info", message: "別の生成処理が進行中です。完了してからもう一度実行してください。" });
      return;
    }
    const ids = [...selectedSections].filter((id) => sections.some((s) => s.id === id));
    if (!ids.length) return;

    setBatchGenerating(true);
    setToast(null);
    const errors = [];

    for (let i = 0; i < ids.length; i++) {
      const sectionId = ids[i];
      setBatchProgress({ current: i + 1, total: ids.length, currentId: sectionId });

      try {
        const section = sections.find((s) => s.id === sectionId);
        const draft = drafts[sectionId];
        const copyChanged = draft && draft.copy !== section.copy;

        if (copyChanged) {
          const savedState = await api(`/api/sections/${sectionId}/save`, {
            method: "POST",
            body: JSON.stringify({ copy: draft.copy })
          });
          commitState(savedState);

          const regenResult = await api(`/api/sections/${sectionId}/regenerate-prompt`, {
            method: "POST",
            body: JSON.stringify({ instruction: "" })
          });
          if (regenResult.newPrompt) {
            const savedPrompt = await api(`/api/sections/${sectionId}/save`, {
              method: "POST",
              body: JSON.stringify({ prompt: regenResult.newPrompt })
            });
            commitState(savedPrompt);
          }
        }

        setGenerateProgress((prev) => ({ ...prev, [sectionId]: 1 }));
        let elapsed = 0;
        const timer = setInterval(() => {
          elapsed += 1;
          const progress = Math.min(93, 100 * (1 - Math.exp(-elapsed / 40)));
          setGenerateProgress((prev) => ({ ...prev, [sectionId]: Math.round(progress) }));
        }, 1000);

        try {
          const genResult = await api(`/api/sections/${sectionId}/generate-image`, { method: "POST", body: JSON.stringify({}) });
          clearInterval(timer);
          setGenerateProgress((prev) => ({ ...prev, [sectionId]: 100 }));
          if (genResult.state) commitState(genResult.state);
          setTimeout(() => setGenerateProgress((prev) => { const n = { ...prev }; delete n[sectionId]; return n; }), 1400);
        } catch (genErr) {
          clearInterval(timer);
          setGenerateProgress((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
          errors.push(`${sectionId}: ${genErr.message}`);
        }
      } catch (err) {
        errors.push(`${sectionId}: ${err.message}`);
      }
    }

    setBatchGenerating(false);
    setBatchProgress(null);

    if (errors.length) {
      setToast({ type: "error", message: `一括生成でエラーが発生しました: ${errors.join(" / ")}` });
    } else {
      setToast({ type: "success", message: `${ids.length} セクションの画像生成が完了しました。` });
    }
    setSelectedSections(new Set());
  };

  const toggleSectionSelection = (id) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelectedSections(new Set(filteredSections.map((s) => s.id)));
  };

  const clearSelection = () => setSelectedSections(new Set());

  const saveUrlPresets = async (presets) => {
    const data = await api("/api/link-areas/url-presets", {
      method: "POST",
      body: JSON.stringify({ presets })
    });
    setUrlPresets(data.presets ?? []);
  };

  const uploadImage = (section, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      runAction(`upload-${section.id}`, async () => {
        const next = await api(`/api/sections/${section.id}/image`, {
          method: "POST",
          body: JSON.stringify({ dataUrl: reader.result })
        });
        commitState(next, `${section.id} の画像をアップロードしました。`);
      });
    };
    reader.readAsDataURL(file);
  };

  const saveTestimonialPhotoPosition = (slideId, positions) => runAction(`testimonial-photo-${slideId}`, async () => {
    const result = await api(`/api/testimonials/${encodeURIComponent(slideId)}/positions`, {
      method: "POST",
      body: JSON.stringify(positions)
    });
    const slides = result.slides ?? [];
    const storyNav = result.storyNav ?? null;
    setState((current) => {
      if (!current?.sections) return current;
      return {
        ...current,
        sections: current.sections.map((section) => (
          section.id === "SEC-07"
            ? { ...section, testimonialSlides: slides, ...(storyNav ? { testimonialStoryNav: storyNav } : {}) }
            : section
        ))
      };
    });
    const label = slides.find((slide) => slide.id === slideId)?.label ?? slideId;
    setToast({ type: "success", message: `${label} の写真位置を保存しました。` });
    return true;
  });

  const saveStoryNavSettings = (storyNav) => runAction("testimonial-story-nav", async () => {
    const result = await api("/api/testimonials/story-nav", {
      method: "POST",
      body: JSON.stringify(storyNav)
    });
    const updatedNav = result.storyNav ?? storyNav;
    setState((current) => {
      if (!current?.sections) return current;
      return {
        ...current,
        sections: current.sections.map((section) => (
          section.id === "SEC-07" ? { ...section, testimonialStoryNav: updatedNav } : section
        ))
      };
    });
    setToast({ type: "success", message: "左右ボタンの位置を保存しました。" });
    return true;
  });

  const loadCompositionsForSection = async (section) => {
    const result = await api(`/api/compositions?styleKey=${encodeURIComponent(compositionStyleKey)}&sectionId=${encodeURIComponent(section.id)}`);
    setCompositionFavorites((current) => ({ ...current, [section.id]: result.compositions ?? [] }));
    return result.compositions ?? [];
  };

  const saveCompositionFavorite = async (section) => {
    if (!section.imageUrl) {
      setToast({ type: "error", message: `${section.id} は保存できる画像がありません。` });
      return;
    }
    const title = window.prompt("構図のお気に入り名", `${section.id} ${section.title} 構図`);
    if (title === null) return;

    startBackgroundTask(`composition-save-${section.id}`, async () => {
      await api("/api/compositions", {
        method: "POST",
        body: JSON.stringify({
          styleKey: compositionStyleKey,
          sectionId: section.id,
          title: title.trim() || `${section.id} 構図`,
          sourceImageName: section.imageName
        })
      });
      const nextList = await loadCompositionsForSection(section);
      setCompositionFavorites((current) => ({ ...current, [section.id]: nextList }));
      setToast({ type: "success", message: `${section.id} の構図をお気に入り登録しました。` });
      return true;
    });
  };

  const openCompositionPicker = async (section) => {
    try {
      const compositions = await loadCompositionsForSection(section);
      setCompositionPickerTarget({
        section,
        compositions,
        selectedId: selectedCompositions[section.id]?.id ?? ""
      });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const selectCompositionFavorite = (section, composition) => runAction(`composition-select-${section.id}`, async () => {
    const result = await api("/api/compositions/select", {
      method: "POST",
      body: JSON.stringify({
        styleKey: compositionStyleKey,
        sectionId: section.id,
        compositionId: composition?.id ?? ""
      })
    });
    setSelectedCompositions(result.selected ?? {});
    if (composition) {
      updateDraft(section.id, "prompt", injectCompositionReference(drafts[section.id]?.prompt ?? section.prompt, composition));
      setShowPrompts(true);
    }
    setCompositionPickerTarget(null);
    setToast({ type: "success", message: composition ? `${section.id} に構図「${composition.title}」を適用しました。` : `${section.id} の構図選択を解除しました。` });
  });

  const deleteCompositionFavorite = async (section, compositionId) => {
    if (!window.confirm("この構図お気に入りを削除しますか？")) return;
    try {
      await api(`/api/compositions/${encodeURIComponent(compositionId)}`, { method: "DELETE" });
      const compositions = await loadCompositionsForSection(section);
      const selected = await api(`/api/compositions/selected?styleKey=${encodeURIComponent(compositionStyleKey)}`);
      setSelectedCompositions(selected.selected ?? {});
      setCompositionPickerTarget((current) => current ? { ...current, compositions } : current);
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
  };

  const deploy = () => runAction("deploy", async () => {
    if (dirtySections.length) {
      throw new Error(`未保存のセクションがあります: ${dirtySections.map((section) => section.id).join(", ")}`);
    }

    let result;
    try {
      result = await api("/api/deploy", {
        method: "POST",
        body: JSON.stringify({ allowDirty: false })
      });
    } catch (error) {
      if (error.code !== "DIRTY_WORKTREE") {
        throw error;
      }
      const ok = window.confirm(
        `未コミットの変更があります。この内容でVercelに公開しますか？\n\n${error.gitStatus || ""}`
      );
      if (!ok) {
        throw new Error("Vercel公開を中止しました。");
      }
      result = await api("/api/deploy", {
        method: "POST",
        body: JSON.stringify({ allowDirty: true })
      });
    }
    await loadState();
    setToast({
      type: "success",
      message: result.output || "Vercel公開コマンドが完了しました。"
    });
  });

  const isCancellable = busy === "deploy" || hasBackgroundTasks || batchGenerating;

  const cancelCurrent = async () => {
    try {
      await api("/api/cancel", { method: "POST" });
      setBusy("");
      backgroundTasksRef.current = [];
      setBackgroundTasks([]);
      setBatchGenerating(false);
      setBatchProgress(null);
      setGenerateProgress({});
      setToast({ type: "info", message: "処理をキャンセルしました。" });
    } catch {
      // ignore
    }
  };

  const backgroundKeyForSection = (sectionId) => (
    backgroundTasks.find((task) => task.key.endsWith(sectionId))?.key ?? ""
  );
  const loadLoopAssetsIfNeeded = () => {
    if ((loopData.assets ?? []).length || busy) return;
    runAction("loop-assets-load", async () => {
      await loadLoopSections({ includeAssets: true });
    });
  };
  const openLoopEditor = (sectionId) => {
    setLoopEditTarget(sectionId);
    loadLoopAssetsIfNeeded();
  };
  const changeViewMode = (mode) => {
    setViewMode(mode);
    if (mode === "loop") loadLoopAssetsIfNeeded();
  };
  const loopEditSection = loopSections.find((section) => section.id === loopEditTarget);

  if (loading) {
    return (
      <main className="loading-screen">
        <LoaderCircle className="spin" size={28} />
        <span>読み込み中</span>
      </main>
    );
  }

  return (
    <main className={`app-shell mode-${viewMode} ${showPrompts ? "" : "prompts-collapsed"}`}>
      <header className="app-header">
        <div>
          <div className="eyebrow">LP Section Studio</div>
          <h1>{state?.project?.name}</h1>
        </div>

        <div className="header-actions">
          {dirtySections.length > 0 && (
            <ToolbarButton
              icon={Save}
              className="save-all"
              loading={busy === "save-all"}
	            disabled={isBusy || isReadOnly}
              onClick={saveAllDirty}
            >
              全て保存 ({dirtySections.length})
            </ToolbarButton>
          )}
          <ToolbarButton icon={RefreshCcw} loading={busy === "reload"} disabled={isBusy} onClick={reloadAll}>
            再読み込み
          </ToolbarButton>
          <ToolbarButton icon={Images} disabled={isBusy || isReadOnly} onClick={() => setShowRefImageManager(true)}>
            参照画像管理
          </ToolbarButton>
          <ToolbarButton icon={History} disabled={isBusy || isReadOnly} onClick={openStateSnapshots}>
            全体状態
          </ToolbarButton>
          <ToolbarButton
            icon={Rocket}
            disabled={!state?.project?.publicUrl}
            onClick={() => window.open(state.project.publicUrl, "_blank", "noopener,noreferrer")}
          >
            公開中LPを見る
          </ToolbarButton>
      <ToolbarButton icon={Rocket} loading={busy === "deploy"} disabled={isBusy || isReadOnly || hasBackgroundTasks || batchGenerating} className="primary" onClick={deploy}>
            Vercelに公開
          </ToolbarButton>
        </div>
      </header>

      <section className="status-strip">
      {dirtySections.length > 0 && (
        <div className="dirty-count-banner">
          <span className="dirty-count-dot" />
          <span>{dirtySections.length} 件 未保存</span>
        </div>
      )}
      {isReadOnly && (
        <div className="dirty-count-banner readonly-banner">
          <span className="dirty-count-dot" />
          <span>{state?.project?.readOnlyReason || "表示確認モードです"}</span>
        </div>
      )}

        <div className="search-wrapper">
          <Search className="search-icon" size={15} />
          <input
            className="section-search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="セクションを検索…"
          />
          {filter && (
            <button
              className="search-clear"
              onClick={() => setFilter("")}
              title="検索をクリア"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      </section>

      <section className="view-toolbar" aria-label="表示切替と編集操作">
        <div className="segmented view-tabs" aria-label="表示切替">
          <button className={viewMode === "editor" ? "active" : ""} onClick={() => changeViewMode("editor")}>編集</button>
          <button className={viewMode === "images" ? "active" : ""} onClick={() => changeViewMode("images")}>画像</button>
          <button className={viewMode === "full" ? "active" : ""} onClick={() => changeViewMode("full")}>全体</button>
          <button className={viewMode === "compare" ? "active" : ""} onClick={() => changeViewMode("compare")}>比較</button>
        </div>
        <div className="editor-toolbar">
          {viewMode === "editor" && (
            <>
              <div className="toolbar-group">
                <ToolbarButton
                  icon={Undo2}
                  disabled={isBusy || !operationHistory.canUndo}
                  onClick={undoOperation}
                  title={operationHistory.undoLabel ? `一つ前に戻す: ${operationHistory.undoLabel}` : "一つ前に戻す"}
                >
                  戻す
                </ToolbarButton>
                <ToolbarButton
                  icon={Redo2}
                  disabled={isBusy || !operationHistory.canRedo}
                  onClick={redoOperation}
                  title={operationHistory.redoLabel ? `次に進める: ${operationHistory.redoLabel}` : "次に進める"}
                >
                  進む
                </ToolbarButton>
              </div>

              <div className="toolbar-group">
                <ToolbarButton
                  icon={Plus}
	                  disabled={isBusy || isReadOnly}
                  onClick={() => setAddSectionTarget({ afterId: "", id: nextSectionId })}
                >
                  追加
                </ToolbarButton>
                <ToolbarButton
                  icon={LayoutList}
	                  disabled={isBusy || isReadOnly || sections.length === 0}
                  onClick={() => setShowStructureEditor(true)}
                >
                  構成
                </ToolbarButton>
                {SPECIAL_LINK_AREA_TARGETS.map((target) => (
                  <ToolbarButton
                    key={target.targetId}
                    icon={Sparkles}
	                    disabled={isBusy || isReadOnly}
                    onClick={() => setLinkAreaTarget(target)}
                  >
                    追加CTA演出
                  </ToolbarButton>
                ))}
              </div>

              <div className="toolbar-group">
                <ToolbarButton
                  icon={selectedSections.size > 0 ? XCircle : CheckSquare}
                  className={selectedSections.size > 0 ? "selected-action" : ""}
                  disabled={isBusy || isReadOnly}
                  onClick={selectedSections.size > 0 ? clearSelection : selectAllVisible}
                >
                  {selectedSections.size > 0 ? `解除 ${selectedSections.size}件` : "全選択"}
                </ToolbarButton>
                {selectedSections.size > 0 && (
                  <ToolbarButton
                    icon={batchGenerating ? LoaderCircle : Layers}
                    loading={batchGenerating}
	                    disabled={isBusy || isReadOnly || hasBackgroundTasks || batchGenerating}
                    className="primary"
                    onClick={batchGenerate}
                  >
                    {batchProgress ? `${batchProgress.current}/${batchProgress.total} 生成中` : `画像生成 ${selectedSections.size}件`}
                  </ToolbarButton>
                )}
              </div>

              <div className="toolbar-group">
                <ToolbarButton
                  icon={FileText}
                  loading={isBackgroundTaskRunning("bulk-regen-copy")}
	                  disabled={isBusy || isReadOnly || hasBackgroundTasks || batchGenerating || filteredSections.length === 0}
                  onClick={() => setShowBulkCopyRegenerate(true)}
                >
                  原稿再生成
                </ToolbarButton>
                <ToolbarButton
                  icon={Wand2}
                  loading={isBackgroundTaskRunning("bulk-regen-prompts")}
	                  disabled={isBusy || isReadOnly || hasBackgroundTasks || batchGenerating || filteredSections.length === 0}
                  onClick={() => setShowBulkPromptRegenerate(true)}
                >
                  プロンプト再生成
                </ToolbarButton>
              </div>
	            </>
	          )}
          <div className="toolbar-group trailing">
            <ToolbarButton
              icon={showPrompts ? EyeOff : Eye}
              className={showPrompts ? "selected-action" : ""}
              disabled={viewMode !== "editor"}
              onClick={() => setShowPrompts((value) => !value)}
            >
              {showPrompts ? "プロンプト非表示" : "プロンプト表示"}
            </ToolbarButton>
          </div>
        </div>
      </section>

      {isProcessing && (
        <div className="activity-banner" role="status" aria-live="polite">
          <LoaderCircle className="spin" size={18} />
          <div>
            <strong>{isBusy ? "処理中" : "バックグラウンド処理中"}</strong>
            <span>{busyLabel(activeStatusKey)}</span>
            {backgroundTasks.length > 1 && <small>ほか {backgroundTasks.length - 1} 件が待機中です。</small>}
          </div>
          <div className="activity-track"><span /></div>
          {isCancellable && (
            <button className="cancel-button" onClick={cancelCurrent} title="処理を強制停止する">
              <XCircle size={14} />
              <span>キャンセル</span>
            </button>
          )}
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
          {toast.type === "error" && (
            <button className="toast-close" onClick={() => setToast(null)} title="閉じる">
              <XCircle size={15} />
            </button>
          )}
        </div>
      )}

      {viewMode === "editor" && (
        <>

          <section className="sections">
            {editorFlowItems.map((item) => {
              if (item.type === "loop") {
                const loopSection = item.section;
                return (
                  <LoopSectionRow
                    key={item.key}
                    section={loopSection}
                    sections={loopSections}
                    assets={loopAssets}
                    draft={loopSectionDraft(loopSection, loopDrafts)}
                    busy={busy}
                    disabled={isBusy}
                    onEdit={() => openLoopEditor(loopSection.id)}
                    onSave={() => saveLoopSection(loopSection)}
                    onOpenLinkAreaEditor={() => setLinkAreaTarget({
                      targetId: loopSection.id,
                      imageUrl: loopSection.backgroundSrc ? `/lp-assets/${loopSection.backgroundSrc}` : "",
                      title: `${loopSection.label} リンク・キラーんアニメーション`
                    })}
                  />
                );
              }

              const section = item.section;
              return (
                <SectionRow
                  key={item.key}
                  section={section}
                  draft={drafts[section.id] ?? { copy: section.copy, prompt: section.prompt }}
                  busy={backgroundKeyForSection(section.id) || busy}
                  disabled={isBusy}
                  showPrompts={showPrompts}
                  selected={selectedSections.has(section.id)}
                  onToggleSelect={() => toggleSectionSelection(section.id)}
                  onDraftChange={updateDraft}
                  onSave={() => saveSection(section)}
                  onAddAfter={() => setAddSectionTarget({ afterId: section.id, id: nextSectionId })}
                  onDelete={() => deleteSection(section)}
                  onOpenHistory={openHistory}
                  onGenerate={(refImageNames, promptOverride) => generateImage(section, refImageNames, promptOverride)}
                  onUpload={uploadImage}
                  onRegeneratePrompt={(instruction, refImageNames) => regeneratePrompt(section, instruction, refImageNames)}
                  onOpenCopyRegenerateModal={(section) => setCopyRegenerateTarget(section)}
                  generateProgress={generateProgress[section.id]}
                  refImages={refImages}
                  onOpenRegenerateModal={(section) => setRegenerateTarget(section)}
                  onOpenLinkAreaEditor={(section) => setLinkAreaTarget({ targetId: section.id, imageUrl: section.imageUrl, title: `${section.id} リンクエリア` })}
                  onSaveComposition={() => saveCompositionFavorite(section)}
                  onOpenCompositionPicker={() => openCompositionPicker(section)}
                  selectedComposition={selectedCompositions[section.id]}
                  compositionCount={compositionFavorites[section.id]?.length ?? 0}
                  onSaveTestimonialPhotoPosition={saveTestimonialPhotoPosition}
                  onSaveStoryNav={saveStoryNavSettings}
                />
              );
            })}
          </section>
        </>
      )}

      {viewMode === "images" && (
        <ImageGallery sections={filteredSections} onOpenHistory={openHistory} />
      )}

      {viewMode === "loop" && (
        <LoopSectionsWorkspace
          sections={loopSections}
          assets={loopAssets}
          drafts={loopDrafts}
          busy={busy}
          disabled={isBusy}
          onDraftChange={updateLoopTrackDraft}
          onSave={saveLoopSection}
          onReload={() => runAction("loop-load", () => loadLoopSections({ includeAssets: true }))}
          onOpenLp={() => window.open("/lp-assets/index.html", "_blank", "noopener,noreferrer")}
        />
      )}

      {viewMode === "full" && (
        <FullLpPreview project={state.project} />
      )}

      {viewMode === "compare" && (
        <PublicCompare project={state.project} sections={filteredSections} />
      )}

      {linkAreaTarget && (
        <LinkAreaEditorModal
          targetId={linkAreaTarget.targetId}
          imageUrl={linkAreaTarget.imageUrl}
          title={linkAreaTarget.title}
          urlPresets={urlPresets}
          onSavePresets={saveUrlPresets}
          onClose={() => setLinkAreaTarget(null)}
        />
      )}

      {loopEditSection && (
        <LoopSectionEditorModal
          section={loopEditSection}
          sections={loopSections}
          assets={loopAssets}
          draft={loopSectionDraft(loopEditSection, loopDrafts)}
          busy={busy}
          disabled={isBusy}
          onDraftChange={updateLoopTrackDraft}
          onSave={() => saveLoopSection(loopEditSection)}
          onClose={() => setLoopEditTarget(null)}
        />
      )}

      {compositionPickerTarget && (
        <CompositionPickerModal
          section={compositionPickerTarget.section}
          compositions={compositionPickerTarget.compositions}
          selectedId={selectedCompositions[compositionPickerTarget.section.id]?.id ?? compositionPickerTarget.selectedId}
          busy={isBusy}
          onClose={() => setCompositionPickerTarget(null)}
          onSelect={(composition) => {
            const section = compositionPickerTarget.section;
            setCompositionPickerTarget(null);
            selectCompositionFavorite(section, composition);
          }}
          onClear={() => {
            const section = compositionPickerTarget.section;
            setCompositionPickerTarget(null);
            selectCompositionFavorite(section, null);
          }}
          onDelete={(compositionId) => deleteCompositionFavorite(compositionPickerTarget.section, compositionId)}
        />
      )}

      {historyTarget && (
        <HistoryModal
          target={historyTarget}
          snapshots={historySnapshots}
          loading={historyLoading}
          busy={isBusy}
          onClose={() => setHistoryTarget(null)}
          onRestore={(snapshot) => {
            restoreSnapshot(snapshot);
            setHistoryTarget(null);
            setHistorySnapshots([]);
          }}
        />
      )}

      {showStateSnapshots && (
        <StateSnapshotsModal
          snapshots={stateSnapshots}
          loading={stateSnapshotsLoading}
          busy={busy}
          dirtyCount={dirtySections.length}
          sectionCount={sections.length}
          suggestion={stateSnapshotSuggestion}
          onClose={() => setShowStateSnapshots(false)}
          onReload={loadStateSnapshots}
          onCreate={(payload) => {
            setShowStateSnapshots(false);
            return createNamedStateSnapshot(payload);
          }}
          onRestore={(snapshot) => {
            setShowStateSnapshots(false);
            restoreNamedStateSnapshot(snapshot);
          }}
          onDelete={deleteNamedStateSnapshot}
        />
      )}

      {showRefImageManager && (
        <RefImageManagerModal
          refImages={refImages}
          busy={busy}
          onClose={() => setShowRefImageManager(false)}
          onOpenLinkAreaEditor={(img) => setLinkAreaTarget({
            targetId: `ref-${img.name}`,
            imageUrl: img.url,
            title: `参照画像 ${img.name} のリンクエリア`
          })}
          onAdd={async (name, dataUrl) => {
            setBusy("ref-images-save");
            setToast(null);
            try {
              await api("/api/ref-images", { method: "POST", body: JSON.stringify({ name, dataUrl }) });
              const data = await api("/api/ref-images");
              setRefImages(data.refImages ?? []);
            } catch (err) {
              setToast({ type: "error", message: err.message });
            } finally {
              setBusy("");
            }
          }}
          onGenerate={async (payload) => {
            setShowRefImageManager(false);
            return startBackgroundTask("ref-images-generate", async () => {
              const result = await api("/api/ref-images/generate", {
                method: "POST",
                body: JSON.stringify(payload)
              });
              const data = await api("/api/ref-images");
              setRefImages(data.refImages ?? []);
              setToast({ type: "success", message: `${result.refImage?.name ?? payload.name} を参照素材として保存しました。` });
              return true;
            });
          }}
          onDelete={async (name) => {
            setBusy("ref-images-delete");
            setToast(null);
            try {
              await api(`/api/ref-images/${encodeURIComponent(name)}`, { method: "DELETE" });
              const data = await api("/api/ref-images");
              setRefImages(data.refImages ?? []);
            } catch (err) {
              setToast({ type: "error", message: err.message });
            } finally {
              setBusy("");
            }
          }}
        />
      )}

      {addSectionTarget && (
        <AddSectionModal
          initial={addSectionTarget}
          sections={sections}
          busy={busy}
          onClose={() => setAddSectionTarget(null)}
          onAdd={(payload) => {
            setAddSectionTarget(null);
            addSection(payload);
          }}
        />
      )}

      {showStructureEditor && (
        <StructureEditorModal
          sections={sections}
          busy={busy}
          onClose={() => setShowStructureEditor(false)}
          onApply={(items) => {
            setShowStructureEditor(false);
            applyStructure(items);
          }}
        />
      )}

	      {showBulkPromptRegenerate && (
	        <BulkPromptRegenerateModal
	          targets={bulkPromptTargets()}
	          globalRules={globalPromptRules}
	          refImages={refImages}
	          busy={busy}
	          selectedCount={selectedSections.size}
	          onClose={() => setShowBulkPromptRegenerate(false)}
	          onRegenerate={(payload) => {
              setShowBulkPromptRegenerate(false);
              regeneratePromptsBulk(payload);
            }}
	        />
	      )}

      {showBulkCopyRegenerate && (
        <BulkCopyRegenerateModal
          targets={bulkTargets()}
          busy={busy}
          selectedCount={selectedSections.size}
          onClose={() => setShowBulkCopyRegenerate(false)}
          onRegenerate={(payload) => {
            setShowBulkCopyRegenerate(false);
            regenerateCopyBulk(payload);
          }}
        />
      )}

      {copyRegenerateTarget && (
        <CopyRegenerateModal
          section={copyRegenerateTarget}
          busy={busy}
          onClose={() => setCopyRegenerateTarget(null)}
          onRegenerate={async (instruction) => {
            const section = copyRegenerateTarget;
            setCopyRegenerateTarget(null);
            regenerateCopy(section, instruction);
          }}
        />
      )}

	      {regenerateTarget && (
	        <PromptRegenerateModal
          section={regenerateTarget}
          refImages={refImages}
          busy={busy}
          onClose={() => setRegenerateTarget(null)}
          onRegenerate={async (instruction, refImageNames) => {
            const section = regenerateTarget;
            setRegenerateTarget(null);
            regeneratePrompt(section, instruction, refImageNames);
          }}
        />
      )}
    </main>
  );
}

function SectionRow({
  section,
  draft,
  busy,
  disabled,
  showPrompts,
  selected,
  onToggleSelect,
  onDraftChange,
  onSave,
  onAddAfter,
  onDelete,
  onOpenHistory,
  onGenerate,
  onUpload,
  onRegeneratePrompt,
  onOpenCopyRegenerateModal,
  generateProgress,
  refImages,
  onOpenRegenerateModal,
  onOpenLinkAreaEditor,
  onSaveComposition,
  onOpenCompositionPicker,
  selectedComposition,
  compositionCount,
  onSaveTestimonialPhotoPosition,
  onSaveStoryNav
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showRefPicker, setShowRefPicker] = useState(false);
  const [selectedRefImages, setSelectedRefImages] = useState([]);
  const copyNav = useFieldNav(section.id, "copy", section.copy, draft.copy, onDraftChange);
  const promptNav = useFieldNav(section.id, "prompt", section.prompt, draft.prompt, onDraftChange);
  const isDirty = draft.copy !== section.copy || draft.prompt !== section.prompt;
  const isDirtyCopy = draft.copy !== section.copy;
  const isDirtyPrompt = draft.prompt !== section.prompt;
  const isRowBusy = busy.endsWith(section.id) || generateProgress != null;
  const controlsDisabled = disabled || isRowBusy;
  const hasTestimonialSlides = Array.isArray(section.testimonialSlides) && section.testimonialSlides.length > 0;

  const toggleRefImage = (name) => {
    setSelectedRefImages((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <article className={`section-row ${isDirty ? "dirty" : ""} ${isRowBusy ? "busy-row" : ""} ${selected ? "selected-row" : ""}`}>
      <div className="section-title">
        <div className="section-title-left">
          <button
            className={`section-checkbox ${selected ? "checked" : ""}`}
            onClick={onToggleSelect}
            title={selected ? "選択を解除" : "一括生成に追加"}
            disabled={controlsDisabled}
          >
            {selected ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
          <div className="section-title-info">
            <span className="section-id">{section.id}</span>
            <h2>{section.title}</h2>
          </div>
        </div>
        <div className="section-actions">
          {isDirtyCopy && <span className="dirty-field-badge copy">原稿 未保存</span>}
          {isDirtyPrompt && <span className="dirty-field-badge prompt">プロンプト 未保存</span>}
          <IconButton
            icon={Plus}
            label="この下にセクションを追加"
            onClick={onAddAfter}
            disabled={controlsDisabled}
          />
          <IconButton
            icon={Trash2}
            label="セクションを削除"
            kind="danger"
            loading={busy === `delete-${section.id}`}
            onClick={onDelete}
            disabled={controlsDisabled}
          />
          <IconButton
            icon={Save}
            label="保存"
            kind="save"
            showLabel
            loading={busy === `save-${section.id}`}
            onClick={onSave}
            disabled={controlsDisabled}
          />
        </div>
      </div>

      {isRowBusy && (
        <div className="row-busy">
          <LoaderCircle className="spin" size={16} />
          <span>{busy ? busyLabel(busy) : `${section.id} の画像をバックグラウンド生成しています。`}</span>
        </div>
      )}

      <div className={`section-grid ${showPrompts ? "" : "no-prompts"}`}>
        <Panel
          title="原稿"
          dirty={isDirtyCopy}
          actions={(
            <>
              <IconButton
                icon={Undo2}
                label={copyNav.label ? `${copyNav.label}の保存に戻す` : "一つ前の保存に戻す"}
                loading={copyNav.loading}
                onClick={copyNav.undo}
                disabled={controlsDisabled || copyNav.atOldest}
              />
              {copyNav.canRedo && (
                <IconButton
                  icon={Redo2}
                  label="次の保存に進む"
                  onClick={copyNav.redo}
                  disabled={controlsDisabled}
                />
              )}
              <IconButton
                icon={FileText}
                label="LP原稿を再生成"
                loading={busy === `regen-copy-${section.id}`}
                onClick={() => onOpenCopyRegenerateModal(section)}
                disabled={controlsDisabled}
              />
              <IconButton
                icon={History}
                label="原稿履歴を開く"
                onClick={() => onOpenHistory(section, "copy")}
                disabled={controlsDisabled}
              />
            </>
          )}
        >
          <textarea
            value={draft.copy}
            onChange={(event) => { copyNav.resetNav(); onDraftChange(section.id, "copy", event.target.value); }}
            disabled={controlsDisabled}
            spellCheck={false}
          />
        </Panel>

        {showPrompts && (
          <Panel
            title="プロンプト"
            dirty={isDirtyPrompt}
            actions={(
              <>
                <IconButton
                  icon={Undo2}
                  label={promptNav.label ? `${promptNav.label}の保存に戻す` : "一つ前の保存に戻す"}
                  loading={promptNav.loading}
                  onClick={promptNav.undo}
                  disabled={controlsDisabled || promptNav.atOldest}
                />
                {promptNav.canRedo && (
                  <IconButton
                    icon={Redo2}
                    label="次の保存に進む"
                    onClick={promptNav.redo}
                    disabled={controlsDisabled}
                  />
                )}
                <IconButton
                  icon={Wand2}
                  label="プロンプトを再生成"
                  loading={busy === `regen-prompt-${section.id}`}
                  onClick={() => onOpenRegenerateModal(section)}
                  disabled={controlsDisabled}
                />
                <div className="ref-image-picker-wrap">
                  <IconButton
                    icon={Images}
                    label={selectedRefImages.length > 0 ? `参照画像 ${selectedRefImages.length}枚` : "参照画像を選択"}
                    onClick={() => setShowRefPicker((v) => !v)}
                    disabled={controlsDisabled}
                    kind={selectedRefImages.length > 0 ? "generate" : "default"}
                  />
                  {showRefPicker && (
                    <div className="ref-image-dropdown">
                      <div className="ref-image-dropdown-head">
                        <span>参照画像を選択</span>
                        <button onClick={() => setShowRefPicker(false)}><XCircle size={14} /></button>
                      </div>
                      {refImages.length === 0 ? (
                        <div className="ref-image-empty">参照画像が登録されていません</div>
                      ) : (
                        <div className="ref-image-list">
                          {refImages.map((img) => (
                            <label key={img.name} className={`ref-image-item ${selectedRefImages.includes(img.name) ? "checked" : ""}`}>
                              <input
                                type="checkbox"
                                checked={selectedRefImages.includes(img.name)}
                                onChange={() => toggleRefImage(img.name)}
                              />
                              <img src={img.url} alt={img.name} />
                              <span>{img.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {selectedRefImages.length > 0 && (
                        <div className="ref-image-selected-tags">
                          {selectedRefImages.map((name) => (
                            <span key={name} className="ref-tag">
                              {name}
                              <button onClick={() => toggleRefImage(name)}><XCircle size={12} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <IconButton
                  icon={Copy}
                  label="プロンプトをコピー"
                  onClick={() => navigator.clipboard?.writeText(draft.prompt)}
                  disabled={controlsDisabled}
                />
                <IconButton
                  icon={History}
                  label="プロンプト履歴を開く"
                  onClick={() => onOpenHistory(section, "prompt")}
                  disabled={controlsDisabled}
                />
              </>
            )}
          >
            <textarea
              value={draft.prompt}
              onChange={(event) => { promptNav.resetNav(); onDraftChange(section.id, "prompt", event.target.value); }}
              disabled={controlsDisabled}
              spellCheck={false}
            />
            {selectedRefImages.length > 0 && (
              <div className="prompt-ref-note">
                参照画像: {selectedRefImages.join(", ")} — 「AI で画像を生成」時に参照されます
              </div>
            )}
          </Panel>
        )}

        <Panel
          title={hasTestimonialSlides ? "実績者カルーセル" : section.imageName}
          actions={hasTestimonialSlides ? null : (
            <>
              <IconButton
                icon={Sparkles}
                label={selectedRefImages.length > 0 ? `AI で画像を生成 (参照:${selectedRefImages.length}枚)` : "AI で画像を生成"}
                kind="generate"
                loading={busy === `generate-${section.id}` || generateProgress != null}
                onClick={() => onGenerate(selectedRefImages, draft.prompt)}
                disabled={controlsDisabled}
              />
              <IconButton
                icon={Star}
                label="構図をお気に入り登録"
                onClick={onSaveComposition}
                disabled={controlsDisabled || !section.imageUrl}
                kind="generate"
              />
              <IconButton
                icon={LayoutList}
                label={selectedComposition ? `構図選択: ${selectedComposition.title}` : "構図を選択"}
                onClick={onOpenCompositionPicker}
                disabled={controlsDisabled}
                kind={selectedComposition ? "generate" : "default"}
              />
              <IconButton
                icon={Upload}
                label="画像をアップロード"
                onClick={() => inputRef.current?.click()}
                disabled={controlsDisabled}
              />
              <IconButton
                icon={History}
                label="画像履歴を開く"
                onClick={() => onOpenHistory(section, "image")}
                disabled={controlsDisabled}
              />
              <IconButton
                icon={Link}
                label="リンクエリアを設定"
                onClick={() => onOpenLinkAreaEditor(section)}
                disabled={controlsDisabled || !section.imageUrl}
              />
            </>
          )}
        >
          {hasTestimonialSlides ? (
            <TestimonialPhotoPositionEditor
              slides={section.testimonialSlides}
              storyNav={section.testimonialStoryNav}
              disabled={controlsDisabled}
              busy={busy}
              onSave={onSaveTestimonialPhotoPosition}
              onSaveStoryNav={onSaveStoryNav}
            />
          ) : (
            <>
              <div
                className={`image-panel${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) onUpload(section, file);
                }}
              >
                {generateProgress != null && (
                  <div className="generate-overlay">
                    <div className="generate-progress-wrap">
                      <div
                        className="generate-progress-bar"
                        style={{ width: `${generateProgress}%` }}
                      />
                    </div>
                    <div className="generate-progress-label">
                      <Sparkles size={13} />
                      <span>生成中… {generateProgress}%</span>
                    </div>
                  </div>
                )}
                {section.imageUrl ? (
                  <img src={section.imageUrl} alt={`${section.title} のLP画像`} />
                ) : (
                  <div className="empty-image">画像なし</div>
                )}
              </div>
              {(selectedComposition || compositionCount > 0) && (
                <div className="composition-meta">
                  <span>{selectedComposition ? `選択中: ${selectedComposition.title}` : "構図未選択"}</span>
                  <span>{compositionCount} 件保存</span>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(event) => onUpload(section, event.target.files?.[0])}
              />
              <div className="image-meta">
                <span>{section.imageMeta?.width ?? "-"} x {section.imageMeta?.height ?? "-"}</span>
              </div>
            </>
          )}
        </Panel>
      </div>
    </article>
  );
}

function testimonialDraftsFromSlides(slides = []) {
  return Object.fromEntries(slides.map((slide) => [
    slide.id,
    {
      photoYPercent: Number(slide.photoYPercent ?? 0),
      voiceIconXPercent: Number(slide.voiceIconXPercent ?? 0),
      voiceIconYPercent: Number(slide.voiceIconYPercent ?? 0)
    }
  ]));
}

const DEFAULT_TESTIMONIAL_NAV = {
  center: { prevX: 58, prevYOffset: 0, nextX: 58, nextYOffset: 0 },
  story: { prevX: 3, prevYOffset: 0, nextX: 8, nextYOffset: 0 },
  voice: { prevX: 10, prevYOffset: 0, nextX: 10, nextYOffset: 0 }
};

const TESTIMONIAL_NAV_TARGETS = [
  { id: "center", label: "ドット左右", description: "ドット余白の左右に置く青い矢印" },
  { id: "story", label: "顔写真横", description: "受講前後の顔写真横に置く丸ボタン" },
  { id: "voice", label: "感想", description: "感想本文セクション内に置く丸ボタン" }
];

const STORY_BG_NAV_TOP = 45.8;

function NavButton({ direction, variant = "round", style }) {
  const label = direction === "prev" ? "‹" : "›";
  return (
    <div
      aria-label={label}
      className={`story-nav-preview-button story-nav-preview-button--${variant} story-nav-preview-button--${direction}`}
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-50%)",
        cursor: "default",
        userSelect: "none",
        pointerEvents: "none",
        ...style
      }}
    >
      {variant === "arrow" ? (
        <img
          className="story-nav-preview-arrow-img"
          src="/lp-assets/assets/icons/handdrawn-blue-arrow-right.svg"
          alt=""
          draggable={false}
        />
      ) : label}
    </div>
  );
}

function StoryNavModal({ slides, initialNav, isSaving, disabled, onClose, onSave }) {
  const [nav, setNav] = useState(() => testimonialNavFromProps(initialNav));
  const [activeTarget, setActiveTarget] = useState("center");
  const [previewId, setPreviewId] = useState(slides[0]?.id ?? "");
  const previewSlide = slides.find((s) => s.id === previewId) ?? slides[0];
  const photoY = Number(previewSlide?.photoYPercent ?? 0);
  const activeConfig = TESTIMONIAL_NAV_TARGETS.find((target) => target.id === activeTarget) ?? TESTIMONIAL_NAV_TARGETS[0];
  const activeNav = nav[activeTarget] ?? DEFAULT_TESTIMONIAL_NAV[activeTarget];

  const updateActiveNav = (patch) => {
    setNav((current) => ({
      ...current,
      [activeTarget]: {
        ...(current[activeTarget] ?? DEFAULT_TESTIMONIAL_NAV[activeTarget]),
        ...patch
      }
    }));
  };

  const baseTopFor = (target) => {
    if (target === "story") return `${STORY_BG_NAV_TOP}%`;
    if (target === "voice") return "28%";
    return "50%";
  };

  const renderButtons = (target) => {
    const group = nav[target] ?? DEFAULT_TESTIMONIAL_NAV[target];
    const baseTop = baseTopFor(target);
    const variant = target === "center" ? "arrow" : "round";
    return (
      <>
        <NavButton
          direction="prev"
          variant={variant}
          style={{ left: group.prevX, top: `calc(${baseTop} + ${group.prevYOffset}%)` }}
        />
        <NavButton
          direction="next"
          variant={variant}
          style={{ right: group.nextX, top: `calc(${baseTop} + ${group.nextYOffset}%)` }}
        />
      </>
    );
  };

  return (
    <div
      className="story-nav-modal-overlay"
      onClick={onClose}
    >
      <div
        className="story-nav-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="story-nav-modal-header">
          <span className="story-nav-modal-title">
            <SlidersHorizontal size={16} />
            左右ボタンの位置調整
          </span>
          <button className="story-nav-modal-close" type="button" onClick={onClose}>
            <XCircle size={20} />
          </button>
        </div>

        <div className="story-nav-modal-body">
          <div className="story-nav-target-tabs" role="tablist" aria-label="調整するボタンセット">
            {TESTIMONIAL_NAV_TARGETS.map((target) => (
              <button
                key={target.id}
                type="button"
                className={`story-nav-target-tab${target.id === activeTarget ? " is-active" : ""}`}
                onClick={() => setActiveTarget(target.id)}
              >
                <strong>{target.label}</strong>
                <span>{target.description}</span>
              </button>
            ))}
          </div>

          {/* スライド選択 */}
          <div className="story-nav-slide-tabs">
            {slides.map((slide) => (
              <button
                key={slide.id}
                type="button"
                className={`story-nav-slide-tab${slide.id === previewId ? " is-active" : ""}`}
                onClick={() => setPreviewId(slide.id)}
              >
                {slide.label}
              </button>
            ))}
          </div>

          {/* プレビュー */}
          <div className="story-nav-preview-wrap">
            <div className={`story-nav-preview story-nav-preview--${activeTarget}`}>
              {activeTarget === "center" ? (
                <>
                  {previewSlide?.storyUrl && (
                    <section className="story-nav-preview-section story-nav-preview-section--story" aria-hidden="true">
                      <div className="story-nav-preview-slider">
                        <div className="story-nav-preview-slide is-active">
                          <img
                            className="story-nav-preview-bg"
                            src={previewSlide.storyUrl}
                            alt={`${previewSlide.label} story`}
                            draggable={false}
                          />
                        </div>
                      </div>
                    </section>
                  )}
                  {previewSlide?.voiceUrl && (
                    <section className="story-nav-preview-section story-nav-preview-section--voice" aria-hidden="true">
                      <div className="story-nav-preview-slider">
                        <div className="story-nav-preview-slide is-active">
                          <img
                            className="story-nav-preview-bg"
                            src={previewSlide.voiceUrl}
                            alt={`${previewSlide.label} voice`}
                            draggable={false}
                          />
                        </div>
                      </div>
                    </section>
                  )}
                  <section className="story-nav-preview-dots-section" aria-hidden="true">
                    <div className="story-nav-preview-dots">
                      {slides.map((slide) => (
                        <span key={slide.id} className={`story-nav-preview-dot${slide.id === previewId ? " is-active" : ""}`} />
                      ))}
                    </div>
                    {renderButtons("center")}
                  </section>
                </>
              ) : (
                <section className={`story-nav-preview-section story-nav-preview-section--${activeTarget}`}>
                  <div className="story-nav-preview-slider">
                    <div className="story-nav-preview-slide is-active">
                      {previewSlide?.[activeTarget === "voice" ? "voiceUrl" : "storyUrl"] && (
                        <img
                          className="story-nav-preview-bg"
                          src={activeTarget === "voice" ? previewSlide.voiceUrl : previewSlide.storyUrl}
                          alt={`${previewSlide.label} ${activeTarget}`}
                          draggable={false}
                        />
                      )}
                      {activeTarget === "story" && previewSlide?.photoUrl && (
                        <img
                          className="story-nav-preview-photo"
                          src={previewSlide.photoUrl}
                          alt={previewSlide.label}
                          draggable={false}
                          style={{ top: `calc(21.8% + ${photoY}%)` }}
                        />
                      )}
                    </div>
                  </div>
                  {renderButtons(activeTarget)}
                </section>
              )}
            </div>
          </div>

          {/* スライダー */}
          <div className="story-nav-controls">
            <div className="story-nav-control-group">
              <div className="story-nav-control-label">{activeConfig.label}：端からの距離</div>
              <label className="loop-range-control">
                <span>左ボタン ‹</span>
                <input type="range" min="0" max="120" step="1"
                  value={activeNav.prevX}
                  onChange={(e) => updateActiveNav({ prevX: Number(e.target.value) })}
                />
                <output>{activeNav.prevX}px</output>
              </label>
              <label className="loop-range-control">
                <span>右ボタン ›</span>
                <input type="range" min="0" max="120" step="1"
                  value={activeNav.nextX}
                  onChange={(e) => updateActiveNav({ nextX: Number(e.target.value) })}
                />
                <output>{activeNav.nextX}px</output>
              </label>
            </div>
            <div className="story-nav-control-group">
              <div className="story-nav-control-label">{activeConfig.label}：高さ（左右共通）</div>
              <label className="loop-range-control">
                <span>上下位置</span>
                <input type="range" min="-20" max="20" step="0.5"
                  value={activeNav.prevYOffset}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);
                    updateActiveNav({ prevYOffset: nextValue, nextYOffset: nextValue });
                  }}
                />
                <output>{activeNav.prevYOffset > 0 ? "+" : ""}{activeNav.prevYOffset}%</output>
              </label>
            </div>
          </div>
        </div>

        <div className="story-nav-modal-footer">
          <button
            type="button"
            className="toolbar-button"
            onClick={() => updateActiveNav(DEFAULT_TESTIMONIAL_NAV[activeTarget])}
          >
            <Undo2 size={15} />
            <span>選択中をデフォルトに戻す</span>
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="toolbar-button" onClick={onClose}>
              キャンセル
            </button>
            <button
              type="button"
              className="toolbar-button primary"
              onClick={() => onSave(nav)}
              disabled={disabled || isSaving}
            >
              {isSaving ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />}
              <span>保存して閉じる</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function navGroupFromProps(group, defaults) {
  return {
    prevX: Number(group?.prevX ?? defaults.prevX),
    prevYOffset: Number(group?.prevYOffset ?? defaults.prevYOffset ?? 0),
    nextX: Number(group?.nextX ?? defaults.nextX),
    nextYOffset: Number(group?.nextYOffset ?? defaults.nextYOffset ?? 0)
  };
}

function testimonialNavFromProps(storyNav) {
  const source = storyNav && typeof storyNav === "object" ? storyNav : {};
  const legacyStory = source.prevX !== undefined || source.nextX !== undefined || source.prevYOffset !== undefined || source.nextYOffset !== undefined;
  return {
    center: navGroupFromProps(source.center, DEFAULT_TESTIMONIAL_NAV.center),
    story: navGroupFromProps(legacyStory ? source : source.story, DEFAULT_TESTIMONIAL_NAV.story),
    voice: navGroupFromProps(source.voice, DEFAULT_TESTIMONIAL_NAV.voice)
  };
}

function testimonialNavIsDirty(current, original) {
  return TESTIMONIAL_NAV_TARGETS.some(({ id }) => {
    const a = current[id] ?? DEFAULT_TESTIMONIAL_NAV[id];
    const b = original[id] ?? DEFAULT_TESTIMONIAL_NAV[id];
    return (
      Math.abs(a.prevX - b.prevX) >= 0.1 ||
      Math.abs(a.nextX - b.nextX) >= 0.1 ||
      Math.abs(a.prevYOffset - b.prevYOffset) >= 0.01 ||
      Math.abs(a.nextYOffset - b.nextYOffset) >= 0.01
    );
  });
}

function TestimonialPhotoPositionEditor({ slides, storyNav, disabled, busy, onSave, onSaveStoryNav }) {
  const [activeId, setActiveId] = useState(slides[0]?.id ?? "");
  const [drafts, setDrafts] = useState(() => testimonialDraftsFromSlides(slides));
  const [navDraft, setNavDraft] = useState(() => testimonialNavFromProps(storyNav));
  const [navModalOpen, setNavModalOpen] = useState(false);
  const dragRef = useRef(null);
  const activeSlide = slides.find((slide) => slide.id === activeId) ?? slides[0];
  const activeDraft = drafts[activeSlide?.id] ?? {
    photoYPercent: Number(activeSlide?.photoYPercent ?? 0),
    voiceIconXPercent: Number(activeSlide?.voiceIconXPercent ?? 0),
    voiceIconYPercent: Number(activeSlide?.voiceIconYPercent ?? 0)
  };
  const activeValue = Number(activeDraft.photoYPercent ?? activeSlide?.photoYPercent ?? 0);
  const activeIconX = Number(activeDraft.voiceIconXPercent ?? activeSlide?.voiceIconXPercent ?? 0);
  const activeIconY = Number(activeDraft.voiceIconYPercent ?? activeSlide?.voiceIconYPercent ?? 0);
  const originalValue = Number(activeSlide?.photoYPercent ?? 0);
  const originalIconX = Number(activeSlide?.voiceIconXPercent ?? 0);
  const originalIconY = Number(activeSlide?.voiceIconYPercent ?? 0);
  const isDirty = (
    Math.abs(activeValue - originalValue) >= 0.01 ||
    Math.abs(activeIconX - originalIconX) >= 0.01 ||
    Math.abs(activeIconY - originalIconY) >= 0.01
  );

  const originalNav = testimonialNavFromProps(storyNav);
  const isNavDirty = testimonialNavIsDirty(navDraft, originalNav);
  const isNavSaving = busy === "testimonial-story-nav";
  const isSaving = busy === `testimonial-photo-${activeSlide?.id}`;

  useEffect(() => {
    if (!slides.length) {
      setActiveId("");
      setDrafts({});
      return;
    }
    setActiveId((current) => (slides.some((slide) => slide.id === current) ? current : slides[0].id));
    setDrafts(testimonialDraftsFromSlides(slides));
  }, [slides]);

  useEffect(() => {
    setNavDraft(testimonialNavFromProps(storyNav));
  }, [storyNav]);

  const setActiveValue = (nextValue) => {
    if (!activeSlide) return;
    setDrafts((current) => ({
      ...current,
      [activeSlide.id]: {
        ...(current[activeSlide.id] ?? {}),
        photoYPercent: roundedNumber(clampNumber(nextValue, -8, 8), 2)
      }
    }));
  };

  const setActiveIconPosition = (axis, nextValue) => {
    if (!activeSlide) return;
    const key = axis === "x" ? "voiceIconXPercent" : "voiceIconYPercent";
    setDrafts((current) => ({
      ...current,
      [activeSlide.id]: {
        ...(current[activeSlide.id] ?? {}),
        [key]: roundedNumber(clampNumber(nextValue, -8, 8), 2)
      }
    }));
  };

  const resetActivePositions = () => {
    if (!activeSlide) return;
    setDrafts((current) => ({
      ...current,
      [activeSlide.id]: {
        ...(current[activeSlide.id] ?? {}),
        photoYPercent: 0,
        voiceIconXPercent: 0,
        voiceIconYPercent: 0
      }
    }));
  };

  const startDrag = (event, dragType = "photo") => {
    if (disabled || !activeSlide) return;
    const frame = event.currentTarget.closest(".testimonial-editor-preview");
    if (!frame) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = frame.getBoundingClientRect();
    dragRef.current = {
      type: dragType,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startValue: activeValue,
      startXValue: activeIconX,
      startYValue: activeIconY,
      width: rect.width || 1,
      height: rect.height || 1
    };
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.type === "voice-icon") {
      const deltaXPercent = ((event.clientX - drag.startX) / drag.width) * 100;
      const deltaYPercent = ((event.clientY - drag.startY) / drag.height) * 100;
      setActiveIconPosition("x", drag.startXValue + deltaXPercent);
      setActiveIconPosition("y", drag.startYValue + deltaYPercent);
      return;
    }
    const deltaYPercent = ((event.clientY - drag.startY) / drag.height) * 100;
    setActiveValue(drag.startValue + deltaYPercent);
  };

  const endDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
  };

  if (!slides.length || !activeSlide) {
    return <div className="empty-image">実績者スライドがありません</div>;
  }

  return (
    <div className="testimonial-editor">
      <div className="testimonial-editor-tabs" role="tablist" aria-label="実績者スライド">
        {slides.map((slide) => (
          <button
            key={slide.id}
            type="button"
            className={slide.id === activeSlide.id ? "active" : ""}
            onClick={() => setActiveId(slide.id)}
            disabled={disabled}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div className="testimonial-editor-preview-stack">
        <div className="testimonial-editor-preview" data-testimonial-slide={activeSlide.id}>
          <img className="testimonial-editor-bg" src={activeSlide.storyUrl ?? activeSlide.backgroundUrl} alt={`${activeSlide.label} 変化コピー背景`} draggable={false} />
          <img
            className="testimonial-editor-photo"
            src={activeSlide.photoUrl}
            alt={`${activeSlide.label} 写真`}
            draggable={false}
            style={{ top: `calc(21.8% + ${activeValue}%)` }}
            onPointerDown={(event) => startDrag(event, "photo")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        </div>
        {activeSlide.voiceUrl ? (
          <div className="testimonial-editor-preview testimonial-editor-preview--voice" data-testimonial-slide={activeSlide.id}>
            <img className="testimonial-editor-bg" src={activeSlide.voiceUrl} alt={`${activeSlide.label} 感想背景`} draggable={false} />
            <img
              className="testimonial-editor-photo testimonial-editor-photo--voice"
              src={activeSlide.photoUrl}
              alt={`${activeSlide.label} 感想顔アイコン`}
              draggable={false}
              style={{
                "--testimonial-voice-icon-x": `${activeIconX}%`,
                "--testimonial-voice-icon-y": `${activeIconY}%`
              }}
              onPointerDown={(event) => startDrag(event, "voice-icon")}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          </div>
        ) : null}
      </div>

      <div className="testimonial-position-controls">
        <label className="loop-range-control">
          <span>写真の上下</span>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.1"
            value={activeValue}
            onChange={(event) => setActiveValue(Number(event.target.value))}
            disabled={disabled}
          />
          <output>{activeValue.toFixed(1)}%</output>
        </label>
        <label className="loop-range-control">
          <span>感想顔アイコンの左右</span>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.1"
            value={activeIconX}
            onChange={(event) => setActiveIconPosition("x", Number(event.target.value))}
            disabled={disabled}
          />
          <output>{activeIconX.toFixed(1)}%</output>
        </label>
        <label className="loop-range-control">
          <span>感想顔アイコンの上下</span>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.1"
            value={activeIconY}
            onChange={(event) => setActiveIconPosition("y", Number(event.target.value))}
            disabled={disabled}
          />
          <output>{activeIconY.toFixed(1)}%</output>
        </label>
        <div className="testimonial-position-actions">
          <button
            type="button"
            className="toolbar-button"
            onClick={resetActivePositions}
            disabled={disabled || (
              Math.abs(activeValue) < 0.01 &&
              Math.abs(activeIconX) < 0.01 &&
              Math.abs(activeIconY) < 0.01
            )}
          >
            <Undo2 size={15} />
            <span>全部0に戻す</span>
          </button>
          <button
            type="button"
            className="toolbar-button primary"
            onClick={() => onSave(activeSlide.id, {
              photoYPercent: activeValue,
              voiceIconXPercent: activeIconX,
              voiceIconYPercent: activeIconY
            })}
            disabled={disabled || !isDirty || isSaving}
          >
            {isSaving ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />}
            <span>位置を保存</span>
          </button>
        </div>
      </div>

      <div className="testimonial-editor-note">
        <MoveVertical size={14} />
        <span>写真は上下にドラッグできます。保存するとLP側の実績者カルーセルにも反映されます。</span>
      </div>

      {onSaveStoryNav && (
        <div className="testimonial-nav-editor">
          <div className="testimonial-nav-editor-title">
            <SlidersHorizontal size={14} />
            <span>左右ボタンの位置</span>
          </div>
          <button
            type="button"
            className="toolbar-button primary"
            style={{ margin: "8px 0 0" }}
            onClick={() => setNavModalOpen(true)}
            disabled={disabled}
          >
            <SlidersHorizontal size={15} />
            <span>プレビューで調整する</span>
          </button>
          {navModalOpen && (
            <StoryNavModal
              slides={slides}
              initialNav={navDraft}
              isSaving={isNavSaving}
              disabled={disabled}
              onClose={() => setNavModalOpen(false)}
              onSave={(next) => { setNavDraft(next); onSaveStoryNav(next); setNavModalOpen(false); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function LoopSectionRow({ section, sections, assets, draft, busy, disabled, onEdit, onSave, onOpenLinkAreaEditor }) {
  const assetsBySrc = useMemo(() => buildLoopAssetsBySrc(assets, sections), [assets, sections]);
  const isDirty = loopSectionIsDirty(section, draft);
  const isSaving = busy === `loop-save-${section.id}`;
  const isHtmlSection = section.kind === "html";
  const isEditableSection = (section.tracks ?? []).length > 0;
  const mediaItems = section.mediaItems ?? [];
  const editLabel = isHtmlSection ? "素材を編集" : "ループを編集";
  const unsavedLabel = isHtmlSection ? "素材 未保存" : "ループ 未保存";
  const trackSummaries = (section.tracks ?? []).map((track) => {
    const trackDraft = loopTrackDraft(track, draft);
    if (track.mediaOnly) {
      return {
        id: track.id,
        label: track.label,
        enabled: true,
        count: trackDraft.imageSrcs.length,
        direction: "",
        vertical: ""
      };
    }
    return {
      id: track.id,
      label: track.label,
      enabled: trackDraft.enabled,
      count: trackDraft.imageSrcs.length,
      direction: trackDraft.reverse ? "右へ流す" : "左へ流す",
      vertical: trackDraft.position.bottom != null
        ? `下 ${trackDraft.position.bottom}%`
        : `上 ${trackDraft.position.top}%`
    };
  });
  const enabledCount = trackSummaries.filter((track) => track.enabled).length;
  const assetCount = !isHtmlSection
    ? trackSummaries.reduce((sum, track) => sum + track.count, 0)
    : ((section.tracks ?? [])[0] ? loopTrackDraft(section.tracks[0], draft).imageSrcs.length : mediaItems.length);

  return (
    <article className={`section-row loop-section-row ${isDirty ? "dirty" : ""}`}>
      <div className="section-title">
        <div className="section-title-left">
          <div className="section-title-info">
            <span className="section-id">{section.badge ?? (!isHtmlSection ? "LOOP" : "HTML")}</span>
            <h2>{section.label}</h2>
          </div>
        </div>
        <div className="section-actions">
          {isEditableSection && isDirty && <span className="dirty-field-badge copy">{unsavedLabel}</span>}
          {isEditableSection && (
            <>
              <IconButton
                icon={SlidersHorizontal}
                label={editLabel}
                kind="generate"
                showLabel
                onClick={onEdit}
                disabled={disabled}
              />
              <IconButton
                icon={Save}
                label="保存"
                kind="save"
                showLabel
                loading={isSaving}
                onClick={onSave}
                disabled={disabled || !isDirty}
              />
            </>
          )}
        </div>
      </div>

      <div className="section-grid no-prompts loop-section-grid">
        <Panel
          title={!isHtmlSection ? "ループ構成" : (isEditableSection ? "モックアップ素材" : "HTMLセクション")}
          dirty={isEditableSection && isDirty}
          actions={isEditableSection ? (
            <IconButton
              icon={SlidersHorizontal}
              label={editLabel}
              onClick={onEdit}
              disabled={disabled}
            />
          ) : null}
        >
          <div className="loop-summary-panel">
            <div className="loop-summary-hero">
              <span>{!isHtmlSection ? `${enabledCount} 行表示` : "HTML差し込み"}</span>
              <strong>{!isHtmlSection ? `${assetCount} 枚の制作物` : (isEditableSection ? `${assetCount} 枚のモックアップ素材` : section.backgroundSrc)}</strong>
              <small>{section.backgroundSrc}</small>
            </div>
            {!isHtmlSection || isEditableSection ? (
              <div className="loop-summary-tracks">
                {trackSummaries.map((track) => (
                  <div key={track.id} className={track.enabled ? "" : "disabled"}>
                    <strong>{track.label}</strong>
                    <span>{track.enabled ? (track.vertical ? `${track.count}枚 / ${track.direction} / ${track.vertical}` : `${track.count}枚`) : "非表示"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loop-summary-tracks">
                <div>
                  <strong>背景画像</strong>
                  <span>{section.background?.exists ? "読み込みOK" : "画像未確認"}</span>
                </div>
                {mediaItems.length > 0 && (
                  <div>
                    <strong>モックアップ素材</strong>
                    <span>{mediaItems.length}枚</span>
                  </div>
                )}
                {section.sectionClass && (
                  <div>
                    <strong>HTMLクラス</strong>
                    <span>{section.sectionClass}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title="ライブプレビュー"
          actions={(
            <>
              {isEditableSection && (
                <IconButton
                  icon={SlidersHorizontal}
                  label={editLabel}
                  onClick={onEdit}
                  disabled={disabled}
                />
              )}
              <IconButton
                icon={Link}
                label="リンク・キラーんアニメーションを設定"
                onClick={onOpenLinkAreaEditor}
                disabled={disabled || !section.backgroundSrc}
              />
            </>
          )}
        >
          <div className="loop-inline-preview">
            <LoopLivePreview section={section} draft={draft} assetsBySrc={assetsBySrc} />
          </div>
          <div className="image-meta">
            <span>{!isHtmlSection ? "LP上の無限ループ表示" : "LP上のHTML差し込み表示"}</span>
            <span>{section.sectionClass || section.backgroundSrc}</span>
          </div>
        </Panel>
      </div>
    </article>
  );
}

function LoopSectionEditorModal({ section, sections, assets, draft, busy, disabled, onDraftChange, onSave, onClose }) {
  const assetsBySrc = useMemo(() => buildLoopAssetsBySrc(assets, sections), [assets, sections]);
  const groupedAssets = useMemo(() => groupLoopAssets(assets), [assets]);
  const isDirty = loopSectionIsDirty(section, draft);
  const isSaving = busy === `loop-save-${section.id}`;
  const isHtmlSection = section.kind === "html";

  return (
    <div className="modal-backdrop">
      <section className="loop-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">{isHtmlSection ? "HTML" : "LOOP"}</span>
            <h2>{section.label} の{isHtmlSection ? "素材編集" : "ループ編集"}</h2>
          </div>
          <button className="modal-close" onClick={onClose} title="閉じる">
            <XCircle size={18} />
          </button>
        </div>

        <div className="loop-modal-layout">
          <aside className="loop-modal-preview">
            <LoopLivePreview section={section} draft={draft} assetsBySrc={assetsBySrc} />
          </aside>
          <div className="loop-modal-tracks">
            {(section.tracks ?? []).map((track) => (
              <LoopTrackEditor
                key={track.id}
                section={section}
                track={track}
                draft={draft}
                groupedAssets={groupedAssets}
                assetsBySrc={assetsBySrc}
                disabled={disabled}
                onDraftChange={onDraftChange}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>閉じる</button>
          <button
            className="primary"
            onClick={onSave}
            disabled={disabled || !isDirty}
          >
            {isSaving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}
            保存
          </button>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, dirty = false, actions, children }) {
  return (
    <div className="panel">
      <div className={`panel-head${dirty ? " has-changes" : ""}`}>
        <span>
          {title}
          {dirty && <span className="change-dot" aria-label="未保存の変更があります" />}
        </span>
        <div className="panel-actions">{actions}</div>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function LoopSectionsWorkspace({ sections, assets, drafts, busy, disabled, onDraftChange, onSave, onReload, onOpenLp }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (!sections.length) {
      setActiveId("");
      return;
    }
    if (!sections.some((section) => section.id === activeId)) {
      setActiveId(sections[0].id);
    }
  }, [sections, activeId]);

  const assetsBySrc = useMemo(() => buildLoopAssetsBySrc(assets, sections), [assets, sections]);
  const groupedAssets = useMemo(() => groupLoopAssets(assets), [assets]);

  if (!sections.length) {
    return (
      <section className="empty-state">
        <h2>無限ループセクションが見つかりません</h2>
        <p>LP HTMLに `ai-loop-section` がある場合、ここに表示されます。</p>
      </section>
    );
  }

  const active = sections.find((section) => section.id === activeId) ?? sections[0];
  const draft = loopSectionDraft(active, drafts);
  const isDirty = loopSectionIsDirty(active, draft);
  const isSaving = busy === `loop-save-${active.id}`;

  return (
    <section className="loop-workspace">
      <div className="preview-head">
        <div>
          <h2>無限ループセクション</h2>
          <p>projects/ai-income-course/ver01-fresh-green/lp/index.html</p>
        </div>
        <div className="preview-head-actions">
          <ToolbarButton icon={RefreshCcw} loading={busy === "loop-load"} disabled={disabled} onClick={onReload}>
            読み込み
          </ToolbarButton>
          <ToolbarButton icon={Rocket} onClick={onOpenLp}>
            実LPを開く
          </ToolbarButton>
        </div>
      </div>

      <div className="loop-layout">
        <aside className="loop-section-nav" aria-label="無限ループセクション選択">
          {sections.map((section) => {
            const sectionDraft = loopSectionDraft(section, drafts);
            const dirty = loopSectionIsDirty(section, sectionDraft);
            const count = (section.tracks ?? []).reduce((sum, track) => (
              sum + (sectionDraft.tracks?.[track.id] ?? track.imageSrcs ?? []).length
            ), 0);
            return (
              <button
                key={section.id}
                className={section.id === active.id ? "active" : ""}
                onClick={() => setActiveId(section.id)}
                disabled={disabled}
              >
                <span className="section-id">LOOP</span>
                <strong>{section.label}</strong>
                <small>{count} 枚</small>
                {dirty && <span className="loop-dirty-dot" aria-label="未保存" />}
              </button>
            );
          })}
        </aside>

        <article className={`loop-editor-card ${isDirty ? "dirty" : ""}`}>
          <div className="loop-editor-head">
            <div>
              <span className="section-id">{active.sectionClass}</span>
              <h2>{active.label}</h2>
              <p>{active.backgroundSrc}</p>
            </div>
            <ToolbarButton
              icon={Save}
              className="primary"
              loading={isSaving}
              disabled={disabled || !isDirty}
              onClick={() => onSave(active)}
            >
              保存
            </ToolbarButton>
          </div>

          <div className="loop-editor-grid">
            <LoopLivePreview section={active} draft={draft} assetsBySrc={assetsBySrc} />
            <div className="loop-track-editor-list">
              {(active.tracks ?? []).map((track) => (
                <LoopTrackEditor
                  key={track.id}
                  section={active}
                  track={track}
                  draft={draft}
                  groupedAssets={groupedAssets}
                  assetsBySrc={assetsBySrc}
                  disabled={disabled}
                  onDraftChange={onDraftChange}
                />
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function MockupMediaPreview({ section, mediaSrcs, assetsBySrc }) {
  if (!mediaSrcs.length) return null;

  const firstSrc = mediaSrcs[0];
  if (section.id === "consultant-template") {
    return (
      <div className="html-preview-laptop html-preview-laptop--consultant" aria-hidden="true">
        <div className="html-preview-laptop-shell">
          <div className="html-preview-screen">
            <img src={loopAssetUrl(firstSrc, assetsBySrc)} alt="" />
          </div>
        </div>
      </div>
    );
  }

  if (section.id === "video-mockup") {
    return (
      <div className="html-preview-laptop html-preview-laptop--video" aria-hidden="true">
        <div className="html-preview-laptop-shell">
          <div className="html-preview-screen html-preview-screen--dark">
            <img src={loopAssetUrl(firstSrc, assetsBySrc)} alt="" />
          </div>
        </div>
        <div className="html-preview-laptop-base" />
      </div>
    );
  }

  return (
    <div className={`loop-preview-media-strip loop-preview-media-strip--${section.id}`} aria-hidden="true">
      {mediaSrcs.slice(0, 8).map((src) => (
        <img key={src} src={loopAssetUrl(src, assetsBySrc)} alt="" />
      ))}
    </div>
  );
}

function LoopLivePreview({ section, draft, assetsBySrc }) {
  const mediaTrack = (section.tracks ?? []).find((track) => track.mediaOnly);
  const mediaSrcs = mediaTrack
    ? loopTrackDraft(mediaTrack, draft).imageSrcs
    : (section.mediaItems ?? []).map((item) => item.src).filter(Boolean);
  return (
    <div className="loop-preview-wrap">
      <div className="loop-preview-device">
        <div className="loop-live-preview" aria-label={`${section.label} の無限ループプレビュー`}>
          {section.backgroundSrc ? (
            <img className="loop-preview-bg" src={loopAssetUrl(section.backgroundSrc, assetsBySrc)} alt="" />
          ) : (
            <div className="empty-image">背景なし</div>
          )}
          {(section.tracks ?? []).filter((track) => !track.mediaOnly).map((track) => {
            const trackDraft = loopTrackDraft(track, draft);
            const imageSrcs = trackDraft.imageSrcs ?? [];
            const repeated = [...imageSrcs, ...imageSrcs];
            const position = trackDraft.position ?? {};
            if (trackDraft.enabled === false) return null;
            return (
              <div
                key={track.id}
                className={`loop-preview-marquee loop-preview-marquee--${track.variant} ${track.trackClass.replace(/^loop-track/, "loop-marquee")}`}
                style={{
                  top: position.top != null ? `${position.top}%` : undefined,
                  bottom: position.bottom != null ? `${position.bottom}%` : undefined,
                  left: position.left != null ? `${position.left}%` : undefined,
                  right: position.right != null ? `${position.right}%` : undefined
                }}
              >
                <div
                  className={`loop-preview-track loop-preview-track--${track.variant} ${track.trackClass} ${trackDraft.reverse ? "reverse" : ""}`}
                  style={{
                    animationDuration: `${trackDraft.duration ?? 48}s`,
                    marginLeft: `${trackDraft.offsetX ?? 0}px`
                  }}
                >
                  {repeated.map((src, index) => (
                    <img
                      key={`${track.id}-${src}-${index}`}
                      src={loopAssetUrl(src, assetsBySrc)}
                      alt=""
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <MockupMediaPreview section={section} mediaSrcs={mediaSrcs} assetsBySrc={assetsBySrc} />
        </div>
      </div>
    </div>
  );
}

function LoopTrackEditor({ section, track, draft, groupedAssets, assetsBySrc, disabled, onDraftChange }) {
  const trackDraft = loopTrackDraft(track, draft);
  const imageSrcs = trackDraft.imageSrcs ?? [];
  const selectedSet = new Set(imageSrcs);

  const patchTrack = (patch) => onDraftChange(section.id, track.id, patch);
  const setTrackImages = (next) => patchTrack({ imageSrcs: next });
  const removeAt = (index) => setTrackImages(imageSrcs.filter((_, itemIndex) => itemIndex !== index));
  const move = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= imageSrcs.length) return;
    const next = [...imageSrcs];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setTrackImages(next);
  };
  const toggleAsset = (src) => {
    if (selectedSet.has(src)) {
      setTrackImages(imageSrcs.filter((item) => item !== src));
      return;
    }
    setTrackImages([...imageSrcs, src]);
  };

  return (
    <section className="loop-track-editor">
      <div className="loop-track-editor-head">
        <div>
          <h3>{track.label}</h3>
          <span>{track.mediaOnly ? `${imageSrcs.length} 枚` : (trackDraft.enabled ? `${imageSrcs.length} 枚 / ${trackDraft.reverse ? "右へ流す" : "左へ流す"} / ${trackDraft.duration ?? 48}s` : "この行は非表示")}</span>
        </div>
        <button
          className="loop-text-button"
          onClick={() => patchTrack(loopTrackDraft(track, { tracks: {} }))}
          disabled={disabled}
        >
          <RefreshCcw size={14} />
          戻す
        </button>
      </div>

      {!track.settingsDisabled && (
        <LoopTrackSettings
          track={track}
          value={trackDraft}
          disabled={disabled}
          onChange={patchTrack}
        />
      )}

      <div className="loop-selected-list">
        {imageSrcs.length ? imageSrcs.map((src, index) => (
          <div key={`${src}-${index}`} className="loop-selected-item">
            <img src={loopAssetUrl(src, assetsBySrc)} alt="" />
            <span>{loopAssetTitle(src, assetsBySrc)}</span>
            <button onClick={() => move(index, -1)} disabled={disabled || index === 0} title="上へ" aria-label="上へ">
              <ArrowUp size={13} />
            </button>
            <button onClick={() => move(index, 1)} disabled={disabled || index === imageSrcs.length - 1} title="下へ" aria-label="下へ">
              <ArrowDown size={13} />
            </button>
            <button className="danger-text" onClick={() => removeAt(index)} disabled={disabled} title="外す" aria-label="外す">
              <Trash2 size={13} />
            </button>
          </div>
        )) : (
          <div className="loop-selected-empty">未選択</div>
        )}
      </div>

      <div className="loop-asset-groups">
        {groupedAssets.map(([group, items]) => (
          <div key={group} className="loop-asset-group">
            <h4>{group}</h4>
            <div className="loop-asset-grid">
              {items.map((asset) => (
                <button
                  key={asset.src}
                  className={`loop-asset-tile ${selectedSet.has(asset.src) ? "selected" : ""}`}
                  onClick={() => toggleAsset(asset.src)}
                  disabled={disabled}
                  title={asset.src}
                >
                  <img src={asset.url} alt="" />
                  <span>{asset.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoopTrackSettings({ value, disabled, onChange }) {
  const position = value.position ?? {};
  const anchor = position.bottom != null ? "bottom" : "top";
  const vertical = position[anchor] ?? 0;
  const setPosition = (patch) => onChange({
    position: {
      ...(anchor === "bottom" ? { bottom: vertical } : { top: vertical }),
      left: position.left ?? 0,
      right: position.right ?? 0,
      ...patch
    }
  });
  const setAnchor = (nextAnchor) => {
    if (nextAnchor === anchor) return;
    onChange({
      position: {
        ...(nextAnchor === "bottom" ? { bottom: 10 } : { top: 32 }),
        left: position.left ?? 0,
        right: position.right ?? 0
      }
    });
  };

  return (
    <div className="loop-track-settings">
      <label className="loop-switch">
        <input
          type="checkbox"
          checked={value.enabled !== false}
          onChange={(event) => onChange({ enabled: event.target.checked })}
          disabled={disabled}
        />
        <span>この行を表示</span>
      </label>

      <div className="loop-setting-block">
        <span>流れる方向</span>
        <div className="segmented loop-direction-toggle">
          <button
            type="button"
            className={!value.reverse ? "active" : ""}
            onClick={() => onChange({ reverse: false })}
            disabled={disabled}
          >
            左へ
          </button>
          <button
            type="button"
            className={value.reverse ? "active" : ""}
            onClick={() => onChange({ reverse: true })}
            disabled={disabled}
          >
            右へ
          </button>
        </div>
      </div>

      <div className="loop-setting-block">
        <span>上下基準</span>
        <div className="segmented loop-direction-toggle">
          <button
            type="button"
            className={anchor === "top" ? "active" : ""}
            onClick={() => setAnchor("top")}
            disabled={disabled}
          >
            上
          </button>
          <button
            type="button"
            className={anchor === "bottom" ? "active" : ""}
            onClick={() => setAnchor("bottom")}
            disabled={disabled}
          >
            下
          </button>
        </div>
      </div>

      <label className="loop-range-control">
        <span>{anchor === "bottom" ? "下余白" : "上余白"}</span>
        <input
          type="range"
          min="0"
          max="92"
          step="1"
          value={vertical}
          onChange={(event) => setPosition({ [anchor]: Number(event.target.value) })}
          disabled={disabled}
        />
        <output>{vertical}%</output>
      </label>

      <label className="loop-range-control">
        <span>左余白</span>
        <input
          type="range"
          min="0"
          max="45"
          step="1"
          value={position.left ?? 0}
          onChange={(event) => setPosition({ left: Number(event.target.value) })}
          disabled={disabled}
        />
        <output>{position.left ?? 0}%</output>
      </label>

      <label className="loop-range-control">
        <span>右余白</span>
        <input
          type="range"
          min="0"
          max="45"
          step="1"
          value={position.right ?? 0}
          onChange={(event) => setPosition({ right: Number(event.target.value) })}
          disabled={disabled}
        />
        <output>{position.right ?? 0}%</output>
      </label>

      <label className="loop-range-control">
        <span>横ずらし</span>
        <input
          type="range"
          min="-240"
          max="240"
          step="4"
          value={value.offsetX ?? 0}
          onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
          disabled={disabled}
        />
        <output>{value.offsetX ?? 0}px</output>
      </label>

      <label className="loop-range-control">
        <span>速度</span>
        <input
          type="range"
          min="8"
          max="120"
          step="1"
          value={value.duration ?? 48}
          onChange={(event) => onChange({ duration: Number(event.target.value) })}
          disabled={disabled}
        />
        <output>{value.duration ?? 48}s</output>
      </label>
    </div>
  );
}

function ImageGallery({ sections, onOpenHistory }) {
  return (
    <section className="image-gallery">
      {sections.map((section) => (
        <article key={section.id} className="image-card">
          <div className="image-card-head">
            <div>
              <span className="section-id">{section.id}</span>
              <h2>{section.title}</h2>
            </div>
            <IconButton icon={History} label="画像履歴を開く" onClick={() => onOpenHistory(section, "image")} />
          </div>
          {section.testimonialSlides?.length ? (
            <div className="testimonial-gallery-grid">
              {section.testimonialSlides.map((slide) => (
                <div key={slide.id} className="testimonial-gallery-item">
                  <div className="testimonial-gallery-preview">
                    <img src={slide.storyUrl ?? slide.backgroundUrl} alt={`${slide.label} 変化コピー背景`} draggable={false} />
                    <img
                      className="testimonial-gallery-photo"
                      src={slide.photoUrl}
                      alt={`${slide.label} 写真`}
                      draggable={false}
                      style={{ top: `calc(21.8% + ${Number(slide.photoYPercent ?? 0)}%)` }}
                    />
                  </div>
                  {slide.voiceUrl ? (
                    <div className="testimonial-gallery-preview testimonial-gallery-preview--voice" data-testimonial-slide={slide.id}>
                      <img src={slide.voiceUrl} alt={`${slide.label} 感想背景`} draggable={false} />
                      <img
                      className="testimonial-gallery-photo testimonial-gallery-photo--voice"
                      src={slide.photoUrl}
                      alt={`${slide.label} 感想顔アイコン`}
                      draggable={false}
                      style={{
                        "--testimonial-voice-icon-x": `${Number(slide.voiceIconXPercent ?? 0)}%`,
                        "--testimonial-voice-icon-y": `${Number(slide.voiceIconYPercent ?? 0)}%`
                      }}
                    />
                    </div>
                  ) : null}
                  <span>{slide.label}</span>
                </div>
              ))}
            </div>
          ) : section.imageUrl ? (
            <img src={section.imageUrl} alt={`${section.title} のLP画像`} />
          ) : (
            <div className="empty-image">画像なし</div>
          )}
        </article>
      ))}
    </section>
  );
}

function FullLpPreview({ project }) {
  const lpHtmlUrl = project?.lpHtmlUrl || "/lp-assets/index.html";
  const lpHtmlPath = project?.lpHtmlPath || "projects/ai-income-course/ver01-fresh-green/lp/index.html";

  return (
    <section className="full-preview">
      <div className="preview-head">
        <div>
          <h2>LP全体プレビュー</h2>
          <p>{lpHtmlPath}</p>
        </div>
        <div className="preview-head-actions">
          <ToolbarButton icon={Rocket} onClick={() => window.open(lpHtmlUrl, "_blank", "noopener,noreferrer")}>
            LPを開く
          </ToolbarButton>
        </div>
      </div>
      <div className="full-preview-frame">
        <iframe src={lpHtmlUrl} title="LP全体プレビュー" />
      </div>
      {project.fullImageUrl ? (
        <details className="full-preview-legacy">
          <summary>lp-full.png</summary>
          <img src={project.fullImageUrl} alt="LP全体画像" />
        </details>
      ) : null}
    </section>
  );
}

function PublicCompare({ project, sections }) {
  if (!project.publicUrl) {
    return (
      <section className="empty-state">
        <h2>公開中LPのURLが未設定です</h2>
        <p>`.env.local` に `LP_PUBLIC_URL=https://...` を設定すると、公開中LPの確認と画像比較が使えます。</p>
      </section>
    );
  }

  return (
    <section className="public-compare">
      <div className="preview-head">
        <div>
          <h2>公開中LPとの比較</h2>
          <p>{project.publicUrl}</p>
        </div>
        <ToolbarButton icon={Rocket} onClick={() => window.open(project.publicUrl, "_blank", "noopener,noreferrer")}>
          公開中LPを開く
        </ToolbarButton>
      </div>
      <div className="compare-list">
        {sections.map((section) => (
          <article key={section.id} className="compare-row">
            <div className="compare-title">
              <span className="section-id">{section.id}</span>
              <h2>{section.title}</h2>
            </div>
            <div className="compare-images">
              <figure>
                <figcaption>公開中</figcaption>
                {section.publicImageUrl ? <img src={section.publicImageUrl} alt={`${section.title} 公開中画像`} /> : <div className="empty-image">公開URLなし</div>}
              </figure>
              <figure>
                <figcaption>編集中</figcaption>
                {section.imageUrl ? <img src={section.imageUrl} alt={`${section.title} 編集中画像`} /> : <div className="empty-image">画像なし</div>}
              </figure>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HistoryModal({ target, snapshots, loading, busy, onClose, onRestore }) {
  const { section, field } = target;
  const candidates = useMemo(() => snapshots.filter((snapshot) => {
    if (!snapshot.changedFields?.includes(field)) return false;
    if (field === "image") return Boolean(snapshot.imageBackupUrl);
    return typeof snapshot[field] === "string";
  }), [snapshots, field]);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    setSelectedFile(candidates[0]?.snapshotFile ?? "");
  }, [candidates]);

	  const selected = candidates.find((snapshot) => snapshot.snapshotFile === selectedFile) ?? candidates[0];
	  const fieldLabel = field === "copy" ? "原稿" : field === "prompt" ? "プロンプト" : "画像";
	  const currentText = field === "copy" ? target.currentCopy : target.currentPrompt;
	  const selectedAt = selected?.createdAt ? new Date(selected.createdAt).toLocaleString("ja-JP") : "";

	  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="history-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">{section.id}</span>
            <h2>{fieldLabel}履歴</h2>
          </div>
          <button className="modal-close" onClick={onClose} title="閉じる">
            <XCircle size={20} />
          </button>
        </div>

        {loading ? (
          <div className="history-loading">
            <LoaderCircle className="spin" size={22} />
            <span>履歴を読み込み中</span>
          </div>
        ) : candidates.length ? (
          <div className="history-layout">
            <aside className="history-list">
              {candidates.map((snapshot) => (
                <button
                  key={snapshot.snapshotFile}
                  className={snapshot.snapshotFile === selected?.snapshotFile ? "active" : ""}
                  onClick={() => setSelectedFile(snapshot.snapshotFile)}
                >
                  <strong>{new Date(snapshot.createdAt).toLocaleString("ja-JP")}</strong>
                  <span>{snapshot.reason}</span>
                  <small>{field === "image" ? `${snapshot.imageMeta?.width ?? "-"} x ${snapshot.imageMeta?.height ?? "-"}` : `${snapshot[`${field}Length`]}文字`}</small>
                </button>
              ))}
            </aside>

	            <div className="history-preview">
	              <div className="history-direction">
	                <span className="history-badge current">現在 / 戻す前</span>
	                <span className="history-arrow">→</span>
	                <span className="history-badge restore">選択履歴 / 戻した後</span>
	                {selectedAt && <small>{selectedAt} の履歴を適用</small>}
	              </div>
	              <div className="history-compare">
	                <PreviewPane label={`現在の${fieldLabel}（戻す前）`} tone="current">
	                  {field === "image" ? (
	                    section.imageUrl ? <img src={section.imageUrl} alt="現在の画像" /> : <div className="empty-image">画像なし</div>
	                  ) : (
	                    <pre>{currentText}</pre>
	                  )}
	                </PreviewPane>
	                <PreviewPane label={`選択履歴の${fieldLabel}（戻した後）`} tone="restore">
	                  {field === "image" ? (
	                    selected?.imageBackupUrl ? <img src={selected.imageBackupUrl} alt="履歴画像" /> : <div className="empty-image">画像なし</div>
	                  ) : (
                    <pre>{selected?.[field] ?? ""}</pre>
                  )}
                </PreviewPane>
              </div>
	              <div className="modal-actions">
	                <button onClick={onClose}>キャンセル</button>
	                <button className="primary" disabled={busy || !selected} onClick={() => onRestore(selected)}>
	                  右側の内容に戻す
	                </button>
	              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state compact">
            <h2>戻せる{fieldLabel}履歴がありません</h2>
            <p>保存、画像生成、アップロード、差し替えを行うと履歴が作成されます。</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewPane({ label, tone = "", children }) {
  return (
    <figure className={`preview-pane ${tone}`}>
      <figcaption>{label}</figcaption>
      <div>{children}</div>
    </figure>
  );
}

function StateSnapshotsModal({
  snapshots,
  loading,
  busy,
  dirtyCount,
  sectionCount,
  suggestion,
  onClose,
  onReload,
  onCreate,
  onRestore,
  onDelete
}) {
  const [title, setTitle] = useState("");
  const [labels, setLabels] = useState("");
  const [note, setNote] = useState("");
  const isBusy = Boolean(busy);
  const canCreate = title.trim().length > 0 && !isBusy;

  const applySuggestion = () => {
    if (!suggestion || isBusy) return;
    setTitle(suggestion.title ?? "");
    setLabels((suggestion.labels ?? []).join(", "));
    setNote(suggestion.note ?? "");
  };

  const create = () => {
    if (!canCreate) return;
    onCreate({ title: title.trim(), labels, note });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="state-snapshot-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">ALL</span>
            <h2>全体状態</h2>
            <p className="modal-subtitle">全セクションの原稿、画像プロンプト、セクション画像を名前付きで保存・復元します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isBusy} title="閉じる"><XCircle size={20} /></button>
        </div>

        <div className="state-snapshot-layout">
          <section className="state-snapshot-create">
            <div className="state-snapshot-create-head">
              <h3>今の状態を保存</h3>
              <button type="button" onClick={applySuggestion} disabled={isBusy}>
                <Wand2 size={14} />
                自動提案
              </button>
            </div>
            <label>
              名前
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例: HERO調整前 / 緑トーン案A"
                disabled={isBusy}
              />
            </label>
            <label>
              ラベル
              <input
                value={labels}
                onChange={(event) => setLabels(event.target.value)}
                placeholder="例: 案A, 公開前, CTA変更"
                disabled={isBusy}
              />
            </label>
            <label>
              メモ
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="復元時に判断しやすいメモ"
                disabled={isBusy}
              />
            </label>
            {dirtyCount > 0 && (
              <p className="snapshot-warning">{dirtyCount} 件の未保存ドラフトも、この全体状態に含めて保存します。本体ファイルはまだ上書きしません。</p>
            )}
            <button className="primary snapshot-create-button" onClick={create} disabled={!canCreate}>
              {busy === "state-snapshot-save" ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />}
              この状態を保存
            </button>
          </section>

          <section className="state-snapshot-list-wrap">
            <div className="state-snapshot-list-head">
              <h3>保存済み</h3>
              <button onClick={onReload} disabled={isBusy || loading} title="一覧を更新">
                {loading ? <LoaderCircle className="spin" size={14} /> : <RefreshCcw size={14} />}
                更新
              </button>
            </div>

            {loading ? (
              <div className="history-loading compact">
                <LoaderCircle className="spin" size={20} />
                <span>全体状態を読み込み中</span>
              </div>
            ) : snapshots.length ? (
              <div className="state-snapshot-list">
                {snapshots.map((snapshot) => (
                  <article key={snapshot.id} className="state-snapshot-item">
                    <div>
                      <strong>{snapshot.title}</strong>
                      <span>{new Date(snapshot.createdAt).toLocaleString("ja-JP")}</span>
                    </div>
                    {snapshot.labels?.length > 0 && (
                      <div className="state-snapshot-tags">
                        {snapshot.labels.map((label) => <span key={label}>{label}</span>)}
                      </div>
                    )}
                    {snapshot.note && <p>{snapshot.note}</p>}
                    <small>{snapshot.sectionCount || sectionCount} セクション / 画像 {snapshot.imageCount} 件</small>
                    <div className="state-snapshot-actions">
                      <button onClick={() => onRestore(snapshot)} disabled={isBusy}>
                        <Undo2 size={14} /> この状態へ戻す
                      </button>
                      <button className="danger-text" onClick={() => onDelete(snapshot)} disabled={isBusy}>
                        <Trash2 size={14} /> 削除
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <h2>保存済みの全体状態がありません</h2>
                <p>名前とラベルを付けて保存すると、後で全セクションを一括復元できます。</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function RefImageManagerModal({ refImages, busy, onClose, onAdd, onGenerate, onDelete, onOpenLinkAreaEditor }) {
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [pendingName, setPendingName] = useState("");
  const [pendingDataUrl, setPendingDataUrl] = useState(null);
  const [pendingPreview, setPendingPreview] = useState(null);
  const [generateScope, setGenerateScope] = useState("global");
  const [generateKind, setGenerateKind] = useState("background");
  const [generateName, setGenerateName] = useState("");
  const [styleInstruction, setStyleInstruction] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");

  const kindOptions = [
    { value: "background", label: "背景素材", hint: "余白・色・奥行き" },
    { value: "person", label: "人物素材", hint: "表情・服装・信頼感" },
    { value: "button", label: "ボタン素材", hint: "CTA・リンク領域" },
    { value: "object", label: "小物/UI素材", hint: "部品・装飾・アイコン" },
    { value: "texture", label: "質感素材", hint: "パターン・空気感" }
  ];
  const scopeLabels = { global: "グローバル", style: "画風別" };
  const kindLabels = Object.fromEntries(kindOptions.map((option) => [option.value, option.label]));

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingDataUrl(reader.result);
      setPendingPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!pendingName.trim() || !pendingDataUrl) return;
    await onAdd(pendingName.trim(), pendingDataUrl);
    setPendingName("");
    setPendingDataUrl(null);
    setPendingPreview(null);
  };

  const handleGenerate = async () => {
    if (!generateName.trim() || !generatePrompt.trim()) return;
    onGenerate({
      name: generateName.trim(),
      scope: generateScope,
      assetKind: generateKind,
      prompt: generatePrompt.trim(),
      styleInstruction: styleInstruction.trim()
    });
  };

  const isBusy = busy === "ref-images-save" || busy === "ref-images-generate" || busy === "ref-images-delete";
  const isGenerating = busy === "ref-images-generate";
  const canGenerate = generateName.trim() && generatePrompt.trim() && (generateScope !== "style" || styleInstruction.trim());

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="ref-image-modal">
        <div className="modal-head">
          <div>
            <h2>参照画像管理</h2>
            <p className="modal-subtitle">プロンプト生成・画像生成で参照できる画像を登録します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isBusy} title="閉じる"><XCircle size={20} /></button>
        </div>

        <div className="ref-image-modal-body">
          <div className="ref-image-tabs">
            <button className={activeTab === "upload" ? "active" : ""} onClick={() => setActiveTab("upload")} disabled={isBusy}>
              <Upload size={15} />
              画像を登録
            </button>
            <button className={activeTab === "generate" ? "active" : ""} onClick={() => setActiveTab("generate")} disabled={isBusy}>
              <Sparkles size={15} />
              参照素材を生成
            </button>
          </div>

          {activeTab === "upload" ? (
            <div className="ref-image-add-section">
              <h3>新しい参照画像を追加</h3>
              <div className="ref-image-add-form">
                <div
                  className={`ref-image-drop-zone ${pendingPreview ? "has-preview" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files?.[0]); }}
                  onClick={() => inputRef.current?.click()}
                >
                  {pendingPreview ? (
                    <img src={pendingPreview} alt="プレビュー" />
                  ) : (
                    <div className="ref-image-drop-placeholder">
                      <Plus size={24} />
                      <span>クリックまたはドロップで画像を選択</span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    hidden
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                  />
                </div>
                <div className="ref-image-name-row">
                  <input
                    type="text"
                    placeholder="画像の名前（例: キャラクター1, ブランドロゴ）"
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    disabled={isBusy}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleAdd}
                    disabled={isBusy || !pendingName.trim() || !pendingDataUrl}
                  >
                    {busy === "ref-images-save" ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}
                    登録
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ref-image-generate-section">
              <h3>参照素材を生成して保存</h3>
              <div className="ref-generate-layout">
                <div className="ref-generate-controls">
                  <div className="ref-field-group">
                    <span>保存範囲</span>
                    <div className="ref-scope-control">
                      <button className={generateScope === "global" ? "active" : ""} onClick={() => setGenerateScope("global")} disabled={isBusy}>
                        グローバル素材
                      </button>
                      <button className={generateScope === "style" ? "active" : ""} onClick={() => setGenerateScope("style")} disabled={isBusy}>
                        画風別素材
                      </button>
                    </div>
                  </div>

                  <div className="ref-field-group">
                    <span>素材タイプ</span>
                    <div className="ref-kind-grid">
                      {kindOptions.map((option) => (
                        <button
                          key={option.value}
                          className={generateKind === option.value ? "active" : ""}
                          onClick={() => setGenerateKind(option.value)}
                          disabled={isBusy}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.hint}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ref-generate-form">
                  <label className="ref-field-group">
                    <span>保存名</span>
                    <input
                      value={generateName}
                      onChange={(e) => setGenerateName(e.target.value)}
                      placeholder="例: global_mint_background / freshgreen_teacher"
                      disabled={isBusy}
                    />
                  </label>

                  {generateScope === "style" && (
                    <label className="ref-field-group">
                      <span>画風ルール</span>
                      <textarea
                        value={styleInstruction}
                        onChange={(e) => setStyleInstruction(e.target.value)}
                        placeholder="例: フレッシュグリーン、白背景、実写広告風、清潔感、スマホLP向け"
                        disabled={isBusy}
                        rows={4}
                      />
                    </label>
                  )}

                  <label className="ref-field-group">
                    <span>生成プロンプト</span>
                    <textarea
                      value={generatePrompt}
                      onChange={(e) => setGeneratePrompt(e.target.value)}
                      placeholder="例: 白いジャケットの30代日本人女性講師。自然光、信頼感、広告写真風、背景は薄いミント。"
                      disabled={isBusy}
                      rows={7}
                    />
                  </label>

                  <div className="ref-generate-footer">
                    <div className="regen-info">
                      <Sparkles size={14} />
                      <span>生成した画像は自動で参照画像リストに保存されます。</span>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={handleGenerate}
                      disabled={isBusy || !canGenerate}
                    >
                      {isGenerating ? <LoaderCircle className="spin" size={16} /> : <Wand2 size={16} />}
                      {isGenerating ? "生成中…" : "素材を生成して保存"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="ref-generate-running" role="status" aria-live="polite">
              <LoaderCircle className="spin" size={18} />
              <div>
                <strong>参照素材を生成中</strong>
                <span>Codex app-server / GPT Image 2 が画像を作成しています。</span>
              </div>
            </div>
          )}

          <div className="ref-image-list-section">
            <h3>登録済み参照画像 ({refImages.length}件)</h3>
            {refImages.length === 0 ? (
              <div className="ref-image-empty-state">参照画像がまだ登録されていません</div>
            ) : (
              <div className="ref-image-grid">
                {refImages.map((img) => (
                  <div key={img.name} className="ref-image-card">
                    <img src={`${img.url}?v=${Date.now()}`} alt={img.name} />
                    <div className="ref-image-card-footer">
                      <div className="ref-image-card-text">
                        <span className="ref-image-name">{img.name}</span>
                        <small className="ref-image-meta">
                          {img.source === "generated" ? "生成" : "登録"}・{scopeLabels[img.scope] ?? "グローバル"}{img.assetKind ? `・${kindLabels[img.assetKind] ?? img.assetKind}` : ""}
                        </small>
                      </div>
                      <button
                        className="ref-image-action"
                        onClick={() => onOpenLinkAreaEditor(img)}
                        disabled={isBusy}
                        title="この参照画像のリンクエリアを設定"
                      >
                        <Link size={14} />
                      </button>
                      <button
                        className="ref-image-action danger"
                        onClick={() => onDelete(img.name)}
                        disabled={isBusy}
                        title="削除"
                      >
                        {busy === "ref-images-delete" ? <LoaderCircle className="spin" size={14} /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={isBusy}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
function defaultImageNameForSection(id) {
  return `IMG_section_${String(id || "new").replace(/^SEC-/i, "").replace(/[^0-9a-z]+/gi, "_").toLowerCase()}`;
}

function AddSectionModal({ initial, sections, busy, onClose, onAdd }) {
  const [id, setId] = useState(initial.id || "SEC-01");
  const [title, setTitle] = useState("");
  const [imageName, setImageName] = useState(defaultImageNameForSection(initial.id || "SEC-01"));
  const [copy, setCopy] = useState("");
  const [prompt, setPrompt] = useState("");
  const isAdding = busy === "add-section";
  const afterLabel = initial.afterId ? `${initial.afterId} の下` : "末尾";
  const existingIds = new Set(sections.map((section) => section.id));
  const canAdd = id.trim() && title.trim() && imageName.trim() && !existingIds.has(id.trim());

  useEffect(() => {
    setImageName((current) => current || defaultImageNameForSection(id));
  }, [id]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="structure-modal">
        <div className="modal-head">
          <div>
            <h2>新規セクション</h2>
            <p className="modal-subtitle">追加位置: {afterLabel}</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isAdding} title="閉じる"><XCircle size={20} /></button>
        </div>
        <div className="structure-body">
          <div className="form-grid">
            <label>
              <span>SEC ID</span>
              <input value={id} onChange={(event) => setId(event.target.value)} disabled={isAdding} />
            </label>
            <label>
              <span>セクション名</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={isAdding} />
            </label>
            <label>
              <span>画像レイヤー名</span>
              <input value={imageName} onChange={(event) => setImageName(event.target.value)} disabled={isAdding} />
            </label>
          </div>
          <label className="wide-field">
            <span>初期LP原稿</span>
            <textarea value={copy} onChange={(event) => setCopy(event.target.value)} disabled={isAdding} rows={7} />
          </label>
          <label className="wide-field">
            <span>初期画像プロンプト</span>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} disabled={isAdding} rows={7} />
          </label>
          {existingIds.has(id.trim()) && (
            <div className="regen-info">
              <AlertTriangle size={14} />
              <span>このSEC IDはすでに使われています。</span>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} disabled={isAdding}>キャンセル</button>
          <button
            className="primary"
            disabled={!canAdd || isAdding}
            onClick={() => onAdd({ afterId: initial.afterId, id: id.trim(), title: title.trim(), imageName: imageName.trim(), copy, prompt })}
          >
            {isAdding ? <><LoaderCircle className="spin" size={15} /> 追加中…</> : <><Plus size={15} /> 追加</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function nextStructureId(rows) {
  const max = rows.reduce((value, row) => {
    const number = Number(row.id.match(/^SEC-(\d{2})/)?.[1] ?? 0);
    return Number.isFinite(number) ? Math.max(value, number) : value;
  }, 0);
  return `SEC-${String(max + 1).padStart(2, "0")}`;
}

function StructureEditorModal({ sections, busy, onClose, onApply }) {
  const [rows, setRows] = useState(() => sections.map((section) => ({
    originalId: section.id,
    id: section.id,
    title: section.title,
    imageName: section.imageName?.replace(/\.(png|jpe?g|webp)$/i, "") || ""
  })));
  const isApplying = busy === "apply-structure";
  const ids = rows.map((row) => row.id.trim()).filter(Boolean);
  const hasDuplicate = new Set(ids).size !== ids.length;
  const canApply = rows.length > 0 && !hasDuplicate && rows.every((row) => row.id.trim() && row.title.trim() && row.imageName.trim());

  const updateRow = (index, field, value) => {
    setRows((current) => current.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };
  const moveRow = (index, direction) => {
    setRows((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const addRowAfter = (index = rows.length - 1) => {
    const id = nextStructureId(rows);
    const row = { originalId: id, id, title: "", imageName: defaultImageNameForSection(id) };
    setRows((current) => {
      const next = [...current];
      next.splice(index + 1, 0, row);
      return next;
    });
  };
  const removeRow = (index) => setRows((current) => current.filter((_, i) => i !== index));

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="structure-modal wide">
        <div className="modal-head">
          <div>
            <h2>セクション構成</h2>
            <p className="modal-subtitle">SEC ID、表示名、画像レイヤー名、並び順を編集します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isApplying} title="閉じる"><XCircle size={20} /></button>
        </div>
        <div className="structure-body">
          <div className="structure-table">
            {rows.map((row, index) => (
              <div className="structure-row" key={`${row.originalId}-${index}`}>
                <input value={row.id} onChange={(event) => updateRow(index, "id", event.target.value)} disabled={isApplying} aria-label="SEC ID" />
                <input value={row.title} onChange={(event) => updateRow(index, "title", event.target.value)} disabled={isApplying} aria-label="セクション名" />
                <input value={row.imageName} onChange={(event) => updateRow(index, "imageName", event.target.value)} disabled={isApplying} aria-label="画像レイヤー名" />
                <div className="structure-row-actions">
                  <IconButton icon={ArrowUp} label="上へ" onClick={() => moveRow(index, -1)} disabled={isApplying || index === 0} />
                  <IconButton icon={ArrowDown} label="下へ" onClick={() => moveRow(index, 1)} disabled={isApplying || index === rows.length - 1} />
                  <IconButton icon={Plus} label="下に追加" onClick={() => addRowAfter(index)} disabled={isApplying} />
                  <IconButton icon={Trash2} label="削除" kind="danger" onClick={() => removeRow(index)} disabled={isApplying || rows.length <= 1} />
                </div>
              </div>
            ))}
          </div>
          <button className="structure-add-button" onClick={() => addRowAfter()} disabled={isApplying}>
            <Plus size={15} />
            行を追加
          </button>
          {hasDuplicate && (
            <div className="regen-info">
              <AlertTriangle size={14} />
              <span>SEC IDが重複しています。</span>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} disabled={isApplying}>キャンセル</button>
          <button
            className="primary"
            disabled={!canApply || isApplying}
            onClick={() => onApply(rows.map((row) => ({
              originalId: row.originalId,
              id: row.id.trim(),
              title: row.title.trim(),
              imageName: row.imageName.trim()
            })))}
          >
            {isApplying ? <><LoaderCircle className="spin" size={15} /> 保存中…</> : <><LayoutList size={15} /> 構成を保存</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkCopyRegenerateModal({ targets, busy, selectedCount, onClose, onRegenerate }) {
  const [rules, setRules] = useState("");
  const [includeExistingCopy, setIncludeExistingCopy] = useState(true);
  const isRegenerating = busy === "bulk-regen-copy";
  const targetLabel = selectedCount > 0 ? `選択中 ${targets.length} セクション` : `表示中 ${targets.length} セクション`;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="bulk-regen-modal">
        <div className="modal-head">
          <div>
            <h2>LP原稿を一括再生成</h2>
            <p className="modal-subtitle">{targetLabel} に同じ方針を適用して、原稿を作り直します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isRegenerating} title="閉じる"><XCircle size={20} /></button>
        </div>
        <div className="bulk-regen-body">
          <div className="bulk-target-strip">
            {targets.map((section) => <span key={section.id}>{section.id}</span>)}
          </div>
          <div className="regen-instruction-section">
            <label className="regen-label">
              <FileText size={15} />
              原稿変更の方針
            </label>
            <textarea
              className="regen-instruction bulk-rules-textarea"
              value={rules}
              onChange={(event) => setRules(event.target.value)}
              disabled={isRegenerating}
              placeholder="例: 初心者向けの不安解消を強める。CTAは60分無料講座に統一。過度な収益保証は入れない。"
              rows={8}
            />
          </div>
          <label className="bulk-option">
            <input
              type="checkbox"
              checked={includeExistingCopy}
              onChange={(event) => setIncludeExistingCopy(event.target.checked)}
              disabled={isRegenerating}
            />
            <span>現在の原稿も参考にして改善する</span>
          </label>
          <div className="regen-info">
            <AlertTriangle size={14} />
            <span>生成結果はまずドラフトに入ります。保存するまで原稿ファイルは上書きされません。</span>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} disabled={isRegenerating}>キャンセル</button>
          <button
            className="primary"
            disabled={isRegenerating || targets.length === 0}
            onClick={() => onRegenerate({ globalInstruction: rules, includeExistingCopy })}
          >
            {isRegenerating ? <><LoaderCircle className="spin" size={15} /> 一括生成中…</> : <><FileText size={15} /> {targets.length} セクションを再生成</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyRegenerateModal({ section, busy, onClose, onRegenerate }) {
  const [instruction, setInstruction] = useState("");
  const isRegenerating = busy === `regen-copy-${section.id}`;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="regen-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">{section.id}</span>
            <h2>LP原稿を再生成</h2>
            <p className="modal-subtitle">現在の原稿・プロンプトをもとに、このセクションの原稿を作り直します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isRegenerating} title="閉じる"><XCircle size={20} /></button>
        </div>
        <div className="regen-modal-body">
          <div className="regen-instruction-section">
            <label className="regen-label">
              <FileText size={15} />
              具体的な指示（省略可）
            </label>
            <textarea
              className="regen-instruction"
              placeholder="例: 冒頭の共感を強める。初心者にもわかる言葉にする。CTAは変えない。"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              disabled={isRegenerating}
              rows={5}
            />
          </div>
          <div className="regen-info">
            <AlertTriangle size={14} />
            <span>再生成した原稿はドラフトに反映されます。保存するまでファイルには書き込まれません。</span>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} disabled={isRegenerating}>キャンセル</button>
          <button className="primary" disabled={isRegenerating} onClick={() => onRegenerate(instruction)}>
            {isRegenerating ? <><LoaderCircle className="spin" size={15} /> 生成中…</> : <><FileText size={15} /> LP原稿を再生成</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkPromptRegenerateModal({ targets, globalRules, refImages, busy, selectedCount, onClose, onRegenerate }) {
  const [rules, setRules] = useState(globalRules || "");
  const [selectedRefs, setSelectedRefs] = useState([]);
  const [includeExistingPrompts, setIncludeExistingPrompts] = useState(true);
  const isRegenerating = busy === "bulk-regen-prompts";
  const targetLabel = selectedCount > 0 ? `選択中 ${targets.length} セクション` : `表示中 ${targets.length} セクション`;

  const toggleRef = (name) => {
    setSelectedRefs((prev) => prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="bulk-regen-modal">
        <div className="modal-head">
          <div>
            <h2>全体方針でプロンプト再生成</h2>
            <p className="modal-subtitle">{targetLabel} に同じルールを適用して、画像プロンプトを一括で作り直します</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isRegenerating} title="閉じる"><XCircle size={20} /></button>
        </div>

        <div className="bulk-regen-body">
          <div className="bulk-target-strip">
            {targets.map((section) => (
              <span key={section.id}>{section.id}</span>
            ))}
          </div>

          <div className="regen-instruction-section">
            <label className="regen-label">
              <Wand2 size={15} />
              グローバルルール / 全体方針
            </label>
            <textarea
              className="regen-instruction bulk-rules-textarea"
              value={rules}
              onChange={(event) => setRules(event.target.value)}
              disabled={isRegenerating}
              placeholder={[
                "例: 全体をリアル写真寄りに。AIっぽい質感を避ける。",
                "例: ミントグリーン基調、白余白多め、人物は自然光、テキストは大きく少なめ。",
                "例: すべて同じ講座LPとして統一感を出し、セクションごとに構図だけ変える。"
              ].join("\n")}
              rows={8}
            />
          </div>

          <label className="bulk-option">
            <input
              type="checkbox"
              checked={includeExistingPrompts}
              onChange={(event) => setIncludeExistingPrompts(event.target.checked)}
              disabled={isRegenerating}
            />
            <span>現在のプロンプトも参考にして改善する</span>
          </label>

          {refImages.length > 0 && (
            <div className="regen-ref-section">
              <label className="regen-label">
                <Images size={15} />
                全体で使う参照画像
              </label>
              <div className="regen-ref-grid">
                {refImages.map((img) => (
                  <label key={img.name} className={`regen-ref-item ${selectedRefs.includes(img.name) ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selectedRefs.includes(img.name)}
                      onChange={() => toggleRef(img.name)}
                      disabled={isRegenerating}
                    />
                    <img src={img.url} alt={img.name} />
                    <span>{img.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="regen-info">
            <AlertTriangle size={14} />
            <span>生成結果はまずドラフトに入ります。保存するまでプロンプトファイルは上書きされません。</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={isRegenerating}>キャンセル</button>
          <button
            className="primary"
            disabled={isRegenerating || targets.length === 0}
            onClick={() => onRegenerate({
              globalInstruction: rules,
              refImageNames: selectedRefs,
              includeExistingPrompts
            })}
          >
            {isRegenerating ? (
              <><LoaderCircle className="spin" size={15} /> 一括生成中…</>
            ) : (
              <><Wand2 size={15} /> {targets.length} セクションを再生成</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptRegenerateModal({ section, refImages, busy, onClose, onRegenerate }) {
  const [instruction, setInstruction] = useState("");
  const [selectedRefs, setSelectedRefs] = useState([]);
  const isRegenerating = busy === `regen-prompt-${section.id}`;

  const toggleRef = (name) => {
    setSelectedRefs((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="regen-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">{section.id}</span>
            <h2>プロンプトを再生成</h2>
            <p className="modal-subtitle">LP原稿・参照画像をもとに Codex app-server でプロンプトを作り直します</p>
          </div>
          <button className="modal-close" onClick={onClose} title="閉じる"><XCircle size={20} /></button>
        </div>

        <div className="regen-modal-body">
          <div className="regen-instruction-section">
            <label className="regen-label">
              <Wand2 size={15} />
              具体的な指示（省略可）
            </label>
            <textarea
              className="regen-instruction"
              placeholder="例: 明るく爽やかな雰囲気で、30代女性をターゲットにしたイメージで&#10;例: この人物（参照画像: キャラクター1）を主役にして&#10;空白のままにすると LP 原稿の内容から自動で生成します"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isRegenerating}
              rows={4}
            />
          </div>

          {refImages.length > 0 && (
            <div className="regen-ref-section">
              <label className="regen-label">
                <Images size={15} />
                参照画像（省略可）
              </label>
              <div className="regen-ref-grid">
                {refImages.map((img) => (
                  <label key={img.name} className={`regen-ref-item ${selectedRefs.includes(img.name) ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selectedRefs.includes(img.name)}
                      onChange={() => toggleRef(img.name)}
                      disabled={isRegenerating}
                    />
                    <img src={img.url} alt={img.name} />
                    <span>{img.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="regen-info">
            <AlertTriangle size={14} />
            <span>再生成したプロンプトはドラフトに反映されます。保存するまでファイルには書き込まれません。</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={isRegenerating}>キャンセル</button>
          <button
            className="primary"
            disabled={isRegenerating}
            onClick={() => onRegenerate(instruction, selectedRefs)}
          >
            {isRegenerating ? (
              <><LoaderCircle className="spin" size={15} /> 生成中…</>
            ) : (
              <><Wand2 size={15} /> プロンプトを再生成</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompositionPickerModal({ section, compositions, selectedId, busy, onClose, onSelect, onClear, onDelete }) {
  const [activeId, setActiveId] = useState(selectedId || compositions[0]?.id || "");
  const active = compositions.find((item) => item.id === activeId) ?? compositions[0];

  useEffect(() => {
    setActiveId(selectedId || compositions[0]?.id || "");
  }, [selectedId, compositions]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="composition-modal">
        <div className="modal-head">
          <div>
            <span className="section-id">{section.id}</span>
            <h2>構図を選択</h2>
            <p className="modal-subtitle">この画風・このセクションで保存した白黒ワイヤーフレームだけを表示しています</p>
          </div>
          <button className="modal-close" onClick={onClose} disabled={busy} title="閉じる"><XCircle size={20} /></button>
        </div>

        {compositions.length === 0 ? (
          <div className="empty-state compact composition-empty">
            <h2>保存済み構図がありません</h2>
            <p>各セクションの画像パネルにある星ボタンで、現在画像の構図を白黒ワイヤーフレームとして保存できます。</p>
          </div>
        ) : (
          <div className="composition-layout">
            <aside className="composition-list">
              {compositions.map((item) => (
                <button
                  key={item.id}
                  className={item.id === active?.id ? "active" : ""}
                  onClick={() => setActiveId(item.id)}
                  disabled={busy}
                >
                  <img src={item.url} alt={item.title} />
                  <span>{item.title}</span>
                  <small>{new Date(item.createdAt).toLocaleString("ja-JP")}</small>
                </button>
              ))}
            </aside>

            <div className="composition-preview">
              {active && (
                <>
                  <div className="composition-preview-image">
                    <img src={active.url} alt={`${active.title} の構図`} />
                  </div>
                  <div className="composition-detail">
                    <strong>{active.title}</strong>
                    <span>{active.sourceImageName || "source image unknown"}</span>
                    <small>{active.id}</small>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} disabled={busy}>キャンセル</button>
          {selectedId && (
            <button onClick={onClear} disabled={busy}>選択解除</button>
          )}
          {active && (
            <button className="danger-text" onClick={() => onDelete(active.id)} disabled={busy}>
              <Trash2 size={14} /> 削除
            </button>
          )}
          <button className="primary" disabled={busy || !active} onClick={() => onSelect(active)}>
            <Star size={15} /> この構図を適用
          </button>
        </div>
      </div>
    </div>
  );
}

function RangeControl({ label, value, min = 0, max = 100, step = 1, unit = "", onChange }) {
  const displayValue = Number.isFinite(Number(value)) ? Number(value) : min;
  return (
    <label className="la-range-control">
      <span>
        <strong>{label}</strong>
        <em>{displayValue}{unit}</em>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function LinkAreaEditorModal({ targetId, imageUrl, title, urlPresets, onSavePresets, onClose }) {
  const containerRef = useRef(null);
  const [areas, setAreas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [dragAction, setDragAction] = useState(null);
  const [activeEditTarget, setActiveEditTarget] = useState("area");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [presetDraft, setPresetDraft] = useState({ label: "", url: "" });

  useEffect(() => {
    api(`/api/sections/${encodeURIComponent(targetId)}/link-areas`)
      .then((data) => setAreas(data.areas ?? []))
	      .catch(() => {})
	      .finally(() => setLoading(false));
	  }, [targetId]);

  useEffect(() => {
    setActiveEditTarget("area");
  }, [selectedId]);

  const getRelCoords = (e) => {
    const imgEl = containerRef.current?.querySelector("img");
    const rect = (imgEl ?? containerRef.current).getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    };
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y } = getRelCoords(e);
    setDrawing({ startX: x, startY: y });
    setCurrentRect({ x, y, width: 0, height: 0 });
    setSelectedId(null);
  };

  const onMouseMove = (e) => {
    if (dragAction) {
      const { x, y } = getRelCoords(e);
      const dx = x - dragAction.startX;
      const dy = y - dragAction.startY;
      const base = dragAction.rect;
      const nextRect = dragAction.action === "resize"
        ? roundedRect({
            ...base,
            width: clampNumber(base.width + dx, 1, 100 - base.x),
            height: clampNumber(base.height + dy, 1, 100 - base.y)
          })
        : roundedRect({
            ...base,
            x: clampNumber(base.x + dx, 0, 100 - base.width),
            y: clampNumber(base.y + dy, 0, 100 - base.height)
          });
      updateAreaRect(dragAction.id, nextRect, dragAction.kind);
      return;
    }
    if (!drawing) return;
    const { x, y } = getRelCoords(e);
    setCurrentRect({
      x: Math.min(drawing.startX, x),
      y: Math.min(drawing.startY, y),
      width: Math.abs(x - drawing.startX),
      height: Math.abs(y - drawing.startY)
    });
  };

  const onMouseUp = () => {
    if (dragAction) {
      setDragAction(null);
      return;
    }
    if (!drawing || !currentRect || currentRect.width < 1 || currentRect.height < 1) {
      setDrawing(null);
      setCurrentRect(null);
      return;
    }
    const newArea = {
      id: `area-${Date.now()}`,
      x: +currentRect.x.toFixed(1),
      y: +currentRect.y.toFixed(1),
      width: +currentRect.width.toFixed(1),
      height: +currentRect.height.toFixed(1),
      radius: DEFAULT_LINK_RADIUS,
      url: "",
      label: "",
      cta: false,
      ctaCopy: "",
      shine: false
    };
    setAreas((prev) => [...prev, newArea]);
    setSelectedId(newArea.id);
	    setDrawing(null);
	    setCurrentRect(null);
	  };

  const updateArea = (id, patch) => {
    if (patch.shine === false) setActiveEditTarget("area");
    setAreas((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const next = { ...a, ...patch };
      if (patch.shine === false) {
        delete next.shineRect;
        delete next.shineRadius;
        delete next.shineAngle;
        delete next.shineWidth;
        delete next.shineDuration;
        delete next.shineOpacity;
      }
      return next;
    }));
  };

  const updateAreaRect = (id, rect, kind = "area") => {
    const nextRect = roundedRect(rect);
    if (kind === "shine") {
      updateArea(id, { shine: true, shineRect: nextRect });
      return;
    }
    updateArea(id, nextRect);
  };

  const startRectDrag = (e, area, kind, action) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const point = getRelCoords(e);
    setSelectedId(area.id);
    setActiveEditTarget(kind);
    const rect = kind === "shine" ? shineAreaRect(area) : baseAreaRect(area);
    if (kind === "shine" && area.shine && !area.shineRect) {
      updateArea(area.id, { shineRect: rect });
    }
    setDragAction({
      id: area.id,
      kind,
      action,
      startX: point.x,
      startY: point.y,
      rect
    });
  };

  const deleteArea = (id) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setSelectedId(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api(`/api/sections/${encodeURIComponent(targetId)}/link-areas`, {
        method: "POST",
        body: JSON.stringify({ areas })
      });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async () => {
    if (!presetDraft.label.trim() || !presetDraft.url.trim()) return;
    const next = [...urlPresets, { id: `preset-${Date.now()}`, label: presetDraft.label.trim(), url: presetDraft.url.trim() }];
    await onSavePresets(next).catch(() => {});
    setPresetDraft({ label: "", url: "" });
  };

  const deletePreset = async (id) => {
    await onSavePresets(urlPresets.filter((p) => p.id !== id)).catch(() => {});
  };

  const applyPreset = (url) => {
    if (!selectedId) return;
    updateArea(selectedId, { url });
  };

  const selectedArea = areas.find((a) => a.id === selectedId);
  const selectedShineRect = selectedArea?.shine ? shineAreaRect(selectedArea) : null;
  const selectedAreaRect = selectedArea ? baseAreaRect(selectedArea) : null;
  const selectedAreaRadius = selectedArea ? linkAreaRadius(selectedArea) : DEFAULT_LINK_RADIUS;
  const selectedShineSettings = selectedArea?.shine ? shineAreaSettings(selectedArea) : null;
  const updateSelectedRect = (patch, kind = "area") => {
    if (!selectedId || !selectedArea) return;
    const current = kind === "shine" ? selectedShineRect : selectedAreaRect;
    if (!current) return;
    updateAreaRect(selectedId, { ...current, ...patch }, kind);
  };

  return (
    <div className="la-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="la-modal">
        <div className="la-header">
          <h2><Link size={16} /> {title}</h2>
          <button className="la-close" onClick={onClose}><XCircle size={18} /></button>
        </div>

        <div className="la-body">
          <div
            className="la-canvas"
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {imageUrl
              ? <img src={imageUrl} alt="section" draggable={false} />
              : <div className="la-no-image">画像がありません</div>
            }
            {areas.map((area, i) => {
              const areaRect = baseAreaRect(area);
              const shineRect = area.shine ? shineAreaRect(area) : null;
              const areaRadius = linkAreaRadius(area);
              const shineSettings = area.shine ? shineAreaSettings(area) : null;
              const selected = selectedId === area.id;
              return (
                <React.Fragment key={area.id}>
                  <div
                    className={`la-area-rect${area.cta ? " la-area-rect--cta" : ""}${selected ? " la-selected" : ""}${activeEditTarget === "area" && selected ? " la-active-edit" : ""}`}
                    style={rectStyle(areaRect, areaRadius)}
                    onMouseDown={(e) => startRectDrag(e, area, "area", "move")}
                  >
                    {area.cta ? (
                      <span className="la-cta-preview">{area.ctaCopy || area.label || "60分の無料講座に申し込む"}</span>
                    ) : (
                      <>
                        <span className="la-area-index">{i + 1}</span>
                        {area.label && <span className="la-area-chip">{area.label}</span>}
                      </>
                    )}
                    {selected && activeEditTarget === "area" && (
                      <span
                        className="la-resize-handle"
                        onMouseDown={(e) => startRectDrag(e, area, "area", "resize")}
                      />
                    )}
                  </div>
                  {shineRect && (
                    <div
                      className={`la-shine-rect${selected ? " la-selected" : ""}${activeEditTarget === "shine" && selected ? " la-active-edit" : ""}`}
                      style={rectStyle(shineRect, shineSettings.radius, {
                        "--la-shine-angle": `${shineSettings.angle}deg`,
                        "--la-shine-width": `${shineSettings.width}%`,
                        "--la-shine-duration": `${shineSettings.duration}s`,
                        "--la-shine-opacity": shineSettings.opacity / 100
                      })}
                      onMouseDown={(e) => startRectDrag(e, area, "shine", "move")}
                    >
                      <span className="la-shine-label">キラーん</span>
                      <span className="la-shine-preview" />
                      {selected && activeEditTarget === "shine" && (
                        <span
                          className="la-resize-handle la-resize-handle--shine"
                          onMouseDown={(e) => startRectDrag(e, area, "shine", "resize")}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            {currentRect && currentRect.width > 0 && (
              <div
                className="la-area-rect la-drawing"
                style={rectStyle(currentRect, DEFAULT_LINK_RADIUS)}
              />
            )}
          </div>

          <div className="la-sidebar">
            <p className="la-hint">ドラッグで追加。選択中の枠は移動・右下でサイズ調整できます。</p>

            {loading && <p className="la-loading">読み込み中…</p>}

            <div className="la-area-list">
              {areas.length === 0 && !loading && <p className="la-empty">エリアなし</p>}
              {areas.map((area, i) => (
                <div
                  key={area.id}
                  className={`la-area-row${selectedId === area.id ? " la-selected" : ""}`}
                  onClick={() => setSelectedId(area.id)}
                >
                  <span className="la-area-num">{i + 1}</span>
                  <span className="la-area-label-text">{area.cta ? `CTA: ${area.ctaCopy || area.label || "コピー未設定"}` : (area.label || <em>ラベルなし</em>)}</span>
                  <button className="la-delete-btn" title="削除" onClick={(e) => { e.stopPropagation(); deleteArea(area.id); }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {selectedArea && (
              <div className="la-detail">
                <label className="la-field-label">ラベル（任意）
                  <input
                    value={selectedArea.label}
                    onChange={(e) => updateArea(selectedId, { label: e.target.value })}
                    placeholder="例: 申し込みボタン"
                  />
                </label>
                <label className="la-field-label">リンク URL
                  <input
                    value={selectedArea.url}
                    onChange={(e) => updateArea(selectedId, { url: e.target.value })}
                    placeholder="https://..."
                  />
                </label>
                <label className="la-toggle">
                  <input
                    type="checkbox"
                    checked={selectedArea.cta === true}
                    onChange={(e) => updateArea(selectedId, {
                      cta: e.target.checked,
                      ctaCopy: e.target.checked
                        ? (selectedArea.ctaCopy || selectedArea.label || "60分の無料講座に申し込む")
                        : selectedArea.ctaCopy
                    })}
                  />
                  <span>CTAボタンとして表示する</span>
                </label>
                {selectedArea.cta && (
                  <label className="la-field-label">CTAコピー
                    <input
                      value={selectedArea.ctaCopy || ""}
                      onChange={(e) => updateArea(selectedId, { ctaCopy: e.target.value })}
                      placeholder="例: 60分の無料講座に申し込む"
                    />
                  </label>
                )}
                {urlPresets.length > 0 && (
                  <div className="la-presets">
                    <span className="la-preset-label">プリセット:</span>
                    {urlPresets.map((p) => (
                      <button key={p.id} className="la-preset-chip" title={p.url} onClick={() => applyPreset(p.url)}>
                        <Star size={11} /> {p.label}
                      </button>
                    ))}
                  </div>
                )}
                {selectedAreaRect && (
                  <div className="la-control-group">
                    <div className="la-control-head">
                      <strong>リンク領域の微調整</strong>
                      <span>クリック範囲と角丸</span>
                    </div>
                    <RangeControl label="X" value={selectedAreaRect.x} min={0} max={100 - selectedAreaRect.width} step={0.1} unit="%" onChange={(x) => updateSelectedRect({ x })} />
                    <RangeControl label="Y" value={selectedAreaRect.y} min={0} max={100 - selectedAreaRect.height} step={0.1} unit="%" onChange={(y) => updateSelectedRect({ y })} />
                    <RangeControl label="幅" value={selectedAreaRect.width} min={1} max={100 - selectedAreaRect.x} step={0.1} unit="%" onChange={(width) => updateSelectedRect({ width })} />
                    <RangeControl label="高さ" value={selectedAreaRect.height} min={1} max={100 - selectedAreaRect.y} step={0.1} unit="%" onChange={(height) => updateSelectedRect({ height })} />
                    <RangeControl label="角丸" value={selectedAreaRadius} min={0} max={50} step={1} unit="%" onChange={(radius) => updateArea(selectedId, { radius })} />
                  </div>
                )}
                <label className="la-toggle">
                  <input
                    type="checkbox"
                    checked={selectedArea.shine === true}
                    onChange={(e) => updateArea(selectedId, { shine: e.target.checked })}
                  />
                  <span>キラーんアニメーションを付ける</span>
                </label>
                {selectedArea.shine && (
                  <div className="la-shine-controls">
                    <div className="la-edit-mode" aria-label="編集対象">
                      <button
                        className={activeEditTarget === "area" ? "active" : ""}
                        onClick={() => setActiveEditTarget("area")}
                      >
                        リンク領域
                      </button>
                      <button
                        className={activeEditTarget === "shine" ? "active" : ""}
                        onClick={() => {
                          if (!selectedArea.shineRect) updateArea(selectedId, { shineRect: shineAreaRect(selectedArea) });
                          setActiveEditTarget("shine");
                        }}
                      >
                        キラーん範囲
                      </button>
                    </div>
                    <button
                      className="la-secondary-action"
                      onClick={() => {
                        setAreas((prev) => prev.map((area) => {
                          if (area.id !== selectedId) return area;
                          const next = { ...area };
                          delete next.shineRect;
                          return next;
                        }));
                        setActiveEditTarget("area");
                      }}
                    >
                      リンク領域と同じに戻す
                    </button>
                    {selectedShineRect && selectedShineSettings && (
                      <div className="la-control-group la-control-group--shine">
                        <div className="la-control-head">
                          <strong>キラーんの微調整</strong>
                          <span>光る範囲と動き</span>
                        </div>
                        <RangeControl label="X" value={selectedShineRect.x} min={0} max={100 - selectedShineRect.width} step={0.1} unit="%" onChange={(x) => updateSelectedRect({ x }, "shine")} />
                        <RangeControl label="Y" value={selectedShineRect.y} min={0} max={100 - selectedShineRect.height} step={0.1} unit="%" onChange={(y) => updateSelectedRect({ y }, "shine")} />
                        <RangeControl label="幅" value={selectedShineRect.width} min={1} max={100 - selectedShineRect.x} step={0.1} unit="%" onChange={(width) => updateSelectedRect({ width }, "shine")} />
                        <RangeControl label="高さ" value={selectedShineRect.height} min={1} max={100 - selectedShineRect.y} step={0.1} unit="%" onChange={(height) => updateSelectedRect({ height }, "shine")} />
                        <RangeControl label="角丸" value={selectedShineSettings.radius} min={0} max={50} step={1} unit="%" onChange={(shineRadius) => updateArea(selectedId, { shineRadius })} />
                        <RangeControl label="光の幅" value={selectedShineSettings.width} min={8} max={50} step={1} unit="%" onChange={(shineWidth) => updateArea(selectedId, { shineWidth })} />
                        <RangeControl label="角度" value={selectedShineSettings.angle} min={70} max={130} step={1} unit="deg" onChange={(shineAngle) => updateArea(selectedId, { shineAngle })} />
                        <RangeControl label="速度" value={selectedShineSettings.duration} min={1.2} max={6} step={0.1} unit="s" onChange={(shineDuration) => updateArea(selectedId, { shineDuration })} />
                        <RangeControl label="濃さ" value={selectedShineSettings.opacity} min={10} max={100} step={5} unit="%" onChange={(shineOpacity) => updateArea(selectedId, { shineOpacity })} />
                      </div>
                    )}
                  </div>
                )}
                <p className="la-coords">
                  x:{selectedArea.x}% y:{selectedArea.y}% w:{selectedArea.width}% h:{selectedArea.height}%
                </p>
                {selectedShineRect && (
                  <p className="la-coords">
                    shine x:{selectedShineRect.x}% y:{selectedShineRect.y}% w:{selectedShineRect.width}% h:{selectedShineRect.height}%
                  </p>
                )}
              </div>
            )}

            <button
              className="la-preset-toggle"
              onClick={() => setShowPresetManager((v) => !v)}
            >
              <Star size={13} /> URLプリセットを{showPresetManager ? "閉じる" : "管理"}
            </button>

            {showPresetManager && (
              <div className="la-preset-manager">
                {urlPresets.map((p) => (
                  <div key={p.id} className="la-preset-item">
                    <span className="la-preset-name">{p.label}</span>
                    <span className="la-preset-url">{p.url}</span>
                    <button onClick={() => deletePreset(p.id)} title="削除"><Trash2 size={12} /></button>
                  </div>
                ))}
                <div className="la-preset-add">
                  <input
                    placeholder="ラベル"
                    value={presetDraft.label}
                    onChange={(e) => setPresetDraft((d) => ({ ...d, label: e.target.value }))}
                  />
                  <input
                    placeholder="URL (https://...)"
                    value={presetDraft.url}
                    onChange={(e) => setPresetDraft((d) => ({ ...d, url: e.target.value }))}
                  />
                  <button onClick={addPreset} disabled={!presetDraft.label.trim() || !presetDraft.url.trim()}>
                    <Plus size={13} /> 登録
                  </button>
                </div>
              </div>
            )}

            <div className="la-footer">
              <button className="la-btn-cancel" onClick={onClose}>キャンセル</button>
              <button className="la-btn-save" disabled={saving} onClick={save}>
                {saving ? <LoaderCircle size={14} className="spin" /> : <Save size={14} />}
                {saving ? "保存中…" : "保存"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
