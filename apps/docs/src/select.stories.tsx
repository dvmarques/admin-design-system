import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsButton, AdsField, AdsSelect } from '@admin-ds/components';

const meta = {
	title: 'Forms/Select',
	component: AdsSelect,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'`AdsSelect` é o `select` nativo com tamanhos e estados. O `placeholder` é opt-in: sem ele o componente se comporta como antes. Com ele, `null` (`value`/`defaultValue`) indica ausência de escolha e `""` seleciona a opção real de valor vazio, se existir. A ausência não é enviada no formulário e `required` a considera inválida.',
			},
		},
	},
} satisfies Meta<typeof AdsSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

const statuses = (
	<>
		<option value="active">Ativo</option>
		<option value="inactive">Inativo</option>
	</>
);

const longLabel =
	'Departamento de operações financeiras, controladoria e planejamento estratégico corporativo da região metropolitana';

/** Sem `placeholder`, o select nativo é preservado, inclusive com uma primeira opção vazia. */
export const Native: Story = {
	render: () => (
		<div className="max-w-md">
			<AdsField label="Status">
				<AdsSelect defaultValue="">
					<option value="">Escolha</option>
					{statuses}
				</AdsSelect>
			</AdsField>
		</div>
	),
};

/** Não controlado: `defaultValue={null}` (ou omitido) começa em ausência; `required` a rejeita. */
export const Placeholder: Story = {
	render: () => (
		<form
			className="flex max-w-md flex-col gap-4"
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<AdsField description="Ausência é inválida com required." label="Status">
				<AdsSelect name="status" placeholder="Selecione…" required>
					{statuses}
				</AdsSelect>
			</AdsField>
			<div className="flex gap-2">
				<AdsButton type="submit">Enviar</AdsButton>
				<AdsButton type="reset" variant="secondary">
					Limpar
				</AdsButton>
			</div>
		</form>
	),
};

/** Controlado: `null` é ausência; `""` seleciona a opção real de valor vazio. */
export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>(null);
		return (
			<div className="flex max-w-md flex-col gap-3">
				<AdsField label="Equipe">
					<AdsSelect
						onChange={(event) => setValue(event.target.value)}
						placeholder="Selecione…"
						value={value}
					>
						<option value="">Sem equipe</option>
						<option value="fin">Financeiro</option>
					</AdsSelect>
				</AdsField>
				<p role="status">
					Valor: {value === null ? 'ausente (null)' : value === '' ? 'vazio ("")' : value}
				</p>
				<div className="flex gap-2">
					<AdsButton onClick={() => setValue(null)} size="sm" variant="secondary">
						Limpar (null)
					</AdsButton>
					<AdsButton onClick={() => setValue('')} size="sm" variant="secondary">
						Sem equipe ("")
					</AdsButton>
				</div>
			</div>
		);
	},
};

/** Opção real de valor vazio com `required`: continua válida e é enviada como `""`. */
export const EmptyValueIsValid: Story = {
	render: () => (
		<div className="max-w-md">
			<AdsField description="A opção real vazia satisfaz required." label="Equipe">
				<AdsSelect defaultValue="" name="team" placeholder="Selecione…" required>
					<option value="">Sem equipe</option>
					<option value="fin">Financeiro</option>
				</AdsSelect>
			</AdsField>
		</div>
	),
};

/** O texto é truncado antes da seta; o rótulo integral continua no nome acessível da opção. */
export const LongText: Story = {
	render: () => (
		<div className="flex w-72 max-w-full flex-col gap-4">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsSelect defaultValue="long" size={size}>
						<option value="long">{longLabel}</option>
						<option value="short">Curto</option>
					</AdsSelect>
				</AdsField>
			))}
		</div>
	),
};

/** Estados no campo composto: padrão, sucesso, erro e desabilitado. */
export const States: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Padrão">
				<AdsSelect placeholder="Selecione…">{statuses}</AdsSelect>
			</AdsField>
			<AdsField label="Sucesso" validationState="success">
				<AdsSelect defaultValue="active" placeholder="Selecione…">
					{statuses}
				</AdsSelect>
			</AdsField>
			<AdsField error="Selecione um status" label="Erro" validationState="error">
				<AdsSelect placeholder="Selecione…" required>
					{statuses}
				</AdsSelect>
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsSelect disabled placeholder="Selecione…">
					{statuses}
				</AdsSelect>
			</AdsField>
		</div>
	),
};
