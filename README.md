# MFM Sculptures

Portfolio website for Matthew Farmer's recycled metal sculptures. It is a plain static site, so GitHub Pages serves it as is. There is no build step.

Live site: https://mdf2023.github.io/mfm-sculptures/

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | Home page |
| `portfolio.html` | Portfolio grid, each piece opens in a photo viewer |
| `about.html` | About page |
| `commissions.html` | Commission info and request form |
| `css/style.css` | All styles. Colors and fonts are set at the top. |
| `js/site.js` | Photo viewer, build-steps slider, commission form |
| `js/pieces.js` | Photo sets and captions for the viewer |
| `img/` | Web-sized photos (WebP). These are what the site uses. |
| `images/` | Original camera photos. The site no longer uses these. |
| `fonts/` | Archivo and Source Serif 4, self-hosted |
| `tools/optimize.py` | Resizes new photos for the web |

## Preview on your computer

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Common updates

### Capitalization

Headings, buttons, nav links, form labels, piece names, and step labels use Title Case (small words like "a", "and", "from", and "the" stay lowercase unless they start the title). Body paragraphs, captions, alt text, and form messages use normal sentence case. When you add a piece, put its name in Title Case in `portfolio.html`, `index.html`, and `js/pieces.js`.

### Change the commission dates

Search for "June 2027" and edit it. It appears in `index.html` (hero note and bottom section) and `commissions.html` (the dark box at the top and the page description). Update the `<meta>` description near the top of each file too.

### Make the commission form send email

Right now the form opens the visitor's email app, which fails for people who don't use one. To fix that:

1. Make a free form at https://formspree.io and copy the form URL. It looks like `https://formspree.io/f/abcdwxyz`.
2. In `commissions.html`, find `data-endpoint=""` and paste the URL between the quotes.

Submissions then arrive in your email, and visitors see a confirmation on the page.

### Add a new piece

1. Put the photos in `images/`.
2. Run `python3 tools/optimize.py images img` (needs Python and `pip install pillow`). It writes `name-800.webp` and `name-1600.webp` into `img/` for each photo.
3. In `portfolio.html`, copy one `<li class="tiles__item">` block and change the piece name, materials, and photo file.
4. In `js/pieces.js`, copy one piece entry and list its photos, so the viewer can show every angle.
5. To list it on the home page, add a row to the "What each piece is made from" list in `index.html`.

### Use your own domain

The page addresses in `<link rel="canonical">`, `og:url`, `og:image`, `sitemap.xml`, and `robots.txt` point at the github.io address. Replace `https://mdf2023.github.io/mfm-sculptures/` with your new address in those places.

## Credits

Fonts are Archivo and Source Serif 4, used under the SIL Open Font License (see `fonts/OFL.txt`).
