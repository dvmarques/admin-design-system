import { createRequire } from 'node:module';
import { join } from 'node:path';
import { expect, type Page } from '@playwright/test';

interface AxeViolation {
	id: string;
	nodes: {
		target: unknown[];
		html?: string;
		failureSummary?: string;
		any?: unknown[];
		all?: unknown[];
		none?: unknown[];
	}[];
}

const requireFromRoot = createRequire(join(process.cwd(), 'noop.js'));

/** Ceiling for waiting on running CSS transitions and finite animations before auditing. */
const animationSettleTimeoutMs = 2000;

/**
 * Audits the page with the repository's `axe-core`, injected into the page. `next dev` adds its
 * own `nextjs-portal` overlay, which belongs to neither the demo nor the library, so it is
 * excluded from the audited context.
 */
export async function expectNoAxeViolations(page: Page) {
	// Theme changes animate colors and some content fades in; auditing mid-animation measures
	// intermediate colors. Running transitions and finite animations are awaited, up to a ceiling;
	// looping animations (spinners, skeletons) never finish, so they are ignored.
	const pending = await page.evaluate(async (timeoutMs) => {
		const finite = document.getAnimations().filter((animation) => {
			if (animation.playState !== 'running') return false;
			if (animation instanceof CSSTransition) return true;
			const iterations = animation.effect?.getComputedTiming().iterations ?? Infinity;
			return animation instanceof CSSAnimation && Number.isFinite(iterations);
		});
		const describe = (animation: Animation) =>
			animation instanceof CSSTransition
				? `transition ${animation.transitionProperty}`
				: `animation ${(animation as CSSAnimation).animationName}`;
		const settled = Promise.all(
			finite.map((animation) => animation.finished.catch(() => undefined)),
		).then(() => [] as string[]);
		const ceiling = new Promise<string[]>((resolve) => {
			setTimeout(() => {
				resolve(finite.filter((animation) => animation.playState === 'running').map(describe));
			}, timeoutMs);
		});
		return Promise.race([settled, ceiling]);
	}, animationSettleTimeoutMs);
	expect(
		pending,
		`Animações ainda em andamento após ${animationSettleTimeoutMs} ms; a auditoria axe mediria cores intermediárias.`,
	).toEqual([]);
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
			failureSummaries: violation.nodes.map((node) => node.failureSummary),
			html: violation.nodes.map((node) => node.html),
			checks: violation.nodes.map((node) => ({ any: node.any, all: node.all, none: node.none })),
		}));
	});

	expect(violations).toEqual([]);
}
