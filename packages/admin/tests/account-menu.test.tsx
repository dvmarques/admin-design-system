import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsAccountMenu, type AdsAccountMenuProps } from '../src/index.js';

const user = { name: 'Ana Souza', email: 'ana@example.com' };

function groups(overrides: Partial<Record<string, () => void | Promise<void>>> = {}) {
	return [
		{
			id: 'account',
			actions: [
				{ id: 'profile', label: 'Minha conta', icon: 'user' as const, href: '/conta' },
				{
					id: 'prefs',
					label: 'Preferências',
					icon: 'settings' as const,
					onSelect: overrides.prefs,
				},
			],
		},
		{
			id: 'session',
			actions: [
				{
					id: 'signout',
					label: 'Sair',
					icon: 'logOut' as const,
					onSelect: overrides.signout,
					tone: 'danger' as const,
				},
			],
		},
	];
}

function setup(props: Partial<AdsAccountMenuProps> = {}) {
	return render(<AdsAccountMenu groups={groups()} user={user} {...props} />);
}

const trigger = () => screen.getByRole('button', { name: 'Menu da conta: Ana Souza' });

describe('AdsAccountMenu', () => {
	it('opens from the avatar button with the dialog semantics and moves focus to the first action', async () => {
		const events = userEvent.setup();
		setup();
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		expect(trigger()).not.toHaveAttribute('aria-controls');
		expect(trigger().querySelector('button, a, [tabindex]')).toBeNull();

		await events.click(trigger());

		const panel = screen.getByRole('dialog', { name: 'Conta' });
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		expect(trigger()).toHaveAttribute('aria-controls', panel.id);
		expect(
			within(screen.getByRole('dialog', { name: 'Conta' })).getByText('Ana Souza'),
		).toBeVisible();
		expect(screen.getByText('ana@example.com')).toBeVisible();
		await waitFor(() => expect(screen.getByRole('link', { name: 'Minha conta' })).toHaveFocus());
		expect(screen.queryByRole('menu')).toBeNull();
	});

	it('closes with Escape and returns the focus to the trigger', async () => {
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

	it('closes on outside click', async () => {
		const events = userEvent.setup();
		render(
			<>
				<p>Fora</p>
				<AdsAccountMenu groups={groups()} user={user} />
			</>,
		);
		await events.click(trigger());
		await screen.findByRole('dialog');

		await events.click(screen.getByText('Fora'));

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('moves with arrows, Home and End and skips disabled actions', async () => {
		const events = userEvent.setup();
		render(
			<AdsAccountMenu
				groups={[
					{
						id: 'a',
						actions: [
							{ id: '1', label: 'Primeira', onSelect: vi.fn() },
							{ id: '2', label: 'Bloqueada', disabled: true, onSelect: vi.fn() },
							{ id: '3', label: 'Terceira', onSelect: vi.fn() },
						],
					},
				]}
				user={user}
			/>,
		);
		await events.click(trigger());
		const first = await screen.findByRole('button', { name: 'Primeira' });
		await waitFor(() => expect(first).toHaveFocus());

		await events.keyboard('{ArrowDown}');
		expect(screen.getByRole('button', { name: 'Terceira' })).toHaveFocus();
		await events.keyboard('{ArrowDown}');
		expect(first).toHaveFocus();
		await events.keyboard('{End}');
		expect(screen.getByRole('button', { name: 'Terceira' })).toHaveFocus();
		await events.keyboard('{Home}');
		expect(first).toHaveFocus();
		await events.keyboard('{ArrowUp}');
		expect(screen.getByRole('button', { name: 'Terceira' })).toHaveFocus();
	});

	it('closes on Tab past the last action and returns the focus to the trigger', async () => {
		const events = userEvent.setup();
		setup();
		await events.click(trigger());
		await screen.findByRole('dialog');
		await events.keyboard('{End}');

		await events.keyboard('{Tab}');

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
	});

	it('runs a callback once and closes', async () => {
		const events = userEvent.setup();
		const onSelect = vi.fn();
		setup({ groups: groups({ prefs: onSelect }) });
		await events.click(trigger());

		await events.click(await screen.findByRole('button', { name: 'Preferências' }));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders links natively and does not execute a disabled action', async () => {
		const events = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<AdsAccountMenu
				groups={[
					{
						id: 'a',
						actions: [
							{ id: 'l', label: 'Minha conta', href: '/conta' },
							{ id: 'd', label: 'Indisponível', disabled: true, onSelect },
						],
					},
				]}
				user={user}
			/>,
		);
		await events.click(trigger());

		expect(await screen.findByRole('link', { name: 'Minha conta' })).toHaveAttribute(
			'href',
			'/conta',
		);
		const disabled = screen.getByRole('button', { name: 'Indisponível' });
		expect(disabled).toBeDisabled();
		fireEvent.click(disabled);
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('shows "Trocar conta" only when provided, as its own group', async () => {
		const events = userEvent.setup();
		const { unmount } = setup();
		await events.click(trigger());
		await screen.findByRole('dialog');
		expect(screen.queryByText('Trocar conta')).toBeNull();
		unmount();

		const onSwitch = vi.fn();
		setup({ switchAccount: { label: 'Usar outra conta', onSelect: onSwitch } });
		await events.click(trigger());

		expect(await screen.findByText('Trocar conta')).toBeVisible();
		await events.click(screen.getByRole('button', { name: 'Usar outra conta' }));
		expect(onSwitch).toHaveBeenCalledTimes(1);
	});

	it('keeps the panel open and the action busy while pending, then closes', async () => {
		const events = userEvent.setup();
		let resolve: () => void = () => undefined;
		const onSelect = vi.fn(
			() =>
				new Promise<void>((done) => {
					resolve = done;
				}),
		);
		setup({ groups: groups({ signout: onSelect }) });
		await events.click(trigger());
		const signout = await screen.findByRole('button', { name: 'Sair' });

		await events.click(signout);
		await events.click(signout);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(signout).toHaveAttribute('aria-busy', 'true');
		expect(screen.getByRole('button', { name: 'Preferências' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
		expect(screen.getByRole('dialog')).toBeVisible();

		await act(async () => resolve());
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('announces a failure, stays open and re-enables the action', async () => {
		const events = userEvent.setup();
		const onSelect = vi.fn().mockRejectedValueOnce(new Error('falha')).mockResolvedValue(undefined);
		setup({ groups: groups({ signout: onSelect }) });
		await events.click(trigger());

		await events.click(await screen.findByRole('button', { name: 'Sair' }));

		expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível concluir a ação');
		expect(screen.getByRole('dialog')).toBeVisible();
		expect(screen.getByRole('button', { name: 'Sair' })).not.toHaveAttribute('aria-busy');

		await events.click(screen.getByRole('button', { name: 'Sair' }));
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(onSelect).toHaveBeenCalledTimes(2);
	});

	it('is controlled by open and notifies onOpenChange', async () => {
		const events = userEvent.setup();
		const onOpenChange = vi.fn();
		setup({ onOpenChange, open: false });

		await events.click(trigger());

		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('works as a controlled component driven by the consumer', async () => {
		const events = userEvent.setup();
		function Controlled() {
			const [open, setOpen] = useState(false);
			return <AdsAccountMenu groups={groups()} onOpenChange={setOpen} open={open} user={user} />;
		}
		render(<Controlled />);

		await events.click(trigger());
		expect(await screen.findByRole('dialog')).toBeVisible();
		await events.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('shows initials without a photo or when it fails, and uses custom initials', async () => {
		const events = userEvent.setup();
		const { rerender } = setup({ user: { ...user, avatarSrc: '/ana.png' } });
		const image = trigger().querySelector('img');
		expect(image).toHaveAttribute('src', '/ana.png');
		expect(image).toHaveAttribute('alt', '');
		fireEvent.error(image!);
		expect(trigger().querySelector('img')).toBeNull();
		expect(trigger()).toHaveTextContent('AS');

		rerender(<AdsAccountMenu groups={groups()} user={{ ...user, initials: 'XY' }} />);
		expect(trigger()).toHaveTextContent('XY');
		await events.click(trigger());
		expect(await screen.findAllByText('XY')).toHaveLength(2);
	});

	it('gives the avatar a themed background, configurable by tone or by any color', async () => {
		const events = userEvent.setup();
		const { rerender } = setup();
		const avatar = () => trigger().querySelector('.ads-avatar')!;
		expect(avatar()).toHaveClass('bg-primary');

		rerender(<AdsAccountMenu groups={groups()} user={{ ...user, avatarTone: 'success' }} />);
		expect(avatar()).toHaveClass('bg-success-background');

		rerender(
			<AdsAccountMenu
				groups={groups()}
				user={{ ...user, avatarBackgroundColor: '#0f766e', avatarForegroundColor: '#ffffff' }}
			/>,
		);
		expect(avatar()).toHaveStyle({ backgroundColor: '#0f766e', color: '#ffffff' });
		await events.click(trigger());
		const identity = (await screen.findByRole('dialog', { name: 'Conta' })).querySelector(
			'.ads-avatar',
		)!;
		expect(identity).toHaveStyle({ backgroundColor: '#0f766e' });
	});

	it('tolerates a missing name, email and photo', async () => {
		const events = userEvent.setup();
		render(<AdsAccountMenu groups={groups()} user={{}} />);
		await events.click(screen.getByRole('button', { name: 'Menu da conta' }));

		expect(await screen.findByRole('dialog', { name: 'Conta' })).toBeVisible();
		expect(screen.getByRole('link', { name: 'Minha conta' })).toBeVisible();
	});

	it('truncates long names and e-mails with their full text available', async () => {
		const events = userEvent.setup();
		const name = 'Maria Aparecida de Albuquerque Montenegro Vasconcelos Figueiredo Neto';
		const email = 'maria.aparecida.albuquerque.montenegro@empresa-com-nome-muito-longo.example.com';
		render(<AdsAccountMenu groups={groups()} user={{ name, email }} />);
		await events.click(screen.getByRole('button', { name: `Menu da conta: ${name}` }));

		expect(await screen.findByTitle(name)).toHaveTextContent(name);
		expect(screen.getByText(email)).toHaveAttribute('title', email);
	});

	it('accepts custom labels', async () => {
		const events = userEvent.setup();
		setup({ labels: { panel: 'Account', trigger: 'Account menu' } });
		await events.click(screen.getByRole('button', { name: 'Account menu: Ana Souza' }));

		expect(await screen.findByRole('dialog', { name: 'Account' })).toBeVisible();
	});

	it('has no detectable accessibility violations, closed and open', async () => {
		const events = userEvent.setup();
		const { container } = setup({
			switchAccount: { label: 'Usar outra conta', onSelect: vi.fn() },
		});
		const options = { rules: { 'color-contrast': { enabled: false } } };
		expect((await axe.run(container, options)).violations).toEqual([]);

		await events.click(trigger());
		await screen.findByRole('dialog');
		expect((await axe.run(document.body, options)).violations).toEqual([]);
	});
});
