import sys
import os
sys.path.insert(0, "/Users/yamamotorina/Documents/ai-design-studio/node_modules")
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(PROJECT_ROOT, "references", "source-full.png")
OUT_DIR = os.path.join(PROJECT_ROOT, "references")

sections = [
    ("01-hero", 0, 262),
    ("02-welcome-coupon", 262, 56),
    ("03-corugi-intro", 318, 140),
    ("04-corugi-what-is", 458, 122),
    ("05-recommend-effect", 580, 159),
    ("06-cta-reserve", 739, 47),
    ("07-campaign-badge", 786, 84),
    ("08-price-detail", 870, 169),
    ("09-merit-icons", 1039, 122),
    ("10-coupon-cta", 1161, 66),
    ("11-skincare-intro", 1227, 140),
    ("12-skincare-steps", 1367, 187),
    ("13-uv-warning", 1554, 94),
    ("14-skincare-message", 1648, 75),
    ("15-product-sunscreen", 1650, 140),
    ("16-product-mask", 1790, 170),
    ("17-corugi-effect-list", 1960, 150),
    ("18-concern-check", 2110, 210),
    ("19-final-cta-footer", 2320, 68),
]

im = Image.open(SRC).convert("RGB")
w, h = im.size
print(f"source size: {w}x{h}")

for sid, y, sh in sections:
    box = (0, y, w, min(y + sh, h))
    crop = im.crop(box)
    out_path = os.path.join(OUT_DIR, f"{sid}.png")
    crop.save(out_path)
    print(f"{sid}: y={y} h={sh} -> {crop.size}")
