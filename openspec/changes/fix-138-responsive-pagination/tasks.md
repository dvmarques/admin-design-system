# Tasks

- [ ] Inspect AdsPagination, AdsButton, AdsSmartTable, tests, stories and existing APIs; verify baseline behavior.
- [ ] Implement stable width-aware page layout and smart ellipses with mandatory first/current/last, edge cases and accessible narrow fallback.
- [ ] Add opt-in arrows/custom navigation content, first/last controls and localized accessible labels.
- [ ] Add opt-in page jump with controlled validation, Enter/click, error feedback, sync and renderPageLink compatibility.
- [ ] Add opt-in loading state and controlled pageCount-change behavior; preserve keyboard focus and SSR/hydration.
- [ ] Add optional SmartTable page-size selection and item summary through existing pagination composition.
- [ ] Extend unit/component tests for boundaries, resize, keyboard, focus, loading, jump and dynamic counts.
- [ ] Add Storybook stories, docs and Next.js compiled CSS consumption coverage including zoom and narrow layouts.
- [ ] Run typecheck, lint, build, tests and npm run test:e2e; review intentional visual snapshots.
- [ ] Run npx.cmd prettier --write on changed files, npm run format and openspec.cmd validate --all --strict; review and fix all failures before PR.
