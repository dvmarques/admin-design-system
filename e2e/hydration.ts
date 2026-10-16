import { expect, type Locator } from '@playwright/test';

/**
 * Waits until React has hydrated the element. Events fired before that, such as `selectOption` or
 * `fill`, can be lost or replayed against stale state, which makes the test flaky on slow runners.
 */
export async function waitForHydration(locator: Locator) {
	await expect
		.poll(() =>
			locator.evaluate((element) =>
				Object.keys(element).some((key) => key.startsWith('__reactProps$')),
			),
		)
		.toBe(true);
}
