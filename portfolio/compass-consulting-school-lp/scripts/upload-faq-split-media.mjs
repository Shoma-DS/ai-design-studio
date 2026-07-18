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

const imageDir = path.join(projectRoot, "lp/images");
const mediaPath = path.join(projectRoot, "outputs/utage-section-media.json");
const media = JSON.parse(await fs.readFile(mediaPath, "utf8"));

const targets = [
  { key: "14a-faq-header", pcFile: "14a-faq-header.jpg", mobileFile: "mobile/14a-faq-header.jpg" },
  { key: "14b-cta-footer", pcFile: "14b-cta-footer.jpg", mobileFile: "mobile/14b-cta-footer.jpg" },
];

for (const t of targets) {
  const pcData = await uploadMedia(path.join(imageDir, t.pcFile), `compass-${t.key}-pc.jpg`, "image/jpeg");
  media.pc[t.key] = pcData;
  console.log(`pc/${t.key}: ${pcData.url}`);

  const mobileData = await uploadMedia(path.join(imageDir, t.mobileFile), `compass-${t.key}-mobile.jpg`, "image/jpeg");
  media.mobile[t.key] = mobileData;
  console.log(`mobile/${t.key}: ${mobileData.url}`);
}

await fs.writeFile(mediaPath, JSON.stringify(media, null, 2));
console.log("updated outputs/utage-section-media.json");
