#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_snippet.py - FluentSnippets などに貼るスニペットを生成する。

  python3 scripts/build_snippet.py --config my.json --out-dir snippets/

出力:
  snippets/00-gsap-core.php          … GSAP読み込み＋共通土台（1回だけ入れる）
  snippets/01-<slug>.php             … アニメーション1つにつき1ファイル
  snippets/README.txt                … 登録手順

要素ごとに独立したスニペットになるので、
「この見出しの動きだけ消したい」= そのスニペットを無効化するだけ、で済む。

config の形:
{
  "animations": [
    { "name": "トップの見出し", "selector": ".wp-block-heading",
      "type": "text-mask", "options": {"duration": 1.1} }
  ]
}
name は省略可（省略時は type から自動生成）。
"""
import os, re, json, argparse, unicodedata

HERE = os.path.dirname(os.path.abspath(HERE_F := __file__))
ROOT = os.path.dirname(HERE)
GSAP_VER = "3.12.5"

# 初期状態で隠しておくべきタイプ（FOUC対策）
HIDE_TYPES = {
    "fade-up", "fade-in", "slide-in", "scale-in", "blur-in", "flip-in", "box-reveal",
    "split-chars", "split-lines", "typewriter", "text-mask",
    "stagger", "grid-cascade", "image-reveal",
}
# text-fill / hover-zoom / link-underline / float / pulse は
# 最初から要素が見えていてよいので、隠さない。


def defs():
    with open(os.path.join(ROOT, "animations.json"), encoding="utf-8") as f:
        return json.load(f)


def core_js():
    with open(os.path.join(ROOT, "engine", "core.js"), encoding="utf-8") as f:
        return f.read()


def core_version():
    """core.js の VERSION を唯一の正とする。"""
    m = re.search(r'var VERSION = "([\d.]+)"', core_js())
    if not m:
        raise SystemExit("エラー: core.js に VERSION が見つかりません")
    return m.group(1)


def preset_js(pid):
    """presets.js から @preset マーカーで1つ分だけ切り出す。"""
    with open(os.path.join(ROOT, "engine", "presets.js"), encoding="utf-8") as f:
        src = f.read()
    m = re.search(
        r"/\*\s*@preset\s+" + re.escape(pid) + r"\s*\*/(.*?)/\*\s*@endpreset\s*\*/",
        src, re.S)
    if not m:
        raise SystemExit("エラー: プリセット '%s' が presets.js に見つかりません" % pid)
    # 先頭のインデントを1段落とす
    body = m.group(1).strip("\n")
    lines = [l[2:] if l.startswith("  ") else l for l in body.split("\n")]
    return "\n".join(lines).strip()


def slugify(name, fallback):
    """ファイル名は必ずASCIIにする。日本語が混じった名前でも安全な名前になる。"""
    s = unicodedata.normalize("NFKC", name or "").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")   # ASCII以外は全部落とす
    s = re.sub(r"-{2,}", "-", s)
    # 「サービス3カード」のように数字だけ残るケースは意味を成さないので、
    # 英字が1文字も無ければ type 名にフォールバックする。
    if not s or not re.search(r"[a-z]", s):
        return fallback
    return s[:40]


def php_escape_heredoc_guard(js):
    """ヒアドキュメント終端と衝突しないか確認する。"""
    for tag in ("WPGSAP_JS", "WPGSAP_CFG"):
        if re.search(r"(?m)^\s*" + tag + r"(?![A-Za-z0-9_])", js):
            raise SystemExit("エラー: JS内にヒアドキュメント終端 %s と衝突する行があります" % tag)
    return js


def build_core():
    js = php_escape_heredoc_guard(core_js())
    return """<?php
/**
 * GSAP Core — 共通の土台
 *
 * wpgsap-core-version: %s
 *   ↑ この行でバージョンを判定する。消さないこと。
 *   サイトに入っているCoreがこれより古ければ、入れ替えること。
 *
 * このスニペットは1つだけ入れてください。
 * GSAP本体（CDN）と、アニメーションの共通処理を読み込みます。
 * 個別のアニメーションは、それぞれ別のスニペットになっています。
 *
 * これを無効化すると、すべてのアニメーションが止まります。
 */

add_action( 'wp_enqueue_scripts', function () {
	if ( is_admin() ) {
		return;
	}

	$ver = '%s';
	$cdn = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/' . $ver . '/';

	// 他のプラグインが既にGSAPを読み込んでいる場合は二重に読まない
	if ( ! wp_script_is( 'gsap', 'registered' ) ) {
		wp_register_script( 'gsap', $cdn . 'gsap.min.js', array(), $ver, true );
	}
	if ( ! wp_script_is( 'gsap-scrolltrigger', 'registered' ) ) {
		wp_register_script( 'gsap-scrolltrigger', $cdn . 'ScrollTrigger.min.js', array( 'gsap' ), $ver, true );
	}
	wp_enqueue_script( 'gsap' );
	wp_enqueue_script( 'gsap-scrolltrigger' );

	// 共通の土台。各アニメーションのスニペットはこれに依存する。
	wp_register_script( 'wpgsap-core', '', array( 'gsap', 'gsap-scrolltrigger' ), '1.0.0', true );
	wp_enqueue_script( 'wpgsap-core' );

	$core = <<<'WPGSAP_JS'
%s
WPGSAP_JS;

	wp_add_inline_script( 'wpgsap-core', $core, 'after' );
}, 5 );

/**
 * 表示直後のチラつき(FOUC)対策。
 * 各アニメーションのスニペットが「隠すCSS」を1枚ずつ出すので、
 * その解除役はここに1つだけ置く。JSが落ちても3秒後に必ず表示が戻る。
 */
add_action( 'wp_head', function () {
	?>
<script id="wpgsap-guard">
document.documentElement.classList.add('wpgsap-js');
setTimeout(function () {
  if (!window.gsap) {
    document.querySelectorAll('style.wpgsap-fouc').forEach(function (s) { s.remove(); });
    document.documentElement.classList.remove('wpgsap-js');
  }
}, 3000);
</script>
	<?php
}, 1 );
""" % (core_version(), GSAP_VER, js)


# どのページで動かすか。config の "scope" で指定する。
SCOPES = {
    "all":    (None, "サイト全体"),
    "front":  ("is_front_page()", "トップページのみ"),
    "home":   ("is_home()", "投稿一覧ページのみ"),
    "single": ("is_single()", "個別投稿のみ"),
    "page":   ("is_page()", "固定ページのみ"),
}


def scope_cond(anim):
    """scope からPHPの条件式と説明を返す。page:12 のようなID指定にも対応。"""
    s = (anim.get("scope") or "all").strip()
    if s.startswith("page:"):
        ids = s.split(":", 1)[1]
        return "is_page(%s)" % ids, "固定ページ %s のみ" % ids
    if s.startswith("post:"):
        ids = s.split(":", 1)[1]
        return "is_single(%s)" % ids, "投稿 %s のみ" % ids
    if s not in SCOPES:
        raise SystemExit(
            "エラー: 不明な scope '%s'。使えるのは: %s, page:<ID>, post:<ID>"
            % (s, ", ".join(SCOPES)))
    return SCOPES[s]


def build_one(anim, index):
    d = defs()
    known = {a["id"]: a for a in d["animations"]}
    t = anim.get("type")
    if t not in known:
        raise SystemExit("エラー: 未知のtype '%s'（見本帳に無い名前です）" % t)

    meta = known[t]
    sel = anim["selector"]
    name = anim.get("name") or meta["label"]
    cond, scope_label = scope_cond(anim)
    js = php_escape_heredoc_guard(preset_js(t))

    cfg = {"selector": sel, "type": t}
    if anim.get("children"):
        cfg["children"] = anim["children"]
    if anim.get("options"):
        cfg["options"] = anim["options"]
    cfg_json = json.dumps(cfg, ensure_ascii=False)

    # ページ限定の条件。scope=all のときは条件を付けない。
    page_check = ""
    if cond:
        page_check = "\n\t// %s で動かす\n\tif ( ! %s ) {\n\t\treturn;\n\t}\n" % (scope_label, cond)

    # FOUC対策: この要素だけを最初に隠す。
    # 解除役（class="wpgsap-fouc" を全部外す処理）は Core 側に1つだけある。
    # 隠すのも、アニメを付けるページだけに限定する（そうしないと
    # 対象外のページで要素が隠れたまま残る）。
    guard = ""
    if t in HIDE_TYPES:
        inner = ""
        if cond:
            inner = "\tif ( ! %s ) {\n\t\treturn;\n\t}\n" % cond
        guard = """
// 表示直後のチラつき防止。この要素だけを最初に隠す。
add_action( 'wp_head', function () {
%s	?>
<style class="wpgsap-fouc">html.wpgsap-js %s{opacity:0}</style>
	<?php
}, 99 );
""" % (inner, sel)

    warn = ""
    if meta.get("warn"):
        warn = " *\n * 注意: %s\n" % meta["warn"]

    return """<?php
/**
 * GSAP: %s
 *
 * wpgsap-preset-version: %s
 *   ↑ プリセットのコードはこのスニペットに焼き込まれている。
 *   スキル側でプリセットを直したら、この版が古いスニペットは作り直すこと。
 *
 * 動き   : %s（%s）
 * 対象   : %s
 * 適用先 : %s
%s *
 * このスニペットを無効化すると、この要素のアニメーションだけが止まります。
 * 「GSAP Core」スニペットが有効になっている必要があります。
 */

add_action( 'wp_enqueue_scripts', function () {
	if ( is_admin() || ! wp_script_is( 'wpgsap-core', 'enqueued' ) ) {
		return;
	}
%s
	$js = <<<'WPGSAP_JS'
(function () {
  var W = window.WPGSAP;
  var P = W.presets, o = W.o, trig = W.trig, base = W.base, children = W.children;

%s

  W.add(%s);
})();
WPGSAP_JS;

	wp_add_inline_script( 'wpgsap-core', $js, 'after' );
}, 10 );
%s""" % (
        name, core_version(), meta["label"], t, sel, scope_label, warn, page_check,
        "\n".join("  " + l if l.strip() else l for l in js.split("\n")),
        cfg_json, guard
    )


def validate(cfg):
    d = defs()
    known = {a["id"]: a for a in d["animations"]}
    warns = []
    for a in cfg.get("animations", []):
        t = a.get("type")
        if t not in known:
            warns.append("未知のtype: %s" % t)
            continue
        req = known[t]["requirement"]
        if req == "multi" and not a.get("children"):
            warns.append("%s: 子要素が2つ以上必要です。children で指定するか、"
                         "対象の直下に複数の子があるか確認してください。" % t)
        if req == "structure":
            warns.append("%s: レイアウトを組み替えます。必ずプレビューで確認してください。" % t)
    return warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--out-dir", required=True)
    args = ap.parse_args()

    with open(args.config, encoding="utf-8") as f:
        cfg = json.load(f)
    if isinstance(cfg, list):
        cfg = {"animations": cfg}

    for w in validate(cfg):
        print("警告: " + w)

    os.makedirs(args.out_dir, exist_ok=True)

    # 前回生成した古いスニペットを必ず消す。
    # 残しておくと、消したはずのアニメーションのスニペットが出力先に残り、
    # それを気づかず登録して「意図しない要素が動く」事故になる。
    removed = 0
    for old in os.listdir(args.out_dir):
        if re.match(r"^\d\d-.*\.php$", old) or old == "README.txt":
            try:
                os.remove(os.path.join(args.out_dir, old))
                removed += 1
            except OSError as e:
                raise SystemExit(
                    "エラー: 古いスニペット %s を削除できません（%s）。\n"
                    "出力先を空にしてから実行してください。" % (old, e))
    if removed:
        print("  （前回の生成物 %d 件を削除しました）" % removed)

    core_path = os.path.join(args.out_dir, "00-gsap-core.php")
    with open(core_path, "w", encoding="utf-8") as f:
        f.write(build_core())
    print("  00-gsap-core.php  … 共通の土台（%.1f KB）" %
          (os.path.getsize(core_path) / 1024))

    listing = []
    for i, anim in enumerate(cfg.get("animations", []), 1):
        slug = slugify(anim.get("name"), anim["type"])
        fn = "%02d-%s.php" % (i, slug)
        p = os.path.join(args.out_dir, fn)
        with open(p, "w", encoding="utf-8") as f:
            f.write(build_one(anim, i))
        title = anim.get("name") or anim["type"]
        listing.append((fn, title, anim["type"], anim["selector"], scope_cond(anim)[1]))
        print("  %-22s … %s（%s / %s / %.1f KB）" %
              (fn, title, anim["type"], scope_cond(anim)[1], os.path.getsize(p) / 1024))

    readme = ["FluentSnippets への登録手順", "=" * 32, "",
              "1. FluentSnippets → New Snippet → 「Functions (PHP)」を選ぶ",
              "2. 下記のファイルの中身をそのまま貼り付ける",
              "3. Run on → Everywhere（サイト全体）にして有効化",
              "",
              "必ず 00-gsap-core.php を最初に登録してください。",
              "これが土台で、他のスニペットはこれに依存します。",
              "", "登録するスニペット:", ""]
    readme.append("  00-gsap-core.php … GSAP Core（共通の土台・1つだけ）")
    for fn, title, t, sel, sc in listing:
        readme.append("  %s … %s / %s / %s / %s" % (fn, title, t, sel, sc))
    readme += ["",
               "動きを止めたいときは、そのスニペットを無効化するだけです。",
               "すべて止めたいときは 00-gsap-core を無効化してください。"]
    with open(os.path.join(args.out_dir, "README.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(readme) + "\n")

    print("\n合計 %d 個のスニペット → %s" % (len(listing) + 1, args.out_dir))


if __name__ == "__main__":
    main()
