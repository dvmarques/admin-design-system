import { act, fireEvent, render, screen } from '@testing-library/react';
import { useEffect, useState, type ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdsAdminShell, useAdsAdminShell } from '../src/index.js';
import { installViewport } from './viewport.js';

let viewport: ReturnType<typeof installViewport>;
const lifecycle = { live: 0, maxLive: 0, mounts: 0 };

function StatefulItem() {
	const [count, setCount] = useState(0);
	useEffect(() => {
		lifecycle.live += 1;
		lifecycle.mounts += 1;
		lifecycle.maxLive = Math.max(lifecycle.maxLive, lifecycle.live);
		return () => {
			lifecycle.live -= 1;
		};
	}, []);
	return (
		<button id="stateful-item" onClick={() => setCount(count + 1)} type="button">
			Item {count}
		</button>
	);
}

function StateProbe() {
	const { collapsed, mobileOpen, isDesktop, setCollapsed } = useAdsAdminShell();
	return (
		<div>
			<span data-testid="probe">
				{collapsed ? 'recolhida' : 'expandida'}|{mobileOpen ? 'aberta' : 'fechada'}|
				{isDesktop ? 'desktop' : 'mobile'}
			</span>
			<button onClick={() => setCollapsed(!collapsed)} type="button">
				Alternar pelo hook
			</button>
		</div>
	);
}

function ExampleShell(props: Omit<ComponentProps<typeof AdsAdminShell>, 'children'>) {
	return (
		<AdsAdminShell {...props}>
			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsAdminShell.SidebarToggle />
				<span>Admin Abril</span>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="/dashboard">Dashboard</a>
					<StatefulItem />
					<StateProbe />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<h1>Visão geral</h1>
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

function ConsumerTrigger() {
	const { setMobileOpen } = useAdsAdminShell();
	return (
		<button onClick={() => setMobileOpen(true)} type="button">
			Menu do consumidor
		</button>
	);
}

function ConsumerTriggerShell() {
	return (
		<AdsAdminShell>
			<AdsAdminShell.Header>
				<ConsumerTrigger />
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar>
					<a href="/dashboard">Dashboard</a>
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>
					<h1>Visão geral</h1>
				</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}

const trigger = () => screen.getByRole('button', { name: 'Abrir navegação' });
const navigations = () => screen.queryAllByRole('navigation', { name: 'Navegação principal' });
const backdrop = () => document.querySelector('[data-overlay="backdrop"]');

beforeEach(() => {
	lifecycle.live = 0;
	lifecycle.maxLive = 0;
	lifecycle.mounts = 0;
});

afterEach(() => {
	viewport?.restore();
});

describe('AdsAdminShell structure', () => {
	beforeEach(() => {
		viewport = installViewport(true);
	});

	it('renders the administrative landmarks and consumer content', () => {
		render(<ExampleShell />);
		expect(screen.getByRole('banner')).toHaveTextContent('Admin Abril');
		expect(screen.getByRole('main')).toHaveTextContent('Visão geral');
		expect(navigations()).toHaveLength(1);
		expect(navigations()[0]).toHaveTextContent('Dashboard');
	});

	it('forwards native attributes and merges the public class names', () => {
		const { container } = render(
			<AdsAdminShell className="custom" data-testid="shell">
				<AdsAdminShell.Main className="main-extra">x</AdsAdminShell.Main>
			</AdsAdminShell>,
		);
		expect(container.firstElementChild).toHaveClass('ads-admin-shell', 'custom');
		expect(screen.getByRole('main')).toHaveClass('ads-admin-shell-main', 'main-extra');
	});

	it('makes the scrollable main reachable by keyboard and lets the consumer override tabIndex', () => {
		const { rerender } = render(
			<AdsAdminShell>
				<AdsAdminShell.Main>x</AdsAdminShell.Main>
			</AdsAdminShell>,
		);
		expect(screen.getByRole('main')).toHaveAttribute('tabindex', '0');
		rerender(
			<AdsAdminShell>
				<AdsAdminShell.Main tabIndex={-1}>x</AdsAdminShell.Main>
			</AdsAdminShell>,
		);
		expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
	});
});

describe('desktop sidebar preference', () => {
	beforeEach(() => {
		viewport = installViewport(true);
	});

	it('keeps the collapsed state internally when only defaultCollapsed is provided', () => {
		render(<ExampleShell defaultCollapsed={false} />);
		const toggle = screen.getByRole('button', { name: 'Recolher barra lateral' });
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		const sidebar = navigations()[0]!.parentElement!;
		expect(sidebar).toHaveAttribute('data-collapsed', 'false');
		expect(toggle).toHaveAttribute('aria-controls', sidebar.id);

		fireEvent.click(toggle);
		expect(screen.getByRole('button', { name: 'Expandir barra lateral' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
		expect(sidebar).toHaveAttribute('data-collapsed', 'true');
	});

	it('requests changes without overriding a controlled collapsed value', () => {
		const onCollapsedChange = vi.fn();
		const { rerender } = render(<ExampleShell collapsed onCollapsedChange={onCollapsedChange} />);
		fireEvent.click(screen.getByRole('button', { name: 'Expandir barra lateral' }));
		expect(onCollapsedChange).toHaveBeenCalledWith(false);
		expect(navigations()[0]!.parentElement).toHaveAttribute('data-collapsed', 'true');

		rerender(<ExampleShell collapsed={false} onCollapsedChange={onCollapsedChange} />);
		expect(navigations()[0]!.parentElement).toHaveAttribute('data-collapsed', 'false');
	});

	it('exposes the structural state so consumers adapt their own content explicitly', () => {
		render(<ExampleShell defaultCollapsed />);
		expect(screen.getByTestId('probe')).toHaveTextContent('recolhida|fechada|desktop');
		fireEvent.click(screen.getByRole('button', { name: 'Alternar pelo hook' }));
		expect(screen.getByTestId('probe')).toHaveTextContent('expandida|fechada|desktop');
	});

	it('does not persist the preference automatically', () => {
		const spy = vi.spyOn(Storage.prototype, 'setItem');
		render(<ExampleShell />);
		fireEvent.click(screen.getByRole('button', { name: 'Recolher barra lateral' }));
		expect(spy).not.toHaveBeenCalled();
		spy.mockRestore();
	});

	it('requires the shell context for its parts', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		expect(() => render(<AdsAdminShell.NavigationTrigger />)).toThrow(/inside AdsAdminShell/);
		error.mockRestore();
	});
});

describe('mobile navigation', () => {
	beforeEach(() => {
		viewport = installViewport(false);
	});

	it('opens the drawer from the accessible trigger and mounts a single navigation', () => {
		const onMobileOpenChange = vi.fn();
		const { container } = render(<ExampleShell onMobileOpenChange={onMobileOpenChange} />);
		expect(navigations()).toHaveLength(0);
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(trigger());
		expect(onMobileOpenChange).toHaveBeenCalledWith(true);
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		const dialog = screen.getByRole('dialog', { name: 'Navegação principal' });
		expect(dialog).toHaveAttribute('id', trigger().getAttribute('aria-controls'));
		expect(navigations()).toHaveLength(1);
		expect(container.ownerDocument.querySelectorAll('#stateful-item')).toHaveLength(1);
	});

	it('closes with Escape and returns focus to the trigger', () => {
		render(<ExampleShell />);
		trigger().focus();
		fireEvent.click(trigger());
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		expect(trigger()).toHaveFocus();
	});

	it('supports controlled mobile state without keeping a competing internal state', () => {
		const onMobileOpenChange = vi.fn();
		const { rerender } = render(
			<ExampleShell mobileOpen={false} onMobileOpenChange={onMobileOpenChange} />,
		);
		fireEvent.click(trigger());
		expect(onMobileOpenChange).toHaveBeenCalledWith(true);
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		rerender(<ExampleShell mobileOpen onMobileOpenChange={onMobileOpenChange} />);
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
	});

	it('lets the application close the menu after navigation by updating its prop', () => {
		const { rerender } = render(<ExampleShell mobileOpen />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		rerender(<ExampleShell mobileOpen={false} />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('keeps the drawer complete when the desktop preference is collapsed', () => {
		render(<ExampleShell defaultCollapsed defaultMobileOpen />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.querySelector('[data-collapsed]')).toBeNull();
		expect(screen.getByText('Dashboard')).toBeVisible();
	});

	it('keeps collapsed and mobileOpen independent', () => {
		render(<ExampleShell defaultMobileOpen />);
		expect(screen.getByTestId('probe')).toHaveTextContent('expandida|aberta|mobile');
		fireEvent.click(screen.getByRole('button', { name: 'Alternar pelo hook' }));
		expect(screen.getByTestId('probe')).toHaveTextContent('recolhida|aberta|mobile');
	});
});

describe('breakpoint transitions', () => {
	beforeEach(() => {
		viewport = installViewport(false);
	});

	it('keeps a single logical instance of arbitrary navigation content at all times', () => {
		render(<ExampleShell />);
		fireEvent.click(trigger());
		viewport.setDesktop(true);
		viewport.setDesktop(false);
		fireEvent.click(trigger());
		viewport.setDesktop(true);
		expect(lifecycle.maxLive).toBe(1);
		expect(document.querySelectorAll('#stateful-item')).toHaveLength(1);
		expect(navigations()).toHaveLength(1);
	});

	it('resets uncontrolled mobile state when entering desktop and does not reopen on return', () => {
		const onMobileOpenChange = vi.fn();
		render(<ExampleShell onMobileOpenChange={onMobileOpenChange} />);
		fireEvent.click(trigger());
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		viewport.setDesktop(true);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(backdrop()).toBeNull();
		expect(navigations()).toHaveLength(1);
		expect(onMobileOpenChange).toHaveBeenLastCalledWith(false);

		viewport.setDesktop(false);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
	});

	it('requests a close without mutating a controlled prop and suppresses the overlay on desktop', () => {
		const onMobileOpenChange = vi.fn();
		render(<ExampleShell mobileOpen onMobileOpenChange={onMobileOpenChange} />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		viewport.setDesktop(true);
		expect(onMobileOpenChange).toHaveBeenCalledTimes(1);
		expect(onMobileOpenChange).toHaveBeenCalledWith(false);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(backdrop()).toBeNull();
		expect(navigations()).toHaveLength(1);
		// The prop is still `true`, yet the trigger reports the effective presentation.
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
	});

	it('does not reopen from a stale controlled true until it is acknowledged and reopened', () => {
		const onMobileOpenChange = vi.fn();
		const { rerender } = render(
			<ExampleShell mobileOpen onMobileOpenChange={onMobileOpenChange} />,
		);
		viewport.setDesktop(true);
		viewport.setDesktop(false);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');

		rerender(<ExampleShell mobileOpen={false} onMobileOpenChange={onMobileOpenChange} />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		rerender(<ExampleShell mobileOpen onMobileOpenChange={onMobileOpenChange} />);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
	});

	it('moves focus to a valid mounted element when the trigger is no longer focusable', () => {
		render(<ExampleShell />);
		trigger().focus();
		fireEvent.click(trigger());
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		viewport.setDesktop(true);
		const active = document.activeElement;
		expect(active).not.toBe(document.body);
		expect(active?.isConnected).toBe(true);
		expect(active).toBe(navigations()[0]);
	});

	it('moves focus away from a consumer trigger that is hidden on desktop', () => {
		render(<ConsumerTriggerShell />);
		const consumerTrigger = screen.getByRole('button', { name: 'Menu do consumidor' });
		consumerTrigger.focus();
		fireEvent.click(consumerTrigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		// The consumer hides its own trigger on desktop; jsdom has no layout, so simulate it.
		consumerTrigger.checkVisibility = () => false;
		// Simulate the drawer restoring focus to its opener while the layout switches.
		consumerTrigger.focus();

		viewport.setDesktop(true);
		expect(consumerTrigger).not.toHaveFocus();
		expect(document.activeElement).toBe(navigations()[0]);
	});

	it('keeps focus on a consumer trigger that remains visible on desktop', () => {
		render(<ConsumerTriggerShell />);
		const consumerTrigger = screen.getByRole('button', { name: 'Menu do consumidor' });
		fireEvent.click(consumerTrigger);
		consumerTrigger.checkVisibility = () => true;
		consumerTrigger.focus();

		viewport.setDesktop(true);
		expect(consumerTrigger).toHaveFocus();
	});

	it('does not steal focus when the drawer was closed during the transition', () => {
		render(<ExampleShell />);
		const outside = document.createElement('button');
		document.body.appendChild(outside);
		outside.focus();
		viewport.setDesktop(true);
		expect(outside).toHaveFocus();
		outside.remove();
	});

	it('keeps the desktop preference independent from the transition', () => {
		render(<ExampleShell defaultCollapsed defaultMobileOpen />);
		viewport.setDesktop(true);
		expect(screen.getByTestId('probe')).toHaveTextContent('recolhida|fechada|desktop');
	});

	it('removes viewport listeners when unmounted', () => {
		const { unmount } = render(<ExampleShell />);
		unmount();
		expect(() => viewport.setDesktop(true)).not.toThrow();
		act(() => undefined);
	});
});

describe('optional sidebar header composition', () => {
	beforeEach(() => {
		viewport = installViewport(true);
	});
	function BrandedShell({ header = true }: { header?: boolean }) {
		return (
			<AdsAdminShell layout="sidebar-header">
				<AdsAdminShell.Header>
					<AdsAdminShell.NavigationTrigger />
				</AdsAdminShell.Header>
				<AdsAdminShell.Body>
					<AdsAdminShell.Sidebar
						header={
							header && (
								<>
									<span>Produto</span>
									<AdsAdminShell.SidebarToggle />
								</>
							)
						}
					>
						<a href="/dashboard">Dashboard</a>
					</AdsAdminShell.Sidebar>
					<AdsAdminShell.Main>Conteúdo</AdsAdminShell.Main>
				</AdsAdminShell.Body>
			</AdsAdminShell>
		);
	}
	it('keeps collapse control operable in the sidebar header', () => {
		render(<BrandedShell />);
		const toggle = screen.getByRole('button', { name: 'Recolher barra lateral' });
		expect(toggle.closest('aside')).not.toBeNull();
		fireEvent.click(toggle);
		expect(screen.getByRole('button', { name: 'Expandir barra lateral' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
		expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
	});
	it('does not reserve a header node when content is absent', () => {
		const { container } = render(<BrandedShell header={false} />);
		expect(container.querySelector('.ads-admin-shell-sidebar-header')).toBeNull();
	});
	it('moves the single header into the mobile drawer across resize', async () => {
		render(<BrandedShell />);
		act(() => viewport.setDesktop(false));
		fireEvent.click(screen.getByRole('button', { name: 'Abrir navegação' }));
		expect(await screen.findByRole('dialog')).toHaveTextContent('Produto');
		expect(screen.getAllByText('Produto')).toHaveLength(1);
		act(() => viewport.setDesktop(true));
		expect(screen.getAllByText('Produto')).toHaveLength(1);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});

it('captures the mobile trigger as focus origin when pointer activation does not focus it', () => {
	viewport = installViewport(false);
	let origin: Element | null = null;
	render(
		<ExampleShell
			onMobileOpenChange={(open) => {
				if (open) origin = document.activeElement;
			}}
		/>,
	);
	const button = trigger();
	fireEvent.click(button);
	expect(origin).toBe(button);
});
