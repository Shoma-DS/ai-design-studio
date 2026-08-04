#!/usr/bin/env python3
"""CLARIVE LP埋め込み用ループ動画（16:9・8秒・無音）のテロップPNGを生成する。

1920x1080 の透過PNGとして、スクリム（左からの暗いグラデーション）と文字を
焼き込んだフルフレーム画像を書き出す。
Premiere側では該当トラックに置くだけで位置が決まる（座標調整不要）。

横型では全幅の黒帯は重く見えるため、左からのグラデーションスクリム＋
左揃えテキストで構成する。16:9の横幅を情報配置に使い、
写真の主役（右寄りに配置した人物）を隠さない。

実行: python3 portfolio/clarive-womens-personal-gym-lp/scripts/render_telops.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
OUT = Path(__file__).resolve().parent.parent / "ad" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

MINCHO = "/System/Library/Fonts/ヒラギノ明朝 ProN.ttc"
GOTHIC_W3 = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
GOTHIC_W6 = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"

WHITE = (255, 255, 255, 255)
INK = (27, 24, 24)          # #1B1818
GOLD = (192, 138, 62)       # #C08A3E

MARGIN_X = 132              # 左の基準線


def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)


def new_canvas():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def scrim(img, strength=0.88, reach=0.76):
    """左から右へ薄れる暗いグラデーション。全幅のベタ帯より軽く、横型に合う。

    背景写真が明るいウォームトーンのため、弱いスクリムでは白文字が沈む。
    左端はしっかり暗くし、写真の主役がいる右側へ滑らかに抜けるようにする。
    """
    grad = Image.new("L", (W, 1))
    px = grad.load()
    end = W * reach
    for x in range(W):
        t = min(x / end, 1.0) if end else 1.0
        # 左を広く濃く保ち、右端へ向けて滑らかに0へ
        px[x, 0] = int(255 * strength * (1 - t) ** 1.25)
    mask = grad.resize((W, H))
    layer = Image.new("RGBA", (W, H), (*INK, 255))
    layer.putalpha(mask)
    img.alpha_composite(layer)


def draw_left(d, y, line, f, fill=WHITE, x=MARGIN_X):
    """左揃えで1行置く。yは文字の上端（インクの上端）。

    スクリムに加えて薄い影を落とし、背景が明るい個体でも白文字が沈まないようにする。
    """
    box = d.textbbox((0, 0), line, font=f)
    px, py = x - box[0], y - box[1]
    d.text((px + 2, py + 3), line, font=f, fill=(*INK, 150))
    d.text((px, py), line, font=f, fill=fill)
    return box[3] - box[1]


def rule(d, y, width=96, color=GOLD, thickness=3, x=MARGIN_X):
    """見出しの上に置く細いゴールドの罫。円形チップやグロー装飾は使わない。"""
    d.rectangle([x, y, x + width, y + thickness - 1], fill=(*color, 255))


def save(img, name):
    img.save(OUT / name)
    print(f"  {name}")
    return OUT / name


# ── ① フック（0.0–2.0s） ────────────────────────────
def t01_hook():
    img = new_canvas()
    scrim(img, strength=0.90, reach=0.78)
    d = ImageDraw.Draw(img)
    rule(d, 452)
    draw_left(d, 508, "今年こそ痩せたい。", font(MINCHO, 96, index=1))
    return save(img, "t01-hook.png")


# ── ② ジム紹介（2.0–4.5s） ──────────────────────────
def gym_telop(main, sub, name):
    img = new_canvas()
    scrim(img, strength=0.86, reach=0.72)
    d = ImageDraw.Draw(img)
    rule(d, 470)
    draw_left(d, 526, main, font(GOTHIC_W6, 64))
    draw_left(d, 626, sub, font(GOTHIC_W3, 34), fill=(236, 230, 228, 255))
    return save(img, name)


# ── ③ ビフォーアフター（4.5–7.0s） ──────────────────
def t04_result():
    """「2ヶ月で、平均 −7kg」＋ 注記。−7kg のみゴールド。"""
    img = new_canvas()
    scrim(img, strength=0.90, reach=0.70)
    d = ImageDraw.Draw(img)

    rule(d, 386)
    f_main = font(MINCHO, 62, index=1)
    f_num = font(MINCHO, 132, index=1)
    draw_left(d, 442, "2ヶ月で、平均", f_main)

    b = d.textbbox((0, 0), "−7kg", font=f_num)
    d.text((MARGIN_X - b[0], 540 - b[1]), "−7kg", font=f_num, fill=(*GOLD, 255))

    # 注記（③の2カットを通して出しっぱなしにする）
    note = "※2ヶ月コース完了者の平均値です。効果には個人差があります。"
    draw_left(d, H - 92, note, font(GOTHIC_W3, 26), fill=(228, 222, 220, 255))
    return save(img, "t04-result.png")


def ba_label(word, name):
    """BEFORE / AFTER の小ラベル。写真側（右寄り）の下に置く。"""
    img = new_canvas()
    d = ImageDraw.Draw(img)
    f = font(GOTHIC_W6, 30)
    b = d.textbbox((0, 0), word, font=f)
    tw, th = b[2] - b[0], b[3] - b[1]
    pad_x, pad_y = 26, 15
    x, y = 1210, H - 150
    d.rectangle([x, y, x + tw + pad_x * 2, y + th + pad_y * 2], fill=(*INK, int(255 * 0.74)))
    d.text((x + pad_x - b[0], y + pad_y - b[1]), word, font=f, fill=WHITE)
    return save(img, name)


# ── ④ アウトロ（7.0–8.0s） ──────────────────────────
def t07_outro():
    img = new_canvas()
    scrim(img, strength=0.86, reach=0.72)
    d = ImageDraw.Draw(img)
    rule(d, 456)
    draw_left(d, 512, "渋谷｜女性専用パーソナルジム", font(GOTHIC_W3, 38), fill=(236, 230, 228, 255))
    draw_left(d, 576, "CLARIVE", font(MINCHO, 84, index=1))
    return save(img, "t07-outro.png")


if __name__ == "__main__":
    print("rendering telops (1920x1080) ->", OUT)
    t01_hook()
    gym_telop("完全個室・食事指導つき", "誰にも見られずに、食べながら整える。", "t02-gym-1.png")
    gym_telop("トレーナーは全員、女性", "体の変化も気分の波も、分かる人が担当します。", "t03-gym-2.png")
    t04_result()
    ba_label("BEFORE", "t05-label-before.png")
    ba_label("AFTER", "t06-label-after.png")
    t07_outro()
    print("done.")
