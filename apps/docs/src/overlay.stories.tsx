import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsButton,
	AdsDialog,
	AdsDrawer,
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

export const NestedLayers: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Overlays aninhados respondem ao Escape na ordem inversa de abertura: o primeiro Escape fecha só o popover e devolve o foco ao seu gatilho; o segundo fecha o diálogo. Uma camada com `closeOnEscape={false}` absorve o Escape sem fechar a camada inferior.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		const [popoverOpen, setPopoverOpen] = useState(false);
		return (
			<>
				<AdsButton onClick={() => setOpen(true)}>Abrir diálogo com popover</AdsButton>
				<AdsDialog onOpenChange={setOpen} open={open} title="Diálogo com camada interna">
					<AdsPopover
						aria-label="Detalhes internos"
						content={<AdsButton onClick={() => setPopoverOpen(false)}>Entendi</AdsButton>}
						onOpenChange={setPopoverOpen}
						open={popoverOpen}
					>
						<AdsButton variant="secondary">Detalhes</AdsButton>
					</AdsPopover>
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
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<AdsPopover
				aria-label="Ações do registro"
				content={<AdsButton onClick={() => setOpen(false)}>Editar registro</AdsButton>}
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
