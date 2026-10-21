import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsButton,
	AdsDialog,
	AdsDrawer,
	AdsField,
	AdsInput,
	AdsPopover,
	AdsToast,
	AdsTooltip,
} from '@admin-ds/components';

const meta = {
	title: 'Overlays/Components',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Camadas acessíveis para diálogos, contexto ancorado e notificações transitórias, com tooltip por hover e foco. Os controles de fechar acompanham o tema selecionado na barra de ferramentas.',
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<AdsButton onClick={() => setOpen(true)}>Abrir diálogo</AdsButton>
				<AdsDialog
					description="As alterações serão aplicadas ao próximo ciclo."
					onOpenChange={setOpen}
					open={open}
					title="Salvar alterações"
				>
					<AdsButton onClick={() => setOpen(false)}>Confirmar</AdsButton>
				</AdsDialog>
			</>
		);
	},
};

export const Drawer: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<AdsButton variant="secondary" onClick={() => setOpen(true)}>
					Abrir filtros
				</AdsButton>
				<AdsDrawer onOpenChange={setOpen} open={open} title="Filtros">
					<p className="text-text-muted">Selecione os critérios da consulta.</p>
				</AdsDrawer>
			</>
		);
	},
};

export const Tooltip: Story = {
	render: () => (
		<AdsTooltip content="Mais informações">
			<AdsButton variant="ghost">Passe o mouse</AdsButton>
		</AdsTooltip>
	),
};

export const Popover: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'O gatilho alterna a abertura. Interagir com campos e botões no conteúdo mantém o painel aberto; o consumidor pode fechá-lo explicitamente. Escape e clique externo solicitam fechamento. Não é necessário interromper a propagação dos cliques.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		const [name, setName] = useState('');
		return (
			<AdsPopover
				aria-label="Ações do registro"
				content={
					<div style={{ display: 'grid', gap: '0.75rem' }}>
						<AdsField label="Nome do registro">
							<AdsInput onChange={(event) => setName(event.target.value)} value={name} />
						</AdsField>
						<AdsButton onClick={() => setName('')}>Limpar nome</AdsButton>
						<AdsButton onClick={() => setOpen(false)}>Editar registro</AdsButton>
					</div>
				}
				onOpenChange={setOpen}
				open={open}
			>
				<AdsButton variant="secondary">Ações</AdsButton>
			</AdsPopover>
		);
	},
};

export const Toast: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return open ? (
			<AdsToast onClose={() => setOpen(false)} variant="success">
				Alterações salvas com sucesso.
			</AdsToast>
		) : (
			<AdsButton onClick={() => setOpen(true)}>Mostrar toast</AdsButton>
		);
	},
};
