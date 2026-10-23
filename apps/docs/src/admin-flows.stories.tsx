import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsConfirmDialog,
	AdsListFlow,
	AdsStepForm,
	type AdsFilterValues,
	type AdsSmartTableColumn,
	type AdsStepDefinition,
} from '@admin-ds/admin';
import { AdsBadge, AdsButton, AdsField, AdsInput, AdsSelect } from '@admin-ds/components';

interface User {
	id: string;
	name: string;
	status: string;
}

const data: User[] = [
	{ id: '1', name: 'Ana Souza', status: 'Ativo' },
	{ id: '2', name: 'Bruno Lima', status: 'Ativo' },
	{ id: '3', name: 'Carla Dias', status: 'Inativo' },
	{ id: '4', name: 'Diego Alves', status: 'Pendente' },
];

const columns: AdsSmartTableColumn<User>[] = [
	{ id: 'name', label: 'Nome', hideable: false, cell: (u) => u.name },
	{
		id: 'status',
		label: 'Status',
		cell: (u) => (
			<AdsBadge variant={u.status === 'Ativo' ? 'success' : 'neutral'}>{u.status}</AdsBadge>
		),
	},
];

const meta = {
	title: 'Layout/AdminFlows',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Fluxos administrativos compostos por componentes públicos: `AdsListFlow` (filtros, tabela, paginação e `AdsBulkActionBar`), `AdsStepForm` (formulário em etapas) e `AdsConfirmDialog` (confirmação destrutiva). Todo o estado é do consumidor; os fluxos não persistem, enviam nem roteiam dados.',
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ListFlowDemo() {
	const [rows, setRows] = useState(data);
	const [selected, setSelected] = useState<string[]>([]);
	const [filters, setFilters] = useState<AdsFilterValues>({});
	const [confirming, setConfirming] = useState(false);
	const query = typeof filters.q === 'string' ? filters.q.toLowerCase() : '';
	const visible = rows.filter((u) => u.name.toLowerCase().includes(query));
	return (
		<>
			<AdsListFlow<User>
				bulkActions={
					<AdsButton onClick={() => setConfirming(true)} size="sm" variant="danger">
						Excluir selecionados
					</AdsButton>
				}
				caption="Usuários"
				columns={columns}
				filterBar={{
					filters: [{ id: 'q', label: 'Busca', type: 'text' }],
					onChange: setFilters,
					value: filters,
				}}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.name}
				onSelectionChange={setSelected}
				pagination={{ page: 1, pageCount: 1, onPageChange: () => {} }}
				rows={visible}
				selectedIds={selected}
			/>
			<AdsConfirmDialog
				confirmLabel="Excluir"
				description="Esta ação não pode ser desfeita."
				onConfirm={() => {
					setRows((current) => current.filter((u) => !selected.includes(u.id)));
					setSelected([]);
					setConfirming(false);
				}}
				onOpenChange={setConfirming}
				open={confirming}
				title={`Excluir ${selected.length} ${selected.length === 1 ? 'usuário' : 'usuários'}?`}
			/>
		</>
	);
}

export const ListWithBulkActions: Story = {
	render: () => <ListFlowDemo />,
};

function StepFormDemo({
	asyncValidation = false,
	startInvalid = false,
}: {
	asyncValidation?: boolean;
	startInvalid?: boolean;
}) {
	const [step, setStep] = useState('account');
	const [name, setName] = useState('');
	const [role, setRole] = useState('editor');
	const [touched, setTouched] = useState(startInvalid);
	const [done, setDone] = useState(false);
	const nameError = touched && name.trim() === '' ? 'Informe o nome.' : undefined;
	const steps: AdsStepDefinition[] = [
		{
			id: 'account',
			label: 'Conta',
			description: 'Dados básicos do usuário.',
			validate: () => {
				setTouched(true);
				const valid = name.trim() !== '';
				// Simula uma consulta ao servidor; um `validate` síncrono continua suportado.
				return asyncValidation
					? new Promise<boolean>((resolve) => setTimeout(() => resolve(valid), 800))
					: valid;
			},
			content: (
				<AdsField error={nameError} label="Nome" validationState={nameError ? 'error' : 'default'}>
					<AdsInput onChange={(e) => setName(e.currentTarget.value)} value={name} />
				</AdsField>
			),
		},
		{
			id: 'access',
			label: 'Acesso',
			content: (
				<AdsField label="Perfil">
					<AdsSelect onChange={(e) => setRole(e.currentTarget.value)} value={role}>
						<option value="editor">Editor</option>
						<option value="reader">Leitor</option>
					</AdsSelect>
				</AdsField>
			),
		},
		{
			id: 'review',
			label: 'Confirmação',
			description: 'Revise os dados antes de confirmar.',
			content: (
				<dl>
					<dt>Nome</dt>
					<dd>{name}</dd>
					<dt>Perfil</dt>
					<dd>{role === 'editor' ? 'Editor' : 'Leitor'}</dd>
				</dl>
			),
		},
	];
	return done ? (
		<p role="status">Usuário confirmado.</p>
	) : (
		<AdsStepForm
			activeStepId={step}
			aria-label="Novo usuário"
			onActiveStepChange={setStep}
			onCancel={() => setStep('account')}
			onSubmit={() => setDone(true)}
			steps={steps}
		/>
	);
}

export const StepForm: Story = { render: () => <StepFormDemo /> };

export const StepFormWithError: Story = {
	render: () => <StepFormDemo startInvalid />,
};

export const StepFormWithAsyncValidation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'`validate` pode retornar uma `Promise`: durante a espera o formulário fica com `aria-busy`, o botão mostra o carregamento e as ações ficam indisponíveis sem perder o foco. Depois de avançar, o indicador permite voltar às etapas anteriores e às já validadas.',
			},
		},
	},
	render: () => <StepFormDemo asyncValidation />,
};

function ConfirmDialogDemo({ destructive }: { destructive: boolean }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setOpen(true)} variant={destructive ? 'danger' : 'primary'}>
				{destructive ? 'Excluir conta' : 'Publicar alterações'}
			</AdsButton>
			<AdsConfirmDialog
				confirmLabel={destructive ? 'Excluir' : 'Publicar'}
				description={
					destructive
						? 'Esta ação não pode ser desfeita.'
						: 'As alterações ficarão visíveis a todos.'
				}
				destructive={destructive}
				onConfirm={() => setOpen(false)}
				onOpenChange={setOpen}
				open={open}
				title={destructive ? 'Excluir a conta?' : 'Publicar as alterações?'}
			/>
		</>
	);
}

export const ConfirmDestructive: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Com `destructive` (padrão) o painel usa `role="alertdialog"` e a variante de perigo. `role` explícito prevalece.',
			},
		},
	},
	render: () => <ConfirmDialogDemo destructive />,
};

export const ConfirmNonDestructive: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Com `destructive={false}` o painel usa `role="dialog"` e a confirmação primária.',
			},
		},
	},
	render: () => <ConfirmDialogDemo destructive={false} />,
};

export const Narrow: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Em telas estreitas o indicador e as ações quebram linha, sem rolagem horizontal da página.',
			},
		},
	},
	render: () => (
		<div style={{ maxWidth: '22rem' }}>
			<StepFormDemo />
		</div>
	),
};
