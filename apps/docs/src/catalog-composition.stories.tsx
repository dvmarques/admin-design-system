import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AdsBulkActionBar } from '@dvmarques/admin-ds-admin';
import {
	AdsButton,
	AdsFieldLabel,
	AdsFieldDescription,
	AdsFieldMessage,
	AdsInput,
	AdsInputGroup,
	AdsTable,
	AdsTableCaption,
	AdsTableHead,
	AdsTableRow,
	AdsTableHeader,
	AdsTableBody,
	AdsTableCell,
} from '@dvmarques/admin-ds-components';

const meta = { title: 'Catalog/Explicit compositions', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const FieldComposition: Story = {
	render: () => (
		<div>
			<AdsFieldLabel id="amount-label">Valor em reais</AdsFieldLabel>
			<AdsInputGroup startContent="R$" endContent="BRL">
				<AdsInput
					aria-labelledby="amount-label"
					aria-describedby="amount-help amount-error"
					aria-invalid="true"
					validationState="error"
					defaultValue="-1"
				/>
			</AdsInputGroup>
			<AdsFieldDescription id="amount-help">Informe um valor positivo.</AdsFieldDescription>
			<AdsFieldMessage id="amount-error">O valor não pode ser negativo.</AdsFieldMessage>
		</div>
	),
};
export const Caption: Story = {
	render: () => (
		<AdsTable>
			<AdsTableCaption>Valores de demonstração</AdsTableCaption>
			<AdsTableHead>
				<AdsTableRow>
					<AdsTableHeader>Item</AdsTableHeader>
					<AdsTableHeader>Valor</AdsTableHeader>
				</AdsTableRow>
			</AdsTableHead>
			<AdsTableBody>
				<AdsTableRow>
					<AdsTableCell>Exemplo A</AdsTableCell>
					<AdsTableCell>R$ 120</AdsTableCell>
				</AdsTableRow>
			</AdsTableBody>
		</AdsTable>
	),
};
function BulkActionsExample() {
	const [count, setCount] = useState(2);
	return (
		<>
			<AdsButton onClick={() => setCount(count + 1)}>Selecionar item</AdsButton>
			<AdsBulkActionBar selectedCount={count} onClear={() => setCount(0)}>
				<AdsButton onClick={() => setCount(0)}>Concluir ação</AdsButton>
			</AdsBulkActionBar>
		</>
	);
}
export const BulkActions: Story = { render: () => <BulkActionsExample /> };
