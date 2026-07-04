/**
 * Codex app-server だけを使う画像生成クライアントです。
 * OpenAI APIキーや従量課金の画像生成APIは使いません。
 */
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import path from "node:path";

const IMAGE_MODEL = "gpt-image-2";
const DEFAULT_CODEX_BIN = "codex";
const DEFAULT_AGENT_MODEL = "gpt-5.5";
const DEFAULT_TIMEOUT_MS = 1000 * 60 * 12;

function getCodexBin() {
  return process.env.CODEX_APP_SERVER_BIN || process.env.LP_CODEX_APP_SERVER_BIN || DEFAULT_CODEX_BIN;
}

function getAgentModel() {
  return process.env.CODEX_APP_SERVER_AGENT_MODEL || process.env.LP_CODEX_APP_SERVER_AGENT_MODEL || DEFAULT_AGENT_MODEL;
}

function getTimeoutMs() {
  const value = Number(process.env.CODEX_APP_SERVER_TIMEOUT_MS || process.env.LP_CODEX_APP_SERVER_TIMEOUT_MS || 0);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

function stripDataUrl(value) {
  const match = String(value || "").match(/^data:image\/[a-z0-9.+-]+;base64,([\s\S]+)$/i);
  return match?.[1] ?? "";
}

function isImageBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return true;
  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a") return true;
  return false;
}

function imageMimeType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return "image/png";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a") return "image/gif";
  return "image/png";
}

function buildInputImageItem(ref, cwd) {
  if (ref?.path) {
    return {
      type: "localImage",
      path: path.isAbsolute(ref.path) ? ref.path : path.join(cwd, ref.path),
      detail: "high"
    };
  }

  if (ref?.buffer) {
    return {
      type: "image",
      url: `data:${imageMimeType(ref.buffer)};base64,${ref.buffer.toString("base64")}`,
      detail: "high"
    };
  }

  return null;
}

function base64ToBuffer(value) {
  const base64 = (stripDataUrl(value) || String(value || "").trim()).replace(/\s+/g, "");
  if (!base64) return null;
  if (!/^[A-Za-z0-9+/=_-]+$/.test(base64)) return null;
  try {
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const buffer = Buffer.from(normalized, "base64");
    return isImageBuffer(buffer) ? buffer : null;
  } catch {
    return null;
  }
}

function pushBase64Candidate(result, value, revisedPrompt = null) {
  if (typeof value !== "string" || !value.trim()) return;
  result.push({ type: "base64", value: value.trim(), revisedPrompt });
}

function pushFileCandidate(result, value, revisedPrompt = null) {
  if (typeof value !== "string" || !value.trim()) return;
  result.push({ type: "file", value: value.trim(), revisedPrompt });
}

function collectStringCandidate(value, result, revisedPrompt = null) {
  if (typeof value !== "string") return;
  const text = value.trim();
  if (!text) return;

  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      collectImageCandidates(JSON.parse(text), result);
      return;
    } catch {
      // Keep checking the string as a possible image payload below.
    }
  }

  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(text)) {
    pushBase64Candidate(result, text, revisedPrompt);
    return;
  }

  if (/^file:\/\//i.test(text) || /\.(png|jpe?g|webp|gif)$/i.test(text)) {
    pushFileCandidate(result, text, revisedPrompt);
    return;
  }

  if (/^[A-Za-z0-9+/=_-\s]+$/.test(text) && text.length > 256) {
    pushBase64Candidate(result, text, revisedPrompt);
  }
}

function collectImageCandidates(payload, result = []) {
  if (!payload || typeof payload !== "object") return result;

  if (["userMessage", "image", "localImage", "input_image", "inputImage"].includes(payload.type)) {
    return result;
  }

  if (payload.type === "image_generation_call") {
    collectStringCandidate(payload.result, result, payload.revised_prompt || null);
    return result;
  }

  if (payload.type === "imageGeneration") {
    collectStringCandidate(payload.result, result, payload.revisedPrompt || null);
    pushFileCandidate(result, payload.savedPath, payload.revisedPrompt || null);
    return result;
  }

  const directKeys = ["dataUrl", "data_url", "b64_json", "base64", "imageBase64", "image_base64", "imageData", "image_data"];
  for (const key of directKeys) {
    collectStringCandidate(payload[key], result, payload.revisedPrompt || null);
  }

  const fileKeys = ["filePath", "file_path", "outputPath", "output_path", "savedPath", "saved_path"];
  for (const key of fileKeys) {
    pushFileCandidate(result, payload[key], payload.revisedPrompt || null);
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) {
      for (const item of value) collectImageCandidates(item, result);
    } else if (value && typeof value === "object") {
      collectImageCandidates(value, result);
    }
  }

  return result;
}

function collectNotificationImageCandidates(message) {
  if (message.method === "rawResponseItem/completed") {
    return collectImageCandidates(message.params?.item);
  }

  if (message.method === "item/completed") {
    const item = message.params?.item;
    const result = collectImageCandidates(item);
    if (item?.imageGeneration) collectImageCandidates(item.imageGeneration, result);
    return result;
  }

  return [];
}

function isTransientAppServerErrorMessage(message) {
  return /^Reconnecting\.\.\.\s+\d+\/\d+/.test(String(message || "").trim());
}

function collectTextContent(payload, result = []) {
  if (typeof payload === "string") {
    result.push(payload);
    return result;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) collectTextContent(item, result);
    return result;
  }

  if (!payload || typeof payload !== "object") return result;

  if (typeof payload.text === "string") {
    result.push(payload.text);
  } else if (typeof payload.output_text === "string") {
    result.push(payload.output_text);
  } else if (typeof payload.content === "string") {
    result.push(payload.content);
  } else if (typeof payload.delta === "string") {
    result.push(payload.delta);
  }

  for (const key of ["content", "parts", "output", "message", "messages", "result"]) {
    if (payload[key] !== undefined) collectTextContent(payload[key], result);
  }

  return result;
}

function extractAssistantText(item) {
  if (!item || typeof item !== "object") return "";

  if (item.type === "agentMessage") {
    if (typeof item.text === "string") return item.text;
    return collectTextContent(item.content).join("");
  }

  if (item.type === "message" && (!item.role || item.role === "assistant")) {
    return collectTextContent(item.content ?? item.output ?? item.text).join("");
  }

  if (item.role === "assistant") {
    return collectTextContent(item.content ?? item.output ?? item.text).join("");
  }

  if (item.type === "output_text" || item.type === "text") {
    return collectTextContent(item).join("");
  }

  return "";
}

function rememberTextChunk(order, map, id, text, { append = false } = {}) {
  if (typeof text !== "string" || !text) return;
  const key = id || `text-${order.length}`;
  if (!order.includes(key)) order.push(key);
  map.set(key, append ? `${map.get(key) ?? ""}${text}` : text);
}

function resolveCandidatePath(value, cwd) {
  const text = String(value || "").trim();
  if (/^file:\/\//i.test(text)) {
    return new URL(text);
  }
  return path.isAbsolute(text) ? text : path.join(cwd, text);
}

function summarizeCandidate(candidate) {
  const value = String(candidate.value || "");
  const kind = value.startsWith("data:image/")
    ? "data-url"
    : /^file:\/\//i.test(value) || /\.(png|jpe?g|webp|gif)$/i.test(value)
      ? "file"
      : "string";
  return `${candidate.type}/${kind}/len=${value.length}`;
}

async function readCandidate(candidate, cwd) {
  if (candidate.type === "base64") {
    const buffer = base64ToBuffer(candidate.value);
    if (!buffer?.length) throw new Error("画像base64ではありませんでした。");
    return buffer;
  }
  if (candidate.type === "file") {
    const buffer = await fs.readFile(resolveCandidatePath(candidate.value, cwd));
    if (!isImageBuffer(buffer)) throw new Error("画像ファイルではありませんでした。");
    return buffer;
  }
  throw new Error("Codex app-server の画像レスポンス形式を読み取れませんでした。");
}

async function readFirstImageCandidate(candidates, cwd) {
  const errors = [];
  const seen = new Set();

  for (const candidate of candidates) {
    const key = `${candidate.type}:${candidate.value}`;
    if (seen.has(key)) continue;
    seen.add(key);

    try {
      const buffer = await readCandidate(candidate, cwd);
      return { candidate, buffer };
    } catch (error) {
      errors.push(`${summarizeCandidate(candidate)} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const detail = errors.length ? ` 候補: ${errors.slice(0, 6).join(" / ")}` : "";
  throw new Error(`Codex app-server の完了結果に、有効な画像データがありませんでした。${detail}`);
}

function buildImageGenerationPrompt(prompt, sectionId, imageName, refImageNames = [], taskType = "section") {
  const refNote = refImageNames.length > 0
    ? `\nReference images provided (use them as visual style/character references): ${refImageNames.join(", ")}\n`
    : "";
  if (taskType === "reference") {
    return [
      "Reference asset image generation task.",
      "",
      `Reference asset: ${sectionId}`,
      `Output target: ${imageName}`,
      `Required image model: ${IMAGE_MODEL}`,
      refNote,
      "Use Codex app-server's built-in image_generation capability exactly once.",
      "Do not use shell commands, filesystem writes, web search, external APIs, OpenAI API keys, or metered image APIs.",
      "Create one clean reusable reference image asset for future landing-page image prompts.",
      "This is not a finished LP section. Prioritize a clear subject, visual style, colors, lighting, and material details.",
      "Avoid dense readable text. Use no text unless the prompt explicitly requires a small simple label.",
      "After the image is generated, reply briefly that the image is ready.",
      "",
      "Reference asset prompt:",
      prompt
    ].join("\n");
  }
  if (taskType === "wireframe") {
    return [
      "Composition wireframe conversion task.",
      "",
      `Section: ${sectionId}`,
      `Output target: ${imageName}`,
      `Required image model: ${IMAGE_MODEL}`,
      refNote,
      "The source image is attached. Use it only to extract layout, information hierarchy, spacing, and visual flow.",
      "Use Codex app-server's built-in image_generation capability exactly once.",
      "Do not use shell commands, filesystem writes, web search, external APIs, OpenAI API keys, or metered image APIs.",
      "Generate one clean monochrome wireframe image with the same aspect ratio and composition as the attached source image.",
      "After the image is generated, reply briefly that the wireframe is ready.",
      "",
      "Wireframe conversion prompt:",
      prompt
    ].join("\n");
  }
  if (taskType === "showcase") {
    return [
      "LP showcase item image generation task.",
      "",
      `Item: ${sectionId}`,
      `Output target: ${imageName}`,
      `Required image model: ${IMAGE_MODEL}`,
      refNote,
      "Use Codex app-server's built-in image_generation capability exactly once.",
      "Do not use shell commands, filesystem writes, web search, external APIs, OpenAI API keys, or metered image APIs.",
      "Create one polished portfolio/showcase asset for a Japanese landing page.",
      "Respect the requested aspect ratio and production format in the prompt.",
      "Use Japanese text inside the image when the prompt asks for visible copy.",
      "Avoid watermarks, real brand logos, celebrity likenesses, and unreadable tiny text.",
      "After the image is generated, reply briefly that the image is ready.",
      "",
      "Showcase item prompt:",
      prompt
    ].join("\n");
  }
  return [
    "LP section image generation task.",
    "",
    `Section: ${sectionId}`,
    `Output target: ${imageName}`,
    `Required image model: ${IMAGE_MODEL}`,
    refNote,
    "Use Codex app-server's built-in image_generation capability exactly once.",
    "Do not use shell commands, filesystem writes, web search, external APIs, OpenAI API keys, or metered image APIs.",
    "Create one polished vertical landing-page section image suitable for a 1080px wide LP section.",
    "Avoid tiny unreadable text. Use Japanese text inside the image only when the prompt explicitly asks for visible copy.",
    "After the image is generated, reply briefly that the image is ready.",
    "",
    "Image prompt:",
    prompt
  ].join("\n");
}

function buildPromptRegenerationInstruction(sectionCopy, sectionTitle, instruction, existingPrompt = "") {
  const parts = [
    "LP section image prompt update task.",
    "",
    `Section title: ${sectionTitle}`,
    "",
    "LP copy for this section:",
    "---",
    sectionCopy,
    "---",
    ""
  ];

  const currentPrompt = typeof existingPrompt === "string" ? existingPrompt.trim() : "";
  if (currentPrompt) {
    parts.push("Current image prompt. Treat this as the canonical template and structure:");
    parts.push("---");
    parts.push(currentPrompt);
    parts.push("---");
    parts.push("");
  }

  if (instruction && instruction.trim()) {
    parts.push("Specific update instruction:");
    parts.push(instruction.trim());
    parts.push("");
  } else {
    parts.push("No extra update instruction was provided.");
    parts.push(currentPrompt
      ? "Improve only obvious mismatches with the LP copy while preserving the current prompt's template and style."
      : "Create a production-ready Japanese image prompt for this LP section based on the copy above.");
    parts.push("");
  }

  parts.push("Rules:");
  if (currentPrompt) {
    parts.push("- Preserve the current prompt's language, template, headings, separators, bullet style, and code fence style.");
    parts.push("- Do not translate the prompt into English unless the user's specific instruction explicitly asks for English.");
    parts.push("- Do not rebuild the whole prompt from scratch. Apply only the necessary edits.");
    parts.push("- If reference images are attached or mentioned, add only the minimum needed reference-image instructions in the existing input/reference area.");
    parts.push("- Keep existing sections such as 【入力】, 【共通デザイン方針】, 【構図】, 【タイトル】, 【色・雰囲気ルール】, and 【最終目的】 when they exist.");
  } else {
    parts.push("- Use Japanese by default.");
    parts.push("- Use a structured prompt format suitable for GPT Image 2 / Codex app-server image generation.");
  }
  parts.push("- Keep claims realistic and aligned with the LP copy.");
  parts.push("- Output ONLY the complete updated image prompt. No explanations, no JSON, no labels outside the prompt.");

  return parts.join("\n");
}

function buildCopyRegenerationInstruction(section, instruction) {
  const parts = [
    "Japanese landing-page copy regeneration task.",
    "",
    `Section ID: ${section.id}`,
    `Section title: ${section.title}`,
    "",
    "Current LP copy for this section:",
    "---",
    section.copy || "(empty)",
    "---",
    ""
  ];

  if (section.prompt) {
    parts.push("Current image prompt context:");
    parts.push("---");
    parts.push(section.prompt);
    parts.push("---");
    parts.push("");
  }

  if (instruction && instruction.trim()) {
    parts.push("Specific instruction for rewriting this LP copy:");
    parts.push(instruction.trim());
    parts.push("");
  } else {
    parts.push("Rewrite this section into stronger Japanese LP copy while keeping the same offer and conversion intent.");
    parts.push("");
  }

  parts.push("Rules:");
  parts.push("- Output Japanese Markdown body content only.");
  parts.push("- Do not include the section heading line that starts with ##.");
  parts.push("- Preserve useful labels such as **見出し**, **本文**, **CTA** when they fit.");
  parts.push("- Keep claims realistic and avoid adding unverifiable guarantees.");
  parts.push("- Do not output explanations, JSON, or commentary.");

  return parts.join("\n");
}

function buildBulkPromptRegenerationInstruction(sections, globalInstruction, { includeExistingPrompts = true } = {}) {
  const parts = [
    "Bulk LP section image prompt update task.",
    "",
    "Update image prompts for all listed LP sections using one consistent global direction.",
    "Each output prompt must be a production-ready prompt for GPT Image 2 / Codex app-server image generation.",
    "Keep each prompt specific to the section copy, but enforce the global visual rules across every section.",
    "When an existing prompt is provided, preserve its language, template, headings, separators, bullet style, and code fence style.",
    "Do not translate prompts into English unless the global direction explicitly asks for English.",
    "Do not rebuild the whole prompt from scratch. Apply only the necessary edits.",
    "",
    "Output format is strict. For every section, output exactly:",
    "<<<SEC-XX>>>",
    "prompt text only",
    "<<<END SEC-XX>>>",
    "",
    "Do not output explanations, markdown tables, JSON, or labels outside those delimiters.",
    "",
    "Global direction and rules:",
    "---",
    globalInstruction && globalInstruction.trim()
      ? globalInstruction.trim()
      : "Create coherent, professional, conversion-oriented Japanese LP section images with a consistent art direction.",
    "---",
    ""
  ];

  for (const section of sections) {
    parts.push(`<<<SOURCE ${section.id}>>>`);
    parts.push(`Section title: ${section.title}`);
    parts.push("");
    parts.push("LP copy:");
    parts.push(section.copy || "(empty)");
    if (includeExistingPrompts && section.prompt) {
      parts.push("");
      parts.push("Existing prompt to improve or align:");
      parts.push(section.prompt);
    }
    parts.push(`<<<END SOURCE ${section.id}>>>`);
    parts.push("");
  }

  return parts.join("\n");
}

function buildBulkCopyRegenerationInstruction(sections, globalInstruction, { includeExistingCopy = true } = {}) {
  const parts = [
    "Bulk Japanese landing-page copy regeneration task.",
    "",
    "Rewrite LP copy for all listed sections using one consistent direction.",
    "Each output must be the Markdown body for that section only, without the ## heading.",
    "",
    "Output format is strict. For every section, output exactly:",
    "<<<SEC-XX>>>",
    "Japanese Markdown copy body only",
    "<<<END SEC-XX>>>",
    "",
    "Do not output explanations, markdown tables, JSON, or labels outside those delimiters.",
    "",
    "Global rewrite direction:",
    "---",
    globalInstruction && globalInstruction.trim()
      ? globalInstruction.trim()
      : "Improve clarity, conversion flow, and emotional relevance while keeping the same offer.",
    "---",
    ""
  ];

  for (const section of sections) {
    parts.push(`<<<SOURCE ${section.id}>>>`);
    parts.push(`Section title: ${section.title}`);
    if (includeExistingCopy) {
      parts.push("");
      parts.push("Current LP copy:");
      parts.push(section.copy || "(empty)");
    }
    if (section.prompt) {
      parts.push("");
      parts.push("Image prompt context:");
      parts.push(section.prompt);
    }
    parts.push(`<<<END SOURCE ${section.id}>>>`);
    parts.push("");
  }

  parts.push("Rules:");
  parts.push("- Use Japanese.");
  parts.push("- Keep claims realistic and avoid unverifiable guarantees.");
  parts.push("- Preserve the LP's offer, audience, and CTA intent unless the global direction explicitly changes them.");
  parts.push("- Return every requested section using the exact delimiters.");

  return parts.join("\n");
}

class CodexAppServerRpc {
  constructor({ cwd, timeoutMs }) {
    this.cwd = cwd;
    this.timeoutMs = timeoutMs;
    this.nextId = 1;
    this.pending = new Map();
    this.stderr = [];
    this.notifications = [];
    this.closed = false;
    this.onNotification = null;
  }

  async start() {
    this.process = spawn(getCodexBin(), ["app-server", "--listen", "stdio://"], {
      cwd: this.cwd,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"]
    });

    this.process.once("error", (error) => {
      this.rejectAll(error);
    });

    this.process.once("exit", (code, signal) => {
      this.closed = true;
      if (this.pending.size) {
        this.rejectAll(new Error(`Codex app-server が終了しました: code=${code ?? "null"} signal=${signal ?? "null"}`));
      }
    });

    createInterface({ input: this.process.stdout }).on("line", (line) => this.handleLine(line));
    createInterface({ input: this.process.stderr }).on("line", (line) => {
      if (line.trim()) this.stderr.push(line.trim());
      if (this.stderr.length > 20) this.stderr.shift();
    });
  }

  stop() {
    if (this.closed) return;
    this.closed = true;
    const child = this.process;
    if (!child) return;
    child.stdin?.destroy();
    child.stdout?.destroy();
    child.stderr?.destroy();
    child.kill("SIGTERM");
    const forceKillTimer = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGKILL");
      }
    }, 1000);
    child.once("exit", () => clearTimeout(forceKillTimer));
  }

  rejectAll(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  handleLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(message, "id") && this.pending.has(message.id)) {
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) {
        pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    if (Object.prototype.hasOwnProperty.call(message, "id") && message.method) {
      this.respondToServerRequest(message);
      return;
    }

    this.notifications.push(message);
    this.onNotification?.(message);
  }

  send(payload) {
    this.process.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  notify(method) {
    this.send({ jsonrpc: "2.0", method });
  }

  request(method, params) {
    const id = this.nextId;
    this.nextId += 1;
    this.send({ jsonrpc: "2.0", id, method, params });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Codex app-server の ${method} がタイムアウトしました。`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
    });
  }

  respondToServerRequest(message) {
    const { id, method } = message;
    if (method === "item/commandExecution/requestApproval" || method === "item/fileChange/requestApproval") {
      this.send({ jsonrpc: "2.0", id, result: { decision: "decline" } });
      return;
    }
    if (method === "item/tool/requestUserInput") {
      this.send({ jsonrpc: "2.0", id, result: { answers: {} } });
      return;
    }
    if (method === "mcpServer/elicitation/request") {
      this.send({ jsonrpc: "2.0", id, result: { action: "cancel", content: null, _meta: null } });
      return;
    }
    this.send({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32000,
        message: `LP画像生成では Codex app-server の ${method} 要求を扱いません。`
      }
    });
  }
}

async function waitForTurnCompleted(rpc, threadId, imageCandidates) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Codex app-server の画像生成がタイムアウトしました。"));
    }, rpc.timeoutMs);

    rpc.onNotification = (message) => {
      if (message.params?.threadId === threadId) {
        imageCandidates.push(...collectNotificationImageCandidates(message));
      }

      if (message.method === "error") {
        const errorMessage = message.params?.error?.message || message.params?.message || "Codex app-server でエラーが発生しました。";
        if (isTransientAppServerErrorMessage(errorMessage)) return;
        clearTimeout(timer);
        reject(new Error(errorMessage));
        return;
      }

      if (message.method === "turn/completed" && message.params?.threadId === threadId) {
        clearTimeout(timer);
        resolve(message.params);
      }
    };
  });
}

export function getCodexImageServerStatus() {
  return {
    configured: true,
    model: IMAGE_MODEL,
    agentModel: getAgentModel(),
    command: getCodexBin(),
    transport: "codex-app-server-stdio",
    timeoutMs: getTimeoutMs()
  };
}

export async function generateImageWithCodexAppServer({ prompt, sectionId, imageName, refImages = [], cwd = process.cwd(), signal = null, taskType = "section" }) {
  const rpc = new CodexAppServerRpc({ cwd, timeoutMs: getTimeoutMs() });
  const imageCandidates = [];
  const refImageNames = refImages.map((r) => r.name);

  const onAbort = () => rpc.stop();
  signal?.addEventListener("abort", onAbort);

  try {
    if (signal?.aborted) throw new Error("キャンセルされました。");
    await rpc.start();
    await rpc.request("initialize", {
      clientInfo: {
        name: "lp-section-studio",
        title: "LP Section Studio",
        version: "0.1.0"
      },
      capabilities: { experimentalApi: true }
    });
    rpc.notify("initialized");

    const capabilities = await rpc.request("modelProvider/capabilities/read", { modelProvider: "openai" });
    if (!capabilities?.imageGeneration) {
      throw new Error("Codex app-server の現在のモデルプロバイダで画像生成が有効ではありません。");
    }

    const thread = await rpc.request("thread/start", {
      cwd,
      model: getAgentModel(),
      modelProvider: "openai",
      approvalPolicy: "never",
      sandbox: "read-only",
      ephemeral: true,
      serviceName: "lp-section-studio",
      developerInstructions: [
        `You are an image generation worker for LP Section Studio.`,
        `Only use Codex app-server built-in image generation with ${IMAGE_MODEL}.`,
        `Do not use shell, file edits, web search, third-party services, direct OpenAI API calls, API keys, or paid metered image APIs.`
      ].join("\n")
    });

    const threadId = thread?.thread?.id;
    if (!threadId) {
      throw new Error("Codex app-server の thread/start が thread.id を返しませんでした。");
    }

    const inputItems = [
      {
        type: "text",
        text: buildImageGenerationPrompt(prompt, sectionId, imageName, refImageNames, taskType),
        text_elements: []
      }
    ];
    for (const ref of refImages) {
      const item = buildInputImageItem(ref, cwd);
      if (item) inputItems.push(item);
    }

    const completed = waitForTurnCompleted(rpc, threadId, imageCandidates);
    await rpc.request("turn/start", {
      threadId,
      cwd,
      model: getAgentModel(),
      approvalPolicy: "never",
      input: inputItems
    });
    await completed;

    const candidates = imageCandidates.filter((item) => item.type === "base64" || item.type === "file");
    if (!candidates.length) {
      throw new Error("Codex app-server の完了結果に画像生成データがありません。");
    }
    const { candidate, buffer } = await readFirstImageCandidate(candidates, cwd);

    return {
      configured: true,
      buffer,
      revisedPrompt: candidate.revisedPrompt,
      model: IMAGE_MODEL,
      transport: "codex-app-server-stdio"
    };
  } finally {
    signal?.removeEventListener("abort", onAbort);
    rpc.stop();
  }
}

export async function generateTextWithCodexAppServer({ userPrompt, images = [], cwd = process.cwd(), signal = null }) {
  const rpc = new CodexAppServerRpc({ cwd, timeoutMs: getTimeoutMs() });
  const textOrder = [];
  const completedTextByItemId = new Map();
  const streamTextByItemId = new Map();
  const fallbackTextChunks = [];

  const onAbort = () => rpc.stop();
  signal?.addEventListener("abort", onAbort);

  try {
    if (signal?.aborted) throw new Error("キャンセルされました。");
    await rpc.start();
    await rpc.request("initialize", {
      clientInfo: { name: "lp-section-studio", title: "LP Section Studio", version: "0.1.0" },
      capabilities: { experimentalApi: true }
    });
    rpc.notify("initialized");

    const thread = await rpc.request("thread/start", {
      cwd,
      model: getAgentModel(),
      modelProvider: "openai",
      approvalPolicy: "never",
      sandbox: "read-only",
      ephemeral: true,
      serviceName: "lp-section-studio",
      developerInstructions: "You are a concise text generation assistant. Output only what is explicitly requested."
    });

    const threadId = thread?.thread?.id;
    if (!threadId) throw new Error("Codex app-server の thread/start が thread.id を返しませんでした。");

    const inputItems = [{ type: "text", text: userPrompt, text_elements: [] }];
    for (const img of images) {
      const item = buildInputImageItem(img, cwd);
      if (item) inputItems.push(item);
    }

    const completedPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("テキスト生成がタイムアウトしました。")), rpc.timeoutMs);
      rpc.onNotification = (message) => {
        if (message.method === "item/agentMessage/delta" && message.params?.threadId === threadId) {
          rememberTextChunk(
            textOrder,
            streamTextByItemId,
            message.params?.itemId,
            message.params?.delta,
            { append: true }
          );
        }

        if (message.method === "item/completed" && message.params?.threadId === threadId) {
          const item = message.params?.item;
          rememberTextChunk(textOrder, completedTextByItemId, item?.id, extractAssistantText(item));
        }

        if (message.method === "rawResponseItem/completed" && message.params?.threadId === threadId) {
          const item = message.params?.item;
          const text = extractAssistantText(item);
          if (text) fallbackTextChunks.push(text);
        }

        if (message.method === "error") {
          const errorMessage = message.params?.error?.message || "Codex app-server でエラーが発生しました。";
          if (isTransientAppServerErrorMessage(errorMessage)) return;
          clearTimeout(timer);
          reject(new Error(errorMessage));
          return;
        }
        if (message.method === "turn/completed" && message.params?.threadId === threadId) {
          clearTimeout(timer);
          resolve(message.params);
        }
      };
    });

    await rpc.request("turn/start", {
      threadId, cwd, model: getAgentModel(), approvalPolicy: "never", input: inputItems
    });
    await completedPromise;

    const resultText = textOrder
      .map((id) => completedTextByItemId.get(id) ?? streamTextByItemId.get(id) ?? "")
      .join("") || fallbackTextChunks.join("");

    if (!resultText.trim()) {
      throw new Error("Codex app-server のテキスト生成結果を読み取れませんでした。");
    }

    return { text: resultText.trim() };
  } finally {
    signal?.removeEventListener("abort", onAbort);
    rpc.stop();
  }
}

export {
  buildPromptRegenerationInstruction,
  buildBulkPromptRegenerationInstruction,
  buildCopyRegenerationInstruction,
  buildBulkCopyRegenerationInstruction
};
