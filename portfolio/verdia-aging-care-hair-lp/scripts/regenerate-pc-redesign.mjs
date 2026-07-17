import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/verdia-aging-care-hair-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

// skills/design/lp-responsive/SKILL.md Step1 強化版プロンプト（PC版レイアウト再構成の指示）をそのまま使用
const PC_REDESIGN_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）のコピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。
・具体的には次のいずれかに該当する要素があれば、必ず配置を変える:
  - 見出し・テキストブロックが写真の上または下にある → PCでは写真の横（左右どちらか）に並べる
  - カード・アイコン・特徴ブロックが3つ以上、縦1列または2列グリッドで並んでいる → PCでは横一列、または3列以上のグリッドに並べる
  - 「テキスト→写真→テキスト」のように縦に交互配置されている → PCでは左右2カラムに分割する
・単に用紙のサイズ・余白比率だけを変えて「スマホ版と同じ配置のまま少し横に広い版」を作ることは禁止。それは「作り直し」ではなく「サイズ変更」であり、この指示の目的に反する。
・縦横比は16:9などに固定せず、組み替えた結果として内容量に合った自然な高さにする（テキストが少なく要素も少ないセクションは、組み替えてもなおポートレートに近いままで構わないが、その場合も「なぜ横に組み替えようがないのか」を自問すること＝ほとんどのセクションは組み替え可能）。
・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）
・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする
・上下端は前後セクションへ自然につながる余白で終える
`;

// セクション別の追加指示（監査で特に「サイズ変更のみ」と指摘された構造への対処）
const EXTRA_INSTRUCTIONS = {
  "02-intro-mood": `
・このセクションは【左右2分割構成】に組み替える。左カラムにモデル写真をセクションの上端から下端まで全高で配置する（写真の上下に見出しやテキストを置かない、写真は縦に大きく1枚）。
・右カラムには、上から順に「縦書き風の見出し」「3つの丸バッジ（新質感×髪質チェンジ×エイジングケア、横並びのまま）」「リード文」を縦に積んで配置する。右カラムの要素はすべて写真の右側1本の帯の中に収める。
・スマホ版のように見出しを写真に重ねて右上に置いたり、バッジ列とリード文をセクション全幅にまたがせたりしない。写真とテキスト情報を完全に左右で分離し、主従関係を「写真＝左の大きな主役ブロック」「見出し・バッジ・リード文＝右の縦積み情報ブロック」に組み替えること。
・写真を消してもスマホ版と似たシルエットに絶対に見えない、明確な左右2カラムレイアウトにする。
・背景の淡いグラデーション・泡や雫の装飾はセクション全体（左右両方）に続けてよい。
・【文字の正確性・最優先で厳守】縦書き見出しは「サイエンスの力で、確かな実感のある美しさへ」の1文だけを、2〜3本の縦書きカラムに自然に分割して配置する。この文字列に無い漢字・文字・記号を絶対に追加しない。読めない・意味不明な単独の漢字1文字だけの列（衍字・誤字）を絶対に生成しない。生成後に自分で文字列を読み上げ、指定の1文と完全一致するか必ず確認してから出力する。`,
  "06-product1-grandsilk": `
・製品写真とチェックリストカードは必ず左右に分割する（写真を左、見出し＋チェックリストを右、またはその逆）。写真の上下にテキストを積む配置は禁止。`,
  "07-product2-grandsatin": `
・製品写真とチェックリストカードは必ず左右に分割する（写真を左、見出し＋チェックリストを右、またはその逆）。写真の上下にテキストを積む配置は禁止。`,
  "08-product3-reviveessence": `
・製品写真は左または右の1カラムに、見出し・3つの効果アイコン・チェックリストはもう一方のカラムに縦に並べる、左右2カラム構成にする。3つの効果アイコンはPCでは横一列に並べる。写真の上下にテキストを積む配置は禁止。`,
  "09-product4-aquaspa": `
・製品写真は左または右の1カラムに、見出し・3つの効果アイコン・チェックリストはもう一方のカラムに縦に並べる、左右2カラム構成にする。3つの効果アイコンはPCでは横一列に並べる。写真の上下にテキストを積む配置は禁止。`,
  "05-tech-detail": `
・白背景カードの中身を左右2カラムに分割する。左カラムにNEWテクノロジーバッジ・見出し・説明文を縦に並べ、右カラムにBefore/Afterの毛髪断面イラストを上下（または左右）に並べる。見出し→説明文→Before/After画像という縦の並び順のまま単純に拡大することは禁止。
・カードの下の注釈と「HOME CARE LINE UP」見出しはカード下部に中央揃えで残してよい。`,
  "04-tech-overview": `
・スマホ版は「番号バッジ＋ラベル＋説明文（左）／アイコン画像（右）」のカードが縦に3行積まれている構成。PC版ではこの3枚のカードを縦1列のまま拡大コピーすることを禁止し、必ず横3列のグリッドに並べ替える。
・英字見出し「Aging Care Technology」はセクション上部中央に1つだけ配置し、その下に3つのカードを左から「01 リペアロックシステム」「02 ボンドチューンシステム」「03 マイクロセルショット」の順で横一列に並べる。
・各カードの内部は縦積みにしてよい（上から番号バッジ、ラベル帯、アイコン/質感ビジュアル、説明文の順など）。ただしカードの中身をどう組むかに関わらず、3枚のカード自体は必ず横に並べること（縦1列や2列折り返しは禁止）。
・3列にしたときにカード幅が狭くなりすぎて説明文が窮屈にならないよう、1200px幅いっぱいを使って余裕を持たせる。
・カードを1枚取り除いてもスマホ版の縦積みシルエットに絶対に見えない、明確な横3列レイアウトにする。`,
  "10-system-table": `
・スマホ版の表は「ラベル列＋GRAND SILK列＋GRAND SATIN列」の3列構成（各セルに製品写真とライン名のみ）。PC版ではこれを列数の少ないまま拡大コピーすることを禁止し、必ず4〜5列構成に組み替える。
・具体的には、GRAND SILK列・GRAND SATIN列それぞれの右隣（またはラベル列の右隣）に「詳細スペック列」を追加する（例: 内容量・価格帯・主要処方・香りタイプなど、コピーで与えられた情報量を超えない範囲で製品写真に添える短いスペック情報を列として独立させる）。列を追加できる情報が無い場合は、代わりに各製品ラインの使用イメージ写真やテクスチャーのクローズアップ写真を独立した列として追加してもよい。
・「アウトバストリートメント」の行はGRAND SILK列・GRAND SATIN列それぞれに個別セルを分けて配置する（スマホ版のような2列またぎの単一セルにしない）。
・列を増やした結果、表全体が1200px幅いっぱいに横広がりのグリッドになるようにする。スマホ版と同じ3列のまま余白だけ広げる・セルを拡大するだけの変更は禁止。
・左端の「ホームケア」縦見出しは維持してよいが、表本体は縦に間延びさせず、横方向の列数と情報量を明確に増やす構成にする。`,
};

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const extra = EXTRA_INSTRUCTIONS[section.id] || "";
  const prompt = buildPrompt(section) + PC_REDESIGN_INSTRUCTION + extra;
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-mobile-reference.png`, buffer: mobileBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let index = 0;
  async function runNext() {
    while (index < items.length) {
      const current = index++;
      try {
        results[current] = { status: "ok", value: await worker(items[current]) };
      } catch (err) {
        results[current] = { status: "error", error: err };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext));
  return results;
}

const concurrency = Number(process.env.GEN_CONCURRENCY || 4);
const results = await runPool(selected, concurrency, generateOne);

let failed = 0;
results.forEach((r, i) => {
  if (r.status === "error") {
    failed++;
    console.error(`FAILED ${selected[i].id}: ${r.error?.message || r.error}`);
  }
});

console.log(`Generated ${selected.length - failed}/${selected.length} sections.`);
if (failed > 0) process.exitCode = 1;
