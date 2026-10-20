# Joel Navales — Personal Portfolio

A responsive portfolio for Joel Franco V. Navales, a fourth-year BSIT student at the University of San Jose–Recoletos in Cebu, Philippines.

Built with **React, Vite, TypeScript, React Router, and CSS**, using **pnpm**. Animation uses **Motion** (formerly Framer Motion), and the About page's 3D scene uses **three.js** through **React Three Fiber**. The visual direction takes inspiration from the playful introduction and project-led storytelling at [Brice Clain’s portfolio](https://briceclain.com/en/), with original layouts, copy, and illustrations.

## Pages and motion

- `/`: Home — an introduction that starts from the SenSOIL research, the project list, a SenSOIL awards band, and a closing band with email and message links.
- `/work`: Work — projects, project dialogs, and skills.
- `/about`: About — biography, interactive 3D interests, and contact details. `/about#contact` links directly to contact.

The header pins to the top once you scroll: it shrinks, turns frosted, drops its tagline, and shows a coral reading-progress line. It slides away while you scroll down and comes back as soon as you scroll up, but stays put while the mobile menu is open, while the navigation has keyboard focus, or with a reduced-motion preference.

Route changes use a short View Transition crossfade, and each page plays its own entrance: headlines rise line by line from behind a mask, supporting content fades up in sequence, and below-the-fold sections reveal as they scroll into view. Project covers tilt toward the mouse, the project dialog animates in and out, and the active-page dot glides between navigation links.

The Home page pairs the introduction with Joel's portrait and a reduced-motion-aware reveal. The About page has an interactive 3D scene drawn in the style of the project illustrations (cel shading and ink outlines), floating directly over the dark page background: a gaming controller for COD and Tekken, a camera for photography, a chess king, and a football. Drag to turn it; tap the controller to rumble and press its buttons, the camera for a flash, the king to tip it, and the ball to kick it. three.js loads as a separate chunk only on the About page, rendering pauses when the scene is off screen, and browsers without WebGL 2 get the original CSS illustration instead.

On the home page, hovering a project in the list shows its cover beside the pointer; on touch screens each row shows the cover inline instead. Clicking opens the project dialog, which leads with the live demo or the code, and its "Ask me about…" button opens the quick message form with the project prefilled.

With a reduced-motion preference, movement is removed (fades remain), the greeting appears without typing, the 3D scene renders still and only on demand, and the camera flash is off. The flash is limited to one every 0.8 seconds in any case. Each page has a distinct title and heading; navigation updates keyboard focus and supports browser back/forward with scroll restoration. Previous section links such as `/#work` redirect to the new page on load.

## Local development

Use Node.js 22.12+ and pnpm 11.17+.

```sh
pnpm install
pnpm dev
```

Vite prints the local preview URL, usually `http://127.0.0.1:5173`.

## Production

```sh
pnpm build
pnpm preview
```

The build checks TypeScript and creates a static site in `dist/`. It also generates `work/index.html`, `about/index.html`, `404.html`, and `.nojekyll` so GitHub Pages can serve direct links and refreshes. The router normalizes trailing slashes while retaining clean URLs. `public/_redirects` remains available for hosts supporting SPA rewrites.

### GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` installs Node.js 24 and the pnpm version declared in `package.json`, installs the frozen lockfile, builds the site, and deploys `dist/` when you push to `main`. You can also start it manually from the Actions tab.

1. Open [this repository's Pages settings](https://github.com/JoelNavales/my-portfolio/settings/pages).
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Commit and push these changes to `main`, then wait for **Deploy portfolio to GitHub Pages** in the Actions tab to finish.
4. Visit **https://joelnavales.github.io/my-portfolio/**. Work and About are available at `/my-portfolio/work` and `/my-portfolio/about`; the contact link is `/my-portfolio/about#contact`.

The workflow obtains the published base path from GitHub Pages and passes it as `VITE_BASE_PATH`, so navigation, portraits, project covers, fonts, and the favicon use the correct prefix. A root site or custom domain uses `/` automatically. No personal access token or additional repository secrets are needed. See the [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

To preview the repository path locally:

```sh
VITE_BASE_PATH=/my-portfolio/ pnpm build
pnpm preview
```

Open `http://127.0.0.1:4173/my-portfolio/`. Local development with `pnpm dev` and builds without `VITE_BASE_PATH` use `/`.

## Editing content

- `src/data.ts`: project details (including each project's role line), skill groups, the email address, and social links.
- `src/main.tsx`: routes and compatibility with previous section links.
- `src/App.tsx`: shared header, footer, navigation, page titles, and focus handling.
- `src/pages/`: Home, Work, and About content.
- `src/components/`: shared artwork, icons, project dialog and covers, and headline reveals.
- `src/components/HomePortrait.tsx` and `AboutVisual.tsx`: the Home portrait and About interests panel. Their visual styles live in `src/components/page-visuals.css`, separate from the shared responsive layouts.
- `src/components/hero/`: the About page's 3D scene. `HeroStage.tsx` handles loading, fallback, dragging, and captions; `HeroScene.tsx` sets up the transparent scene; `objects.tsx` builds the controller, camera, chess king, and football.
- `src/lib/motion.ts`: shared easing, entrance variants, and scroll-reveal settings.
- `src/styles.css`: layout, theme, and responsive styles.
- `src/page-transitions.css`: route transitions and their reduced-motion behavior.
- `public/assets/`: concept illustrations, project screenshots, photos, and locally hosted fonts, with font licenses.
- `public/assets/pfp-*.webp` and `pfp-800.jpg`: the Home page portrait at web sizes, made from `pfp.jpg`. To swap the photo, replace `pfp.jpg` and regenerate them:

  ```sh
  cd public/assets
  for w in 480 800 1200; do cwebp -q 80 -m 6 -sharp_yuv -metadata none -resize $w 0 pfp.jpg -o pfp-$w.webp; done
  dwebp pfp-800.webp -o /tmp/pfp-800.png && sips -s format jpeg -s formatOptions 82 /tmp/pfp-800.png --out pfp-800.jpg
  ```

- `index.html`: page title, description, and sharing metadata.

Clario and SteelBound covers are real screenshots; Locker and Aspire covers are concept artwork and are labeled as such. Locker is marked in development and Clario links to its live demo, both with their public repositories. Aspire links to [SE-Aspire](https://github.com/senRyuu286/SE-Aspire), a team-built Flutter career guidance app using Firebase and Gemini; its description credits Joel's interface design and Flutter UI/UX contribution as documented in that repository. There are no invented project metrics, testimonials, or employment details.

## Contact form

The About page’s contact form sends messages through [Formspree](https://formspree.io) (form `xrpervzl`, set in `src/components/ContactForm.tsx`), which emails them on. It uses `@formspree/react`, loaded only on the About page. Submissions include the name, email, message, a fixed subject line, and a hidden `_gotcha` field that Formspree uses to discard spam; the email address becomes the reply-to. The browser checks required fields first, Formspree’s field and form errors appear inline, and the direct email address is offered if sending fails.

The header’s “Let’s talk” button opens the same form in a panel over the current page (a bottom sheet on phones), so visitors don’t have to leave what they’re reading. A half-written message survives closing the panel, Escape or the × closes it, and focus returns to the button. After a successful send the panel closes and a short “Message sent” toast confirms it, announced to screen readers through a status region. Ctrl/Cmd-click on the button still opens the About page in a new tab. The panel and toast live in `src/components/QuickContact.tsx` and `src/components/Toast.tsx`.

Formspree’s free plan accepts a limited number of submissions per month. Once the site is live, consider restricting the form to your domain in the Formspree dashboard.

The site doesn’t list an email address on its pages; the form (in the header panel and on the About page) is the way to get in touch, and its error message offers the address if sending fails. No backend, analytics, cookies, or third-party runtime font requests are needed; Formspree is contacted only when someone sends the form.

## Accessibility

Includes semantic sections, a skip link, keyboard-accessible navigation, native project dialogs with Escape dismissal and focus restoration, visible focus indicators, and reduced-motion support. Functional text is at least 11px. The 3D scene is described by a text label, and everything it shows is also on the Work and About pages. Fonts and project artwork are served locally.

## Design checks

[Impeccable](https://impeccable.style) scans the rendered pages for common design-quality problems and AI-generated-design tells. With the dev server running:

```sh
npx impeccable detect http://127.0.0.1:5173/ http://127.0.0.1:5173/work http://127.0.0.1:5173/about
npx impeccable detect --viewport 390x844 http://127.0.0.1:5173/about
```

URL scans need Chrome, Chromium, Edge, or Brave; set `IMPECCABLE_BROWSER` to the browser's path if it isn't found.
