# Final commit verification

2026-09-09. The owner accepted the final hybrid integration for evaluation. This pass made no visual, choreography, camera, asset or section changes and did not deploy.

- `npm run build`: PASS (existing large-chunk and Vinext route-classification warnings).
- `npx tsc --noEmit`: PASS.
- `npx oxlint components/scene`: PASS.
- `node scripts/check-hybrid-motion.mjs`: PASS; protected geometry, choreography, stream/fill timing, cameras and GSAP controller match checkpoint 0d31c0e.
- `npm run lint`: FAIL with the same 19 pre-existing errors in unrelated UI components and hooks/use-mobile.ts. Those files were neither modified nor staged.
- Existing Playwright capture/reverse/reduced/behavior scripts rerun against localhost: 24 forward states, 24 reverse targets, all four reduced-motion widths, idle/offscreen pause and context fallback pass. No normal console/page errors or horizontal overflow.
- See [raw final verification](commit-verification.json) for this pass, separate from the earlier detailed integration [QA report](QA.md).

The production build was compiled successfully; browser tests used the existing localhost development server. No production deployment, actual-phone test or Safari sign-off is implied.

Staged scope: Overhead scene implementation and retired runtime modules, final six WebPs, shared hybrid asset/layer code, loading/focus integration, asset documentation, motion verifier and selected QA evidence. No unrelated UI/hook, backend, CMS, dependency or environment changes. Common staged credential/private-key pattern scan found no matches (not a comprehensive security audit).

The final contact sheet, before/after comparison, QA reports/results and browser verification scripts are versioned explicitly. Individual screenshot PNGs, HTML sheet builders and browser caches remain local ignored generated artifacts; capture scripts can regenerate the individual states. Build output, dependencies and compiler caches also remain ignored. The existing ignore policy was not broadened or removed.
