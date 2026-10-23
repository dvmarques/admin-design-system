# Design

- Use a typed catalog registry with categories, slugs, descriptions, runnable demo renderers and TSX source strings; validate coverage against public runtime exports.
- Keep navigation and interactive previews in client components; preserve Next.js App Router route boundaries and stable paths. Reuse AdsAdminShell and existing design tokens/CSS rather than changing distributed library styles.
- Accessible grouped sidebar with keyboard-operable disclosure, aria-current, visible focus, and mobile closing behavior. Search uses labeled input and clear empty state.
- Preview controls select light/dark and bounded widths without overflow; snippets use actual supported props and a copy control with feedback.
- Retain application routes; redirects only if necessary. No new dependency by default, no change to library bundle or CSS distribution.
- Tradeoff: registry adds metadata but enables predictable discoverability and automated coverage; route-per-component avoids fragile anchors.
