import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsBreadcrumb,
	AdsDropdown,
	AdsNav,
	AdsPagination,
	AdsTabs,
	getAdsPaginationItems,
} from '../src/index.js';

describe('navigation components', () => {
	it('renders breadcrumb semantics and current page', () => {
		render(<AdsBreadcrumb items={[{ href: '/home', label: 'Início' }, { label: 'Relatórios' }]} />);
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
		expect(screen.getByText('Relatórios')).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/home');
	});

	it('renders active nav destination', () => {
		render(
			<AdsNav
				items={[
					{ href: '/dashboard', label: 'Dashboard', current: true },
					{ label: 'Sair', onClick: vi.fn() },
				]}
			/>,
		);
		expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
	});

	it('supports manual tabs keyboard navigation', () => {
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="one">Painel um</AdsTabs.Panel>
				<AdsTabs.Panel value="two">Painel dois</AdsTabs.Panel>
			</AdsTabs>,
		);
		const first = screen.getByRole('tab', { name: 'Um' });
		const second = screen.getByRole('tab', { name: 'Dois' });
		expect(first).toHaveAttribute('aria-selected', 'true');
		expect(first).toHaveAttribute('data-state', 'active');
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(second).toHaveFocus();
		fireEvent.keyDown(second, { key: 'Enter' });
		expect(screen.getByText('Painel dois')).toBeInTheDocument();
		expect(second).toHaveAttribute('data-state', 'active');
		expect(second).toHaveClass('bg-primary', 'border-b-primary');
	});

	it('opens dropdown and restores focus after Escape', () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item onSelect={() => undefined}>Editar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Mais' });
		fireEvent.click(trigger);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('styles menu items as actions and disabled text', () => {
		render(
			<AdsDropdown defaultOpen>
				<AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item href="#edit">Editar</AdsDropdown.Item>
					<AdsDropdown.Item disabled>Arquivar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveClass(
			'box-border',
			'max-w-full',
			'font-sans',
			'no-underline',
			'border-0',
		);
		expect(screen.getByRole('menuitem', { name: 'Arquivar' })).toHaveClass(
			'bg-transparent',
			'border-0',
			'text-text-muted',
		);
	});

	it('calculates compact pagination and disables boundaries', () => {
		expect(getAdsPaginationItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
		render(<AdsPagination page={1} pageCount={3} onPageChange={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
			'aria-current',
			'page',
		);
		expect(screen.getByRole('button', { name: 'Página 1' })).toHaveClass('ads-button');
		expect(screen.getByRole('list')).toHaveClass('list-none');
	});
});
