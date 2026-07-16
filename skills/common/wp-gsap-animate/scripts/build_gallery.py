#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_gallery.py - animations.json から「GSAPアニメーション見本帳」HTMLを生成する。

  python3 scripts/build_gallery.py -o gallery.html

見本帳は engine/engine.js をそのまま埋め込む。つまり
「見本帳で見た動き」と「WordPressに入る動き」は完全に同じコードで動く。
"""
import os, json, html, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
GSAP_VER = "3.12.5"
CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/%s/" % GSAP_VER

REQ_COLOR = {
    "any": "#30a46c",
    "text": "#3b82f6",
    "multi": "#f5a623",
}

# 「▶ もう一度」を出すのは、一度きり再生されるアニメだけ。
REPLAYABLE = {
    "fade-up", "fade-in", "slide-in", "scale-in", "blur-in", "flip-in", "box-reveal",
    "split-chars", "split-lines", "typewriter", "text-mask",
    "highlight-marker", "stagger", "grid-cascade", "count-up", "image-reveal",
}

# 再生ボタンの代わりに出す案内文
HINT = {
    "parallax": "↕ スクロールすると動きます",
    "scroll-scale": "↕ スクロールすると動きます",
    "scroll-rotate": "↕ スクロールすると動きます",
    "section-color": "↕ スクロールすると色が変わります",
    "marquee": "自動で流れ続けます",
    "ken-burns": "自動で動き続けます",
    "text-fill": "↕ スクロールすると塗られます",
    "hover-lift": "🖱 マウスを乗せてみてください",
    "hover-zoom": "🖱 マウスを乗せてみてください",
    "link-underline": "🖱 マウスを乗せてみてください",
    "float": "自動で浮遊し続けます",
    "spin": "自動で回り続けます",
    "pulse": "自動で脈打ち続けます",
    "hover-tilt": "🖱 マウスを動かしてみてください",
    "magnetic": "🖱 ボタンに近づけてみてください",
}


def esc(s):
    return html.escape(str(s)) if s is not None else ""


def build(defs):
    reqs = defs["requirements"]
    groups = defs["groups"]
    anims = defs["animations"]
    by_group = {}
    for a in anims:
        by_group.setdefault(a["group"], []).append(a)

    cards_html = ""
    for g in groups:
        items = by_group.get(g["id"], [])
        if not items:
            continue
        cards_html += '<h2 class="gtitle">%s <span class="gnote">%s</span></h2>\n<div class="grid">\n' % (
            esc(g["label"]), esc(g["note"]))
        for a in items:
            r = reqs[a["requirement"]]
            col = REQ_COLOR[a["requirement"]]
            warn = ('<div class="warn">⚠ %s</div>' % esc(a["warn"])) if a.get("warn") else ""
            # delay は全アニメ共通で指定できるので、必ず出す
            keys = list((a.get("options") or {}).keys())
            if "delay" not in keys:
                keys.append("delay")
            opts = '<div class="opts">調整できる項目: %s</div>' % esc(", ".join(keys))

            # 「もう一度」は、一度きり再生されるアニメだけに出す。
            # スクロール連動・常時ループ・ホバー反応には不要（押しても意味がない）。
            if a["id"] in REPLAYABLE:
                action = '<button class="replay" data-replay="%s">▶ もう一度</button>' % esc(a["id"])
            else:
                action = '<span class="hint">%s</span>' % esc(HINT.get(a["id"], ""))

            cards_html += """<article class="card" data-id="%s">
  <div class="stage" id="stage-%s">%s</div>
  <div class="meta">
    <div class="row">
      <code class="name">%s</code>
      <button class="copy" data-copy="%s">名前をコピー</button>
      %s
      <span class="req" style="background:%s">%s</span>
    </div>
    <div class="label">%s</div>
    <div class="desc">%s</div>
    %s%s
  </div>
</article>
""" % (esc(a["id"]), esc(a["id"]), a["demo"], esc(a["id"]), esc(a["id"]), action,
            col, esc(r["label"]), esc(a["label"]), esc(a["desc"]), opts, warn)
        cards_html += "</div>\n"

    legend = "".join(
        '<span class="lg"><i style="background:%s"></i>%s — %s</span>' % (
            REQ_COLOR[k], esc(v["label"]), esc(v["note"]))
        for k, v in reqs.items()
    )

    # 見本帳では core + 全プリセットを束ねる。
    # スニペット側は同じファイルから必要な分だけを切り出すので、動きは必ず一致する。
    engine = (open(os.path.join(ROOT, "engine", "core.js"), encoding="utf-8").read()
              + "\n"
              + open(os.path.join(ROOT, "engine", "presets.js"), encoding="utf-8").read())
    data = json.dumps(anims, ensure_ascii=False)

    tpl = """<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GSAP アニメーション見本帳 — WordPress用</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;
background:#0f1115;color:#e8eaed;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
/* 画面幅に応じて2〜3列。狭ければ自動で1列になる。 */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;margin-top:16px}
header{padding:72px 20px 40px;max-width:1240px;margin:0 auto}
header h1{font-size:30px;font-weight:900;letter-spacing:-.5px}
header .sub{color:#8b93a1;margin-top:10px;font-size:15px}
.how{background:#151922;border:1px solid #232833;border-radius:14px;padding:20px 22px;
margin-top:26px;max-width:560px}
.how h3{font-size:13px;color:#7fd1ae;margin-bottom:10px;letter-spacing:.5px}
.how ol{margin-left:18px;font-size:14px;color:#c3c8d2}
.how li{margin-bottom:4px}
.how .ex{background:#0f1115;border-radius:8px;padding:12px 14px;margin-top:12px;
font-size:13px;color:#9db8ff;font-family:monospace;line-height:1.7}
.how .tip{font-size:12.5px;color:#6b7280;margin-top:10px}
.how code{background:#0f1115;color:#7fd1ae;padding:1px 6px;border-radius:5px;
font-size:12.5px;font-family:monospace}
.legend{display:flex;flex-direction:column;gap:6px;margin-top:22px;font-size:12.5px;color:#8b93a1}
.lg i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:7px}
.gtitle{font-size:19px;font-weight:800;margin:56px 0 4px;padding-left:12px;border-left:4px solid #5b8def}
.gnote{display:block;font-size:12.5px;color:#6b7280;font-weight:400;margin-top:3px}
.card{background:#141821;border:1px solid #232833;border-radius:16px;overflow:hidden;
display:flex;flex-direction:column}
.stage{padding:44px 24px;min-height:200px;display:flex;align-items:center;justify-content:center;
background:radial-gradient(circle at 50% 0%,#1a1f2b,#12151d);overflow:hidden}
.meta{padding:16px 20px 20px;border-top:1px solid #232833;flex:1}
.row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:8px}
.name{background:#0f1115;color:#7fd1ae;padding:5px 12px;border-radius:7px;font-size:14px;
font-weight:700;font-family:monospace;border:1px solid #26332c}
.copy,.replay{background:#1e222b;color:#c3c8d2;border:1px solid #2b3240;border-radius:7px;
padding:5px 11px;font-size:12px;cursor:pointer;font-family:inherit}
.copy:hover,.replay:hover{background:#262b36;color:#fff}
.copy.done{background:#15301f;color:#5bd99a;border-color:#1f5136}
.hint{font-size:12px;color:#6b7280}
.req{margin-left:auto;color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:6px}
.label{font-weight:700;font-size:15px}
.desc{font-size:13.5px;color:#8b93a1;margin-top:2px}
.opts{font-size:12px;color:#5b6472;margin-top:7px;font-family:monospace}
.warn{font-size:12.5px;color:#f5a623;margin-top:8px;background:#2a2114;
border-radius:7px;padding:7px 11px}
footer{text-align:center;color:#6b7280;font-size:12.5px;padding:80px 20px 60px;line-height:2}
/* --- デモ要素 --- */
.dbox{background:linear-gradient(135deg,#5b8def,#8b5bef);color:#fff;font-weight:800;font-size:17px;
padding:38px 26px;border-radius:14px;text-align:center;width:100%}
.dtitle{font-size:22px;font-weight:900;text-align:center;line-height:1.6}
.dmono{font-family:monospace}
.dnum{font-size:60px;font-weight:900;color:#7fd1ae;font-variant-numeric:tabular-nums}
.dsquare{width:110px;height:110px;border-radius:10px;
background:linear-gradient(135deg,#5b8def,#8b5bef);color:#fff;
font-size:14px;font-weight:900;letter-spacing:2px;
display:flex;align-items:center;justify-content:center}
.drow{display:flex;gap:12px;width:100%}
.dcard{flex:1;background:#1b2029;border:1px solid #2b3240;border-radius:11px;padding:30px 0;
text-align:center;font-size:19px;font-weight:800;color:#9db8ff}
.dgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:260px}
.dcell{aspect-ratio:1;background:#5b8def;border-radius:9px;opacity:.85}
.dmarquee{display:flex;gap:16px;width:100%}
.dlogo{background:#1b2029;border:1px solid #2b3240;border-radius:10px;padding:20px 30px;
font-weight:800;color:#8b93a1;white-space:nowrap}
.dbtn{background:#7fd1ae;color:#0f1115;font-weight:800;padding:16px 38px;border-radius:99px;font-size:16px}
.dhover{cursor:pointer}
.dmark{padding:0 2px}
.dlink{font-size:19px;font-weight:700;color:#9db8ff;cursor:pointer;display:inline-block}
.dbadge{background:#ef5b9c;color:#fff;font-weight:900;font-size:15px;letter-spacing:2px;
padding:16px 24px;border-radius:12px}
/* 回転が見えるよう、円ではなく角のある形にする */
.dspin{width:120px;height:120px;border-radius:14px;
background:linear-gradient(135deg,#7fd1ae,#5b8def);color:#0f1115;
font-weight:900;font-size:13px;letter-spacing:1px;
display:flex;align-items:center;justify-content:center}
.dframe{width:100%;border-radius:14px;overflow:hidden}
/* 単色だと拡大・移動が知覚できないので、目印になる模様を入れる */
.dimg{width:100%;height:180px;
background-image:
 radial-gradient(circle at 22% 30%,rgba(255,255,255,.55) 0 9px,transparent 10px),
 radial-gradient(circle at 74% 66%,rgba(255,255,255,.35) 0 16px,transparent 17px),
 radial-gradient(circle at 50% 88%,rgba(0,0,0,.28) 0 22px,transparent 23px),
 repeating-linear-gradient(45deg,rgba(255,255,255,.10) 0 12px,transparent 12px 24px),
 linear-gradient(135deg,#5b8def,#8b5bef 60%,#7fd1ae);
display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.9);
font-weight:900;letter-spacing:3px;font-size:15px;
text-shadow:0 2px 10px rgba(0,0,0,.4)}
.dcolor{width:100%;padding:44px 24px;border-radius:14px;text-align:center;font-weight:800;
font-size:17px;background:#1b2029;border:1px solid #2b3240}
</style></head><body>

<header>
  <h1>GSAP アニメーション見本帳</h1>
  <div class="sub">WordPressの好きな場所に入れられる、__COUNT__種類の動き。<br>
  CSSの知識は要りません。動きの名前と、動かしたい場所を言葉で伝えるだけです。</div>

  <div class="how">
    <h3>使い方</h3>
    <ol>
      <li>気に入った動きの<strong>名前をコピー</strong>する（例 <code>split-lines</code>）</li>
      <li>AIに <strong>①動きの名前 ②ページ ③動かしたい場所</strong> の3つを伝える</li>
      <li>場所は<strong>見えている文章で指してOK</strong>。CSSセレクタは不要です</li>
      <li>速さや強さは、<strong>最後に言葉で足すだけ</strong>（省略可）</li>
    </ol>
    <div class="ex">/wp-gsap-animate split-lines /about<br>
    「私たちについて」の見出し、少しゆっくりめで</div>
    <div class="tip">「少しゆっくりめで」「サッと」「大げさに」「控えめに」などが伝わります。
    省略すれば、ちょうどいい既定値で入ります。</div>
  </div>

  <div class="legend">__LEGEND__</div>
</header>

<div class="wrap">
__CARDS__
</div>

<footer>
  各アニメーションは、実際にWordPressへ入るコードと同じもので動いています。<br>
  GSAP は2025年に全機能が無料化されました（商用利用可）。
</footer>

<script src="__CDN__gsap.min.js"></script>
<script src="__CDN__ScrollTrigger.min.js"></script>
<script>
__ENGINE__
</script>
<script>
(function(){
  var DEFS = __DATA__;
  var map = {};
  DEFS.forEach(function(d){ map[d.id] = d; });

  // 各デモを「その場で再生」する。スクロール連動系はScrollTriggerのまま動かす。
  var SCROLL_TYPES = ['parallax','scroll-scale','scroll-rotate','section-color','text-fill','marquee','ken-burns','float','pulse','spin',
                      'hover-lift','hover-tilt','magnetic','hover-zoom','link-underline'];

  function stageOf(id){ return document.getElementById('stage-' + id); }

  function play(id, immediate){
    var d = map[id]; if(!d) return;
    var stage = stageOf(id); if(!stage) return;
    var el = stage.querySelector(d.target);
    if(!el) return;
    WPGSAP.apply(makeAnim(d, immediate), el);
  }

  // 見本帳では、動き出す前の状態が一瞬見えるように少し遅らせる。
  // （本番の既定は delay:0。ユーザーが「少し遅れて」と言えば設定できる）
  var DEMO_DELAY = 0.4;

  function makeAnim(d, immediate){
    var opts = Object.assign({}, d.options || {});
    if (opts.delay === undefined) opts.delay = DEMO_DELAY;
    if (immediate) opts.immediate = true;
    return { type: d.id, selector: d.target, options: opts };
  }

  // 初期化: 一度だけ全デモを適用（スクロール連動はScrollTriggerに任せる）
  DEFS.forEach(function(d){
    var stage = stageOf(d.id); if(!stage) return;
    var el = stage.querySelector(d.target); if(!el) return;
    WPGSAP.apply(makeAnim(d, false), el);
  });

  // もう一度ボタン: デモを初期状態に戻して即再生
  document.querySelectorAll('.replay').forEach(function(b){
    b.addEventListener('click', function(){
      var id = b.dataset.replay;
      var d = map[id];
      var stage = stageOf(id);
      if(!d || !stage) return;
      // ステージを作り直して、GSAPが付けたスタイルを完全に消す
      stage.innerHTML = d.demo;
      var el = stage.querySelector(d.target);
      if(!el) return;
      if(SCROLL_TYPES.indexOf(d.id) >= 0){
        play(id, false);
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      } else {
        play(id, true);
      }
    });
  });

  // 名前をコピー
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click', function(){
      var t = b.dataset.copy;
      navigator.clipboard.writeText(t).then(function(){
        var old = b.textContent;
        b.textContent = '✓ コピーしました';
        b.classList.add('done');
        setTimeout(function(){ b.textContent = old; b.classList.remove('done'); }, 1400);
      });
    });
  });
})();
</script>
</body></html>"""

    return (tpl
            .replace("__COUNT__", str(len(anims)))
            .replace("__LEGEND__", legend)
            .replace("__CARDS__", cards_html)
            .replace("__CDN__", CDN)
            .replace("__ENGINE__", engine)
            .replace("__DATA__", data))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--out", default="gallery.html")
    ap.add_argument("--defs", default=os.path.join(ROOT, "animations.json"))
    args = ap.parse_args()

    with open(args.defs, encoding="utf-8") as f:
        defs = json.load(f)

    out = build(defs)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(out)
    print("見本帳を生成: %s（%d種 / %.0f KB）" % (
        args.out, len(defs["animations"]), len(out.encode("utf-8")) / 1024))


if __name__ == "__main__":
    main()
