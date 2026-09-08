import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
	AdsCard,
	AdsCardActions,
	AdsCardContent,
	AdsCardHeader,
	AdsEmptyState,
	AdsList,
	AdsListItem,
	AdsProgress,
	AdsTable,
	AdsTableBody,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
} from '../src';
import { renderWithTheme } from './test-utils';

describe('AdsTable', () => {
	it('preserves native table semantics inside a horizontal overflow container', () => {
		render(
			<AdsTable aria-label="Clientes">
				<AdsTableHead>
					<AdsTableRow>
						<AdsTableHeader>Nome</AdsTableHeader>
					</AdsTableRow>
				</AdsTableHead>
				<AdsTableBody>
					<AdsTableRow>
						<AdsTableCell>Maria</AdsTableCell>
					</AdsTableRow>
				</AdsTableBody>
			</AdsTable>,
		);

		const table = screen.getByRole('table', { name: 'Clientes' });
		expect(table.closest('.ads-table-container')).toHaveClass('overflow-x-auto');
		expect(screen.getByRole('columnheader', { name: 'Nome' })).toHaveAttribute('scope', 'col');
		expect(screen.getByRole('cell', { name: 'Maria' })).toBeVisible();
	});

	it.each(['light', 'dark'] as const)('remains available in the %s theme', async (theme) => {
		const { container } = renderWithTheme(
			<AdsTable aria-label="Resumo"><AdsTableBody><AdsTableRow><AdsTableCell>Valor</AdsTableCell></AdsTableRow></AdsTableBody></AdsTable>,
			theme,
		);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});

describe('AdsList and AdsCard', () => {
	it('keeps semantic collection and compositional card content', () => {
		render(
			<>
				<AdsList aria-label="Pendências">
					<AdsListItem>Documento</AdsListItem>
				</AdsList>
				<AdsCard>
					<AdsCardHeader>Cliente</AdsCardHeader>
					<AdsCardContent>Dados cadastrais</AdsCardContent>
					<AdsCardActions>
						<button type="button">Editar</button>
					</AdsCardActions>
				</AdsCard>
			</>,
		);

		expect(screen.getByRole('list', { name: 'Pendências' })).toBeVisible();
		expect(screen.getByRole('listitem')).toHaveTextContent('Documento');
		expect(screen.getByRole('button', { name: 'Editar' })).toBeVisible();
		expect(screen.getByText('Cliente').closest('.ads-card')).toHaveClass('ads-surface');
	});

	it.each(['light', 'dark'] as const)('is accessible in the %s theme', async (theme) => {
		const { container } = renderWithTheme(
			<><AdsList aria-label="Itens"><AdsListItem>Item</AdsListItem></AdsList><AdsCard>Conteúdo</AdsCard></>,
			theme,
		);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});

describe('AdsProgress', () => {
	it('clamps determinate values and exposes the effective value accessibly', () => {
		render(<AdsProgress label="Importação" min={10} max={20} value={30} />);
		const progress = screen.getByRole('progressbar', { name: 'Importação' });

		expect(progress).toHaveAttribute('aria-valuemin', '10');
		expect(progress).toHaveAttribute('aria-valuemax', '20');
		expect(progress).toHaveAttribute('aria-valuenow', '20');
	});

	it('omits a fictional percentage while indeterminate', () => {
		render(<AdsProgress label="Processando" />);
		const progress = screen.getByRole('progressbar', { name: 'Processando' });

		expect(progress).not.toHaveAttribute('aria-valuenow');
		expect(progress.querySelector('.ads-progress-indicator')).toHaveClass('motion-reduce:animate-none');
	});

	it('rejects an invalid range deterministically', () => {
		expect(() => render(<AdsProgress min={10} max={10} value={10} />)).toThrow(RangeError);
	});

	it('has no detectable accessibility violations in both modes', async () => {
		const { container } = render(<><AdsProgress label="Importando" value={30} /><AdsProgress label="Processando" /></>);
		expect((await axe.run(container)).violations).toEqual([]);
	});
});

describe('AdsEmptyState', () => {
	it('does not assume alert semantics and remains accessible', async () => {
		const { container } = render(
			<AdsEmptyState
				title="Nenhum resultado"
				description="Ajuste os filtros para tentar novamente."
				actions={<button type="button">Limpar filtros</button>}
			/>,
		);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeVisible();
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
