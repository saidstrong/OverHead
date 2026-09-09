# Hybrid visual plate contract

## Current integration (2026-09-09)

The six user-approved `overhead-*.webp` files are now installed. See [INTEGRATION.md](INTEGRATION.md) for current filenames, shared registration, delivery cost and limitations. The implementation uses the source images unchanged. Loading is atomic: the existing static fallback remains until the selected cocktail pair and stage decode; an image error keeps the scene in its static fallback.

**The remainder is the historical pre-artwork specification, not the current installation state.** Its proposed rim/base positions and size budgets were superseded by the delivered assets; nullable slots are now populated.

These SVG files are labeled registration placeholders, NOT final bar artwork. No product or stage artwork was generated for this pass.

## Install final artwork

Place approved files here, then set the corresponding URLs in `components/scene/hybrid-assets.ts`. Slots default to null, so missing production files do not cause 404 requests. Each slot accepts `{ desktop: '/media/overhead/…', mobile: '/media/overhead/…' }`. Mobile is optional; the picture source switches at 600px. Failed images retain the marked placeholder and do not block the shaker/scroll sequence.

| Slot | Suggested names | Desktop | Mobile | Alpha |
| --- | --- | --- | --- | --- |
| Prepared receiving glass | cocktail-prepared.webp / cocktail-prepared-mobile.webp | 1200 x 1500 | 640 x 800 | Required |
| Finished drink | cocktail-served.webp / cocktail-served-mobile.webp | 1200 x 1500 | 640 x 800 | Required |
| Live stage | stage-desktop.avif / stage-mobile.avif | 1920 x 1080 | 900 x 1350 | Not required |

Cocktail: use alpha WebP for practical delivery, retain a full-resolution RGBA PNG master. Both versions are 4:5. Stage: AVIF or WebP, opaque; choose the best tested size/quality result. The URLs determine format; no codec-specific runtime or video required. Proposed transfer budgets, not measured final sizes: each cocktail <=250KB desktop / <=100KB mobile; stage <=350KB desktop / <=180KB mobile. Final image decoding and GPU upload need real-device QA.

## Mandatory cocktail registration

Prepared and served plates MUST be renders from the same locked camera, identical pixel dimensions and identical framing. Do not independently crop them. Both must register glass base at `(50%,96%)`, rim center at `(50%,18%)`, and glass outer rim edges approximately x=14%/86%. All garnish must fit inside the canvas. Keep transparent padding and do not trim on export. A standard three-quarter product view with a modest downward view into the rim matches the current scene; match the placeholder registration in browser before final export. Fixed 2D perspective cannot reproduce all 3D camera angles exactly.

Prepared plate: the same empty heavy rocks glass, already containing its one large (maximum two) ice piece and citrus twist. Served plate: same setup, warm dark amber liquid at about y=31% of the plate (roughly the existing filled level). Keep ice/garnish movement between renders minimal. No text, background tabletop, baked depth blur, cast-shadow rectangle or different lighting between plates. Include a subtle alpha contact shadow only if it aligns with the base; the app supplies a small contact cue.

Why two renders: a single finished PNG cannot convincingly show an empty glass filling. The prepared plate stays underneath as the served plate is revealed from the projected liquid surface upward. Over time 9.9–10.7 the mask opens completely and prepared opacity falls to zero. Served hold remains unchanged. If only a served render is supplied, the prepared guide remains during the pour: integration works, but that is NOT production-ready continuity.

Lighting: controlled warm key from upper left, narrow cooler rim from right, deep blacks. Cocktail remains an independent alpha layer in front of the realtime canvas; the stream terminates behind its receiving region. Do not bake the shaker into either render.

## Stage composition

One cinematic room image, not a collage of tiny props. Dark live performers, amp, optional partial kit, restrained amber/deep red and minimal cool blue. Reserve the lower portion for the existing foreground bar plane. Desktop stage subject placement should leave the left editorial copy readable; mobile requires an intentional portrait crop with important performers in the central/right safe area. No text, logos, UI or baked blur. Supply readable unblurred artwork; the app applies responsive blur/brightness and a restrained scale/translate using the existing focus progress.

## Integration and limits

The realtime camera projects the original glass base/rim into CSS pixel bounds each demanded frame. All major progress derives from the existing scroll seek; no autonomous animation clock or per-frame React state. Images mount only when the section enters the existing preload boundary. CSS filters are limited to these layers (max stage blur 8px desktop/4px mobile; cocktail 6px/3px). There is no WebGL DOF, native transmission, GLB request, stage geometry or performer animation.

This prepares a technically testable swap, not final visual sign-off. The real plate pair must be reviewed across the pour/served handoff at 1440/375/390/430 and with reduced motion before release. Do not use the guide SVGs as final production art.

Format reference: [MDN image format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types). WebP supports alpha; AVIF is also suitable for compressed delivery. If older-client coverage is required, use WebP as the configured stage URL or extend the picture sources with an explicit fallback after testing the target browsers.
