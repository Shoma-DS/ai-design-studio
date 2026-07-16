import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/beauty-salon-c3-inspired-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

// 強化版プロンプト: skills/design/lp-responsive/SKILL.md「PC版をスマホ版基準で作り直す」節
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

// セクションごとの具体的な左右2カラム再構成指示。
// mobile版を実際に確認した上で、要素の相対配置が確実に入れ替わるよう明示する。
const LAYOUT_OVERRIDES = {
  "03-value": `
・具体的な組み替え: 見出し帯の下を左右2カラムにする。
  左カラム(約45%幅): 「Quality/Q」の大きな比較キャッチコピーと女性スタッフ写真のパネル（縦に大きく）。
  右カラム(約55%幅): 3つの理由カード（剃り残し対応・予約の取りやすさ・スタッフ技術力）を縦に積んだリストとして配置し、その下に「比べてわかる、安心の違い」比較表を右カラム内に収める。
  2カラムの下にCTAボタンを全幅で配置する。`,
  "04-ranking": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約35%幅): 3つのメダル（技術力・接客満足度・衛生管理満足度）を縦1列のバッジリストとして配置し、下に調査概要の注記を置く。
  右カラム(約65%幅): 「選ばれる理由は、見えないこだわりに。」見出しと、一般的なサロン／当サロンのこだわり／お客様にとっての価値の3列比較ブロックを配置する。
  2カラムの下にCTAボタンを全幅で配置する。`,
  "10-machine-effect": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約45%幅): 脱毛機器の写真を縦に大きく配置する（安心バッジを写真に重ねてよい）。
  右カラム(約55%幅): 「Point1 伝わる施術品質」見出し・リボン、出力調整と専門スタッフの2つの丸窓カード、Quality/Clean/Safety/Trustの4アイコンを縦に積んで配置する。
  2カラムの下にCTAボタンを全幅で配置する。`,
  "11-body-coverage": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約35%幅): 見出し「ケア範囲をひと目で」、「気になる部位だけ」バッジ、そして元は図の下にあった「気になる部位だけの単発コースも選べます」バナーと3つの小アイコンを、縦リストとしてこの左カラムに移動する。
  右カラム(約65%幅): 全身シルエット2体と部位ラベルの図解を中央に大きく配置する（ラベルの引き出し線はそのまま）。`,
  "12-method": `
・具体的な組み替え: 見出しの下、独自の3ステップ（カウンセリング／冷却ジェル／照射）のカードを、縦3段の積み重ねではなく横一列の3カラムに並べる（各カードは番号+テキスト+丸窓写真を縦に積んだ構成にする）。
  その下に「一人ひとりに合わせたオーダーメイドケア」比較ブロックを全幅で配置し、最後にCTAを全幅で置く。`,
  "13-skill-speed": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約40%幅): 「Point4 スキルとスピード」見出し・研修済みスタッフの説明文・スタッフ写真を縦に積んで配置する。
  右カラム(約60%幅): 「全身1回あたり最短45分」「お着替えから退店までスムーズな導線」の2枚のカードを縦に積み、その下に「施術の流れ」5ステップを横一列ではなく縦のステップリストとして配置する。
  2カラムの下にCTAボタンを全幅で配置する。`,
  "15-staff-support": `
・具体的な組み替え: 見出し帯（Relief Support＋スタッフ写真、既に横並び）の下を左右2カラムにする。
  左カラム: そのまま見出し＋スタッフ写真の帯を縦に伸ばして配置する。
  右カラム: 3つの安心サポートカード（同性スタッフ対応／無理な勧誘なし／なんでも相談）を横一列ではなく縦に積んだリストにし、その下にCTAボタンを右カラム内に配置する。
  見出し帯と2カラムエリアが左右に並ぶ大きな構成にする（3つのバンドが上から順に並ぶ構成にしない）。`,
  "16-payment": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約40%幅): 「Choice! 選べるお支払い方法」見出しと、鏡・タオル・カードの小物写真を縦に積んで配置する。
  右カラム(約60%幅): クレジットカード・分割払い・現金の3つの支払いカードを縦に積んだリストとして右カラムに配置する（横一列にしない）。`,
  "18-resale": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約40%幅): 「Resale & Ticket」見出しリボンと、チケット写真（バッジ付き）を縦に積んで配置する。
  右カラム(約60%幅): 「途中で通えなくなった場合のリセール制度」と「回数の譲渡・分割利用も相談可能」の2枚のカードを横一列ではなく縦に積み、その下に注記バナーとCTAボタンを配置する。`,
  "19-no-regret": `
・具体的な組み替え: 見出し「3つの、なし」の下を左右2カラムにする。
  左カラム(約35%幅): 無理な勧誘なし・追加料金なし・我慢する痛みなしの3アイコンカードを横一列ではなく縦に積んだリストとして配置する。
  右カラム(約65%幅): 「通いやすさを大切にした安心のサロンです」見出しと、当サロン／他サロンA／他サロンBの3列比較表を配置し、その下にCTAボタンを置く。
  最下部のスタッフメッセージ帯（写真＋テキスト、既に横並び）はそのまま全幅で残す。`,
  "21-infection-control": `
・具体的な組み替え: 見出しの下全体を左右2カラムにする（既存の「スタッフ写真＋チェックリストカード」の横並びをさらに拡張する）。
  左カラム(約40%幅): 見出しとスタッフ写真を縦に積んで配置する。
  右カラム(約60%幅): 「清潔で安心なサロンづくりに努めています」チェックリストカードを配置し、その下に元は横一列だった3つの小アイコン（体調管理・換気消毒・マスク着用）を縦に積んだリストとして右カラム内に配置する。
  2カラムの下にCTAボタンを全幅で配置する。`,
  "22-private-room": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約55%幅): 個室の写真を縦に大きく配置する（バッジを重ねてよい）。
  右カラム(約45%幅): 見出し「Private Room」、そして元は写真の下に横一列で並んでいた3つの小アイコン（個室・アロマ・着替えスペース）を縦に積んだリストとして配置し、その下にCTAボタンを右カラム内に配置する。`,
  "23-faq-area": `
・具体的な組み替え: 見出しの下を左右2カラムにする。
  左カラム(約35%幅): 「Q&A よくある質問」見出しと、元はページ最下部に横帯として配置されていた「対応エリア」（東京／神奈川／埼玉／千葉／大阪／福岡）を縦積みの帯としてこの左カラムに移動する。
  右カラム(約65%幅): 2つのQ&Aカード（痛みについて／効果が出るまでの回数）を縦に積んで配置する。`,
};

const targetIds = new Set(Object.keys(LAYOUT_OVERRIDES));

const argIds = new Set(process.argv.slice(2));
const selected = sections.filter((s) => (argIds.size ? argIds.has(s.id) : targetIds.has(s.id)));

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const override = LAYOUT_OVERRIDES[section.id] || "";
  const prompt = buildPrompt(section) + PC_REDESIGN_INSTRUCTION + override;
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
  const outTmp = `${outputPath}.new.png`;
  await fs.writeFile(outTmp, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outTmp)}`);
  return { id: section.id, path: outTmp };
}

async function runPool(items, concurrency, worker) {
  const results = [];
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const current = idx++;
      try {
        results[current] = { ok: true, value: await worker(items[current]) };
      } catch (error) {
        results[current] = { ok: false, error };
        console.error(`FAILED ${items[current].id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => next());
  await Promise.all(workers);
  return results;
}

const CONCURRENCY = Number(process.env.GEN_CONCURRENCY || 4);
const results = await runPool(selected, CONCURRENCY, generateOne);

const okCount = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
console.log(`Generated ${okCount}/${selected.length} sections.`);
if (failed.length) {
  console.log(`Failed: ${failed.map((_, i) => selected[i]?.id).filter(Boolean).join(", ")}`);
  process.exitCode = 1;
}
