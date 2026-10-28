import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsCombobox, AdsField } from '@admin-ds/components';

const options = [
	{ value: 'SP', label: 'São Paulo', description: 'Sudeste' },
	{ value: 'RJ', label: 'Rio de Janeiro', description: 'Sudeste' },
	{ value: 'SC', label: 'Santa Catarina', description: 'Sul', disabled: true },
];
const meta = {
	title: 'Forms/Combobox',
	component: AdsCombobox,
	tags: ['autodocs'],
	args: { options },
} satisfies Meta<typeof AdsCombobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>('SP');
		return (
			<div className="max-w-md">
				<AdsField label="Estado" description="Pesquise e selecione com o teclado.">
					<AdsCombobox options={options} value={value} onValueChange={setValue} />
				</AdsField>
				<p role="status">Selecionado: {value ?? 'nenhum'}</p>
			</div>
		);
	},
};
export const States: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Vazio"><AdsCombobox options={[]} /></AdsField>
			<AdsField error="Selecione um estado" label="Inválido" validationState="error">
				<AdsCombobox options={options} />
			</AdsField>
			<AdsField label="Desabilitado"><AdsCombobox disabled options={options} /></AdsField>
			<AdsField label="Opção customizada">
				<AdsCombobox options={options} renderOption={(option) => <span>{option.label} [{option.value}]</span>} />
			</AdsField>
		</div>
	),
};
