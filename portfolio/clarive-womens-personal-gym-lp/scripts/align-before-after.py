#!/usr/bin/env python3
"""ビフォーアフター比較スライダー用に、2枚の写真の人物位置を揃える。

問題:
    AI生成の before / after は、同じ参照画像を渡しても人物の大きさ・立ち位置が
    毎回わずかにずれる。そのまま縦に切り替えるスライダーに乗せると、
    ブラの位置や腰の高さが合わず「加工に失敗した写真」に見えてしまう。

やること:
    1. 背景（無地の壁）との差分で人物を切り出し、バウンディングボックスを求める
    2. after を「頭頂〜足元の高さ」と「左右中心」が before と一致するよう拡大縮小＋平行移動
    3. 2枚を同じ矩形で切り抜き、体が画面いっぱいに入る構図にする

これで、バーを左右に動かしたときに体のラインだけが変わって見える。

実行: python3 scripts/align-before-after.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

PROJECT = Path(__file__).resolve().parent.parent
SRC = PROJECT / "references/original-png"
OUT = PROJECT / "lp/images"

PAIRS = [
    ("13-before-a", "14-after-a", "ba-a-before", "ba-a-after"),
    ("15-before-b", "16-after-b", "ba-b-before", "ba-b-after"),
]

# 出力する比較用フレーム（縦長）。体が主役になる比率にする
OUT_W, OUT_H = 760, 1040


def person_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    """背景との差分から人物のバウンディングボックスを求める。

    背景は上が壁・下が床で色が変わるため、画像全体で1色とみなすと検出が破綻する。
    人物は中央にいるので、**行ごとに左右端の色を背景とみなして**差分を取る。
    """
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    h, w, _ = a.shape

    # 被写体は暗いトレーニングウェアと髪。背景（明るい壁・床）と輝度で分離する。
    # 背景色との差分方式は、壁と床で色が変わる／植物やベンチが入る構図で破綻したため使わない。
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    mask = lum < 100

    # 縦方向は画面全幅で判定してよい（人物以外に横一列を占める暗い物体はない）
    rows = mask.sum(axis=1)
    row_hit = np.where(rows > w * 0.03)[0]

    # 横方向は、背景の鏡枠・ダンベルラック等の暗い什器を拾わないよう中央60%に絞る
    x0, x1 = int(w * 0.20), int(w * 0.80)
    cols = mask[:, x0:x1].sum(axis=0)
    col_hit = np.where(cols > h * 0.03)[0]

    if row_hit.size == 0 or col_hit.size == 0:
        return 0, 0, w, h
    return (
        int(col_hit[0]) + x0,
        int(row_hit[0]),
        int(col_hit[-1]) + 1 + x0,
        int(row_hit[-1]) + 1,
    )


def align(before_path: Path, after_path: Path) -> tuple[Image.Image, Image.Image]:
    before = Image.open(before_path).convert("RGB")
    after = Image.open(after_path).convert("RGB")

    bx0, by0, bx1, by1 = person_bbox(before)
    ax0, ay0, ax1, ay1 = person_bbox(after)
    b_h, a_h = by1 - by0, ay1 - ay0
    print(f"  before bbox={bx0},{by0},{bx1},{by1} (h={b_h})")
    print(f"  after  bbox={ax0},{ay0},{ax1},{ay1} (h={a_h})")

    # after を before と同じ「背の高さ」に合わせる
    scale = b_h / a_h
    new_size = (round(after.width * scale), round(after.height * scale))
    after_s = after.resize(new_size, Image.LANCZOS)

    # 拡大縮小後の after の bbox 中心・足元が before と一致するよう平行移動
    a_cx = (ax0 + ax1) / 2 * scale
    a_bottom = ay1 * scale
    b_cx = (bx0 + bx1) / 2
    b_bottom = by1
    dx = round(b_cx - a_cx)
    dy = round(b_bottom - a_bottom)
    print(f"  align: scale={scale:.4f} dx={dx} dy={dy}")

    # before と同じ画布に after を配置（はみ出す部分は背景色で埋める）
    a_arr = np.asarray(after_s, dtype=np.uint8)
    k = max(8, min(a_arr.shape[:2]) // 40)
    bg = tuple(int(v) for v in np.concatenate([
        a_arr[:k, :k].reshape(-1, 3), a_arr[:k, -k:].reshape(-1, 3),
    ]).mean(axis=0))
    canvas = Image.new("RGB", before.size, bg)
    canvas.paste(after_s, (dx, dy))
    return before, canvas


# 切り抜き範囲を「頭の幅」の何倍で取るか。
# person_bbox は暗い服の範囲しか拾えず、A（膝上の短パン）とB（足首までのレギンス）で
# 検出される「人物の高さ」が別物になる。その値で切り抜くと2枚の被写体スケールが
# 揃わないため、服装に左右されない頭部を基準にする。
CROP_H_PER_HEAD = 4.62  # 頭頂〜腿の中ほどが入る高さ
CROP_TOP_MARGIN_PER_HEAD = 0.17  # 頭上に残す余白


def head_metrics(img: Image.Image) -> tuple[int, int, float]:
    """頭頂の y 座標・頭の幅・頭の水平中心を返す。

    髪は暗く、左右の什器やドア枠を避けるため中央40%だけを見る。
    頭の幅は被写体スケールの代理指標として使う（服装の影響を受けない）。
    """
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    h, w, _ = a.shape
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    x0, x1 = int(w * 0.30), int(w * 0.70)
    mask = (lum < 100)[:, x0:x1]

    rows = mask.sum(axis=1)
    hit = np.where(rows > 4)[0]
    if hit.size == 0:
        return 0, int(w * 0.16), w / 2
    y_head = int(hit[0])

    band = mask[y_head : y_head + int(h * 0.12)]
    widths = []
    for row in band:
        idx = np.where(row)[0]
        widths.append(int(idx[-1] - idx[0] + 1) if idx.size else 0)
    w_head = max(widths) if widths else int(w * 0.16)

    idx = np.where(band[len(band) // 3])[0]
    cx = (idx[0] + idx[-1]) / 2 + x0 if idx.size else w / 2
    return y_head, w_head, float(cx)


def crop_pair(before: Image.Image, after: Image.Image) -> tuple[Image.Image, Image.Image]:
    """体が主役になる縦長の同一矩形で2枚を切り抜く。

    頭の大きさを基準にするので、全身が写っている素材と膝上までの素材が混ざっても
    仕上がりの被写体スケールが揃う。
    """
    y_head, w_head, cx = head_metrics(before)
    print(f"  head: y={y_head} w={w_head} cx={cx:.0f}")

    height = w_head * CROP_H_PER_HEAD
    top = y_head - w_head * CROP_TOP_MARGIN_PER_HEAD
    width = height * (OUT_W / OUT_H)

    # 画像からはみ出さないよう収める
    top = max(0, min(before.height - height, top))
    left = max(0, min(before.width - width, cx - width / 2))

    box = (round(left), round(top), round(left + width), round(top + height))
    print(f"  crop: {box}")
    return (
        before.crop(box).resize((OUT_W, OUT_H), Image.LANCZOS),
        after.crop(box).resize((OUT_W, OUT_H), Image.LANCZOS),
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for before_name, after_name, out_before, out_after in PAIRS:
        print(f"{before_name} / {after_name}")
        before, after = align(SRC / f"{before_name}.png", SRC / f"{after_name}.png")
        b_crop, a_crop = crop_pair(before, after)
        b_crop.save(OUT / f"{out_before}.jpg", quality=86, optimize=True)
        a_crop.save(OUT / f"{out_after}.jpg", quality=86, optimize=True)
        print(f"  -> {out_before}.jpg / {out_after}.jpg  ({OUT_W}x{OUT_H})")


if __name__ == "__main__":
    main()
