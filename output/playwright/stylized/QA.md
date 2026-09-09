# Overhead — premium stylized direction

Date: 2026-09-09. Local Chromium / localhost:3000. No deployment.

## Verdict

The pivot is visibly more intentional than the authored-assets realism attempt. Copper fill and crystalline facets now read immediately; the glass is a designed smoky shell instead of an unsuccessful optical simulation. The stage is quieter and more atmospheric. The steel shaker remains the strongest object.

This is a stronger stylized direction, not final premium visual sign-off. Ice silhouettes remain noticeably cuboid, the drink has a graphic rather than tactile surface, and the fixed performers remain mannequin-like. These are visible limitations, not reasons to resume the photoreal-material loop.

## Evidence

- [24-state contact sheet](contact-sheet.png): six states at 1440 / 375 / 390 / 430.
- [Before / after comparison](comparison.png): authored-assets baseline versus this pass; desktop and 390 pairs for all six states.
- Explicit baseline: [authored-assets contact sheet](../authored-assets/contact-sheet.png).
- Individual captures: `{width}-{initial,shake,separation,pour,served,music}.png` in this directory.
- Extra desktop / 390 captures: `pour-setup`, `tools-recede`, `rack-start`, `rack-middle`, `rack-end`.
- Reduced-motion captures: `reduced-{1440,375,390,430}.png`.
- Short mobile: [375 × 667 pour](375-short.png).
- `draft-*.png` are intermediate experiments, NOT the final result.

Desktop screenshots crop the scene panel from a 1440 × 1000 viewport. Normal mobile captures show the full 844px viewport, including the existing Tonight / Menu / Reserve bar. The surrounding orange page surface is unchanged and outside this scene-only pass.

## Visual assessment against the requested criteria

| Question | Screenshot-based assessment |
| --- | --- |
| More intentional? | Yes. Steel, smoke, copper and muted stage lighting have a narrower, clearer hierarchy. The old bright cymbal shapes no longer compete with the shaker. |
| Designed glass rather than fake glass? | Closer. The smoky silhouette, rolled rim and dark heavy base are readable. It remains visibly rendered, with outlined edges; optical accuracy is intentionally not the target. |
| Attractive ice? | Partial. Two pale/cool, translucent faceted pieces read much better than the old nearly invisible brown blocks. Their broad cuboid faces and diagonal triangulation are still obvious at desktop served scale. |
| Appealing amber drink? | Improved. The richer copper volume and bright top surface are much easier to read. The surface remains graphic/flat, not sumptuous photographic liquid. |
| Clear pour? | Yes. The narrow copper stream connects the existing transformed shaker lip to the rising liquid surface. No fluid simulation, glow, particles or timing change was added. |
| Atmospheric stage instead of diorama? | Improved. Exposed cymbals, duplicate toms, rims, lugs, tripod hardware and grille detail are gone. Two figures, a mic, one amp and a partial kit remain. Figures are intentionally dark, but their poses are stiff and the microphone is conspicuous. |
| Coherent and premium? | More coherent; mixed premium readiness. Shaker/highlights are strong; ice and performer shapes remain less refined. Table grounding is preserved but subtle on dark displays. |
| More memorable? | In my judgment, the readable copper/facet contrast is stronger than the earlier muddy realism attempt. Audience memorability has not been user-tested. |

Rack focus: served keeps the cocktail readable and stage subdued; midpoint lets stage structure become readable before the cocktail is fully soft; music leaves a recognizable blurred foreground drink. The widened focus band avoids an unreadable midpoint, but gives a brief shared-focus impression rather than an optically exact rack. Small blur halos around high-contrast edges remain. Mobile retains the approved crop: the cocktail moves partially outside the right edge during the stage transition.

## Implementation scope

- `components/scene/bar-canvas.tsx`: smoke/ice/copper/rind material direction, explicit transparent draw ordering, ice depth writes, restrained table response, simplified stage. Existing shaker geometry/materials, model file, hero transforms and camera tracks preserved.
- `components/scene/focus-pass.tsx`: one main color/depth render, depth-only glass proxy, existing quarter-resolution two-pass blur and final depth mix. Removed cloned wall/ice/liquid scenes, nested transmission passes, extra full-resolution render target and copy pass. GPU resources still disposed on unmount.
- `components/scene/studio-assets.ts`: retired screen-space refraction material. Reused existing edge-alpha styling and controlled studio reflections. No new optical hacks, textures or internal noise.
- `components/scene/bar-experience.tsx` / CSS: presentation-only chapter attribute, omit explanatory subcopy on action chapters, italic pour title. Existing CTA destinations, accessibility description and interaction behavior retained.
- `public/models/overhead/SOURCE.md`: current stylized runtime documented; no new models, dependencies or external asset licenses.

React skill review: mutable animation values remain in refs, no per-frame React state added, lazy/Suspense boundary retained, hooks unconditional, scene-owned resources disposed. No backend, CMS, routes or product features changed.

## Verification

- Build: `npm run build` PASS. Existing large-chunk / Vinext route-classification warnings remain.
- Types: `npx tsc --noEmit` PASS.
- Scene lint: `npx oxlint components/scene` PASS.
- `git diff --check` PASS (existing Windows line-ending warnings only).
- Full `npm run lint`: FAIL, 19 pre-existing errors in `components/ui/*` and `hooks/use-mobile.ts`; not changed in this pass.
- `node scripts/check-bar-assets.mjs`: PASS, camera unchanged, GLB bounds/index checks passed.
- `node output/playwright/stylized/check-invariants.mjs`: PASS. The entire World frame-update track and GSAP controller match the pre-pass snapshot, ignoring formatting. This includes object transforms, responsive framing, timing, visibility gates, fill, stream path and light progression.
- Forward 24 captures: target times 0 / 3 / 6.1 / 8.7 / 12.3 / 16, all reached exactly to displayed two decimals; no horizontal overflow.
- Reverse traversal: all six targets at all four widths reached within 0.025 timeline units. See `reverse-reduced-results.json`.
- Reduced motion: fixed 12.30 at all widths, full scene runway collapses to panel height (781 desktop / 739 mobile), no overflow. Wheel scrolling did not advance choreography.
- Lazy loading: bar-canvas resource absent before approaching the section.
- Idle: renderer counter 94 → 94 over 1.5 seconds. Offscreen: 143 → 143 over 1.5 seconds. No autonomous choreography.
- Context-loss injection: canvas removed, static SVG fallback shown, runway collapsed; no application error.
- Normal captures / reverse / behavior: no page or console errors. Existing Three.Clock deprecation and Windows shader precision warnings remain.
- Extra 375 × 667 check: first combined resize test recorded 0.00 instead of pour; NOT counted as a pass. Fresh navigation with explicit settling assertion reached 8.70, no overflow, no error overlay/errors; `short.pw` regenerated the correct screenshot.
- Dev server page loads with meaningful content and working scene. `agent-browser` was unavailable; Playwright supplied the verification fallback.

No new appearance/disappearance gates were added. Reviewed setup/withdrawal/transition captures show continuous staging, and the unchanged track plus reverse tests support continuity. This is not a claim that every possible scroll velocity/browser has been exhaustively tested.

## Performance evidence

Draw calls aggregate the explicit scene, depth-proxy and postprocessing renders, as in the baseline. Mobile columns use 390px.

| State | Desktop before → after | Mobile before → after |
| --- | ---: | ---: |
| Initial | 61 → 30 | 41 → 25 |
| Shake | 61 → 30 | 41 → 25 |
| Separation | 61 → 30 | 41 → 25 |
| Pour | 71 → 37 | 68 → 35 |
| Served | 59 → 26 | 56 → 26 |
| Music | 61 → 27 | 53 → 23 |

Desktop triangles: pour 27,020 → 21,838; served 18,220 → 13,382. Across final mobile captures draw calls range 22–35. Pixel-ratio cap 1.25, half-float target, quarter-resolution blur and one 1024 shadow map retained.

Lazy scene JS: 948,258 bytes, versus recorded authored baseline 956,373 bytes (8,115 bytes smaller, uncompressed). GLB unchanged: 222,272 bytes / 7,454 triangles. No added dependencies. Three/R3F still dominate this large lazy chunk.

Browser RAF scheduling sample: 145 frames / 2,408.7ms, median 16.7ms, p95 16.8ms. This is desktop Chromium at a mobile viewport, NOT a real-phone GPU/thermal benchmark. See `behavior-results.json`.

## Remaining boundaries

No real-device Safari/Android, thermal/battery or production-bundle browser testing in this pass. No deploy. Transparent layer ordering and inexpensive DOF are deliberately art-directed approximations. The next decision should be a visual review of this stylized direction, not another photorealism iteration.
