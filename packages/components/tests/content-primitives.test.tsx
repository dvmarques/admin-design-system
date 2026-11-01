import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { AdsAvatar } from '../src/avatar';
import { AdsBadge } from '../src/badge';
import { AdsIcon } from '../src/icon';
import { AdsSkeleton } from '../src/skeleton';
import { AdsTypography } from '../src/typography';
import { renderWithTheme } from './test-utils';

describe('AdsBadge', () => {
	it('renders textual status variants and a stable public class', () => {
		render(
			<>
				<AdsBadge variant="neutral">Rascunho</AdsBadge>
				<AdsBadge variant="success">Ativo</AdsBadge>
			</>,
		);

		const badge = screen.getByText('Ativo');
		expect(badge).toHaveClass('ads-badge', 'bg-success-background', 'text-success');
		expect(screen.getByText('Rascunho')).toHaveClass('bg-surface-muted', 'py-0.5');
		expect(badge).toHaveClass('py-0.5');
	});

	it.each(['light', 'dark'] as const)('renders responsively in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsBadge size="sm">Pendente</AdsBadge>, theme);

		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Pendente')).toBeVisible();
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsBadge variant="warning">Atenção</AdsBadge>);
		expect(screen.getByText('Atenção')).toHaveClass('bg-warning-background', 'text-warning');

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});

describe('AdsSkeleton', () => {
	it('is decorative by default and can expose an accessible loading label', () => {
		const { rerender } = render(<AdsSkeleton className="h-4 w-32" />);
		expect(document.querySelector('.ads-skeleton')).toHaveAttribute('aria-hidden', 'true');

		rerender(<AdsSkeleton label="Carregando resumo" />);
		expect(screen.getByRole('status', { name: 'Carregando resumo' })).toBeVisible();
	});

	it('exposes the variant as an attribute and omits it by default', () => {
		const { rerender } = render(<AdsSkeleton variant="value" />);
		expect(document.querySelector('.ads-skeleton')).toHaveAttribute('data-variant', 'value');

		rerender(<AdsSkeleton />);
		expect(document.querySelector('.ads-skeleton')).not.toHaveAttribute('data-variant');
	});
});

describe('AdsAvatar', () => {
	it('renders a textual fallback when no image is provided', () => {
		render(<AdsAvatar alt="Ana Silva" fallback="AS" />);

		expect(screen.getByText('AS')).toBeVisible();
	});

	it('reveals the fallback when the image fails to load', () => {
		render(<AdsAvatar alt="Ana Silva" fallback="AS" src="/avatar.png" />);

		const image = screen.getByRole('img', { name: 'Ana Silva' });
		fireEvent.error(image);

		expect(screen.getByText('AS')).toBeVisible();
		expect(screen.queryByRole('img', { name: 'Ana Silva' })).not.toBeInTheDocument();
	});

	it('keeps the neutral look by default and offers token tones', () => {
		const { rerender, container } = render(<AdsAvatar fallback="AS" />);
		const avatar = () => container.querySelector('.ads-avatar')!;
		expect(avatar()).toHaveClass('bg-surface-raised', 'text-text');
		expect(avatar()).not.toHaveAttribute('style');

		rerender(<AdsAvatar fallback="AS" tone="primary" />);
		expect(avatar()).toHaveClass('bg-primary');
		expect(avatar()).not.toHaveClass('bg-surface-raised');
		rerender(<AdsAvatar fallback="AS" tone="danger" />);
		expect(avatar()).toHaveClass('bg-danger-background', 'text-danger');
	});

	it('accepts any CSS color for the background and the initials', () => {
		const { container } = render(
			<AdsAvatar
				backgroundColor="#7c3aed"
				fallback="AS"
				foregroundColor="#ffffff"
				tone="primary"
			/>,
		);

		expect(container.querySelector('.ads-avatar')).toHaveStyle({
			backgroundColor: '#7c3aed',
			color: '#ffffff',
		});
	});

	it('tries the new image after a failed source changes', () => {
		const { rerender } = render(<AdsAvatar alt="Ana Silva" fallback="AS" src="/quebrada.png" />);

		fireEvent.error(screen.getByRole('img', { name: 'Ana Silva' }));
		expect(screen.queryByRole('img', { name: 'Ana Silva' })).not.toBeInTheDocument();

		rerender(<AdsAvatar alt="Ana Silva" fallback="AS" src="/nova.png" />);
		expect(screen.getByRole('img', { name: 'Ana Silva' })).toHaveAttribute('src', '/nova.png');
	});

	it('treats an image that failed before hydration as a failure', () => {
		const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		const width = vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0);
		const source = vi
			.spyOn(HTMLImageElement.prototype, 'currentSrc', 'get')
			.mockReturnValue('http://localhost/quebrada.png');
		try {
			render(<AdsAvatar alt="Ana" fallback="AS" src="/quebrada.png" />);

			expect(screen.queryByRole('img', { name: 'Ana' })).not.toBeInTheDocument();
			expect(screen.getByText('AS')).toBeVisible();
		} finally {
			complete.mockRestore();
			width.mockRestore();
			source.mockRestore();
		}
	});

	it('keeps a loaded image that is already complete', () => {
		const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		const width = vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(40);
		try {
			render(<AdsAvatar alt="Ana" fallback="AS" src="/ok.png" />);

			expect(screen.getByRole('img', { name: 'Ana' })).toBeInTheDocument();
		} finally {
			complete.mockRestore();
			width.mockRestore();
		}
	});

	it('keeps the failed fallback while the same source is rendered again', () => {
		const { rerender } = render(<AdsAvatar alt="Ana" fallback="AS" src="/quebrada.png" />);

		fireEvent.error(screen.getByRole('img', { name: 'Ana' }));
		rerender(<AdsAvatar alt="Ana" fallback="AS" src="/quebrada.png" size="lg" />);

		expect(screen.queryByRole('img', { name: 'Ana' })).not.toBeInTheDocument();
		expect(screen.getByText('AS')).toBeVisible();
	});

	it('keeps its box with an empty fallback and no image', () => {
		const { container } = render(<AdsAvatar fallback="" />);

		expect(container.querySelector('.ads-avatar')).toHaveClass('h-10', 'w-10');
	});

	it('does not have detectable accessibility violations with a fallback', async () => {
		const { container } = render(<AdsAvatar alt="Ana Silva" fallback="AS" />);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});

describe('AdsIcon', () => {
	it.each([
		'bell',
		'building',
		'chevronDown',
		'chevronsUpDown',
		'logOut',
		'settings',
		'user',
	] as const)('renders the %s icon as decorative by default', (name) => {
		render(<AdsIcon name={name} />);

		const icon = document.querySelector('.ads-icon');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon?.childElementCount).toBeGreaterThan(0);
	});

	it('renders the licensed Hugeicons Free Building06 geometry with the public AdsIcon contract', () => {
		const { rerender, container } = render(<AdsIcon name="building" size="sm" />);
		const svg = container.querySelector('svg');
		const paths = Array.from(svg?.querySelectorAll('path') ?? []);

		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
		expect(svg).toHaveAttribute('stroke', 'currentColor');
		expect(svg).toHaveClass('h-4', 'w-4');
		expect(paths.map((path) => path.getAttribute('d'))).toEqual([
			'M12 2H6C3.518 2 3 2.518 3 5V22H15V5C15 2.518 14.482 2 12 2Z',
			'M18 8H15V22H21V11C21 8.518 20.482 8 18 8Z',
			'M8 6L10 6M8 9L10 9M8 12L10 12',
			'M11.5 22V18C11.5 17.0572 11.5 16.5858 11.2071 16.2929C10.9142 16 10.4428 16 9.5 16H8.5C7.55719 16 7.08579 16 6.79289 16.2929C6.5 16.5858 6.5 17.0572 6.5 18V22',
		]);
		expect(paths.map((path) => path.getAttribute('stroke-width'))).toEqual([
			'1.5',
			'1.5',
			'1.5',
			'1.5',
		]);
		expect(paths.map((path) => path.getAttribute('stroke-linecap'))).toEqual([
			'butt',
			'butt',
			'round',
			'butt',
		]);

		rerender(<AdsIcon label="Organização" name="building" size="lg" />);
		expect(screen.getByRole('img', { name: 'Organização' })).toHaveClass('h-6', 'w-6');
	});

	it.each([
		'alertCircle',
		'alertTriangle',
		'bell',
		'calendar',
		'check',
		'chevronDown',
		'chevronLeft',
		'chevronRight',
		'chevronsUpDown',
		'close',
		'logOut',
		'monitor',
		'moon',
		'info',
		'plus',
		'sun',
		'settings',
		'search',
		'user',
	] as const)('renders the licensed %s SVG with the source stroke width', (name) => {
		const { container } = render(<AdsIcon name={name} />);
		const svg = container.querySelector('svg');
		const shapes = Array.from(
			svg?.querySelectorAll('path, circle, line, rect, polyline, polygon, ellipse') ?? [],
		);
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(shapes.length).toBeGreaterThan(0);
		expect(shapes.every((shape) => shape.getAttribute('stroke-width') === '2')).toBe(true);
	});

	it('names new informative icons', () => {
		render(<AdsIcon label="Notificações" name="bell" />);

		expect(screen.getByRole('img', { name: 'Notificações' })).toBeInTheDocument();
	});

	it('hides decorative icons from assistive technology', () => {
		render(<AdsIcon name="search" />);

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(document.querySelector('.ads-icon')).toHaveAttribute('aria-hidden', 'true');
	});

	it('gives informative icons an accessible name', () => {
		render(<AdsIcon label="Informações" name="info" size="lg" />);

		const icon = screen.getByRole('img', { name: 'Informações' });
		expect(icon).toHaveClass('ads-icon', 'h-6', 'w-6');
	});
});

describe('AdsTypography', () => {
	it('preserves heading semantics while applying the selected hierarchy', () => {
		render(<AdsTypography variant="heading2">Resumo</AdsTypography>);

		const heading = screen.getByRole('heading', { level: 2, name: 'Resumo' });
		expect(heading).toHaveClass('ads-typography', 'text-3xl');
	});

	it('allows an explicit semantic element for body content', () => {
		render(
			<AdsTypography as="span" variant="muted">
				Texto auxiliar
			</AdsTypography>,
		);

		expect(screen.getByText('Texto auxiliar').tagName).toBe('SPAN');
	});

	it.each(['light', 'dark'] as const)('keeps content readable in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsTypography>Conteúdo</AdsTypography>, theme);

		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Conteúdo')).toBeVisible();
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsTypography variant="heading1">Painel</AdsTypography>);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});
