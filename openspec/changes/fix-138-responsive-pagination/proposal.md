# Responsive AdsPagination (#138)

## Why
AdsPagination overflows narrow containers and clips focus/hover indicators. Consumers need accessible, responsive navigation and optional richer controls without breaking existing behavior.

## What changes
- Adapt visible page numbers to measured container width; always prioritize first, current, last and previous/next controls.
- Optional arrow navigation, page jump, loading state, localized labels, first/last navigation.
- Optional SmartTable page-size selector and item summary, controlled by consumer props.
- Preserve renderPageLink, legacy renderPage, SSR/hydration and existing defaults.
- Add tests, stories, docs and Next.js integration coverage.

## Affected packages/APIs
AdsPagination public props and AdsSmartTable pagination composition; styling, tests, Storybook, documentation.

## Out of scope
Unknown total pages; issue #91; data fetching or pagination state ownership.
