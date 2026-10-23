# AdsPagination responsive behavior

## Requirements
### Width adaptation
The component MUST adapt displayed page buttons to the actual available container width, preserving unique first/current/last pages and previous/next navigation whenever pageCount > 0. It MUST avoid normal horizontal overflow and clipping of vertical focus indicators. When physical width is insufficient it MUST preserve mandatory controls using an accessible fallback.

#### Scenario: Intermediate page
Given 50 pages and current page 25, wide containers show adjacent pages when they fit; compact containers retain first, current and last with meaningful ellipses.

#### Scenario: Edge cases
Given pages 1, 2, 49, 50 or pageCount 0, 1, 2, no page number is duplicated and navigation limits remain correct.

### Optional controls
The component MUST retain text navigation by default and MAY opt into arrows, custom labels, first/last controls, loading and page jump. Page jump MUST reject invalid, fractional, unchanged and out-of-range values and support Enter and button activation.

#### Scenario: Page jump
Given showPageJump true, a valid target calls onPageChange once; invalid input reports an accessible error without navigation.

### Accessibility and integration
The component MUST preserve aria-current, descriptive navigation names, keyboard focus and SSR hydration compatibility, including custom links. SmartTable MAY opt into page-size and total-item summary controls without adding fetching logic to AdsPagination.

#### Scenario: Narrow SmartTable
At container resize, sidebar changes or zoom, the pagination controls remain operable and focus indicators are not clipped.

### Dynamic totals
The component MUST document and test its controlled behavior when pageCount decreases below the supplied page; it MUST NOT fire callbacks during render.
