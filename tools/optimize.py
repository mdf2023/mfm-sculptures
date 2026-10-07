"""Resize photos for the web.

Usage:  python3 tools/optimize.py images img

For every .jpg in the first folder, writes two WebP files into the second:
  <name>-1600.webp   large version, used in the photo viewer
  <name>-800.webp    smaller version, used in grids

File names are lowercased and cleaned up (spaces become hyphens).
Needs Pillow:  pip install pillow
"""
import os
import re
import sys

from PIL import Image, ImageOps

if len(sys.argv) != 3:
    sys.exit(__doc__)

src_dir, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)


def slug(name):
    base = os.path.splitext(name)[0].lower()
    return re.sub(r"[^a-z0-9]+", "-", base).strip("-")


count = 0
for filename in sorted(os.listdir(src_dir)):
    if not filename.lower().endswith((".jpg", ".jpeg")):
        continue
    # Apply the camera's rotation so portrait photos stay upright.
    image = ImageOps.exif_transpose(Image.open(os.path.join(src_dir, filename))).convert("RGB")
    for label, longest_edge, quality in (("1600", 1600, 80), ("800", 800, 76)):
        resized = image.copy()
        resized.thumbnail((longest_edge, longest_edge), Image.LANCZOS)
        resized.save(os.path.join(out_dir, f"{slug(filename)}-{label}.webp"), "WEBP", quality=quality, method=6)
    count += 1

print(f"Optimized {count} photos into {out_dir}/")
