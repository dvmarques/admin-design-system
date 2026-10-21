import type { HTMLAttributes } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdsBreadcrumb, type AdsBreadcrumbItem } from '../src/index.js';

const Link = ({ href, ...props }: { href: string } & HTMLAttributes<HTMLAnchorElement>) => (
	<a data-consumer-link="" href={href} {...props} />
);

const trail: AdsBreadcrumbItem[] = [
	{ href: '/1', label: 'Início' },
	{ href: '/2', label: 'Relatórios' },
	{ href: '/3', label: 'Vendas' },
	{ href: '/4', label: 'Região' },
	{ href: '/5', label: 'Estado' },
	{ label: 'Mensal' },
];

function labels() {
	return within(screen.getByRole('navigation'))
		.getAllByRole('listitem')
		.map((item) => item.textContent);
}

describe('AdsBreadcrumb separator', () => {
	it('keeps the slash separator by default, hidden from assistive technology', () => {
		render(<AdsBreadcrumb items={trail.slice(0, 2)} />);
		const separator = screen.getByText('/');
		expect(separator).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders a consumer separator between the items, hidden from assistive technology', () => {
		render(<AdsBreadcrumb items={trail.slice(0, 3)} separator={<span data-sep="">›</span>} />);
		const separators = document.querySelectorAll('[data-sep]');
		expect(separators).toHaveLength(2);
		for (const separator of separators) {
			expect(separator.closest('[aria-hidden="true"]')).not.toBeNull();
		}
		expect(screen.queryByText('/')).toBeNull();
	});
});

describe('AdsBreadcrumb collapse', () => {
	it('shows every item without maxItems', () => {
		render(<AdsBreadcrumb items={trail} />);
		expect(labels()).toHaveLength(6);
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('shows every item when the trail does not exceed maxItems', () => {
		render(<AdsBreadcrumb items={trail} maxItems={6} />);
		expect(labels()).toHaveLength(6);
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('collapses the middle items behind an expand button, keeping the current page', () => {
		render(<AdsBreadcrumb items={trail} maxItems={4} />);
		expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument();
		expect(screen.queryByText('Relatórios')).toBeNull();
		expect(screen.queryByText('Vendas')).toBeNull();
		expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Estado' })).toBeInTheDocument();
		expect(screen.getByText('Mensal')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('button', { name: 'Show full path' }).closest('li')).not.toBeNull();
	});

	it('respects itemsBeforeCollapse and itemsAfterCollapse', () => {
		render(
			<AdsBreadcrumb itemsAfterCollapse={1} itemsBeforeCollapse={2} items={trail} maxItems={4} />,
		);
		expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Relatórios' })).toBeInTheDocument();
		expect(screen.queryByText('Vendas')).toBeNull();
		expect(screen.queryByText('Estado')).toBeNull();
		expect(screen.getByText('Mensal')).toHaveAttribute('aria-current', 'page');
	});

	it('never hides the current page, whatever the counts', () => {
		render(
			<AdsBreadcrumb itemsAfterCollapse={0} itemsBeforeCollapse={0} items={trail} maxItems={2} />,
		);
		expect(screen.getByText('Mensal')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
	});

	it('does not collapse when the kept items already cover the trail', () => {
		render(
			<AdsBreadcrumb itemsAfterCollapse={3} itemsBeforeCollapse={3} items={trail} maxItems={2} />,
		);
		expect(labels()).toHaveLength(6);
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('expands in place and moves the focus to the first revealed item', () => {
		render(<AdsBreadcrumb items={trail} maxItems={4} />);
		fireEvent.click(screen.getByRole('button', { name: 'Show full path' }));
		expect(screen.queryByRole('button')).toBeNull();
		expect(labels()).toHaveLength(6);
		expect(screen.getByRole('link', { name: 'Relatórios' })).toHaveFocus();
		expect(labels().at(-1)).toContain('Mensal');
	});

	it('keeps the focus inside the breadcrumb when the first revealed item has no link', () => {
		render(
			<AdsBreadcrumb
				items={[
					{ href: '/1', label: 'Início' },
					{ label: 'Sem link' },
					{ href: '/3', label: 'Vendas' },
					{ href: '/4', label: 'Estado' },
					{ label: 'Mensal' },
				]}
				maxItems={3}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Show full path' }));
		const item = screen.getByText('Sem link').closest('li');
		expect(item).toHaveFocus();
	});

	it('overrides the default labels with props', () => {
		render(
			<AdsBreadcrumb
				aria-label="Trilha de navegação"
				expandLabel="Mostrar caminho completo"
				items={trail}
				maxItems={4}
			/>,
		);
		expect(screen.getByRole('navigation', { name: 'Trilha de navegação' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Mostrar caminho completo' })).toBeInTheDocument();
	});

	it('uses English defaults', () => {
		render(<AdsBreadcrumb items={trail} maxItems={4} />);
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument();
	});

	it('renders consumer links of the collapsed items once expanded', () => {
		render(
			<AdsBreadcrumb
				items={trail.map((item, index) => ({
					label: item.label,
					...(index < trail.length - 1
						? { renderLink: (props) => <Link href={`/p${index}`} {...props} /> }
						: {}),
				}))}
				maxItems={4}
			/>,
		);
		expect(
			screen.getAllByRole('link').every((link) => link.hasAttribute('data-consumer-link')),
		).toBe(true);
		fireEvent.click(screen.getByRole('button', { name: 'Show full path' }));
		const link = screen.getByRole('link', { name: 'Vendas' });
		expect(link).toHaveAttribute('data-consumer-link');
		expect(link).toHaveClass('text-text-muted', 'hover:text-text');
	});
});

describe('AdsBreadcrumb on the server', () => {
	it('renders from a function component without a client boundary, with renderLink', () => {
		// A plain function component stands for a Server Component: no hooks, no "use client".
		function Page() {
			return (
				<AdsBreadcrumb
					items={trail.map((item) => ({
						label: item.label,
						renderLink: (props) => <Link href="/x" {...props} />,
					}))}
					maxItems={4}
				/>
			);
		}
		const html = renderToString(<Page />);
		expect(html).toContain('aria-label="Breadcrumb"');
		expect(html).toContain('aria-label="Show full path"');
		expect(html).toContain('data-consumer-link');
		expect(html).not.toContain('Relatórios');
	});
});
