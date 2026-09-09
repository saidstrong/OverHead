# Approved hybrid asset integration

Source: the six final WebP files supplied and approved by the user in this directory, 2026-09-09. No external artwork was sourced, generated, retouched, cropped into new files or recompressed during integration. Source approval is not an independent copyright/licensing audit.

## Files and responsive delivery

| Role | Desktop filename | Mobile filename | Desktop / mobile dimensions |
| --- | --- | --- | --- |
| Prepared glass | overhead-cocktail-prepared-desktop.webp | overhead-cocktail-prepared-mobile.webp | 1200 x 1500 / 640 x 800 |
| Served glass | overhead-cocktail-served-desktop.webp | overhead-cocktail-served-mobile.webp | 1200 x 1500 / 640 x 800 |
| Stage | overhead-stage-desktop.webp | overhead-stage-mobile.webp | 1920 x 1080 / 900 x 1350 |

Cocktail plates have alpha; stage is opaque. Native picture selects the mobile source at <=600px, including the intentionally composed portrait stage. Images only mount inside the existing 600px near-viewport lazy boundary. All three selected files decode before the scene becomes ready; a load/decode error uses the existing static scene fallback. There is no scroll-time fetch, alternate-frame image sequence or new motion clock.

## Shared registration

`components/scene/hybrid-assets.ts` owns the URLs and shared registration: rim y=0.215, base y=0.875, center x=0.5, aspect=0.8. This is measured to the supplied artwork, replacing the placeholder-only .18/.96 contract. Both plates share exactly the same containing rectangle, object-fit: contain, transform origin and world projection. The Three camera, world glass base/rim anchor, shaker and stream remain unchanged. Contact darkening is aligned to the actual image base.

The prepared/served source images are close but not pixel-identical. Small rim/base/peel silhouette and internal ice changes cannot be removed through identical CSS transforms. The reveal has a restrained 1.5%-high feather; the existing 9.9-10.7 takeover and served hold are unchanged. Do not independently crop, translate or scale one plate to compensate for one feature at the expense of the others.

The stage wordmark is retained: it reads as in-space signage, separated from the small editorial masthead, not a duplicate UI headline. No destructive image editing was done.

## Delivery and memory cost

Desktop files: prepared 1,447,222 bytes; served 1,479,094; stage 188,286. Total 3,114,602 bytes (~2.97 MiB).

Mobile files: prepared 472,310 bytes; served 471,596; stage 146,826. Total 1,090,732 bytes (~1.04 MiB), 65% less than desktop.

Nominal decoded RGBA backing storage for the three selected sources is ~21.64 MiB desktop / ~8.54 MiB mobile. This is width x height x 4, NOT measured total browser/GPU memory; filters, compositor surfaces, browser caches and WebGL add overhead. No pixel arrays or extra image copies are retained in React. The source images remain unchanged to avoid degrading fine glass/ice alpha edges. These cocktail files exceed the original proposed transfer budget; real-phone/slow-network performance should be reviewed before public release.

No new dependency, geometry or WebGL postprocessing pass. Lazy scene chunk: 893,409 bytes uncompressed, versus 893,355 before final asset integration (54-byte increase). WebGL draw calls remain 12 initial/shake/separation, 8 pour, 2 desktop or 1 mobile served/music. CSS image/filter cost is additional and is not included in those counts.

## QA

See `output/playwright/final-assets/QA.md`, `contact-sheet.png` and `comparison.png`. The assets are integrated for review, not a claim of physically exact refraction or flawless photographic continuity. No deployment or commit was performed by this integration pass.
