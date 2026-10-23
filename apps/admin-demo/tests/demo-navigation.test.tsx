import { fireEvent, render, screen } from '@testing-library/react';
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
			expect(screen.getByRole('link', { name: item.label, hidden: true })).toHaveAttribute(
				'href',
				item.href,
			);
		}
	});

	it.each(demoNavigationItems.map((item) => [item.href, item.label] as const))(
		'marks only the current route (%s) with aria-current="page"',
		(href, label) => {
			pathname = href;
			render(<DemoNavigation />);

			const marked = screen
				.getAllByRole('link', { hidden: true })
				.filter((link) => link.getAttribute('aria-current') === 'page');
			expect(marked).toHaveLength(1);
			expect(marked[0]).toHaveAccessibleName(label);
		},
	);

	it('marks nothing for a route without a navigation item', () => {
		pathname = '/rota-sem-item';
		render(<DemoNavigation />);

		expect(screen.getAllByRole('link').some((link) => link.hasAttribute('aria-current'))).toBe(
			false,
		);
	});
	it('preserves group identity and manual expansion when the destination group opens', () => {
		const { rerender } = render(<DemoNavigation />);
		const basics = screen.getByText('Básicos', { exact: true }).closest('details')!;
		const applications = screen
			.getByText('Exemplos de aplicação', { exact: true })
			.closest('details')!;
		basics.open = true;
		fireEvent(basics, new Event('toggle'));
		applications.open = false;
		fireEvent(applications, new Event('toggle'));
		pathname = '/catalogo/input';
		rerender(<DemoNavigation />);
		expect(screen.getByText('Básicos', { exact: true }).closest('details')).toBe(basics);
		expect(basics).toHaveAttribute('open');
		expect(applications).not.toHaveAttribute('open');
		expect(screen.getByText('Formulários', { exact: true }).closest('details')).toHaveAttribute(
			'open',
		);
		pathname = '/catalogo/textarea';
		rerender(<DemoNavigation />);
		expect(basics).toHaveAttribute('open');
		expect(applications).not.toHaveAttribute('open');
	});
});
