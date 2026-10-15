import { createRequire } from 'node:module';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

interface AxeViolation {
	id: string;
	nodes: { target: unknown[] }[];
}

const requireFromRoot = createRequire(join(process.cwd(), 'noop.js'));

/**
 * Audits the page with the repository's `axe-core`, injected into the page. `next dev` adds its
 * own `nextjs-portal` overlay, which belongs to neither the demo nor the library, so it is
 * excluded from the audited context.
 */
export async function expectNoAxeViolations(page: Page) {
	await page.addScriptTag({ path: requireFromRoot.resolve('axe-core/axe.min.js') });
	const violations = await page.evaluate(async () => {
		const axe = (
			window as unknown as {
				axe: { run(context: object): Promise<{ violations: AxeViolation[] }> };
			}
		).axe;
		const results = await axe.run({ exclude: [['nextjs-portal']] });
		return results.violations.map((violation) => ({
			id: violation.id,
			targets: violation.nodes.map((node) => node.target.join(' ')),
		}));
	});

	expect(violations).toEqual([]);
}
