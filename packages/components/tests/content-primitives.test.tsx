import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { AdsAvatar } from '../src/avatar';
import { AdsBadge } from '../src/badge';
import { AdsIcon } from '../src/icon';
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
		expect(badge).toHaveClass('ads-badge', 'bg-success');
		expect(screen.getByText('Rascunho')).toHaveClass('bg-surface-muted', 'min-h-8');
		expect(badge).toHaveClass('min-h-8');
	});

	it.each(['light', 'dark'] as const)('renders responsively in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsBadge size="sm">Pendente</AdsBadge>, theme);

		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByText('Pendente')).toBeVisible();
	});

	it('does not have detectable accessibility violations', async () => {
		const { container } = render(<AdsBadge variant="warning">Atenção</AdsBadge>);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
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

	it('does not have detectable accessibility violations with a fallback', async () => {
		const { container } = render(<AdsAvatar alt="Ana Silva" fallback="AS" />);

		const results = await axe.run(container);
		expect(results.violations).toEqual([]);
	});
});

describe('AdsIcon', () => {
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
