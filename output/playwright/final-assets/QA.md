# Final approved hybrid asset integration QA

2026-09-09. Scope: asset integration and verification only. Baseline: `output/playwright/hybrid/` placeholder implementation. No new section, feature, dependency, motion system, artwork generation, source-image editing, commit or deployment.

## Verdict

The supplied images materially improve the served cocktail and stage. Suitable for an owner-facing review of this hybrid scene, with the limitations below disclosed. No severe integration defect was found that blocks that review. This is not unconditional public-release or photorealism sign-off: physical-phone/Safari performance and exact source-image registration remain outstanding.

| Question | Screenshot-based assessment |
| --- | --- |
| Does the cocktail pair crossfade cleanly? | No CSS position/size/origin jump. The gradual reveal and takeover are coherent at normal viewing size. The two supplied renders are not pixel-identical: small rim/base shifts and ice/peel changes remain visible under close scrutiny. Do not describe it as a perfectly registered render pair. |
| Is the served drink substantially more premium? | Yes: heavy glass, amber depth, ice detail and an intentional peel now replace the wireframe guide. It is the sole sharp foreground hero in the served hold. Bright baked highlights and saturated amber still look like a composited product render rather than physically lit glass in the WebGL room. |
| Is the stage more believable? | Yes: occupied performance silhouettes, haze, lighting and room scale read far better than registration guides. It is still a single image, not a 3D environment or verified documentary photography of the actual venue. |
| Does the focus transition read naturally? | The narrative reads clearly: sharp cocktail, then legible stage, with a soft foreground drink retained. The midpoint does not make both layers unreadable. It remains a CSS focus/parallax approximation, not optical rack focus. |
| Any owner-presentation blockers? | None found in the tested scene at these widths. Remaining polish: source-pair silhouette mismatch, flat table/background horizon, limited contact reflection, and the hard occlusion where the stream passes behind the opaque parts of the glass plate. Do not promise exact refraction. |

The source-stage OVERHEAD wordmark is deliberately retained. It reads as signage inside the stage, separate from the small editorial `OVERHEAD / THE BAR` masthead. There is no competing large UI brand headline in this section. Source artwork was not destructively edited.

## Artifacts

- [24-view final contact sheet](contact-sheet.png)
- [Placeholder / final comparison](comparison.png): six states, 1440 and 390, before left / after right.
- Six-state PNGs: `{1440,375,390,430}-{initial,shake,separation,pour,served,music}.png`.
- Extra 1440/390 frames: pour-setup, fill-late, handoff, tools-recede, rack-start, rack-middle, rack-end.
- Four reduced-motion captures, plus 375-short.png (375 x 667).
- [Asset specification and delivery cost](../../../public/media/overhead/INTEGRATION.md).
- `asset-results.json`: 44 registration/source/focus samples and delayed-load result.
- `verification-0.json`: reverse/reduced-motion; `verification-1.json`: idle/offscreen/context fallback and RAF sample.
- `extra-1.json`: breakpoint resize, alpha and injected asset failure; `extra-2.json`: 48 CTA/composite samples.

## Integration changes

Configured all six supplied WebPs in `hybrid-assets.ts`; native picture sources select the portrait/mobile set at <=600px. Prepared and served images share their projected containing block, dimensions, object-fit and transform origin. Shared registration was calibrated to the supplied pixels: rim y=.215, base y=.875, aspect .8. This corrects the floating base caused by using the old placeholder .18/.96 padding contract. It does not change the camera, world anchor, shaker, stream or object choreography.

The existing fill mask now has a restrained 1.5%-high feather. During the existing 9.9-10.7 takeover, its minimum alpha follows takeover, so the peel above the rim is also crossfaded instead of briefly being excluded by the rising mask. Both plates remain independently untransformed inside the same shared wrapper. Contact darkening was aligned to the new source base.

Readiness now requires the existing WebGL renderer AND all three selected source images to decode. The existing static fallback remains while loading; the scroll controller itself is unchanged. An image request/decode failure uses the static fallback rather than exposing incomplete cocktail layers. No per-frame React state, additional animation clock or WebGL pass was introduced.

React review: stable callbacks/ref set for one-time image completion, decode completion ignores detached images, native decorative picture sources, no retained decoded pixel arrays, existing lazy boundary and GPU disposal retained.

## Verification

- 1440 x 1000 desktop and 375 / 390 / 430 x 844 mobile: all six forward states reached, no horizontal overflow, no normal console/page errors.
- Reverse scrolling: all 24 targets within .025 timeline units. Prepared/served CSS rectangles, object-fit and transform-origin matched exactly in all 44 registration samples.
- Prepared opacity 1 before takeover, served full visibility and prepared opacity 0 in served hold. The stream enters the middle of the glass rim in desktop/mobile pour captures. Its original world endpoint and curve were retained.
- All 48 scene CTA hit tests passed; no overflow and no GLB requests. Reveal center tracks the projected stream surface to within .02 CSS px before takeover. The feather is intentionally not a hard clip; takeover deliberately reveals beyond the liquid level.
- Responsive selection: correct natural sizes and mobile filenames at 375/390/430, desktop files at 1440. Repeated 610 / 590 / 610 / 375 breakpoint crossings did not fail the scene. Cocktail corner alpha=0, stage alpha=255.
- Cold, cache-disabled fresh-page probes: mobile requests only the three mobile WebPs; desktop only its three desktop WebPs. No plate/model resources requested before approaching the scene. Earlier resize-and-reload resource history contained previous desktop requests; fresh-page probes isolate actual first-load behavior.
- Slow-load injection: prepared decoded while served was withheld; scene-ready stayed false, static fallback remained, and hybrid opacity stayed 0. Releasing the file decoded all three slots and revealed the scene together. No scroll-time image fetch/pop-in after readiness.
- Injected served-image request failure: canvas removed, static fallback present, scene-ready false and no overflow. Expected injected network error is not counted as a clean normal-scene console run.
- Reduced motion at all four widths: fixed 12.30 state, runway collapses to panel height, no overflow. Wheel input did not advance the narrative.
- Idle frame counter 50 -> 50 over 1.5s; offscreen 62 -> 62. No continuous rendering loop added.
- 375 x 667 short viewport: pour reaches 8.70, no overflow. WebGL context-loss event still removes canvas and uses the static fallback.
- Build, TypeScript, scoped scene lint and protected checkpoint comparison pass. Full repository lint still reports 19 pre-existing errors in unrelated UI components and hooks/use-mobile.ts. Existing Three.Clock/Windows shader-precision and large-chunk build warnings remain.

Test harness correction: the first delayed-load probe inspected the layer before the near-viewport mount completed. The corrected probe waits for the actual mounted prepared layer to decode; repeated test passed. No scroll choreography was changed to accommodate QA.

## Performance and optimization

WebGL draw calls are unchanged from the placeholder hybrid: initial/shake/separation 12, pour 8, served/music 2 desktop or 1 mobile. Lazy bar chunk 893,409 bytes uncompressed vs 893,355 before this integration (+54 bytes). No realtime glass/ice/garnish/stage/performer or WebGL DOF was reintroduced.

Selected image payloads: desktop 3,114,602 bytes (~2.97 MiB); mobile 1,090,732 bytes (~1.04 MiB). Mobile is 65% smaller. Three guide SVG requests during hidden loading add 1,261 bytes of body data. Originals were retained without recompression to avoid alpha-edge degradation; no alternative codec/variant was created without visual evidence of equivalent quality.

Nominal decoded RGBA image storage: 21.64 MiB desktop / 8.54 MiB mobile. This is a dimensional estimate, not total GPU/process memory. Browser/compositor filters and WebGL add allocations; no memory-leak guarantee is implied. Cached repeated-page JS heap samples varied ~28-57MB, with GC reducing later readings, not a calibrated memory benchmark.

Desktop Chromium scroll RAF sample at mobile viewport: 145 frames over 2414.2ms, median 16.6ms / p95 17ms. This is not measured physical-phone frame rate, thermal behavior, battery cost or Safari compatibility. Cold local asset requests are fast, but localhost latency is not representative of public mobile networks.

## Remaining limits

Exact source-pair registration would require a locked-camera prepared/served render from the same scene, not independent CSS transforms. Baked highlights cannot follow the moving realtime environment. The table is still a restrained flat WebGL surface, and the foreground/background join remains detectable. Some stage-image foreground content is naturally occluded by the existing bar plane. Actual-source loading, CSS blur cost and alpha quality must still be checked on physical target devices before public release.
