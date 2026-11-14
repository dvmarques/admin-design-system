import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { AdsIcon, AdsIconSlot, AdsThemeControl, AdsAlert, AdsToast } from '../src/index';
import { renderWithTheme } from './test-utils';

function LocalIcon({ testId, size = 19 }: { testId: string; size?: number }) {
	return (
		<svg
			data-testid={testId}
			fill="none"
			height={size}
			stroke="currentColor"
			strokeWidth={3}
			viewBox="0 0 24 24"
			width={size}
		>
			<path d="M3 12h18" />
		</svg>
	);
}

describe('AdsIconSlot generic composition (#316)', () => {
	it('renders external React/SVG markup without changing its props', () => {
		const { container } = render(
			<AdsIconSlot icon={<LocalIcon size={17} testId="original" />} size="lg" />,
		);
		const slot = container.querySelector('.ads-icon-slot');
		const svg = screen.getByTestId('original');
		expect(slot).toHaveClass('h-6', 'w-6', 'text-current');
		expect(slot).toHaveAttribute('aria-hidden', 'true');
		expect(svg).toHaveAttribute('width', '17');
		expect(svg).toHaveAttribute('height', '17');
		expect(svg).toHaveAttribute('stroke-width', '3');
		expect(svg).toHaveAttribute('stroke', 'currentColor');
		expect(svg).not.toHaveAttribute('class');
	});

	it('exposes a named image only when informative', async () => {
		const { container } = render(
			<div>
				<AdsIconSlot icon={<LocalIcon testId="info" />} label="Status da entrega" />
				<AdsIconSlot icon={<LocalIcon testId="decorative" />} />
			</div>,
		);
		expect(screen.getByRole('img', { name: 'Status da entrega' })).toBeInTheDocument();
		expect(screen.getByTestId('decorative').parentElement).toHaveAttribute('aria-hidden', 'true');
		expect((await axe.run(container)).violations).toEqual([]);
	});

	it.each(['light', 'dark'] as const)('retains inherited colors in %s mode', (theme) => {
		const { container } = renderWithTheme(
			<AdsIconSlot className="text-primary" icon={<LocalIcon testId="theme" />} />,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByTestId('theme').parentElement).toHaveClass('text-primary');
	});

	it('renders on the server and hydrates unchanged', async () => {
		const icon = <AdsIconSlot icon={<LocalIcon testId="hydrated" />} label="Pacote" />;
		const element = document.createElement('div');
		element.innerHTML = renderToString(icon);
		const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		let root: ReturnType<typeof hydrateRoot> | undefined;
		try {
			await act(async () => {
				root = hydrateRoot(element, icon);
			});
			expect(element.querySelector('[data-testid="hydrated"]')).toHaveAttribute('width', '19');
			expect(errors).not.toHaveBeenCalled();
		} finally {
			await act(async () => root?.unmount());
			errors.mockRestore();
		}
	});

	it('keeps the typed named-icon implementation intact', () => {
		const { container } = render(<AdsIcon name="user" size="sm" />);
		expect(container.querySelector('svg')).toHaveClass('ads-icon', 'h-4', 'w-4');
	});
});

describe('Optional icon overrides (#316)', () => {
	it('overrides theme icons without removing the radio labels or disabled state', () => {
		render(
			<AdsThemeControl
				disabled
				icons={{ light: <LocalIcon testId="custom-light" /> }}
				variant="group"
			/>,
		);
		expect(screen.getByTestId('custom-light')).toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Claro' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'Escuro' })).toContainElement(
			document.querySelector('.ads-icon')!,
		);
	});

	it('overrides the alert close icon while preserving the accessible action', () => {
		const closed = vi.fn();
		render(
			<AdsAlert closeIcon={<LocalIcon testId="close-alert" />} dismissible onClose={closed}>
				Aviso
			</AdsAlert>,
		);
		expect(screen.getByTestId('close-alert')).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem' }));
		expect(closed).toHaveBeenCalledOnce();
	});

	it('overrides the toast close icon while preserving its accessible action', () => {
		const closed = vi.fn();
		render(
			<AdsToast closeIcon={<LocalIcon testId="close-toast" />} onClose={closed}>
				Atualizado
			</AdsToast>,
		);
		expect(screen.getByTestId('close-toast')).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }));
		expect(closed).toHaveBeenCalledOnce();
	});
});
