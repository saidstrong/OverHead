# Overhead authored bar assets

Historical assets: retained for checkpoint recovery and the offline validation scripts. The hybrid scene no longer loads this GLB. Current rendered-plate integration is documented in `public/media/overhead/README.md`; the runtime descriptions below record the earlier stylized pass.

`bar-assets.glb` is original project geometry authored locally in `scripts/author-bar-assets.mjs`. No downloaded model, scan, character likeness, texture or third-party art is included. There is no external asset-license or attribution dependency. Three.js (MIT, already a project dependency) is used as the offline mesh/export tool; its package license remains applicable to the library, not as an external artwork license.

This is **script-authored geometry from explicit profiles/control cages**, not a claim of a manually sculpted or scanned commercial asset. Rebuild from the repository root with `node scripts/author-bar-assets.mjs`.

- RocksGlass: continuous closed cross-section, outer and inner walls, 0.21-unit solid base, rounded heel and rolled rim. Subtle shallow heel shaping; 64 radial segments. Existing scene dimensions are retained.
- Ice1 / Ice2: distinct authored control cages with small rounded hull bevels. Shared runtime material. No decorative crack/bubble meshes.
- PeelRind / PeelPith / PeelEdge: designed S-curve ribbon with 0.008-unit thickness and separate rind/pith surfaces. No texture dependency.
- Vocalist / Drummer: faceless fixed-pose silhouettes, each one merged mesh. No rig, skinning, animation clips, facial detail or crowd.

Optimization: indexed meshes, merged identical vertices, removed UVs (unused), removed collapsed triangles and compacted unused vertices. No hidden rig/cameras/lights, embedded textures or 4K maps. `asset-stats.json` records exact generated sizes, vertex/triangle counts and bounds. No Draco/Meshopt decoder is added: this small texture-free model avoids the extra runtime/download dependency.

Runtime uses `/models/overhead/bar-assets.glb`, loaded only with the lazy scene. Parsed geometry is cached by the existing R3F loader; scene-owned clones/materials are explicitly disposed. Embedded neutral materials are not the final art direction. The stylized pass assigns smoked, edge-weighted glass transparency, faceted translucent ice, copper liquid, rind/pith and dark silhouette materials. No native transmission or screen-space glass refraction is used.

Art direction: intentionally stylized, not photographic. The previous realism experiment and its optical layers were retired. Authored geometry is unchanged; adding GLB assets is not itself evidence of premium visual sign-off. See `output/playwright/stylized/QA.md` for the current screenshot-based assessment.
