# M/S Zahura & Son's — website

A fast, fully static website (plain HTML, CSS and JavaScript — no build step, no server, no framework) for M/S Zahura & Son's, Govt. Contractor & Supplier. It runs on **GitHub Pages for free**.

## What's interactive
- Full-screen photo at the top of every page with a centred headline; the photo moves slower than the page as you scroll (parallax), so the next section slides up over it. No zoom animation.
- Header: logo on a white tab over the photo, turning into a slim light bar once you scroll; hides when scrolling down, returns when scrolling up. On phones: a light bar and a full-screen menu.
- Photo mosaic (home and services), scrolling client ticker, content that reveals as you scroll, counting-up numbers, scroll-progress bar, back-to-top button
- Project filter chips (and deep links such as `projects.html#shasha-denims`); home-page project cards link to their project. The chips are a normal block, so they scroll away with the page.
- Photo viewer with next/previous, arrow keys, swipe on phones and a counter (projects, certificates, work orders)
- Contact form with live validation and a spam trap
- Respects "reduce motion" settings; nothing is hidden if JavaScript fails

## Publish on GitHub (free)
1. Create a **public** repository on github.com (e.g. `zahura-and-sons`). Upload everything in this folder (drag and drop works: **Add file > Upload files**), or from a terminal:
   ```
   git init && git add . && git commit -m "Website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/zahura-and-sons.git
   git push -u origin main
   ```
2. Open **Settings > Pages**. Under *Build and deployment*, set **Source: GitHub Actions**. The included workflow deploys the site whenever you push to the **main** branch.
3. After about a minute your site is live at `https://YOUR-USERNAME.github.io/zahura-and-sons/`.
   (To use `https://YOUR-USERNAME.github.io/` instead, name the repository `YOUR-USERNAME.github.io`. A custom domain can be added in the same Pages settings.)

## Make the contact form deliver email
Edit **`js/config.js`** (it has instructions inside):
- `WEB3FORMS_KEY`: get a free key at https://web3forms.com (enter the email that should receive enquiries). Messages then arrive in that inbox, with no server. The key is meant to be public.
- `EMAIL` and `PHONE`: shown on the Contact page (hidden while empty). If there is no Web3Forms key, the form opens the visitor's email app with the message pre-filled, addressed to `EMAIL`.

## Editing
- Text: edit the `.html` files. Photos: put them in `images/` and reference them in the page.
- Page top photo and headline: in each page's `<section class="hero">` change the `<img src>` and the `<h1>`. `--pos` and `--pos-m` set which part of the photo stays in view on desktop and phone.
- Logos: `images/logo-stacked.png` (white tab and footer) and `images/logo-horizontal.png` (slim bar and phone header), cut from the logo PDF. `images/favicon.png` is the browser-tab icon.
- Colours, fonts and animation: `css/styles.css` (numbered sections at the top of the file).
- After changing `css/` or `js/` files, bump the `?v=` number in the `<script>`/`<link>` tags so browsers fetch the new version.
- Behaviour: `js/main.js` (menu, nav, gallery, filter, form) and `js/animate.js` (scroll animations).
- To preview locally, open `index.html` in a browser, or run `python3 -m http.server` in this folder.

Photos and documents belong to M/S Zahura & Son's.
