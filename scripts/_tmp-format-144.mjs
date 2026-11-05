import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Execução temporária e sem escrita no GitHub: apenas diagnóstico de formatação da PR #302.
const paths = [
	"apps/admin-demo/app/(admin)/componentes/datas/page.tsx",
	"apps/admin-demo/app/(admin)/componentes/datas/time-picker-examples.tsx",
	"apps/admin-demo/app/catalogo/catalog-demos.tsx",
	"apps/docs/src/time-picker.stories.tsx",
	"docs/component-changelog.md",
	"e2e/time-picker.spec.ts",
	"openspec/changes/add-ads-time-picker-144/design.md",
	"openspec/changes/add-ads-time-picker-144/proposal.md",
	"openspec/changes/add-ads-time-picker-144/specs/time-picker/spec.md",
	"openspec/changes/add-ads-time-picker-144/tasks.md",
	"packages/components/src/time-picker.tsx",
	"packages/components/tests/time-picker.test.tsx",
	"docs/admin-demo-catalog.md",
	"apps/admin-demo/app/catalogo/catalog-snippets.json"
];
execFileSync(process.execPath, ['node_modules/prettier/bin/prettier.cjs', '--write', ...paths], {
	stdio: 'inherit',
});
for (const path of paths) {
	console.log('FORMATTED_FILE_144=' + JSON.stringify([path, readFileSync(path, 'utf8')]));
}
