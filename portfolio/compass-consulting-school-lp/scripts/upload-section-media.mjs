import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");

const envPath = path.join(repoRoot, ".env");
const envText = await fs.readFile(envPath, "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = process.env[m[1]] || m[2];
}

const API_BASE = process.env.UTAGE_API_BASE_URL;
const API_KEY = process.env.UTAGE_API_KEY;

async function uploadMedia(filePath, filename, filetype) {
  const uploadUrlRes = await fetch(`${API_BASE}/media/upload-url`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ filename, filetype }),
  });
  const uploadUrlJson = await uploadUrlRes.json();
  if (!uploadUrlRes.ok) {
    throw new Error(`upload-url failed: ${uploadUrlRes.status} ${JSON.stringify(uploadUrlJson)}`);
  }
  const { media_id, presigned_post } = uploadUrlJson.data;

  const fileBuffer = await fs.readFile(filePath);
  const form = new FormData();
  for (const [key, value] of Object.entries(presigned_post.fields)) {
    form.append(key, value);
  }
  form.append("file", new Blob([fileBuffer], { type: filetype }), filename);

  const s3Res = await fetch(presigned_post.url, { method: "POST", body: form });
  if (!s3Res.ok) {
    const text = await s3Res.text();
    throw new Error(`s3 upload failed: ${s3Res.status} ${text}`);
  }

  const completeRes = await fetch(`${API_BASE}/media/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ media_id }),
  });
  const completeJson = await completeRes.json();
  if (!completeRes.ok) {
    throw new Error(`media/complete failed: ${completeRes.status} ${JSON.stringify(completeJson)}`);
  }
  return completeJson.data;
}

const SCRATCH_JPG_DIR = "/private/tmp/claude-501/-Users-yamamotorina-Documents-ai-design-studio/d7cbd5dc-fe93-4c90-b82d-24294801abda/scratchpad/utage-jpg";

const names = [
  "01-hero", "02-campaign", "03-problem", "04-target", "05-about",
  "06-reasons", "07-why", "08-features1", "09-features2", "10-compare",
  "11-curriculum", "12-instructors", "13-flow", "14-faq-footer",
];

const result = { pc: {}, mobile: {} };

for (const name of names) {
  const pcPath = path.join(SCRATCH_JPG_DIR, "pc", `${name}.jpg`);
  const pcData = await uploadMedia(pcPath, `compass-${name}-pc.jpg`, "image/jpeg");
  result.pc[name] = pcData;
  console.log(`pc/${name}: ${pcData.url}`);

  const mobilePath = path.join(SCRATCH_JPG_DIR, "mobile", `${name}.jpg`);
  const mobileData = await uploadMedia(mobilePath, `compass-${name}-mobile.jpg`, "image/jpeg");
  result.mobile[name] = mobileData;
  console.log(`mobile/${name}: ${mobileData.url}`);
}

await fs.writeFile(
  path.join(projectRoot, "outputs/utage-section-media.json"),
  JSON.stringify(result, null, 2)
);
console.log("saved outputs/utage-section-media.json");
