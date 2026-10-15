import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoNavigation, demoNavigationItems } from '../app/demo-navigation';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

describe('DemoNavigation', () => {
	beforeEach(() => {
		pathname = '/';
	});

	it('lists one link per route with the application-provided hrefs', () => {
		render(<DemoNavigation />);

		for (const item of demoNavigationItems) {
			expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
		}
	});

	it.each(demoNavigationItems.map((item) => [item.href, item.label] as const))(
		'marks only the current route (%s) with aria-current="page"',
		(href, label) => {
			pathname = href;
			render(<DemoNavigation />);

			const marked = within(screen.getByRole('list'))
				.getAllByRole('link')
				.filter((link) => link.getAttribute('aria-current') === 'page');
			expect(marked).toHaveLength(1);
			expect(marked[0]).toHaveAccessibleName(label);
		},
	);

	it('marks nothing for a route without a navigation item', () => {
		pathname = '/clientes/novo';
		render(<DemoNavigation />);

		expect(screen.getAllByRole('link').some((link) => link.hasAttribute('aria-current'))).toBe(
			false,
		);
	});
});
