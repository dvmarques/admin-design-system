# Component catalog specification

## Requirements
### Searchable component index
The demo SHALL list existing public UI components in logical categories and allow case-insensitive search, keyboard navigation and direct stable links.

#### Scenario: Find component
Given a visitor searches for a public component, when a matching name is entered, then a result linking to its demonstration is displayed; no matches show a clear empty state.

### Complete demonstrable coverage
Every public runtime UI export SHALL have a documented navigable example, including compound subcomponents, or an explicit documented exclusion for non-visual utilities/test fixtures. The coverage check SHALL fail on an unregistered UI export.

#### Scenario: New export
When a new public UI component is exported without a demo mapping, the automated coverage test fails.

### Usable examples
Each page SHALL display a name, description, functional example and applicable variants, states and real TSX snippets with copying when feasible.

#### Scenario: Interactive example
When a user changes an interactive control, the example reflects the change and remains keyboard accessible.

### Responsive accessible navigation
The catalog SHALL support keyboard focus, active item indication, grouped navigation, narrow viewports, and light/dark preview without clipping.

#### Scenario: Narrow viewport
When the viewport is mobile sized, catalog navigation and demos remain operable without horizontal page overflow.

### Preserve application demos
Existing business pages SHALL remain reachable at their current paths or redirect to equivalent paths.

#### Scenario: Existing URL
When a user visits an existing business route, the relevant business example remains available.
