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
