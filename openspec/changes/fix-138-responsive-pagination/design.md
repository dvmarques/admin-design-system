# Design

## Layout and measurement
Use a client-side ResizeObserver on the pagination container with a stable initial SSR-safe layout. Measure actual control widths and reserve room for mandatory pages and navigation; progressively add siblings and gap tokens. Avoid ResizeObserver feedback loops by separating available width from rendered-content width. When physically too narrow, provide an accessible horizontal fallback with vertical breathing room and no clipped focus outlines.

## API and accessibility
Keep text previous/next defaults. Opt-in arrow content without an icon dependency; customizable accessible labels and page-jump text/errors. Preserve aria-current, aria-label, keyboard focus, 44px targets where feasible, and avoid nested interactive controls when renderPageLink is used. Optional loading state prevents duplicate callbacks without fetching data. Controlled pageCount shrink requires documented correction behavior without callbacks during render.

## Styling and compatibility
Use existing design tokens and static Tailwind classes; preserve dark/light themes and compiled CSS distribution. Avoid new dependencies and SmartTable-specific logic in the base component. Hydrate without layout mismatch; resize adaptation happens after mount.

## Trade-offs
Width measurement adds observer complexity but handles sidebars/zoom unlike viewport breakpoints. Accessible horizontal scrolling remains last-resort only when mandatory controls physically cannot fit.
