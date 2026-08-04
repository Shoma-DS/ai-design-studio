#!/usr/bin/env python3
"""LP用に生成した写真を、LP埋め込み用ループ動画の16:9フレームへ組み直す。

なぜ必要か:
LP用の写真は横長(16:9)と縦長(3:4など)が混在している。縦長素材をそのまま
16:9に合わせると上下が大きく切れ、ビフォーアフターの全身が失われる。
そこで素材ごとに処理を変えて、あらかじめ構図を組み直したフレームを書き出す。

出力サイズは 2400x1350（1920x1080 の125%）。
Premiere側では スケール80% で ちょうど画面いっぱいになり、
80→85% のケンバーンズを掛けても常に等倍以下＝拡大による劣化が出ない。

テロップは左側にスクリム＋左揃えで入るため、人物は右寄りに配置する。

実行: python3 portfolio/clarive-womens-personal-gym-lp/scripts/prepare_ad_frames.py
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "lp" / "images"
OUT = ROOT / "ad" / "assets" / "frames"
OUT.mkdir(parents=True, exist_ok=True)

TW, TH = 2400, 1350
GOLD = (192, 138, 62)


def cover(im, w, h, anchor_y=0.5, anchor_x=0.5):
    """縦横比を保ったまま w x h を覆うよう拡大し、指定位置に寄せて切り出す。"""
    s = max(w / im.width, h / im.height)
    nw, nh = round(im.width * s), round(im.height * s)
    im = im.resize((nw, nh), Image.LANCZOS)
    left = round((nw - w) * anchor_x)
    top = round((nh - h) * anchor_y)
    return im.crop((left, top, left + w, top + h))


def blurred_bg(im):
    bg = cover(im, TW, TH, 0.5).filter(ImageFilter.GaussianBlur(70))
    bg = ImageEnhance.Brightness(bg).enhance(0.52)
    return ImageEnhance.Color(bg).enhance(0.7)


def make_cover(src, dst, anchor_y=0.5, anchor_x=0.5):
    """横長素材・および多少切れても成立する素材はそのまま cover で埋める。"""
    im = Image.open(SRC / src).convert("RGB")
    cover(im, TW, TH, anchor_y, anchor_x).save(OUT / dst, quality=95)
    return f"{dst}  (cover {im.width}x{im.height})"


def make_figure_right(src, dst, center_x=0.66):
    """全身を切らずに見せる必要がある縦長素材（ビフォーアフター）用。

    ぼかした同じ写真を背景に敷き、その上に全高の写真を右寄りで配置する。
    左側はテロップのスクリムが乗るので、そこに人物を置かない。
    """
    im = Image.open(SRC / src).convert("RGB")
    bg = blurred_bg(im)

    fw = round(im.width * (TH / im.height))     # 全高に合わせる＝全身が切れない
    fg = im.resize((fw, TH), Image.LANCZOS)
    left = round(TW * center_x - fw / 2)
    bg.paste(fg, (left, 0))

    # 写真の左右の境目を細いゴールドの罫でとめる（ぼかしの溶け際を作らない）
    d = ImageDraw.Draw(bg)
    d.rectangle([left - 3, 0, left - 1, TH], fill=GOLD)
    d.rectangle([left + fw + 1, 0, left + fw + 3, TH], fill=GOLD)

    bg.save(OUT / dst, quality=95)
    return f"{dst}  (figure-right {im.width}x{im.height}, x={left}..{left+fw})"


# (元ファイル, 出力名, 処理)
PLAN = [
    # 鏡の前の女性: 顔と手元を残すため上寄り、人物が右に来るよう左寄せで切る
    ("02-problem.png", "f01-problem.png", lambda s, d: make_cover(s, d, anchor_y=0.30, anchor_x=0.62)),
    # 個室の内観: 元が16:9なのでほぼ切れない
    ("06-studio-room.png", "f02-studio.png", lambda s, d: make_cover(s, d, anchor_y=0.50)),
    # 女性トレーナー: バストアップ。顔を残しつつ右寄せ配置
    ("03-trainer-a.png", "f03-trainer.png", lambda s, d: make_cover(s, d, anchor_y=0.24, anchor_x=0.66)),
    # ビフォーアフター: 全身を切らない
    ("13-before-a.png", "f04-before-a.png", lambda s, d: make_figure_right(s, d)),
    ("14-after-a.png", "f05-after-a.png", lambda s, d: make_figure_right(s, d)),
]


if __name__ == "__main__":
    print(f"frames (2400x1350) -> {OUT}")
    made, missing = 0, []
    for src, dst, fn in PLAN:
        if (SRC / src).exists():
            print("  " + fn(src, dst))
            made += 1
        else:
            missing.append(src)
    print(f"done: {made} frames")
    if missing:
        print("MISSING (まだ生成されていない): " + ", ".join(missing))
