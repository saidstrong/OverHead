# Overhead owner-facing mobile refinement

2026-09-09. Based on accepted checkpoint `fef25b7e6b8db68516be5c2d4d3aee64b318859b`.
Local implementation only. No deployment or commit.

## Scope and files

| Area | Files | Change |
| --- | --- | --- |
| Document and fixed UI | app/layout.tsx, app/page.tsx, app/owner-refinement.css | Russian document/metadata; viewport-fit=cover; body-level nav; ritual moved out of orange content container; responsive surface rules |
| Hero | components/sections/hero-section.tsx | Original Overhead brand mark instead of decorative shaker |
| Shared copy and venue facts | content/site-content.ts | Russian editorial copy, localized event display, centralized seven-day hours and address |
| Menu | content/overhead-menu.ts, components/sections/menu-explorer.tsx, components/sections/signature-drinks-section.tsx | Supplied structured menu; shared signature items; swipe rail and accessible tabs |
| Customer-facing sections | components/sections/tonight-section.tsx, events-section.tsx, atmosphere-section.tsx, visit-section.tsx, site-footer.tsx | Russian UI; genuine hours; no development placeholders; explicitly illustrative room artwork |
| Shared UI | components/site/site-header.tsx, quick-actions.tsx, event-poster.tsx | Russian navigation, CTA/accessibility labels and poster surrounds |
| Ritual shell | components/scene/bar-experience.tsx, bar-experience.css, hybrid-layers.tsx | Full-bleed shell, no visible captions/counter/progress/CTA/guide text; focus-only keyboard skip |
| Protection checks | scripts/check-hybrid-motion.mjs, scripts/check-owner-refinement.mjs | Protect accepted renderer/choreography, event facts, brand asset and menu/hour invariants |

No changes to package dependencies, the final six WebPs, hybrid asset registration, hybrid compositing CSS, bar-canvas.tsx, studio assets, UI library or hooks.

## Hero branding

`public/overhead-mark.png` is the existing 1080 x 1080 guitar-head/circular icon. Earlier hero implementation at `4b92976` used this asset; its current Git blob is unchanged from the accepted checkpoint. No image was generated, redrawn or retouched.

The decorative hero shaker and associated steel/live/loud labels/orbit have been removed from the rendered hero. The OVERHEAD wordmark remains. The original icon is centered above the mobile proposition and placed beside the desktop wordmark. The real-time shaker appears only in the later ritual.

Russian social metadata also uses the original mark; the old English-tagline og.png remains on disk but is no longer referenced by the document metadata.

## Russian-first content and factual limits

Russian UI includes header/mobile links, hero, event surrounds, section headings, menu, room, visit/hours, footer, document metadata and relevant accessible names. Proper product/artist names are preserved.

Event ids, dates, start times, age restrictions, prices, status and Ticketon destinations compare unchanged to the accepted checkpoint. Their display labels were localized; no fresh event facts were invented or silently updated.

`content/overhead-menu.ts` is the single source of menu values. Each item exposes name, optional description, optional volume, integer tenge price and category. Groups organize 62 supplied entries into seven customer-facing tabs: signature, beer, wine, spirits, soft drinks, tea/coffee and food. Signature drinks outside the menu consume those same objects.

There is no empty generic cocktail tab. Jagermeister/infusions and spirit families are grouped under spirits. Food/set volumes are omitted when not supplied. No ingredients or prices were inferred.

The supplied ambiguous non-alcoholic beer spelling “RELOCVNT” was not independently verifiable from existing source assets/transcriptions. That one item is deliberately withheld from public rendering; attach the source menu image to resolve it. This uncertainty appears only in source/docs, never in customer UI.

`visit.hours` in `content/site-content.ts` supplies all seven daily opening/closing times. The visit section maps the records; no separate hard-coded schedule is rendered elsewhere.

## Full-bleed ritual, preserved engine

The ritual is a top-level sibling between signature drinks and events, not a card inside the orange section. Its panel is sticky at top:0, has no outer margin, border or inset frame, and fills the viewport width.

The scroll runway is 440svh. The visible scene uses 100dvh minus the fixed mobile-nav height, with a 100svh fallback. This reserves the nav's actual safe-area-inclusive height while allowing the scene to follow viewport changes. Reduced motion collapses the runway to one panel.

Removed normal visible UI: masthead, chapter titles/descriptions, chapter count, scroll guidance, next-action buttons, progress indicator, and asset-guide labels. The wordmark baked into the approved stage artwork remains part of the scene, not an HTML caption.

An icon-only skip is invisible during ordinary browsing and appears on keyboard focus. Its Russian accessible name describes skipping the animation; activation scrolls to and focuses the events section. The figure retains a Russian accessible description.

The only scroll-controller changes are removal of caption/progress state bookkeeping and replacement of the former 24px card top inset with top:0. The 16-unit clock, scrub, shake, tin separation/tilt, stream/fill timing, served hold, focus transition, camera paths, mobile framing, reversible seek, demand rendering, lazy boundary, image decode coordination and offscreen behavior remain protected by comparison checks.

Breakpoint QA exposed an older decode rejection being treated as an asset failure after a responsive source switch. Plate completion/failure now checks that the element remains connected, its source is still the one being decoded, and its current request is complete. The replacement load event owns readiness. Genuine load/decode failures still use the static fallback. This is a loading safeguard, not a motion-system change. A changed image request can reject decode(): [MDN decode()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode).

## Mobile nav and menu

The original nav was nested in the isolated/clipped hero. It now mounts directly under body, outside all section/reveal/canvas ancestors. It is fixed across left/right/bottom at z-index 10000, with isolation:isolate, opacity:1, a solid #11100f background, normal blending, and no backdrop filter.

Bottom padding uses env(safe-area-inset-bottom); left/right safe insets are respected. The same calculated 62px + safe-area height pads the document bottom and is subtracted from the scene viewport. Footer content can scroll above the nav. No zoom-disabling viewport restriction was added.

The category rail has a swipe hint, soft trailing edge, end padding, center snapping, 48px targets and a high-contrast active state. Selection scrolls only the rail; ArrowLeft/ArrowRight/Home/End work with roving focus. All labels fit when active. Menu rows display product, description, volume and price without placeholder gaps or extra accordions.

The simplified room section reuses the approved responsive stage artwork with a visible atmospheric-illustration caption. It does not claim real venue photography or invent terrace/interior features.

## Verification and performance

Commands:
- `npm run build`
- `npx tsc --noEmit`
- `npx oxlint app content components/sections components/site components/scene components/motion scripts/check-owner-refinement.mjs scripts/check-hybrid-motion.mjs`
- `node scripts/check-hybrid-motion.mjs`
- `node scripts/check-owner-refinement.mjs`
- `npm run lint` (the known 19 unrelated failures are retained)

Browser evidence and executable local probes: `output/playwright/owner-mobile/`. See its QA.md and contact sheets. Generated evidence is ignored by the existing repository rules; no staging was performed.

The lazy renderer chunk remains 893,409 bytes uncompressed. Scene geometry, images and dependencies are unchanged. Normal render calls remain 12 initially, 7–8 during the sampled pour, and 1 mobile / 2 desktop when served. Removing chapter state eliminates those React caption rerenders. The gallery reuses the same stage sources and adds no new image variant.

Full-bleed presentation covers more pixels than the old inset card, so unchanged draw-call counts do not prove identical GPU/compositor cost. CSS blur and final alpha assets still need physical-phone scrutiny; desktop Chromium is not an iPhone performance benchmark.

## Remaining validation boundary

The requested physical iPhone screenshots were not attached/available during this pass. Browser QA tests 375/390/430 and 1440 widths, shortened/changing heights and section boundaries. This does not certify actual Safari address-bar transitions, home-indicator insets, thermal performance or touch behavior. Recheck this local revision on the actual iPhone before public release.

This pass does not attempt to fix the accepted source-pair silhouette mismatch, baked highlights, flat table horizon, or right-biased desktop camera. It preserves the accepted motion/visual checkpoint while addressing the owner-facing surface issues.

Viewport reference: [MDN env()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env), [MDN viewport lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length).
