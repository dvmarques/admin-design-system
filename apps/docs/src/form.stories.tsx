import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsPasswordInput,
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

/**
 * Um `AdsButton` em `startContent` ou `endContent` fica rente ao campo, sem a moldura do adendo, e
 * acompanha a altura do campo em qualquer tamanho; vários botões no mesmo adendo ficam contíguos.
 * Adendos de texto não mudam.
 */
export const InputGroupWithButton: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<div key={size} style={{ display: 'grid', gap: '0.75rem' }}>
					<AdsInputGroup
						endContent={
							<AdsButton size={size} type="button">
								Buscar
							</AdsButton>
						}
					>
						<AdsInput aria-label={`Busca (${size})`} placeholder="Nome ou e-mail" size={size} />
					</AdsInputGroup>
					<AdsInputGroup
						startContent={
							<AdsButton size={size} type="button" variant="secondary">
								Filtros
							</AdsButton>
						}
					>
						<AdsInput aria-label={`Filtro (${size})`} placeholder="Nome ou e-mail" size={size} />
					</AdsInputGroup>
					<AdsInputGroup
						endContent={
							<>
								<AdsButton size={size} type="button" variant="secondary">
									Limpar
								</AdsButton>
								<AdsButton size={size} type="button">
									Buscar
								</AdsButton>
							</>
						}
					>
						<AdsInput
							aria-label={`Busca com dois botões (${size})`}
							placeholder="Nome ou e-mail"
							size={size}
						/>
					</AdsInputGroup>
					<AdsInputGroup endContent="BRL" startContent="R$">
						<AdsInput aria-label={`Valor (${size})`} inputMode="decimal" size={size} />
					</AdsInputGroup>
				</div>
			))}
		</div>
	),
};

/** `AdsInput` e `AdsSelect` de mesmo tamanho têm a mesma altura, lado a lado. */
export const Sizes: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<div key={size} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
					<AdsField label={`Busca (${size})`}>
						<AdsInput placeholder="Nome ou e-mail" size={size} />
					</AdsField>
					<AdsField label={`Status (${size})`}>
						<AdsSelect defaultValue="active" size={size}>
							<option value="active">Ativo</option>
							<option value="inactive">Inativo</option>
						</AdsSelect>
					</AdsField>
				</div>
			))}
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

export const PasswordInput: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			<AdsField description="Use ao menos 8 caracteres." label="Senha">
				<AdsPasswordInput
					autoComplete="new-password"
					rules={[
						{ id: 'length', label: 'Ao menos 8 caracteres', test: (value) => value.length >= 8 },
						{ id: 'digit', label: 'Ao menos um número', test: (value) => /\d/.test(value) },
					]}
					showStrength
				/>
			</AdsField>
			<AdsField label="Senha inválida" validationState="error" error="Revise sua senha">
				<AdsPasswordInput />
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsPasswordInput disabled />
			</AdsField>
			<AdsField label="Sem alternância de visibilidade">
				<AdsPasswordInput showVisibilityToggle={false} />
			</AdsField>
		</div>
	),
};
