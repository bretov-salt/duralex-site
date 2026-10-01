"""Build every DuraLex logo file from one vector master.

Run from the repo root:  python3 brand/build.py
Needs: pip install cairosvg fonttools brotli uharfbuzz pillow shapely

The mark is drawn once below (MARK_D and MARK_SLASH, 72 x 72 units, no
background). Everything else, the colour variants, the wordmark lockup,
the PNG/JPG exports and the PWA / favicon icons, is generated from it, so a
change to the mark is made here and nowhere else.
"""
import io
import math
import json
from pathlib import Path

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "brand"
ICONS = ROOT / "icons"

# ---- Master geometry (72 x 72 units, transparent) ----
MARK_D = "M20 12h14a24 24 0 0 1 0 48H20z"
MARK_SLASH = "M9 63L63 9"
SLASH_WIDTH = 7

# ---- Brand colours ----
ACCENT = "#C8FF3D"     # the slash, same on every background
INK_LIGHT_BG = "#132029"   # D and wordmark on light backgrounds (site navy)
INK_DARK_BG = "#F3F1EC"    # D and wordmark on dark backgrounds (site ondark)
BLACK = "#000000"
WHITE = "#FFFFFF"
TILE = "#0A0A0A"           # app-icon / favicon tile only, never part of the logo itself


def mark_paths(ink, accent=ACCENT):
    return (
        f'<path d="{MARK_D}" fill="{ink}"/>'
        f'<path d="{MARK_SLASH}" stroke="{accent}" stroke-width="{SLASH_WIDTH}" stroke-linecap="round" fill="none"/>'
    )


def mono_mark(colour):
    """One-colour mark (stamps, engraving, fax, embossing). The slash cuts a real
    gap through the D (true geometry, no masks) so the shapes still read apart."""
    from shapely.geometry import LineString, Polygon
    from shapely.geometry.polygon import orient
    arc = [(34 + 24 * math.sin(math.pi * i / 180), 36 - 24 * math.cos(math.pi * i / 180)) for i in range(0, 181)]
    d_shape = Polygon([(20, 12)] + arc + [(20, 60)])
    gap = LineString([(9, 63), (63, 9)]).buffer((SLASH_WIDTH + 7) / 2, cap_style=1, quad_segs=32)
    pieces = d_shape.difference(gap)
    parts = []
    for poly in getattr(pieces, "geoms", [pieces]):
        ring = orient(poly).exterior.coords
        parts.append("M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in ring) + "Z")
    return (
        f'<path d="{"".join(parts)}" fill="{colour}"/>'
        f'<path d="{MARK_SLASH}" stroke="{colour}" stroke-width="{SLASH_WIDTH}" stroke-linecap="round" fill="none"/>'
    )


def svg(view_w, view_h, body, title="DuraLex"):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w:g} {view_h:g}" '
        f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'
    )


def adaptive_mark():
    """Mark that switches its D colour with the viewer's light/dark setting.
    Used as the browser-tab favicon and as the default master file."""
    style = (
        "<style>.d{fill:" + INK_LIGHT_BG + "}"
        "@media (prefers-color-scheme:dark){.d{fill:" + INK_DARK_BG + "}}</style>"
    )
    body = (
        style
        + f'<path class="d" d="{MARK_D}"/>'
        + f'<path d="{MARK_SLASH}" stroke="{ACCENT}" stroke-width="{SLASH_WIDTH}" stroke-linecap="round" fill="none"/>'
    )
    return svg(72, 72, body)


# ---- Wordmark: "DuraLex" in Switzer 800, outlined so no font is needed ----
def wordmark_path():
    font = TTFont(ROOT / "assets/fonts/Switzer-Variable.woff2")
    font = instantiateVariableFont(font, {"wght": 800})
    font.flavor = None
    buf = io.BytesIO()
    font.save(buf)
    hb_font = hb.Font(hb.Face(buf.getvalue()))
    shaped = hb.Buffer()
    shaped.add_str("DuraLex")
    shaped.guess_segment_properties()
    hb.shape(hb_font, shaped, {"kern": True, "liga": True})
    glyphs = font.getGlyphSet()
    order = font.getGlyphOrder()
    upm = font["head"].unitsPerEm
    tracking = -0.01 * upm  # matches the site's letter-spacing:-.01em
    pen, bounds = SVGPathPen(glyphs), BoundsPen(glyphs)
    x = 0
    for info, pos in zip(shaped.glyph_infos, shaped.glyph_positions):
        g = order[info.codepoint]
        t = (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)
        glyphs[g].draw(TransformPen(pen, t))
        glyphs[g].draw(TransformPen(bounds, t))
        x += pos.x_advance + tracking
    return pen.getCommands(), bounds.bounds, font["OS/2"].sCapHeight, upm


def lockup(ink):
    """Mark + wordmark, proportioned like the site header (38px mark, 20px type, 10px gap)."""
    d, (x0, y0, x1, y1), cap, upm = wordmark_path()
    scale = (20 * 72 / 38) / upm
    gap = 10 * 72 / 38
    tx = 72 + gap - x0 * scale
    baseline = 36 + cap * scale / 2
    width = tx + x1 * scale + 4
    body = mark_paths(ink) + (
        f'<path d="{d}" fill="{ink}" transform="translate({tx:.2f} {baseline:.2f}) scale({scale:.5f})"/>'
    )
    return svg(round(width, 2), 72, body)


def tile_icon(size, radius_ratio, mark_ratio, bg=TILE):
    """Square app icon: tile + mark centred. radius_ratio 0 = full-bleed square."""
    m = 72 * mark_ratio
    off = (72 - m) / 2
    s = mark_ratio
    rx = 72 * radius_ratio
    body = (
        f'<rect width="72" height="72" rx="{rx:g}" fill="{bg}"/>'
        f'<g transform="translate({off:g} {off:g}) scale({s:g})">{mark_paths(INK_DARK_BG)}</g>'
    )
    return cairosvg.svg2png(bytestring=svg(72, 72, body).encode(), output_width=size, output_height=size)


def png(svg_text, path, width):
    cairosvg.svg2png(bytestring=svg_text.encode(), write_to=str(path), output_width=width)


def jpg_on(svg_text, path, width, bg):
    raw = cairosvg.svg2png(bytestring=svg_text.encode(), output_width=width)
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    pad = round(width * 0.08)
    canvas = Image.new("RGB", (im.width + 2 * pad, im.height + 2 * pad), bg)
    canvas.paste(im, (pad, pad), im)
    canvas.save(path, quality=92)


def main():
    out = BRAND
    (out / "png").mkdir(parents=True, exist_ok=True)
    (out / "jpg").mkdir(parents=True, exist_ok=True)

    files = {
        "duralex-mark.svg": adaptive_mark(),
        "duralex-mark-on-light.svg": svg(72, 72, mark_paths(INK_LIGHT_BG)),
        "duralex-mark-on-dark.svg": svg(72, 72, mark_paths(INK_DARK_BG)),
        "duralex-mark-black.svg": svg(72, 72, mono_mark(BLACK)),
        "duralex-mark-white.svg": svg(72, 72, mono_mark(WHITE)),
        "duralex-lockup-on-light.svg": lockup(INK_LIGHT_BG),
        "duralex-lockup-on-dark.svg": lockup(INK_DARK_BG),
    }
    for name, text in files.items():
        (out / name).write_text(text, encoding="utf-8")

    # Transparent PNGs
    for name in ["duralex-mark-on-light", "duralex-mark-on-dark", "duralex-mark-black", "duralex-mark-white"]:
        for w in (512, 1024):
            png(files[name + ".svg"], out / "png" / f"{name}-{w}.png", w)
    for name in ["duralex-lockup-on-light", "duralex-lockup-on-dark"]:
        for w in (600, 1200, 2400):
            png(files[name + ".svg"], out / "png" / f"{name}-{w}.png", w)

    # JPG cannot be transparent, so these carry a solid background
    jpg_on(files["duralex-lockup-on-light.svg"], out / "jpg" / "duralex-lockup-white-bg.jpg", 1200, WHITE)
    jpg_on(files["duralex-lockup-on-dark.svg"], out / "jpg" / "duralex-lockup-dark-bg.jpg", 1200, TILE)
    jpg_on(files["duralex-mark-on-light.svg"], out / "jpg" / "duralex-mark-white-bg.jpg", 1024, WHITE)

    # ---- Site icons (PWA, favicon, iOS) ----
    (ICONS / "duralex-mark.svg").write_text(files["duralex-mark.svg"], encoding="utf-8")
    (ICONS / "icon-192.png").write_bytes(tile_icon(192, 16 / 72, 0.86))
    (ICONS / "icon-512.png").write_bytes(tile_icon(512, 16 / 72, 0.86))
    # Maskable: full-bleed, mark kept inside the 80% safe circle
    (ICONS / "icon-maskable-512.png").write_bytes(tile_icon(512, 0, 0.62))
    # iOS: opaque square, iOS rounds the corners itself
    (ICONS / "apple-touch-icon.png").write_bytes(tile_icon(180, 0, 0.74))
    (ICONS / "favicon-32.png").write_bytes(tile_icon(32, 16 / 72, 0.9))
    ico_src = Image.open(io.BytesIO(tile_icon(256, 16 / 72, 0.9)))
    ico_src.save(ICONS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    manifest = {
        "name": "DuraLex",
        "short_name": "DuraLex",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "background_color": TILE,
        "theme_color": TILE,
        "icons": [
            {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
            {"src": "/icons/duralex-mark.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
        ],
    }
    (ROOT / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("Built brand/ and icons/")


if __name__ == "__main__":
    main()
