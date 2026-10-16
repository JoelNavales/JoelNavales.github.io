# Joel Navales — Personal Portfolio

A responsive portfolio for Joel Franco V. Navales, a fourth-year BSIT student at the University of San Jose–Recoletos in Cebu, Philippines.

Built with **React, Vite, TypeScript, React Router, and CSS**, using **pnpm**. Animation uses **Motion** (formerly Framer Motion), and the home page's 3D scene uses **three.js** through **React Three Fiber**. The visual direction takes inspiration from the playful introduction and project-led storytelling at [Brice Clain’s portfolio](https://briceclain.com/en/), with original layouts, copy, and illustrations.

## Pages and motion

- `/`: Home — introduction with a typed greeting, a sliding toolkit strip, and the project list.
- `/work`: Work — projects, project dialogs, and skills.
- `/about`: About — biography, interests, and contact details. `/about#contact` links directly to contact.

The header pins to the top once you scroll: it shrinks, turns frosted, drops its tagline, and shows a coral reading-progress line. It slides away while you scroll down and comes back as soon as you scroll up, but stays put while the mobile menu is open, while the navigation has keyboard focus, or with a reduced-motion preference.

Route changes use a short View Transition crossfade, and each page plays its own entrance: headlines rise line by line from behind a mask, supporting content fades up in sequence, and below-the-fold sections reveal as they scroll into view. Project covers tilt toward the mouse, the project dialog animates in and out, and the active-page dot glides between navigation links.

The home page hero is an interactive 3D scene drawn in the style of the project illustrations (cel shading and ink outlines): a phone showing the real project list, a camera, a chess king, and a football. Drag to turn it; tap the phone to cycle projects, the camera for a flash, the king to tip it, and the ball to kick it. three.js loads as a separate chunk only on the home page, rendering pauses when the hero is off screen, and browsers without WebGL 2 get the original SVG illustration instead.

On the home page, the toolkit strip slides continuously, speeds up as you scroll, and reverses when you scroll back up; it pauses on hover or with its Pause button. Hovering a project in the list shows its cover beside the pointer, and clicking opens the project dialog.

With a reduced-motion preference, movement is removed (fades remain), the greeting appears without typing, the toolkit strip stands still, the 3D scene renders still and only on demand, and the camera flash is off. The flash is limited to one every 0.8 seconds in any case. Each page has a distinct title and heading; navigation updates keyboard focus and supports browser back/forward with scroll restoration. Previous section links such as `/#work` redirect to the new page on load.

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

The build checks TypeScript and creates a static site in `dist/`. Production hosting must serve `index.html` for `/work` and `/about` so direct links and refreshes work. `public/_redirects` supplies this fallback on hosts supporting that format; configure an equivalent SPA rewrite on other hosts. Vite’s development and preview servers already handle these routes. This repository has not been deployed automatically.

## Editing content

- `src/data.ts`: project details, the toolkit, skill groups, and social links.
- `src/main.tsx`: routes and compatibility with previous section links.
- `src/App.tsx`: shared header, footer, navigation, page titles, and focus handling.
- `src/pages/`: Home, Work, and About content.
- `src/components/`: shared artwork, icons, project dialog and covers, and headline reveals.
- `src/components/hero/`: the 3D hero. `HeroStage.tsx` handles loading, fallback, dragging, and captions; `HeroScene.tsx` sets up the scene; `objects.tsx` builds the models; `phoneScreen.ts` paints the phone screen from `src/data.ts`.
- `src/lib/motion.ts`: shared easing, entrance variants, and scroll-reveal settings.
- `src/styles.css`: layout, theme, and responsive styles.
- `src/page-transitions.css`: route transitions and their reduced-motion behavior.
- `public/assets/`: original concept illustrations and locally hosted fonts, with font licenses.
- `public/assets/pfp-*.webp` and `pfp-800.jpg`: the About page portrait at web sizes, made from `pfp.jpg`. To swap the photo, replace `pfp.jpg` and regenerate them:

  ```sh
  cd public/assets
  for w in 480 800 1200; do cwebp -q 80 -m 6 -sharp_yuv -metadata none -resize $w 0 pfp.jpg -o pfp-$w.webp; done
  dwebp pfp-800.webp -o /tmp/pfp-800.png && sips -s format jpeg -s formatOptions 82 /tmp/pfp-800.png --out pfp-800.jpg
  ```

- `index.html`: page title, description, and sharing metadata.

Project covers are conceptual artwork, not application screenshots. The car rental application is marked in progress; e-shop and Traits are marked as private repositories. There are no invented project metrics, testimonials, or employment details.

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
