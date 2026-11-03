import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsButton, AdsField, AdsMultiSelect } from '@dvmarques/admin-ds-components';

const options = [
	{ value: 'design', label: 'Design' },
	{ value: 'frontend', label: 'Frontend' },
	{ value: 'backend', label: 'Backend' },
	{ value: 'seguranca', label: 'Segurança' },
	{ value: 'ops', label: 'Operações', disabled: true },
];

const meta = {
	title: 'Forms/Multi select',
	component: AdsMultiSelect,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Seleção múltipla com busca, chips removíveis e limite opcional. Use AdsField para label/erro. ArrowUp/Down navegam, Enter alterna, Backspace remove a última escolha e Escape fecha. O name repete valores em FormData.getAll(name).',
			},
		},
	},
} satisfies Meta<typeof AdsMultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<div className="max-w-md">
			<AdsField label="Áreas" description="Pesquise e selecione várias áreas.">
				<AdsMultiSelect defaultValue={['design']} name="areas" options={options} />
			</AdsField>
		</div>
	),
};

export const Controlled: Story = {
	render: () => {
		function Example() {
			const [selected, setSelected] = useState<string[]>(['design']);
			return (
				<div className="flex max-w-md flex-col gap-3">
					<AdsField label="Áreas controladas" description="No máximo três escolhas.">
						<AdsMultiSelect
							maxSelections={3}
							onValueChange={setSelected}
							options={options}
							value={selected}
						/>
					</AdsField>
					<p role="status">Valores: {selected.join(', ') || 'nenhum'}</p>
					<AdsButton onClick={() => setSelected(['frontend'])} type="button" variant="secondary">
						Definir Frontend
					</AdsButton>
				</div>
			);
		}
		return <Example />;
	},
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Carregando">
				<AdsMultiSelect loading options={options} />
			</AdsField>
			<AdsField error="Não foi possível consultar." label="Erro" validationState="error">
				<AdsMultiSelect error="Falha simulada" options={options} />
			</AdsField>
			<AdsField label="Sem opções">
				<AdsMultiSelect options={[]} />
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsMultiSelect defaultValue={['design']} disabled options={options} />
			</AdsField>
			<AdsField label="Somente leitura">
				<AdsMultiSelect defaultValue={['design']} options={options} readOnly />
			</AdsField>
		</div>
	),
};

export const Form: Story = {
	render: () => (
		<form className="flex max-w-md flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
			<AdsField label="Áreas obrigatórias" description="Um ou mais valores serão serializados.">
				<AdsMultiSelect name="areas" options={options} required />
			</AdsField>
			<div className="flex gap-2">
				<AdsButton type="submit">Enviar</AdsButton>
				<AdsButton type="reset" variant="secondary">Restaurar</AdsButton>
			</div>
		</form>
	),
};
