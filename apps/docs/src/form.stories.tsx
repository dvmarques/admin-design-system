import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsInputGroup,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsSwitch,
	AdsTextarea,
} from '@admin-ds/components';

const meta = {
	title: 'Forms/Form controls',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Controles nativos acessíveis e compactos para coleta e seleção de dados administrativos.',
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextControls: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			<AdsField description="Usado para notificações da conta" label="E-mail">
				<AdsInput type="email" placeholder="nome@empresa.com" />
			</AdsField>
			<AdsField error="Informe uma descrição" label="Descrição" validationState="error">
				<AdsTextarea rows={3} />
			</AdsField>
			<AdsField label="Status">
				<AdsSelect defaultValue="active">
					<option value="active">Ativo</option>
					<option value="inactive">Inativo</option>
				</AdsSelect>
			</AdsField>
			<AdsInputGroup startContent="R$" endContent="BRL">
				<AdsInput aria-label="Valor" inputMode="decimal" />
			</AdsInputGroup>
		</div>
	),
};

export const SelectionControls: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<AdsCheckbox label="Enviar atualizações por e-mail" />
			<AdsSwitch label="Ativar notificações" defaultChecked />
			<AdsSelectionGroup legend="Periodicidade">
				<AdsRadio label="Diária" name="period" value="daily" defaultChecked />
				<AdsRadio label="Semanal" name="period" value="weekly" />
			</AdsSelectionGroup>
		</div>
	),
};

export const ValidationAndThemes: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			<AdsField error="Este campo é obrigatório" label="Campo inválido" validationState="error">
				<AdsInput aria-required="true" />
			</AdsField>
			<AdsField description="Valor verificado" label="Campo válido" validationState="success">
				<AdsInput defaultValue="Confirmado" />
			</AdsField>
		</div>
	),
};
