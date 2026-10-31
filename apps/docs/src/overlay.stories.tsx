import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsButton,
	AdsDialog,
	AdsDrawer,
	AdsDropdown,
	AdsField,
	AdsInput,
	AdsPopover,
	AdsToast,
	AdsTooltip,
} from '@dvmarques/admin-ds-components';

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

export const ExtremePositions: Story = {
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				story:
					'Tooltip, Popover e Dropdown junto às bordas da viewport. Abra em Canvas, reduza a janela e teste os quatro lados, conteúdo dinâmico, scroll e zoom. O lado efetivo aparece em data-placement; a seta acompanha o deslocamento.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		const [expanded, setExpanded] = useState(false);
		return (
			<div style={{ minHeight: '150vh', padding: 8 }}>
				{(['top', 'right', 'bottom', 'left'] as const).map((side, index) => (
					<div
						key={side}
						style={{
							position: 'fixed',
							...(index < 2 ? { top: 8 } : { bottom: 8 }),
							...(index % 2 ? { right: 8 } : { left: 8 }),
						}}
					>
						<AdsTooltip
							placement={side}
							content={
								side === 'right'
									? `Texto longo junto à borda direita. ${'A largura e a seta acompanham a área disponível. '.repeat(6)}`
									: `Preferência ${side}: a seta acompanha o lado efetivo e o shift.`
							}
						>
							<AdsButton>{side}</AdsButton>
						</AdsTooltip>
					</div>
				))}
				<div style={{ position: 'fixed', bottom: 64, left: 8 }}>
					<AdsPopover
						aria-label="Conteúdo dinâmico"
						placement="left"
						open={open}
						onOpenChange={setOpen}
						content={
							<>
								<AdsButton onClick={() => setExpanded(!expanded)}>Alternar conteúdo</AdsButton>
								<p>
									{expanded ? 'Conteúdo expandido junto à borda. '.repeat(20) : 'Conteúdo breve.'}
								</p>
							</>
						}
					>
						<AdsButton>Popover na borda</AdsButton>
					</AdsPopover>
				</div>
				<div style={{ position: 'fixed', top: 64, right: 8 }}>
					<AdsDropdown>
						<AdsDropdown.Trigger>Dropdown na borda</AdsDropdown.Trigger>
						<AdsDropdown.Content placement="right">
							<AdsDropdown.Item>Editar</AdsDropdown.Item>
							<AdsDropdown.Item>Duplicar</AdsDropdown.Item>
						</AdsDropdown.Content>
					</AdsDropdown>
				</div>
			</div>
		);
	},
};

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

export const TabWithIneligibleControls: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Tab e Shift+Tab circulam só pelos controles elegíveis, os mesmos do foco inicial: campos em `fieldset disabled`, `inert`, `hidden`, `display: none`, `visibility: hidden` ou com `tabindex` negativo não são pontos de virada. Use "Bloquear campos finais" para ver o ciclo se ajustar com o modal aberto: o botão passa a ser o último destino e Tab volta ao primeiro controle em vez de escapar para o navegador.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		const [locked, setLocked] = useState(false);
		return (
			<>
				<AdsButton onClick={() => setOpen(true)}>Abrir diálogo com campos bloqueados</AdsButton>
				<AdsDialog
					description="Percorra com Tab e Shift+Tab: os campos bloqueados ficam fora do ciclo."
					onOpenChange={setOpen}
					open={open}
					title="Campos condicionais"
				>
					<div style={{ display: 'grid', gap: '0.75rem' }}>
						<fieldset style={{ border: 0, margin: 0, minWidth: 0, padding: 0 }} disabled>
							<legend>Dados bloqueados</legend>
							<AdsField label="Código interno">
								<AdsInput defaultValue="A-102" />
							</AdsField>
						</fieldset>
						<AdsField label="Nome do registro">
							<AdsInput />
						</AdsField>
						<AdsButton variant="secondary" onClick={() => setLocked(!locked)}>
							{locked ? 'Liberar campos finais' : 'Bloquear campos finais'}
						</AdsButton>
						<fieldset style={{ border: 0, margin: 0, minWidth: 0, padding: 0 }} disabled={locked}>
							<legend>Campos finais</legend>
							<AdsField label="Observação">
								<AdsInput />
							</AdsField>
						</fieldset>
					</div>
				</AdsDialog>
			</>
		);
	},
};

export const InertBackground: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Com um diálogo ou drawer aberto, o conteúdo da página fora dele fica inerte: não recebe foco nem cliques e sai da árvore de acessibilidade (nos navegadores com suporte a `inert`). Com modais aninhados, só o mais recente é interativo, e a página só volta ao normal quando o último fecha. Popovers e menus abertos dentro do modal continuam interativos.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		const [confirmOpen, setConfirmOpen] = useState(false);
		const [popoverOpen, setPopoverOpen] = useState(false);
		return (
			<>
				<AdsButton onClick={() => setOpen(true)}>Abrir diálogo</AdsButton>
				<AdsButton variant="secondary">Controle da página</AdsButton>
				<AdsDialog onOpenChange={setOpen} open={open} title="Fundo inerte">
					<div className="flex gap-2">
						<AdsPopover
							aria-label="Detalhes do modal"
							content={<AdsButton onClick={() => setPopoverOpen(false)}>Entendi</AdsButton>}
							onOpenChange={setPopoverOpen}
							open={popoverOpen}
						>
							<AdsButton variant="secondary">Detalhes</AdsButton>
						</AdsPopover>
						<AdsButton onClick={() => setConfirmOpen(true)}>Abrir confirmação</AdsButton>
					</div>
				</AdsDialog>
				<AdsDialog onOpenChange={setConfirmOpen} open={confirmOpen} title="Confirmação aninhada">
					<AdsButton onClick={() => setConfirmOpen(false)}>Concluir</AdsButton>
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
	parameters: {
		docs: {
			description: {
				story:
					'O tooltip abre por foco ou apontamento e se associa ao gatilho por `aria-describedby`. Escape o dispensa sem mover o foco, inclusive quando aberto só por apontamento; ele só reabre com um novo foco ou apontamento no gatilho.',
			},
		},
	},
	render: () => (
		<AdsTooltip content="Mais informações">
			<AdsButton variant="ghost">Passe o mouse</AdsButton>
		</AdsTooltip>
	),
};

export const TooltipInStretchedColumn: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Em um contêiner flex em coluna com `align-items: stretch`, o wrapper do gatilho ocupa toda a largura, mas o tooltip e o popover se ancoram no botão visível: o balão e a seta ficam centralizados nele, não no wrapper.',
			},
		},
	},
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'stretch',
				gap: '4rem',
				paddingBlock: '4rem',
				width: '24rem',
			}}
		>
			<AdsTooltip content="Ancorado no botão">
				<AdsButton variant="ghost">Ajuda</AdsButton>
			</AdsTooltip>
		</div>
	),
};

export const TooltipWithDescribedTrigger: Story = {
	render: () => {
		const helpId = useId();
		return (
			<>
				<p id={helpId}>Use o e-mail corporativo.</p>
				<AdsTooltip content="Mais informações">
					<AdsButton aria-describedby={helpId} variant="ghost">
						Foque ou passe o mouse
					</AdsButton>
				</AdsTooltip>
			</>
		);
	},
};

export const TooltipInDialog: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Um tooltip aberto é a camada superior para o Escape: o primeiro Escape fecha só o tooltip, com o foco no gatilho, e o segundo fecha o diálogo. Isso vale também quando o foco inicial ou o foco devolvido cai num gatilho de tooltip.',
			},
		},
	},
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<AdsButton onClick={() => setOpen(true)}>Abrir diálogo com tooltip</AdsButton>
				<AdsDialog onOpenChange={setOpen} open={open} title="Diálogo com tooltip">
					<AdsTooltip content="Dispensável com Escape">
						<AdsButton variant="secondary">Mais informações</AdsButton>
					</AdsTooltip>
				</AdsDialog>
			</>
		);
	},
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
