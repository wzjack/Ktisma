# Ktisma Capital Group website

A simple static site: plain HTML, CSS and JavaScript. No build step and no dependencies.

## What is where

```
index.html          The page: all the text and the layout
css/styles.css      All the styling. Brand colors and fonts are at the top (the :root block)
js/config.js        The settings you are most likely to change: form endpoint, minimum investment, quiz questions
js/quiz.js          The qualification quiz and lead form (the logic)
assets/
  logo/             Logo files (SVG): on-dark and on-light
  icons/            The six sub-brand icons (SVG), in color and reversed for dark backgrounds
  favicon/          Favicons, app icons and site.webmanifest
  social/           Image shown when the site is shared (1200 x 630)
```

## Run it on your computer

Open `index.html` in a browser. Or, from this folder, run `python3 -m http.server 8000` and visit http://localhost:8000

## Deploy on Cloudflare Pages

1. Put these files in your Git repo with `index.html` at the top level of the repo.
2. In Cloudflare, go to Workers & Pages, then Create, then Pages, then Connect to Git, and pick the repo.
3. Build settings: Framework preset **None**, Build command **empty**, Build output directory **empty**.
4. Save and Deploy. After that, every push to the main branch updates the live site.

## Common changes

| To change | Edit |
| --- | --- |
| Headline, section text, FAQ, footer disclaimer | `index.html` |
| Brand colors and fonts | `:root` block at the top of `css/styles.css` |
| Where leads are sent | `formEndpoint` in `js/config.js` (leave it empty to test without sending anything) |
| Minimum investment | `minimumInvestment` in `js/config.js` |
| Quiz questions and answers | `STEPS` in `js/config.js` |
| Consent text and thank-you messages | `js/quiz.js` |
| Logo and icons | the files in `assets/` (keep the file names, or update the paths in `index.html`) |
| Social sharing image | in the `<head>` of `index.html`, turn on the commented "Social sharing" block and replace YOUR-DOMAIN |

## Brand

Navy `#0E1F3B`, Gold `#B08A4A`, Light gold `#C9A55F` (gold on navy), Ivory `#F7F3E9`.
Fonts: Cormorant Garamond for the headline and quiz questions, Hanken Grotesk for everything else. Both load from Google Fonts.
