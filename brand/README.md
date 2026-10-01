# DuraLex logo files

The logo has no background. It is one vector master (`build.py`), and every file
in this folder plus the site icons are generated from it, so they always match.

## Which file to use

| Where | File |
|---|---|
| Website, app, anything on screen (inline) | the inline SVG in the pages; the D uses `currentColor`, so it takes the text colour and works on light and dark automatically |
| Light background (paper, white, letterhead, documents) | `duralex-lockup-on-light.svg` / `duralex-mark-on-light.svg` |
| Dark background (navy, black, dark slides) | `duralex-lockup-on-dark.svg` / `duralex-mark-on-dark.svg` |
| One colour only (stamp, embossing, engraving, fax, one-colour print) | `duralex-mark-black.svg` / `duralex-mark-white.svg` (the slash cuts a gap through the D) |
| Programs that cannot open SVG | `png/` (transparent, 512 to 2400 px) |
| Places that need JPG (some email signatures, forms) | `jpg/` (JPG cannot be transparent, so these have a white or dark background) |

Always prefer SVG; it scales to any size without blur. For print vendors, send the SVG.

## Colours

- Accent slash: `#C8FF3D` (the same on every background)
- D and wordmark on light: `#132029`
- D and wordmark on dark: `#F3F1EC`

## App and browser icons

Generated into `/icons` and wired up in `/manifest.webmanifest`:

- `duralex-mark.svg`: browser-tab icon; switches the D colour with the visitor's light/dark setting
- `favicon.ico`, `favicon-32.png`: fallbacks for older browsers
- `icon-192.png`, `icon-512.png`: PWA install icons
- `icon-maskable-512.png`: Android adaptive icon (mark inside the safe zone)
- `apple-touch-icon.png`: iPhone/iPad home screen

App icons sit on a dark tile (`#0A0A0A`) because phone home screens require a solid square; the tile is part of the icon, not of the logo. The same `icon-*` files are the starting point for the native app icons.

## Changing the logo

Edit the geometry or colours at the top of `build.py`, then run `python3 brand/build.py` from the repo root. The inline SVG in the HTML pages uses the same two paths; update them too if the geometry changes.
