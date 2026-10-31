import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
	AdsAdminShell,
	AdsOrganizationSwitcher,
	type AdsOrganization,
	type AdsOrganizationSwitcherProps,
} from '../src/index.js';

const organizations: AdsOrganization[] = [
	{ id: 'acme', name: 'Acme Brasil', description: 'Plano Enterprise' },
	{ id: 'globex', name: 'Globex', initials: 'GX', logoSrc: '/globex.png' },
	{ id: 'initech', name: 'Initech', disabled: true },
];

function setup(props: Partial<AdsOrganizationSwitcherProps> = {}) {
	return render(<AdsOrganizationSwitcher organizations={organizations} value="acme" {...props} />);
}

const trigger = (name: string | RegExp = /Organização atual: .*Acme Brasil/) =>
	screen.getByRole('button', { name });

describe('AdsOrganizationSwitcher trigger', () => {
	it('shows the current organization with initials, name, description and a name that includes it', () => {
		setup();

		const button = trigger();
		expect(button).toHaveAttribute('aria-expanded', 'false');
		expect(button).toHaveAttribute('aria-haspopup', 'dialog');
		expect(button).toHaveTextContent('Acme Brasil');
		expect(button).toHaveTextContent('Plano Enterprise');
		expect(button).toHaveTextContent('AB');
		expect(button).toHaveAccessibleName('Organização atual: AB Acme Brasil Plano Enterprise');
	});

	it('truncates long names keeping the full text available', () => {
		const name = 'Organização com um nome extraordinariamente longo para a barra lateral';
		setup({ organizations: [{ id: 'x', name }], value: 'x' });

		expect(screen.getByRole('button', { name: new RegExp(name.slice(0, 20)) })).toContainElement(
			screen.getByTitle(name),
		);
	});

	it('falls back to initials when the logo fails', () => {
		setup({
			organizations: [{ id: 'g', name: 'Globex', logoSrc: '/quebrado.png' }],
			value: 'g',
		});
		const logo = document.querySelector('img');
		expect(logo).toHaveAttribute('src', '/quebrado.png');

		act(() => {
			logo!.dispatchEvent(new Event('error'));
		});

		expect(document.querySelector('img')).toBeNull();
		expect(trigger(/Globex/)).toHaveTextContent('GL');
	});

	it('is disabled and says so when there are no organizations', () => {
		setup({ organizations: [], value: undefined });

		const button = screen.getByRole('button', { name: /Sem organizações/ });
		expect(button).toBeDisabled();
	});
});

describe('AdsOrganizationSwitcher panel', () => {
	it('opens, marks the current organization explicitly and focuses it', async () => {
		const events = userEvent.setup();
		setup();

		await events.click(trigger());

		const panel = await screen.findByRole('dialog', { name: 'Trocar de organização' });
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		expect(trigger()).toHaveAttribute('aria-controls', panel.id);
		const current = within(panel).getByRole('option', { name: /^Acme Brasil/ });
		expect(current).toHaveAttribute('aria-selected', 'true');
		expect(current).toHaveTextContent('(organização atual)');
		const list = within(panel).getByRole('listbox', { name: 'Organizações' });
		await waitFor(() => expect(list).toHaveFocus());
		expect(list).toHaveAttribute('aria-activedescendant', current.id);
		expect(within(panel).getByRole('option', { name: 'Globex' })).toHaveAttribute(
			'aria-selected',
			'false',
		);
	});

	it('selects another organization, closes and returns the focus to the trigger', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		setup({ onValueChange });
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(onValueChange).toHaveBeenCalledWith('globex');
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
		expect(trigger()).toHaveTextContent('Acme Brasil');
	});

	it('does not call back when the current organization is chosen again', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		setup({ onValueChange });
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: /^Acme Brasil/ }));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('does not select a disabled organization', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		setup({ onValueChange });
		await events.click(trigger());

		const initech = await screen.findByRole('option', { name: 'Initech' });
		expect(initech).toHaveAttribute('aria-disabled', 'true');
		await events.click(initech);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('updates its own selection when uncontrolled', async () => {
		const events = userEvent.setup();
		render(<AdsOrganizationSwitcher defaultValue="acme" organizations={organizations} />);
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(screen.getByRole('button', { name: /Organização atual: .*Globex/ })).toBeVisible();
	});

	it('closes with Escape and returns the focus', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(trigger());
		await screen.findByRole('dialog');

		await events.keyboard('{Escape}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
	});

	it('returns the focus to the trigger on Escape even when it opened already open', async () => {
		const events = userEvent.setup();
		setup({ defaultOpen: true });
		await screen.findByRole('dialog');

		await events.keyboard('{Escape}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
	});

	it('moves between options with the arrows', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(trigger());
		const acme = await screen.findByRole('option', { name: /^Acme Brasil/ });
		const list = screen.getByRole('listbox');
		await waitFor(() => expect(list).toHaveFocus());
		expect(list).toHaveAttribute('aria-activedescendant', acme.id);

		await events.keyboard('{ArrowDown}');

		expect(list).toHaveAttribute(
			'aria-activedescendant',
			screen.getByRole('option', { name: 'Globex' }).id,
		);
	});

	it('hides the search for few organizations and shows it for many', async () => {
		const events = userEvent.setup();
		const { unmount } = setup();
		await events.click(trigger());
		await screen.findByRole('dialog');
		expect(screen.queryByRole('searchbox')).toBeNull();
		unmount();

		const many = Array.from({ length: 9 }, (_, index) => ({
			id: `o${index}`,
			name: `Empresa ${index}`,
		}));
		setup({ organizations: many, value: 'o0' });
		await events.click(screen.getByRole('button', { name: /Organização atual: .*Empresa 0/ }));

		const search = await screen.findByRole('searchbox', { name: 'Buscar organização' });
		await waitFor(() => expect(search).toHaveFocus());
	});

	it('filters ignoring case and accents and shows a no results state', async () => {
		const events = userEvent.setup();
		const many = [
			{ id: 'a', name: 'Água Azul' },
			...Array.from({ length: 8 }, (_, index) => ({ id: `o${index}`, name: `Empresa ${index}` })),
		];
		setup({ organizations: many, value: 'o0' });
		await events.click(screen.getByRole('button', { name: /Organização atual/ }));
		const search = await screen.findByRole('searchbox');

		await events.type(search, 'agua');
		expect(screen.getAllByRole('option')).toHaveLength(1);
		expect(screen.getByRole('option', { name: /Água Azul/ })).toBeVisible();

		await events.clear(search);
		await events.type(search, 'inexistente');
		expect(screen.getByRole('status')).toHaveTextContent('Nenhuma organização encontrada.');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('can force the search for a short list', async () => {
		const events = userEvent.setup();
		setup({ searchable: true });
		await events.click(trigger());

		expect(await screen.findByRole('searchbox')).toBeVisible();
	});

	it('offers "Gerenciar organizações" only when provided', async () => {
		const events = userEvent.setup();
		const onSelect = vi.fn();
		const { unmount } = setup();
		await events.click(trigger());
		await screen.findByRole('dialog');
		expect(screen.queryByText('Gerenciar organizações')).toBeNull();
		unmount();

		setup({ manage: { onSelect } });
		await events.click(trigger());
		await events.click(await screen.findByRole('button', { name: 'Gerenciar organizações' }));
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders the manage action as a link when it has an href', async () => {
		const events = userEvent.setup();
		setup({ manage: { href: '/organizacoes', label: 'Administrar' } });
		await events.click(trigger());

		expect(await screen.findByRole('link', { name: 'Administrar' })).toHaveAttribute(
			'href',
			'/organizacoes',
		);
	});

	it('works with a single organization, without search', async () => {
		const events = userEvent.setup();
		setup({ organizations: [organizations[0]!] });
		await events.click(trigger());

		expect(await screen.findAllByRole('option')).toHaveLength(1);
		expect(screen.queryByRole('searchbox')).toBeNull();
	});

	it('shows a loading state and an error with retry', async () => {
		const events = userEvent.setup();
		const onRetry = vi.fn();
		const { rerender } = setup({ status: 'loading' });
		await events.click(trigger());
		expect(await screen.findByRole('status')).toHaveTextContent('Carregando organizações');

		rerender(
			<AdsOrganizationSwitcher
				onRetry={onRetry}
				organizations={organizations}
				status="error"
				value="acme"
			/>,
		);
		expect(screen.getByRole('status')).toHaveTextContent('Não foi possível carregar');
		await events.click(screen.getByRole('button', { name: 'Tentar novamente' }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('does not confirm the new organization before an asynchronous switch succeeds', async () => {
		const events = userEvent.setup();
		let resolve: () => void = () => undefined;
		const onValueChange = vi.fn(
			() =>
				new Promise<void>((done) => {
					resolve = done;
				}),
		);
		function Controlled() {
			const [value, setValue] = useState('acme');
			return (
				<AdsOrganizationSwitcher
					onValueChange={async (id) => {
						await onValueChange();
						setValue(id);
					}}
					organizations={organizations}
					value={value}
				/>
			);
		}
		render(<Controlled />);
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		const globex = screen.getByRole('option', { name: 'Globex' });
		expect(globex).toHaveAttribute('aria-selected', 'false');
		expect(screen.getByRole('status')).toHaveTextContent('Trocando de organização');
		expect(screen.getByRole('option', { name: /^Acme Brasil/ })).toHaveAttribute(
			'aria-selected',
			'true',
		);
		expect(screen.getByRole('option', { name: /^Acme Brasil/ })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
		// Outra troca não é executada enquanto a primeira está pendente.
		await events.click(screen.getByRole('option', { name: /^Acme Brasil/ }));
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(trigger()).toHaveTextContent('Acme Brasil');
		expect(screen.getByRole('dialog')).toBeVisible();

		await act(async () => resolve());
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(screen.getByRole('button', { name: /Organização atual: .*Globex/ })).toBeVisible();
	});

	it('keeps the previous organization and announces an asynchronous failure', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn().mockRejectedValue(new Error('falha'));
		setup({ onValueChange });
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível trocar');
		expect(screen.getByRole('dialog')).toBeVisible();
		expect(trigger()).toHaveTextContent('Acme Brasil');
		expect(screen.getByRole('option', { name: 'Globex' })).not.toHaveAttribute('aria-disabled');
	});

	it('keeps the controlled value when the consumer does not update it', async () => {
		const events = userEvent.setup();
		setup({ onValueChange: vi.fn() });
		await events.click(trigger());

		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(trigger()).toHaveTextContent('Acme Brasil');
	});

	it('supports a controlled open state', async () => {
		const events = userEvent.setup();
		const onOpenChange = vi.fn();
		setup({ onOpenChange, open: false });

		await events.click(trigger());

		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('accepts custom labels', async () => {
		const events = userEvent.setup();
		setup({ labels: { panel: 'Switch organization', trigger: 'Current organization' } });
		await events.click(screen.getByRole('button', { name: /Current organization: .*Acme Brasil/ }));

		expect(await screen.findByRole('dialog', { name: 'Switch organization' })).toBeVisible();
	});

	it('has no detectable accessibility violations, closed and open', async () => {
		const events = userEvent.setup();
		const { container } = setup({ manage: { href: '/organizacoes' }, searchable: true });
		const options = { rules: { 'color-contrast': { enabled: false } } };
		expect((await axe.run(container, options)).violations).toEqual([]);

		await events.click(trigger());
		await screen.findByRole('dialog');
		expect((await axe.run(document.body, options)).violations).toEqual([]);
	});
});

describe('AdsOrganizationSwitcher focus', () => {
	it('moves the focus into a panel opened while loading once the list is ready', async () => {
		const events = userEvent.setup();
		const { rerender } = setup({ status: 'loading' });
		await events.click(trigger());
		const panel = await screen.findByRole('dialog', { name: 'Trocar de organização' });
		await waitFor(() => expect(panel).toHaveFocus());

		rerender(<AdsOrganizationSwitcher organizations={organizations} status="ready" value="acme" />);

		await waitFor(() => expect(screen.getByRole('listbox')).toHaveFocus());
	});

	it('does not steal the focus when a pending switch resolves after the panel was dismissed', async () => {
		const events = userEvent.setup();
		let resolve: () => void = () => undefined;
		const onValueChange = vi.fn(
			() =>
				new Promise<void>((done) => {
					resolve = done;
				}),
		);
		render(
			<>
				<input aria-label="Outro campo" />
				<AdsOrganizationSwitcher
					onValueChange={onValueChange}
					organizations={organizations}
					value="acme"
				/>
			</>,
		);
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Globex' }));
		await events.keyboard('{Escape}');
		screen.getByLabelText('Outro campo').focus();

		await act(async () => resolve());

		expect(screen.getByLabelText('Outro campo')).toHaveFocus();
	});
});

describe('AdsOrganizationSwitcher in the sidebar', () => {
	function Sidebar({ withSwitcher }: { withSwitcher: boolean }) {
		return (
			<AdsAdminShell defaultCollapsed>
				<AdsAdminShell.Body>
					<AdsAdminShell.Sidebar label="Principal">
						{withSwitcher ? (
							<AdsOrganizationSwitcher organizations={organizations} value="acme" />
						) : null}
						<a href="/inicio">Início</a>
					</AdsAdminShell.Sidebar>
					<AdsAdminShell.Main>Conteúdo</AdsAdminShell.Main>
				</AdsAdminShell.Body>
			</AdsAdminShell>
		);
	}

	it('leaves no trace when it is not rendered', () => {
		render(<Sidebar withSwitcher={false} />);

		const nav = screen.getByRole('navigation', { name: 'Principal' });
		expect(nav.firstElementChild).toBe(screen.getByRole('link', { name: 'Início' }));
		expect(document.querySelector('.ads-organization-switcher')).toBeNull();
	});

	it('renders above the navigation and becomes compact in the collapsed sidebar', async () => {
		const events = userEvent.setup();
		render(<Sidebar withSwitcher />);

		const nav = screen.getByRole('navigation', { name: 'Principal' });
		expect(nav.firstElementChild).toBe(document.querySelector('.ads-organization-switcher'));
		expect(document.querySelector('.ads-organization-switcher')).toHaveAttribute(
			'data-collapsed',
			'true',
		);
		const compact = screen.getByRole('button', { name: /Organização atual: .*Acme Brasil/ });
		expect(compact).toHaveAttribute('aria-label', expect.stringContaining('Acme Brasil'));

		await events.click(compact);
		expect(await screen.findByRole('dialog', { name: 'Trocar de organização' })).toBeVisible();
	});

	it('works outside the shell, expanded', () => {
		setup();

		expect(document.querySelector('.ads-organization-switcher')).toHaveAttribute(
			'data-collapsed',
			'false',
		);
	});
});

it('uses each configured avatar tone in the trigger and options after switching', async () => {
	const events = userEvent.setup();
	setup({
		value: undefined,
		defaultValue: 'a',
		organizations: [
			{ id: 'a', name: 'Acme Brasil', avatarTone: 'primary' },
			{ id: 'b', name: 'Globex', avatarTone: 'success' },
		],
	});
	expect(trigger().querySelector('.ads-avatar')).toHaveClass('bg-primary');
	await events.click(trigger());
	const panel = await screen.findByRole('dialog', { name: 'Trocar de organização' });
	const option = within(panel).getByRole('option', { name: /^Globex/ });
	expect(option.querySelector('.ads-avatar')).toHaveClass('bg-success-background');
	expect(
		within(panel)
			.getByRole('option', { name: /^Acme Brasil/ })
			.querySelector('.ads-avatar'),
	).toHaveClass('bg-primary');
	await events.click(option);
	expect(trigger(/Globex/).querySelector('.ads-avatar')).toHaveClass('bg-success-background');
});

describe('AdsOrganizationSwitcher composes the AdsCombobox popover', () => {
	it('renders the primitive panel with a listbox, a labelled dialog and no nested interactive options', async () => {
		const events = userEvent.setup();
		setup({ manage: { href: '/organizacoes' }, searchable: true });
		await events.click(trigger());

		const panel = await screen.findByRole('dialog', { name: 'Trocar de organização' });
		expect(panel).toHaveClass('ads-combobox__panel', 'ads-organization-switcher-popover');
		const list = within(panel).getByRole('listbox', { name: 'Organizações' });
		expect(list).not.toContainElement(within(panel).getByRole('link', { name: /Gerenciar/ }));
		for (const option of within(list).getAllByRole('option'))
			expect(option.querySelector('button, a, input')).toBeNull();
		expect(screen.queryByRole('combobox')).toBeNull();
		expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('does not confirm an uncontrolled switch until the promise resolves', async () => {
		const events = userEvent.setup();
		let resolve: () => void = () => undefined;
		render(
			<AdsOrganizationSwitcher
				defaultValue="acme"
				onValueChange={() =>
					new Promise<void>((done) => {
						resolve = done;
					})
				}
				organizations={organizations}
			/>,
		);
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(trigger()).toHaveTextContent('Acme Brasil');
		expect(screen.getByRole('dialog')).toBeVisible();

		await act(async () => resolve());
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(screen.getByRole('button', { name: /Organização atual: .*Globex/ })).toHaveFocus();
	});

	it('reports a synchronous failure and keeps the previous organization', async () => {
		const events = userEvent.setup();
		setup({
			onValueChange: () => {
				throw new Error('falha');
			},
		});
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Globex' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível trocar');
		expect(trigger()).toHaveTextContent('Acme Brasil');
		expect(screen.getByRole('dialog')).toBeVisible();
	});

	it('clears the search when the panel closes and keeps manage with a callback in the footer', async () => {
		const events = userEvent.setup();
		const onSelect = vi.fn();
		setup({ manage: { onSelect }, searchable: true });
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'glo');
		expect(screen.getAllByRole('option')).toHaveLength(1);
		await events.keyboard('{Escape}');
		await events.click(trigger());
		expect(await screen.findByRole('searchbox')).toHaveValue('');
		expect(screen.getAllByRole('option')).toHaveLength(3);
		await events.click(screen.getByRole('button', { name: 'Gerenciar organizações' }));
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
	});

	it('selects with the keyboard from the search field in a long list', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		const many = Array.from({ length: 8 }, (_, index) => ({
			id: `o${index}`,
			name: `Empresa ${index}`,
		}));
		setup({ organizations: many, value: 'o0', onValueChange });
		await events.click(screen.getByRole('button', { name: /Organização atual: .*Empresa 0/ }));
		const search = await screen.findByRole('searchbox');
		await events.type(search, 'empresa 5');
		await events.keyboard('{Enter}');
		expect(onValueChange).toHaveBeenCalledWith('o5');
	});
});
