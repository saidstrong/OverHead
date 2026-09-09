# Checkpoint before hybrid visual pivot

2026-09-09. This report supersedes the older visual-pass QA claims for the current snapshot.

The runtime implementation is preserved as found, with no visual fixes in this checkpoint task. Two scene files changed during the initial verification window; the latest state was staged and the build repeated. This is an as-is recovery checkpoint, not an all-green or production-ready certification.

## Verification

- Build, TypeScript and scoped scene lint passed.
- Authored GLB validation and approved camera block comparison passed.
- Forward scroll captures: all six states at 1440 / 375 / 390 / 430 reached the requested time; no horizontal overflow.
- Reverse traversal: all 24 targets within 0.025 timeline units.
- Reduced motion: fixed 12.30 at every width; collapsed runway; no overflow; wheel does not advance choreography.
- Lazy scene absent before approach; idle render counter 79 to 79 and offscreen 127 to 127 over 1.5 seconds.
- Context-loss fallback: static SVG shown, canvas removed, runway collapsed.
- 375 x 667 pour reached 8.70; no overflow or framework overlay.

## Known failures deliberately preserved

1. Browser console verification FAILS: haze fragment shader uses `drift` without declaring `uniform float drift`. A JavaScript uniform exists, but the GLSL declaration does not. WebGL reports an invalid program. Choreography still reaches its states; this is not a console-clean snapshot.
2. Historical `check-invariants.mjs` FAILS against its older snapshot. Current focus timing is 13.65 to 15.35 versus historical 13.2 to 16; current frame logic also updates haze drift. The old checker was not weakened or its baseline overwritten to manufacture a pass.
3. Full repository lint FAILS with 19 existing errors under components/ui and hooks/use-mobile.ts. These were not fixed in this no-visual-change pass.

Current browser results are in `checkpoint-results.json`. Older QA.md, behavior-results.json and reverse-reduced-results.json describe the prior pass, not this checkpoint. Individual six-state and reduced screenshots were regenerated; previous transition captures remain historical. Browser tests use desktop Chromium viewport emulation, not physical mobile devices.

## Commit scope

Scene/controller source, integration changes, package manifest/lock, GLB and authoring/validation scripts, selected QA scripts/baselines/evidence. Browser session logs, build caches and unrelated historical screenshot scratch stay local and ignored. No secrets, deployment, push, backend/CMS work or new visual implementation is intended.
