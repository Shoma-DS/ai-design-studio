#!/usr/bin/env node
/**
 * UI/UX 実測監査ツール
 *
 * ローカルHTML または 公開URL を Chromium で開き、
 * デザインの4原則 + UI/UXヒューリスティックのうち「数値で測れる項目」を機械的に検査する。
 *
 * 使い方（リポジトリルートから実行）:
 *   node skills/design/uiux-design/scripts/uiux-audit.mjs <path-or-url> [options]
 *
 * options:
 *   --out <file>        Markdownレポートの出力先（省略時は標準出力のみ）
 *   --json <file>       生の検査結果をJSONで保存
 *   --viewport <mode>   mobile | desktop | both（既定: both）
 *   --wait <ms>         ページ読み込み後の待機ms（既定: 1200）
 *
 * 例:
 *   node skills/design/uiux-design/scripts/uiux-audit.mjs portfolio/xxx-lp/lp/index.html --out /tmp/report.md
 *   node skills/design/uiux-design/scripts/uiux-audit.mjs https://example.vercel.app --viewport mobile
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// ---------------------------------------------------------------- CLI

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0].startsWith('--')) {
  console.error('使い方: node skills/design/uiux-design/scripts/uiux-audit.mjs <path-or-url> [--out report.md] [--json report.json] [--viewport mobile|desktop|both] [--wait 1200]');
  process.exit(1);
}

const target = argv[0];
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const outFile = opt('out', null);
const jsonFile = opt('json', null);
const viewportMode = opt('viewport', 'both');
const waitMs = Number(opt('wait', '1200'));

const isRemote = /^https?:\/\//.test(target);
const localPath = isRemote ? null : path.resolve(process.cwd(), target);
if (!isRemote && !fs.existsSync(localPath)) {
  console.error(`ファイルが見つかりません: ${localPath}`);
  process.exit(1);
}
const url = isRemote ? target : pathToFileURL(localPath).href;

const VIEWPORTS = {
  mobile: { name: 'mobile', width: 390, height: 844, isMobile: true },
  desktop: { name: 'desktop', width: 1440, height: 900, isMobile: false },
};
const runViewports =
  viewportMode === 'both' ? [VIEWPORTS.mobile, VIEWPORTS.desktop] : [VIEWPORTS[viewportMode]].filter(Boolean);
if (runViewports.length === 0) {
  console.error('--viewport は mobile | desktop | both のいずれか');
  process.exit(1);
}

// ---------------------------------------------------------------- ページ内検査

/**
 * ブラウザ内で実行される検査本体。
 * DOMを走査して「測れる事実」だけを集め、判定はNode側で行わずここで完結させる。
 */
function collectInPage(cfg) {
  const MAX_TEXT_NODES = 1200;
  const findings = [];
  const add = (id, severity, category, message, example) => {
    let f = findings.find((x) => x.id === id);
    if (!f) {
      f = { id, severity, category, message, count: 0, examples: [] };
      findings.push(f);
    }
    f.count += 1;
    if (example && f.examples.length < 6) f.examples.push(example);
  };

  // ---- ユーティリティ
  const selectorOf = (el) => {
    if (!el || el.nodeType !== 1) return '?';
    const parts = [];
    let node = el;
    for (let depth = 0; node && node.nodeType === 1 && depth < 4; depth++) {
      let s = node.tagName.toLowerCase();
      if (node.id) {
        parts.unshift(`${s}#${node.id}`);
        break;
      }
      const cls = (node.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) s += '.' + cls.join('.');
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const textOf = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);

  const parseColor = (str) => {
    if (!str) return null;
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };

  const relLum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const contrast = (a, b) => {
    const l1 = relLum(a);
    const l2 = relLum(b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
  };

  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  // 背景レイヤーの解決。
  // 「祖先のbackground-colorを遡るだけ」では、背景画像 <img> や半透明スクリム <div> を
  // 絶対配置で敷くLPの定番実装（白抜き文字が乗るCTA帯など）を取りこぼして誤検知する。
  // そのため、祖先の疑似要素と絶対配置の被覆レイヤーも重なり順に積んで合成する。
  const rectCovers = (outer, inner) => {
    const w = Math.max(0, Math.min(outer.right, inner.right) - Math.max(outer.left, inner.left));
    const h = Math.max(0, Math.min(outer.bottom, inner.bottom) - Math.max(outer.top, inner.top));
    const outerArea = outer.width * outer.height;
    return outerArea > 0 && (w * h) / outerArea >= 0.8;
  };

  const layerCache = new Map();
  const layersOfNode = (node, isSelf) => {
    const key = node;
    if (!isSelf && layerCache.has(key)) return layerCache.get(key);
    const out = [];
    // 上に重なる順に積む: 絶対配置の被覆子要素 → 疑似要素 → 自身のbackground
    if (!isSelf) {
      const r = node.getBoundingClientRect();
      const covers = [];
      for (const child of node.children) {
        const ccs = getComputedStyle(child);
        if (ccs.position !== 'absolute' && ccs.position !== 'fixed') continue;
        if (ccs.display === 'none' || Number(ccs.opacity) === 0) continue;
        if (!rectCovers(r, child.getBoundingClientRect())) continue;
        covers.push({ child, ccs, z: parseInt(ccs.zIndex, 10) || 0 });
      }
      // z-index → DOM順で下から上に並べ、上のものから積む
      covers.sort((a, b) => a.z - b.z);
      for (let i = covers.length - 1; i >= 0; i--) {
        const { child, ccs } = covers[i];
        if (child.tagName === 'IMG' || child.tagName === 'VIDEO' || ccs.backgroundImage !== 'none') out.push({ image: true });
        const cc = parseColor(ccs.backgroundColor);
        if (cc && cc.a > 0) out.push({ color: cc });
      }
    }
    // 疑似要素は「面として敷かれているもの」だけを背景とみなす。
    // 1pxの罫線や小さな装飾（◆など）を背景色と誤認すると判定が総崩れになる。
    const nodeRect = node.getBoundingClientRect();
    for (const pe of ['::after', '::before']) {
      const p = getComputedStyle(node, pe);
      if (!p.content || p.content === 'none') continue;
      if (p.position !== 'absolute' && p.position !== 'fixed') continue;
      const pw = parseFloat(p.width);
      const ph = parseFloat(p.height);
      if (!(pw >= nodeRect.width * 0.8 && ph >= nodeRect.height * 0.8)) continue;
      if (p.backgroundImage !== 'none') out.push({ image: true });
      const pc = parseColor(p.backgroundColor);
      if (pc && pc.a > 0) out.push({ color: pc });
    }
    const cs = getComputedStyle(node);
    if (cs.backgroundImage !== 'none') out.push({ image: true });
    const c = parseColor(cs.backgroundColor);
    if (c && c.a > 0) out.push({ color: c });
    if (!isSelf) layerCache.set(key, out);
    return out;
  };

  // 上から下の順に並んだ背景レイヤー配列を返す
  const backdropLayers = (el) => {
    const layers = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 14) {
      layers.push(...layersOfNode(node, node === el));
      // 不透明レイヤーに到達したらそれ以下は見えない
      if (layers.some((l) => l.color && l.color.a >= 0.999)) break;
      node = node.parentElement;
      depth++;
    }
    return layers;
  };

  // レイヤーを下から合成する。画像レイヤーは色が不明なので assumedBase に戻して uncertain を立てる。
  const composeLayers = (layers, assumedBase) => {
    let acc = assumedBase;
    let uncertain = false;
    for (let i = layers.length - 1; i >= 0; i--) {
      const L = layers[i];
      if (L.image) {
        acc = assumedBase;
        uncertain = true;
        continue;
      }
      acc = blend(L.color, acc);
    }
    return { color: acc, uncertain };
  };

  const WHITE = { r: 255, g: 255, b: 255, a: 1 };
  const BLACK = { r: 0, g: 0, b: 0, a: 1 };

  const isVisible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const hasOwnText = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim().length > 0) return true;
    }
    return false;
  };

  const cjkRatio = (s) => {
    if (!s.length) return 0;
    const cjk = s.match(/[　-ヿ㐀-䶿一-鿿＀-￯]/g);
    return (cjk ? cjk.length : 0) / s.length;
  };

  // ---- 1. 横スクロール（レイアウト崩れ）
  const docW = document.documentElement.scrollWidth;
  if (docW > window.innerWidth + 1) {
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (offenders.length >= 6 || !isVisible(el)) return;
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 1 && r.width <= window.innerWidth * 1.5) {
        offenders.push({ selector: selectorOf(el), detail: `右端 ${Math.round(r.right)}px（画面幅 ${window.innerWidth}px）` });
      }
    });
    add(
      'overflow-x',
      'critical',
      'レイアウト',
      `横スクロールが発生（文書幅 ${docW}px > 画面幅 ${window.innerWidth}px）。はみ出し要素を修正する`,
      offenders[0]
    );
    const f = findings.find((x) => x.id === 'overflow-x');
    f.examples = offenders;
    f.count = offenders.length || 1;
  }

  // ---- 2. テキストの走査（コントラスト / 文字サイズ / 行長 / 行間 / 中央揃え比率）
  const textEls = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode() && textEls.length < MAX_TEXT_NODES) {
    const el = walker.currentNode;
    if (/^(script|style|noscript|svg|path|br|template)$/i.test(el.tagName)) continue;
    if (!hasOwnText(el) || !isVisible(el)) continue;
    textEls.push(el);
  }

  let centeredCount = 0;
  const fontFamilies = new Set();
  const fontSizes = new Set();
  const bgImageTextEls = [];

  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const text = textOf(el);
    fontFamilies.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
    fontSizes.add(Math.round(fs));
    if (cs.textAlign === 'center') centeredCount++;

    const rect = el.getBoundingClientRect();
    const isHeading = /^h[1-6]$/i.test(el.tagName) || fs >= 24 || weight >= 700;
    const fullText = (el.textContent || '').trim();
    const bodyLike = fullText.length >= 40; // 「本文」と「短いラベル・キャプション」を分ける

    // 2-1 コントラスト
    const fg = parseColor(cs.color);
    if (fg) {
      const layers = backdropLayers(el);
      const onWhite = composeLayers(layers, WHITE);
      const large = fs >= 24 || (fs >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const ratioOf = (bgColor) => contrast(fg.a < 1 ? blend(fg, bgColor) : fg, bgColor);

      if (!onWhite.uncertain) {
        const ratio = ratioOf(onWhite.color);
        if (ratio < need) {
          add(
            large ? 'contrast-large' : 'contrast-body',
            ratio < need * 0.75 ? 'critical' : 'warn',
            'アクセシビリティ',
            `${large ? '大きい文字' : '本文テキスト'}のコントラスト比が WCAG AA（${need}:1）未満`,
            {
              selector: selectorOf(el),
              detail: `${ratio.toFixed(2)}:1（${cs.color} on rgb(${Math.round(onWhite.color.r)},${Math.round(onWhite.color.g)},${Math.round(onWhite.color.b)})）"${text}"`,
            }
          );
        }
      } else {
        // 背景に画像があるので、明るい背景・暗い背景の両極で評価する
        const rWhite = ratioOf(onWhite.color);
        const rBlack = ratioOf(composeLayers(layers, BLACK).color);
        const worst = Math.min(rWhite, rBlack);
        const best = Math.max(rWhite, rBlack);
        if (best < need) {
          add(large ? 'contrast-large' : 'contrast-body', 'warn', 'アクセシビリティ', `${large ? '大きい文字' : '本文テキスト'}のコントラスト比が WCAG AA（${need}:1）未満（背景画像がどんな明度でも不足）`, {
            selector: selectorOf(el),
            detail: `${worst.toFixed(2)}〜${best.toFixed(2)}:1（${cs.color}）"${text}"`,
          });
        } else if (worst < need) {
          bgImageTextEls.push({ selector: selectorOf(el), detail: `${worst.toFixed(2)}〜${best.toFixed(2)}:1 "${text}"` });
        }
      }
    }

    // 2-2 文字サイズ（日本語の注釈・ラベルは12〜13pxが実務上の常用域なので本文と分けて判定する）
    if (!isHeading && fs > 0) {
      const floorSize = cfg.isMobile ? 15 : 14;
      if (fs < 11) {
        add('font-too-small', 'critical', 'タイポグラフィ', '文字が11px未満。日本語では潰れて読めない', {
          selector: selectorOf(el),
          detail: `${fs.toFixed(1)}px "${text}"`,
        });
      } else if (fs < 12) {
        add('font-11px', bodyLike ? 'critical' : 'warn', 'タイポグラフィ', '文字が12px未満。注釈でも12pxを下限にする', {
          selector: selectorOf(el),
          detail: `${fs.toFixed(1)}px "${text}"`,
        });
      } else if (fs < floorSize && bodyLike) {
        add('font-body-small', 'warn', 'タイポグラフィ', `読ませたい本文が${floorSize}px未満（本文の基準は${cfg.isMobile ? 'モバイル16px・最低15px' : 'PC16〜17px・最低14px'}）`, {
          selector: selectorOf(el),
          detail: `${fs.toFixed(1)}px / ${fullText.length}字 "${text}"`,
        });
      } else if (fs < floorSize) {
        add('font-label-small', 'info', 'タイポグラフィ', `12〜${floorSize - 1}pxの小さいラベル・注釈。意図的なら可、本文なら引き上げる`, {
          selector: selectorOf(el),
          detail: `${fs.toFixed(1)}px "${text}"`,
        });
      }
    }

    // 2-3 行間
    const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
    const ratioLh = lh / fs;
    const isMultiline = rect.height > lh * 1.6 && fullText.length >= 20;
    if (!isHeading && isMultiline && ratioLh < 1.5) {
      add('line-height-tight', 'warn', 'タイポグラフィ', '複数行の本文で行間が1.5未満（日本語本文は1.7〜1.9が読みやすい）', {
        selector: selectorOf(el),
        detail: `line-height ${ratioLh.toFixed(2)} "${text}"`,
      });
    }

    // 2-4 一行の文字数（行長）
    if (isMultiline && fs > 0) {
      const full = fullText;
      const jp = cjkRatio(full) > 0.3;
      const charsPerLine = jp ? rect.width / fs : rect.width / (fs * 0.5);
      const limit = jp ? 48 : 95;
      if (charsPerLine > limit) {
        add('line-too-long', 'warn', 'タイポグラフィ', `1行が長すぎて視線が戻りにくい（${jp ? '日本語は20〜45字' : '欧文は45〜90字'}が目安）`, {
          selector: selectorOf(el),
          detail: `約${Math.round(charsPerLine)}字/行 "${text}"`,
        });
      }
    }
  }

  if (bgImageTextEls.length) {
    add('contrast-on-image', 'info', 'アクセシビリティ', '背景画像の明るい部分に重なるとAA未満になりうる文字。スクリム（半透明の暗幕）を濃くするか、実画像で目視確認する', bgImageTextEls[0]);
    findings.find((x) => x.id === 'contrast-on-image').examples = bgImageTextEls.slice(0, 6);
    findings.find((x) => x.id === 'contrast-on-image').count = bgImageTextEls.length;
  }

  // ---- 3. 反復（フォント・文字サイズ・余白の一貫性）
  if (fontFamilies.size > 3) {
    add('font-family-variety', 'warn', '反復', `書体が${fontFamilies.size}種類使われている（本文・見出しで2種、多くて3種に抑える）`, {
      selector: 'document',
      detail: [...fontFamilies].slice(0, 8).join(' / '),
    });
  }
  if (fontSizes.size > 12) {
    add('font-size-variety', 'info', '反復', `文字サイズが${fontSizes.size}種類。タイプスケール（例: 12/14/16/20/24/32/40/56）に整理すると統一感が出る`, {
      selector: 'document',
      detail: [...fontSizes].sort((a, b) => a - b).join(', ') + ' px',
    });
  }

  // 余白グリッド（4pxの倍数からの逸脱率）
  let spaceTotal = 0;
  let spaceOffGrid = 0;
  const offGridSamples = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (spaceTotal > 2500 || !isVisible(el)) return;
    const cs = getComputedStyle(el);
    for (const prop of ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom']) {
      const v = parseFloat(cs[prop]);
      if (!v || v < 4) continue; // 1〜3pxの微調整はグリッド判定の対象外
      spaceTotal++;
      if (Math.abs(v - Math.round(v / 4) * 4) > 0.6) {
        spaceOffGrid++;
        if (offGridSamples.length < 6) offGridSamples.push({ selector: selectorOf(el), detail: `${prop}: ${v.toFixed(1)}px` });
      }
    }
  });
  if (spaceTotal > 20 && spaceOffGrid / spaceTotal > 0.25) {
    add('spacing-off-grid', 'info', '反復', `余白の${Math.round((spaceOffGrid / spaceTotal) * 100)}%が4pxグリッドから外れている（8pxグリッドに寄せると整列と反復が効く）`, offGridSamples[0]);
    findings.find((x) => x.id === 'spacing-off-grid').examples = offGridSamples;
  }

  // 中央揃えの多用（整列）
  if (textEls.length > 10 && centeredCount / textEls.length > 0.5) {
    add('center-align-overuse', 'info', '整列', `テキストブロックの${Math.round((centeredCount / textEls.length) * 100)}%が中央揃え。左揃えの軸を通すと視線の起点が安定する`, {
      selector: 'document',
      detail: `${centeredCount} / ${textEls.length} ブロック`,
    });
  }

  // ---- 4. タップターゲット（モバイル時のみ判定）
  const interactiveSel = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [onclick]';
  const interactives = [...document.querySelectorAll(interactiveSel)].filter(isVisible);
  if (cfg.isMobile) {
    for (const el of interactives) {
      // 本文中のインラインリンクはWCAG 2.2で除外対象
      const inlineInText = el.tagName === 'A' && el.parentElement && /^(P|LI|SPAN|TD|SMALL)$/.test(el.parentElement.tagName) && getComputedStyle(el).display === 'inline';
      if (inlineInText) continue;
      const r = el.getBoundingClientRect();
      const min = Math.min(r.width, r.height);
      if (min < 24) {
        add('tap-target-tiny', 'critical', 'モバイルUX', 'タップ領域が24px未満（WCAG 2.2 AA 最低基準を下回る）', {
          selector: selectorOf(el),
          detail: `${Math.round(r.width)}×${Math.round(r.height)}px "${textOf(el)}"`,
        });
      } else if (min < 44) {
        add('tap-target-small', 'warn', 'モバイルUX', 'タップ領域が44px未満（指で押しにくい。iOS HIG は44px、Material は48dp推奨）', {
          selector: selectorOf(el),
          detail: `${Math.round(r.width)}×${Math.round(r.height)}px "${textOf(el)}"`,
        });
      }
    }
    // 入力欄のフォントサイズ（iOSの自動ズーム対策）
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      if (!isVisible(el)) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 16) {
        add('input-font-zoom', 'warn', 'モバイルUX', '入力欄のfont-sizeが16px未満。iOS Safariでフォーカス時に画面が自動ズームする', {
          selector: selectorOf(el),
          detail: `${fs.toFixed(1)}px`,
        });
      }
    });
  }

  // ---- 5. 画像
  document.querySelectorAll('img').forEach((el) => {
    if (!el.hasAttribute('alt')) {
      add('img-no-alt', 'critical', 'アクセシビリティ', 'img に alt 属性がない（装飾画像なら alt="" を明示する）', {
        selector: selectorOf(el),
        detail: (el.getAttribute('src') || '').split('/').pop(),
      });
    }
    const cs = getComputedStyle(el);
    const hasSize = (el.hasAttribute('width') && el.hasAttribute('height')) || cs.aspectRatio !== 'auto';
    const outOfFlow = cs.position === 'absolute' || cs.position === 'fixed'; // 背景用の敷き画像はレイアウトをずらさない
    if (!hasSize && !outOfFlow && isVisible(el)) {
      add('img-no-dimensions', 'info', 'パフォーマンス', 'width/height または aspect-ratio がなく、読み込み時にレイアウトがずれる（CLS）', {
        selector: selectorOf(el),
        detail: (el.getAttribute('src') || '').split('/').pop(),
      });
    }
  });

  // ---- 6. 見出し構造
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isVisible);
  const h1s = headings.filter((h) => h.tagName === 'H1');
  if (h1s.length === 0) {
    add('h1-missing', 'warn', '情報設計', 'h1 がない。ページの主題を示す見出しを1つ置く', { selector: 'document', detail: '' });
  } else if (h1s.length > 1) {
    add('h1-multiple', 'info', '情報設計', `h1 が${h1s.length}個ある。ページの主題は1つに絞る`, {
      selector: 'document',
      detail: h1s.slice(0, 4).map((h) => `"${textOf(h)}"`).join(' / '),
    });
  }
  let prev = 0;
  for (const h of headings) {
    const lv = Number(h.tagName[1]);
    if (prev && lv > prev + 1) {
      add('heading-skip', 'info', '情報設計', '見出しレベルが飛んでいる（h2 の次に h4 など）。階層＝近接の表現なので順に下げる', {
        selector: selectorOf(h),
        detail: `h${prev} → h${lv} "${textOf(h)}"`,
      });
    }
    prev = lv;
  }

  // ---- 7. フォーム
  document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea').forEach((el) => {
    if (!isVisible(el)) return;
    const id = el.getAttribute('id');
    const labelled =
      (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
      el.closest('label') ||
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby');
    if (!labelled) {
      const ph = el.getAttribute('placeholder');
      add('form-no-label', ph ? 'warn' : 'critical', 'フォームUX', ph
        ? 'ラベルがなくplaceholderだけ。入力すると項目名が消え、何を書いたか分からなくなる'
        : 'ラベルもaria-labelもない入力欄。スクリーンリーダーで用途が読めない', {
        selector: selectorOf(el),
        detail: ph ? `placeholder="${ph}"` : `name="${el.getAttribute('name') || ''}"`,
      });
    }
    // 入力補助
    const type = (el.getAttribute('type') || '').toLowerCase();
    const name = `${el.getAttribute('name') || ''}${id || ''}`.toLowerCase();
    if (el.tagName === 'INPUT' && !el.hasAttribute('autocomplete') && /mail|tel|phone|name|zip|postal|address/.test(name)) {
      add('form-no-autocomplete', 'info', 'フォームUX', 'autocomplete 属性がなく、ブラウザの自動入力が効かない（入力の摩擦になる）', {
        selector: selectorOf(el),
        detail: `name="${el.getAttribute('name') || ''}"`,
      });
    }
    if (el.tagName === 'INPUT' && /mail/.test(name) && type !== 'email') {
      add('form-input-type', 'warn', 'フォームUX', 'メール欄が type="email" でない。モバイルで最適なキーボードが出ない', { selector: selectorOf(el), detail: `type="${type}"` });
    }
    if (el.tagName === 'INPUT' && /tel|phone/.test(name) && type !== 'tel') {
      add('form-input-type', 'warn', 'フォームUX', '電話番号欄が type="tel" でない。モバイルで数字キーボードが出ない', { selector: selectorOf(el), detail: `type="${type}"` });
    }
  });

  // ---- 8. リンク文言・新規タブ
  document.querySelectorAll('a[href]').forEach((el) => {
    if (!isVisible(el)) return;
    const t = textOf(el);
    if (/^(こちら|ここ|詳細|もっと見る|click here|here|read more|link|リンク)$/i.test(t)) {
      add('link-vague', 'info', 'ライティング', 'リンク文言が「こちら」等で、リンク先が文言だけで判別できない', { selector: selectorOf(el), detail: `"${t}"` });
    }
    if (el.getAttribute('target') === '_blank' && !/noopener/.test(el.getAttribute('rel') || '')) {
      add('link-noopener', 'info', 'セキュリティ', 'target="_blank" に rel="noopener" がない', { selector: selectorOf(el), detail: el.getAttribute('href') });
    }
  });

  // ---- 9. CTA と第一印象（ファーストビュー）
  const vh = window.innerHeight;
  const ctaRe = /(申込|申し込|お問い合わせ|問合せ|相談|購入|予約|登録|ダウンロード|資料|見積|contact|apply|buy|start|無料)/;
  const ctas = interactives.filter((el) => ctaRe.test(textOf(el)));
  const ctaAboveFold = ctas.filter((el) => el.getBoundingClientRect().top < vh);
  add('info-cta', 'info', 'コンバージョン', `CTA候補 ${ctas.length}個（うちファーストビュー内 ${ctaAboveFold.length}個）`, {
    selector: 'document',
    detail: ctas.slice(0, 5).map((el) => `"${textOf(el)}"`).join(' / ') || 'なし',
  });
  if (ctas.length > 0 && ctaAboveFold.length === 0) {
    add('cta-below-fold', 'warn', 'コンバージョン', 'ファーストビュー内にCTAがない。最初の画面で次の行動を示す', { selector: 'document', detail: '' });
  }

  // 追従CTA（モバイル）
  if (cfg.isMobile) {
    const sticky = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      return (cs.position === 'fixed' || cs.position === 'sticky') && isVisible(el) && el.querySelector('a,button');
    });
    add('info-sticky-cta', 'info', 'コンバージョン', sticky.length ? `追従要素あり（${sticky.length}個）` : '追従CTAなし。長いLPでは画面下固定のCTAで離脱前の受け皿を作れる', {
      selector: sticky[0] ? selectorOf(sticky[0]) : 'document',
      detail: sticky[0] ? `"${textOf(sticky[0])}"` : '',
    });
  }

  // ---- 10. 基本メタ
  if (!document.documentElement.getAttribute('lang')) {
    add('html-no-lang', 'warn', 'アクセシビリティ', '<html lang="ja"> がない。読み上げの言語判定と日本語フォント選択に影響する', { selector: 'html', detail: '' });
  }
  const vp = document.querySelector('meta[name="viewport"]');
  if (!vp) {
    add('no-viewport-meta', 'critical', 'レスポンシブ', 'viewport メタタグがない。モバイルで縮小表示される', { selector: 'head', detail: '' });
  } else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(vp.getAttribute('content') || '')) {
    add('viewport-no-zoom', 'warn', 'アクセシビリティ', 'ピンチズームが禁止されている。弱視ユーザーが拡大できない', {
      selector: 'meta[name=viewport]',
      detail: vp.getAttribute('content'),
    });
  }
  if (!document.title || document.title.trim().length < 5) {
    add('title-weak', 'warn', '情報設計', '<title> が未設定または短すぎる', { selector: 'head > title', detail: document.title });
  }
  const desc = document.querySelector('meta[name="description"]');
  if (!desc || !(desc.getAttribute('content') || '').trim()) {
    add('no-meta-description', 'info', '情報設計', 'meta description がない（検索結果・SNSでの説明文）', { selector: 'head', detail: '' });
  }
  if (!document.querySelector('meta[property="og:image"]')) {
    add('no-og-image', 'info', '情報設計', 'og:image がない。SNSシェア時にサムネイルが出ない', { selector: 'head', detail: '' });
  }

  return {
    findings,
    stats: {
      textElements: textEls.length,
      interactives: interactives.length,
      headings: headings.length,
      images: document.querySelectorAll('img').length,
      fontFamilies: [...fontFamilies],
      fontSizes: [...fontSizes].sort((a, b) => a - b),
      docHeight: document.documentElement.scrollHeight,
      viewportH: window.innerHeight,
    },
  };
}

// ---------------------------------------------------------------- CSSソースの検査（フォーカス可視 / モーション配慮）

function auditCssText(cssText) {
  const out = [];
  const hasFocusVisible = /:focus-visible/.test(cssText);
  const killsOutline = /:focus[^{]*\{[^}]*outline\s*:\s*(none|0)/.test(cssText) || /\*\s*\{[^}]*outline\s*:\s*(none|0)/.test(cssText);
  if (killsOutline && !hasFocusVisible) {
    out.push({
      id: 'focus-outline-removed',
      severity: 'critical',
      category: 'アクセシビリティ',
      message: 'CSSで outline を消しているが :focus-visible の代替スタイルがない。キーボード操作時に現在位置が見えなくなる',
      count: 1,
      examples: [{ selector: 'stylesheet', detail: 'outline: none / 0 を検出' }],
    });
  }
  const hasMotion = /(animation|transition)\s*:/.test(cssText);
  if (hasMotion && !/prefers-reduced-motion/.test(cssText)) {
    out.push({
      id: 'no-reduced-motion',
      severity: 'info',
      category: 'モーション',
      message: 'アニメーションがあるが prefers-reduced-motion への配慮がない。動きに酔うユーザー向けに停止指定を入れる',
      count: 1,
      examples: [{ selector: 'stylesheet', detail: '@media (prefers-reduced-motion: reduce) を追加する' }],
    });
  }
  // `.45s` のような先頭ドット表記も拾う（`300ms` は数字直後が m なので一致しない）
  const longTransitions = [...cssText.matchAll(/transition[^;{}]*?(\d*\.?\d+)s(?![\w-])/g)]
    .map((m) => Number(m[1]))
    .filter((s) => s > 0.6);
  if (longTransitions.length) {
    out.push({
      id: 'slow-transition',
      severity: 'info',
      category: 'モーション',
      message: 'transition が0.6秒超。UIの反応は0.15〜0.3秒、画面遷移でも0.5秒以内が体感の目安',
      count: longTransitions.length,
      examples: [{ selector: 'stylesheet', detail: `最長 ${Math.max(...longTransitions)}s` }],
    });
  }
  return out;
}

async function loadCssText(page, isRemoteTarget, localFilePath, collectedCss) {
  let text = collectedCss.join('\n');
  // インラインstyleタグ
  text += '\n' + (await page.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n')));
  // ローカルファイルの場合は <link rel=stylesheet> を実ファイルから読む
  if (!isRemoteTarget) {
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel~="stylesheet"]')].map((l) => l.getAttribute('href')).filter(Boolean)
    );
    const baseDir = path.dirname(localFilePath);
    for (const href of hrefs) {
      if (/^https?:/.test(href)) continue;
      const p = path.resolve(baseDir, href.split('?')[0]);
      if (fs.existsSync(p)) text += '\n' + fs.readFileSync(p, 'utf8');
    }
  }
  return text;
}

// ---------------------------------------------------------------- キーボードフォーカスの実測

async function auditKeyboardFocus(page) {
  try {
    const result = await page.evaluate(() => {
      document.body.focus();
      return true;
    });
    if (!result) return [];
    const states = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const shadow = cs.boxShadow && cs.boxShadow !== 'none';
        const border = cs.borderWidth;
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30),
          visible: outline || shadow,
          border,
        };
      });
      if (s) states.push(s);
    }
    const invisible = states.filter((s) => !s.visible);
    if (states.length && invisible.length / states.length > 0.5) {
      return [
        {
          id: 'focus-indicator-missing',
          severity: 'critical',
          category: 'アクセシビリティ',
          message: 'Tabキーで移動しても、フォーカス中の要素に見た目の変化がない（実測）。キーボードだけで操作できない',
          count: invisible.length,
          examples: invisible.slice(0, 5).map((s) => ({ selector: s.tag, detail: `"${s.text}"` })),
        },
      ];
    }
    return [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- 実行

const SEVERITY_ORDER = { critical: 0, warn: 1, info: 2 };
const SEVERITY_LABEL = { critical: '🔴 重大', warn: '🟡 要改善', info: '🔵 参考' };

const results = [];
const browser = await chromium.launch();

for (const vp of runViewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    userAgent: vp.isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await context.newPage();
  const collectedCss = [];
  page.on('response', async (res) => {
    try {
      if ((res.headers()['content-type'] || '').includes('css')) collectedCss.push(await res.text());
    } catch {}
  });

  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(waitMs);
  // 遅延読み込み要素を出すため一度最下部まで送ってから戻す
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);

  const inPage = await page.evaluate(collectInPage, { isMobile: vp.isMobile });
  const cssText = await loadCssText(page, isRemote, localPath, collectedCss);
  const cssFindings = auditCssText(cssText);
  const focusFindings = await auditKeyboardFocus(page);

  results.push({
    viewport: vp.name,
    size: `${vp.width}×${vp.height}`,
    findings: [...inPage.findings, ...cssFindings, ...focusFindings],
    stats: inPage.stats,
  });

  await context.close();
}

await browser.close();

// ---------------------------------------------------------------- レポート生成

const lines = [];
lines.push(`# UI/UX 実測監査レポート`);
lines.push('');
lines.push(`- 対象: \`${target}\``);
lines.push(`- 検査ビューポート: ${results.map((r) => `${r.viewport} (${r.size})`).join(' / ')}`);
lines.push('');

let totalCritical = 0;
let totalWarn = 0;

for (const r of results) {
  const sorted = [...r.findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.category.localeCompare(b.category)
  );
  const c = sorted.filter((f) => f.severity === 'critical').length;
  const w = sorted.filter((f) => f.severity === 'warn').length;
  totalCritical += c;
  totalWarn += w;

  lines.push(`## ${r.viewport} (${r.size})`);
  lines.push('');
  lines.push(`重大 ${c}件 / 要改善 ${w}件 / 参考 ${sorted.filter((f) => f.severity === 'info').length}件`);
  lines.push('');
  lines.push(`ページ高 ${r.stats.docHeight}px（${(r.stats.docHeight / r.stats.viewportH).toFixed(1)}画面分） / テキストブロック ${r.stats.textElements} / 操作要素 ${r.stats.interactives} / 画像 ${r.stats.images}`);
  lines.push('');

  if (sorted.length === 0) {
    lines.push('検出なし。');
    lines.push('');
    continue;
  }

  for (const f of sorted) {
    lines.push(`### ${SEVERITY_LABEL[f.severity]} [${f.category}] ${f.message}`);
    lines.push('');
    lines.push(`該当 ${f.count}件`);
    if (f.examples.length) {
      lines.push('');
      for (const ex of f.examples) {
        lines.push(`- \`${ex.selector}\` — ${ex.detail}`);
      }
    }
    lines.push('');
  }
}

lines.push('---');
lines.push('');
lines.push(`合計: 重大 ${totalCritical}件 / 要改善 ${totalWarn}件`);
lines.push('');
lines.push('※ このツールは「測れる項目」だけを見る。情報の並び順・コピーの説得力・トンマナ・視線誘導は `skills/design/uiux-design/SKILL.md` のチェックリストで人間が判断する。');

const report = lines.join('\n');
console.log(report);

if (outFile) {
  fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
  fs.writeFileSync(path.resolve(outFile), report, 'utf8');
  console.error(`\n→ レポートを書き出しました: ${outFile}`);
}
if (jsonFile) {
  fs.mkdirSync(path.dirname(path.resolve(jsonFile)), { recursive: true });
  fs.writeFileSync(path.resolve(jsonFile), JSON.stringify({ target, results }, null, 2), 'utf8');
  console.error(`→ JSONを書き出しました: ${jsonFile}`);
}

process.exit(totalCritical > 0 ? 1 : 0);
