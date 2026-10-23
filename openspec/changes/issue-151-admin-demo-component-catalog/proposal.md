# Admin demo component catalog (#151)

## Why
The flat demo navigation and incomplete examples make public UI components hard to discover and validate.

## What changes
- Introduce a searchable catalog, categorized navigation, stable component deep links, interactive examples, responsive/theme inspection and copyable real TSX snippets.
- Inventory all runtime UI exports from `packages/components/src/index.ts` and `packages/admin/src/index.ts`, including relevant compound parts; document route/anchor coverage and test it.
- Preserve existing business examples and legacy URLs.

## Impact
Demo application and its documentation/tests; public component APIs and package styling must remain unchanged unless a demonstrated defect requires a separately justified fix. Benefits consuming applications by providing verifiable usage examples.

## Out of scope
New components planned under #141, CoreUI code/assets, and unrelated #91 behavior.
