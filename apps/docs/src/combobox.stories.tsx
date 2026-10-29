import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsAvatar,
	AdsButton,
	AdsCombobox,
	AdsDialog,
	AdsField,
	AdsIcon,
} from '@admin-ds/components';

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
			<AdsField label="Vazio">
				<AdsCombobox options={[]} />
			</AdsField>
			<AdsField error="Selecione um estado" label="Inválido" validationState="error">
				<AdsCombobox options={options} />
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsCombobox disabled options={options} />
			</AdsField>
			<AdsField label="Opção customizada">
				<AdsCombobox
					options={options}
					renderOption={(option) => (
						<span>
							{option.label} [{option.value}]
						</span>
					)}
				/>
			</AdsField>
		</div>
	),
};

export const VisualOptions: Story = {
	args: {
		options: [
			{ value: 'a', label: 'Com ícone', icon: 'building' },
			{ value: 'b', label: 'Sem ícone' },
		],
		defaultValue: 'a',
		renderOption: (option) => (
			<span>
				{option.label} [{option.value}]
			</span>
		),
	},
};
export const VisualOptionsDisabled: Story = {
	args: { ...VisualOptions.args, showOptionVisuals: false },
};

const team = [
	{ value: 'ana', label: 'Ana Souza', description: 'Produto', avatar: { fallback: 'AS' } },
	{ value: 'bia', label: 'Bia Lima', description: 'Design', avatar: { fallback: 'BL' } },
	{ value: 'caio', label: 'Caio Prado', description: 'Engenharia', avatar: { fallback: 'CP' } },
	{
		value: 'duda',
		label: 'Duda Reis',
		description: 'Suporte',
		avatar: { fallback: 'DR' },
		disabled: true,
	},
];

/**
 * `presentation="popover"`: um botão (não um `combobox`) abre um painel `dialog` não modal com
 * pesquisa separada e `listbox`. Digitar altera só a consulta; o valor confirmado não muda.
 */
export const PopoverBasic: Story = {
	render: () => (
		<div className="max-w-md">
			<AdsField label="Responsável" description="Abra, pesquise e selecione com o teclado.">
				<AdsCombobox
					defaultValue="ana"
					options={team}
					panelLabel="Escolher responsável"
					presentation="popover"
					searchLabel="Pesquisar responsável"
				/>
			</AdsField>
		</div>
	),
};

/** `renderTrigger` compõe o gatilho (um único botão) e `footer` fica fora da lista. */
export const PopoverCustomTriggerAndFooter: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>('bia');
		return (
			<div className="max-w-md">
				<AdsCombobox
					aria-label="Responsável"
					footer={
						<AdsButton onClick={() => setValue(null)} size="sm" type="button" variant="ghost">
							Remover responsável
						</AdsButton>
					}
					onValueChange={setValue}
					options={team}
					panelLabel="Escolher responsável"
					presentation="popover"
					renderTrigger={({ selectedOption, triggerProps }) => (
						<button
							{...triggerProps}
							className="flex w-full items-center gap-3 rounded-md border border-border-control bg-form-background px-3 py-2 text-start"
						>
							{selectedOption?.avatar ? (
								<AdsAvatar alt="" fallback={selectedOption.avatar.fallback} size="sm" />
							) : null}
							<span className="grid flex-1">
								<strong>{selectedOption?.label ?? 'Sem responsável'}</strong>
								<small>{selectedOption?.description ?? 'Escolha uma pessoa'}</small>
							</span>
							<AdsIcon name="chevronsUpDown" size="sm" />
						</button>
					)}
					value={value}
				/>
				<p role="status">Selecionado: {value ?? 'nenhum'}</p>
			</div>
		);
	},
};

export const PopoverWithoutSearch: Story = {
	render: () => (
		<div className="max-w-md">
			<AdsField label="Responsável (sem pesquisa)">
				<AdsCombobox
					defaultValue="bia"
					options={team}
					panelLabel="Escolher responsável"
					presentation="popover"
					searchable={false}
				/>
			</AdsField>
		</div>
	),
};

export const PopoverStates: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Vazio">
				<AdsCombobox options={[]} panelLabel="Vazio" presentation="popover" />
			</AdsField>
			<AdsField label="Carregando">
				<AdsCombobox loading options={team} panelLabel="Carregando" presentation="popover" />
			</AdsField>
			<AdsField label="Erro">
				<AdsCombobox
					error="Não foi possível carregar."
					onRetry={() => undefined}
					options={team}
					panelLabel="Erro"
					presentation="popover"
				/>
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsCombobox
					defaultValue="caio"
					disabled
					options={team}
					panelLabel="Desabilitado"
					presentation="popover"
				/>
			</AdsField>
		</div>
	),
};

/** `closeOnSelect={false}` com `value` controlado: o consumidor confirma (por exemplo, após uma API). */
export const PopoverAsyncConfirmation: Story = {
	render: () => {
		const [value, setValue] = useState<string | null>('ana');
		const [pending, setPending] = useState<string | null>(null);
		const [open, setOpen] = useState(false);
		return (
			<div className="max-w-md">
				<AdsField label="Responsável (confirmação assíncrona)">
					<AdsCombobox
						closeOnSelect={false}
						onOpenChange={setOpen}
						onValueChange={(next) => {
							setPending(next);
							setTimeout(() => {
								setValue(next);
								setPending(null);
								setOpen(false);
							}, 600);
						}}
						open={open}
						options={team}
						panelLabel="Escolher responsável"
						presentation="popover"
						statusMessage={pending ? 'Confirmando seleção' : undefined}
						value={value}
					/>
				</AdsField>
			</div>
		);
	},
};

export const PopoverInForm: Story = {
	render: () => (
		<form
			className="flex max-w-md flex-col gap-3"
			onSubmit={(event) => {
				event.preventDefault();
				alert(String(new FormData(event.currentTarget).get('responsavel')));
			}}
		>
			<AdsField description="Obrigatório; apenas o valor é enviado." label="Responsável">
				<AdsCombobox
					name="responsavel"
					options={team}
					panelLabel="Escolher responsável"
					presentation="popover"
					required
				/>
			</AdsField>
			<AdsButton type="submit">Enviar</AdsButton>
		</form>
	),
};

export const PopoverInDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return (
			<AdsDialog onOpenChange={setOpen} open={open} title="Atribuir responsável">
				<AdsField label="Responsável">
					<AdsCombobox options={team} panelLabel="Escolher responsável" presentation="popover" />
				</AdsField>
			</AdsDialog>
		);
	},
};
