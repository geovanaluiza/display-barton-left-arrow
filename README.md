# Northwest University — Interactive Campus Display

A Nuxt 3 + Vue 3 application built to run on 10 fullscreen touchscreen displays across the Northwest University campus. This is not a website — it's an immersive, touch-first interactive experience.

## Stack

- **Framework:** Nuxt 3.17 (SPA mode, static prerender)
- **Runtime:** Vue 3.5, Vite 6
- **Type system:** TypeScript
- **Styling:** Hand-rolled CSS with a strict, locked color palette (no Tailwind, no dark/neon/red)
- **Image pipeline:** Source images from `2025-2026 Heros` edited-photo library, downscaled to 1920px max edge for the 1080p displays

## Run

```bash
# Node 22 LTS is required (not bundled on macOS by default)
export PATH="$HOME/.local/node/bin:$PATH"

npm install
npm run dev          # http://localhost:3000
npm run build        # static build → .output/public
npm run preview      # serve the production build
```

## How the display works

### Navigation
- **Swipe left/right** anywhere on screen → move between worlds.
- **Swipe up/down** inside a world → scroll that world's content.
- **Tap** any tappable element (pins on the home map, cards, chips, dots).
- **Arrow keys** are also wired up for keyboard navigation (and `Esc` returns to home).
- After **30 seconds of inactivity**, the screen enters **idle mode** — a cinematic slideshow of campus photos with floating stat cards. Any touch instantly returns to interactive mode.

### Home screen — animated campus map
Not a dashboard. An SVG of the hill with tappable building pins (HSC, Butterfield Chapel, Eagles Court, Library, Residence Life, Event Lawn, Leadership, Peabody). Each pin routes to the corresponding world. Priority buildings for the current display's location pulse.

### The seven worlds
1. **Home** (`/`) — animated campus map
2. **Discover NU** — overview, mission, community, six pillars
3. **Student Life** — clubs, housing, traditions (filterable by category)
4. **Events** — filterable event cards (chapel, athletics, arts, social, service)
5. **Academics** — six colleges with program chips
6. **Athletics** — featured teams, hero, scores, next game
7. **Faith & Community** — ministries mosaic, photo grid, quote
8. **Student Stories** — large profile carousel with thumbnails

### Location-aware content
Each display passes a location hint via query string: `?loc=student-center | athletics | library | residence | default`. The top-bar pill and home-map pin priority both reflect the display's location. See `composables/useLocation.ts`.

## Color palette (locked)

```
--nu-blue:     #0068bb   primary
--nu-navy:     #034c87   primary
--nu-midnight: #00263d   primary
--nu-alt:      #148dcd
--nu-sky:      #95c5ea
--nu-skylight: #b4d4f0
--nu-tour:     #fbd945   CTA
--nu-amber:    #ffbc2d   CTA
--nu-leaf:     #44ba82
--nu-powder:   #eaf4fb   background
--nu-cloud:    #f1f2f2   background
--nu-wisp:     #f9f9f9   background
```

No dark, cyberpunk, neon, or red interfaces. Headlines use Times New Roman; body uses system sans-serif.

## Project layout

```
app.vue                  root → NuxtLayout → NuxtPage
nuxt.config.ts           SPA mode, locked viewport 1920×1080
assets/css/main.css      palette, type, motion, components
layouts/default.vue      chrome: top bar with world dots, bottom hint
pages/                   one .vue per world
components/
  IdleOverlay.vue        cinematic slideshow for idle state
  WorldHeader.vue        shared header for each world
  PhotoCard.vue          shared photo card
composables/
  useDisplayState.ts     current world, idle detection, navigation
  useLocation.ts         location-aware content priority
  useSwipe.ts            horizontal/vertical pointer-swipe
utils/
  content.ts             events, stories, teams, clubs, programs
  photos.ts              curated manifest of all featured photos
types/index.ts           shared TypeScript types
public/images/           201 campus photos (114MB, max 1920px edge)
```

## Image pipeline

The marketing share on OneDrive contains a folder literally named `2025-2026 Heros` (with a space — not the underscore in the brief). The `2025-2026_Heros` path in the original brief did not exist; we resolved it to `2025-2026 Heros/`.

Raw editorial photos are massive (5–140 MB per file, multi-thousand-pixel dimensions). For a 1920×1080 touchscreen they were downscaled via macOS `sips` to a 1920px max edge at JPEG quality 78, bringing the asset directory from 9.3 GB to 114 MB while preserving every image.

## Motion principles

- **Intentional** — every animation has a reason (state change, attention, hierarchy).
- **Layered** — parallax trees, drifting badges, ken-burns on hero photos.
- **Soft** — eased with `cubic-bezier(0.22, 1, 0.36, 1)` curves, never linear.
- **Staggered** — grid cards and stat tiles fade in with 80ms steps.
- **Touch-aware** — every interactive element is at least 56px tall (most are 72px+).
