import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsAccordion,
	AdsBreadcrumb,
	AdsDropdown,
	AdsNav,
	AdsPagination,
	AdsSurface,
	AdsTabs,
} from '@admin-ds/components';

const meta = { title: 'Navigation/Components', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Structure: Story = {
	render: () => (
		<div className="grid gap-6">
			<AdsBreadcrumb
				items={[
					{ href: '#overview', label: 'Visão geral' },
					{ href: '#reports', label: 'Relatórios' },
					{ label: 'Mensal' },
				]}
			/>
			<AdsNav
				items={[
					{ href: '#overview', label: 'Visão geral', current: true },
					{ href: '#activity', label: 'Atividade' },
					{ label: 'Ações', onClick: () => undefined },
				]}
			/>
		</div>
	),
};
export const Tabs: Story = {
	render: () => (
		<AdsTabs defaultValue="details">
			<AdsTabs.List>
				<AdsTabs.Trigger value="details">Detalhes</AdsTabs.Trigger>
				<AdsTabs.Trigger value="history">Histórico</AdsTabs.Trigger>
			</AdsTabs.List>
			<AdsTabs.Panel value="details">Detalhes do registro.</AdsTabs.Panel>
			<AdsTabs.Panel value="history">Histórico do registro.</AdsTabs.Panel>
		</AdsTabs>
	),
};
/** Breadcrumb links and tabs keep AA contrast on an elevated surface in both themes. */
/**
 * A coluna `auto` de um grid não encolhe abaixo do conteúdo (as abas rolam, mas a lista pede 244px);
 * `minmax(0, 1fr)` deixa o conteúdo rolar dentro do próprio contêiner em vez de alargar a página.
 */
const fitColumn = { gridTemplateColumns: 'minmax(0, 1fr)' } as const;

export const OnRaisedSurface: Story = {
	render: () => (
		<div className="grid gap-6" style={fitColumn}>
			{(['light', 'dark'] as const).map((theme) => (
				<div
					data-theme={theme}
					key={theme}
					style={{ background: 'var(--ads-color-canvas)', padding: '1rem' }}
				>
					<AdsSurface variant="raised">
						<div className="grid gap-4" style={fitColumn}>
							<AdsBreadcrumb
								aria-label={`Breadcrumb ${theme}`}
								items={[
									{ href: '#overview', label: 'Visão geral' },
									{ href: '#reports', label: 'Relatórios' },
									{ label: 'Mensal' },
								]}
							/>
							<AdsTabs defaultValue="summary">
								<AdsTabs.List>
									<AdsTabs.Trigger value="summary">Resumo</AdsTabs.Trigger>
									<AdsTabs.Trigger value="history">Histórico</AdsTabs.Trigger>
									<AdsTabs.Trigger disabled value="future">
										Em breve
									</AdsTabs.Trigger>
								</AdsTabs.List>
								<AdsTabs.Panel value="summary">Resumo da conta.</AdsTabs.Panel>
								<AdsTabs.Panel value="history">Histórico de alterações.</AdsTabs.Panel>
							</AdsTabs>
						</div>
					</AdsSurface>
				</div>
			))}
		</div>
	),
};
export const Dropdown: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'ArrowDown, Enter ou Espaço abrem o menu e focam o primeiro item habilitado após a montagem. Setas, Home e End navegam ignorando itens desabilitados. Escape fecha e devolve foco ao gatilho. O clique abre sem mover o foco para um item.',
			},
		},
	},
	render: () => (
		<AdsDropdown>
			<AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
			<AdsDropdown.Content>
				<AdsDropdown.Item href="#edit">Editar</AdsDropdown.Item>
				<AdsDropdown.Item disabled>Arquivar</AdsDropdown.Item>
			</AdsDropdown.Content>
		</AdsDropdown>
	),
};
export const Pagination: Story = {
	render: () => {
		const [page, setPage] = useState(5);
		return <AdsPagination page={page} pageCount={20} onPageChange={setPage} />;
	},
};

/** Paginação responsiva em contêiner que pode ser redimensionado no Storybook. */
export const PaginationResponsive: Story = {
 render: () => {
  const [page,setPage]=useState(25);
  return <div style={{width:'min(100%, 420px)',resize:'horizontal',overflow:'auto',padding:'1rem'}}>
   <AdsPagination page={page} pageCount={50} onPageChange={setPage}
    navigationMode="arrows" showFirstLast showPageJump />
  </div>;
 },
};

export const PaginationLoading: Story = {
 render: () => <AdsPagination page={5} pageCount={20} loading navigationMode="arrows" />,
};

const ConsumerLink = ({
	href,
	...props
}: {
	href: string;
	className: string;
	children: ReactNode;
}) => <a href={href} {...props} onClick={(event) => event.preventDefault()} />;

/** Consumer-provided links (e.g. `next/link`) keep the library style and `aria-current` without nesting interactive content. */
export const ConsumerLinks: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<AdsBreadcrumb
				items={[
					{ label: 'Início', renderLink: (props) => <ConsumerLink href="/" {...props} /> },
					{ label: 'Relatórios' },
				]}
			/>
			<AdsNav
				items={[
					{
						current: true,
						label: 'Painel',
						renderLink: (props) => <ConsumerLink href="/painel" {...props} />,
					},
					{
						label: 'Clientes',
						renderLink: (props) => <ConsumerLink href="/clientes" {...props} />,
					},
				]}
			/>
			<AdsPagination
				page={2}
				pageCount={5}
				renderPageLink={(page, props) => <ConsumerLink href={`/?pagina=${page}`} {...props} />}
			/>
		</div>
	),
};

const longTrail = [
	{ href: '#home', label: 'Início' },
	{ href: '#reports', label: 'Relatórios' },
	{ href: '#sales', label: 'Vendas' },
	{ href: '#region', label: 'Região' },
	{ href: '#state', label: 'Estado' },
	{ label: 'Mensal' },
];

/** Beyond `maxItems`, the middle items collapse behind a button that expands them in place. */
export const BreadcrumbCollapsed: Story = {
	render: () => (
		<div className="grid gap-6">
			<AdsBreadcrumb items={longTrail} maxItems={4} />
			<AdsBreadcrumb
				itemsAfterCollapse={1}
				itemsBeforeCollapse={2}
				items={longTrail}
				maxItems={4}
			/>
		</div>
	),
};

/** The separator is any node, hidden from assistive technology. */
export const BreadcrumbSeparator: Story = {
	render: () => <AdsBreadcrumb items={longTrail.slice(0, 4)} separator="›" />,
};

/** Default texts are in English; pass translated ones from the app's own i18n. */
export const BreadcrumbTranslatedLabels: Story = {
	render: () => (
		<AdsBreadcrumb
			aria-label="Trilha de navegação"
			expandLabel="Mostrar caminho completo"
			items={longTrail}
			maxItems={4}
		/>
	),
};

/** `automatic` activates the tab as the focus moves; `vertical` swaps the arrows for Up and Down. */
export const TabsVerticalAutomatic: Story = {
	render: () => (
		<AdsTabs activationMode="automatic" defaultValue="profile" orientation="vertical">
			<AdsTabs.List aria-label="Configurações da conta">
				<AdsTabs.Trigger value="profile">Perfil</AdsTabs.Trigger>
				<AdsTabs.Trigger value="security">Segurança</AdsTabs.Trigger>
				<AdsTabs.Trigger disabled value="billing">
					Cobrança
				</AdsTabs.Trigger>
			</AdsTabs.List>
			<AdsTabs.Panel value="profile">Dados do perfil.</AdsTabs.Panel>
			<AdsTabs.Panel value="security">Opções de segurança.</AdsTabs.Panel>
			<AdsTabs.Panel value="billing">Dados de cobrança.</AdsTabs.Panel>
		</AdsTabs>
	),
};

/** `keepMounted` keeps inactive panels, hidden, so what was typed in them is preserved. */
export const TabsKeepMounted: Story = {
	render: () => (
		<AdsTabs defaultValue="form" keepMounted>
			<AdsTabs.List>
				<AdsTabs.Trigger value="form">Formulário</AdsTabs.Trigger>
				<AdsTabs.Trigger value="notes">Notas</AdsTabs.Trigger>
			</AdsTabs.List>
			<AdsTabs.Panel value="form">
				<label>
					Nome <input />
				</label>
			</AdsTabs.Panel>
			<AdsTabs.Panel value="notes">Notas do registro.</AdsTabs.Panel>
		</AdsTabs>
	),
};

function AccordionItem({
	disabled = false,
	level = 3,
	title,
	value,
}: {
	disabled?: boolean;
	level?: 2 | 3 | 4 | 5 | 6;
	title: string;
	value: string;
}) {
	return (
		<AdsAccordion.Item disabled={disabled} value={value}>
			<AdsAccordion.Header level={level}>
				<AdsAccordion.Trigger>{title}</AdsAccordion.Trigger>
			</AdsAccordion.Header>
			<AdsAccordion.Panel>Conteúdo de {title.toLowerCase()}.</AdsAccordion.Panel>
		</AdsAccordion.Item>
	);
}

/** One item open at a time; `collapsible` lets the open one close. */
export const AccordionSingle: Story = {
	render: () => (
		<AdsAccordion collapsible defaultValue="account" type="single">
			<AccordionItem title="Conta" value="account" />
			<AccordionItem title="Cobrança" value="billing" />
			<AccordionItem title="Notificações" value="notifications" />
		</AdsAccordion>
	),
};

/** Any number of items open; the heading level fits the outline of the page. */
export const AccordionMultiple: Story = {
	render: () => (
		<AdsAccordion defaultValue={['account', 'billing']} type="multiple">
			<AccordionItem level={4} title="Conta" value="account" />
			<AccordionItem level={4} title="Cobrança" value="billing" />
			<AccordionItem level={4} title="Notificações" value="notifications" />
		</AdsAccordion>
	),
};

/** A disabled item can neither be toggled nor focused by the arrows. */
export const AccordionDisabledItem: Story = {
	render: () => (
		<AdsAccordion type="single">
			<AccordionItem title="Conta" value="account" />
			<AccordionItem disabled title="Integrações (em breve)" value="integrations" />
			<AccordionItem title="Notificações" value="notifications" />
		</AdsAccordion>
	),
};

/** Closed panels stay hidden in the document by default; `unmountOnCollapse` removes their content. */
export const AccordionUnmountOnCollapse: Story = {
	render: () => (
		<AdsAccordion defaultValue="account" type="single" unmountOnCollapse>
			<AccordionItem title="Conta" value="account" />
			<AccordionItem title="Cobrança" value="billing" />
		</AdsAccordion>
	),
};

/** The accordion on a raised surface, in both themes. */
export const AccordionOnRaisedSurface: Story = {
	render: () => (
		<div className="grid gap-6" style={fitColumn}>
			{(['light', 'dark'] as const).map((theme) => (
				<div
					data-theme={theme}
					key={theme}
					style={{ background: 'var(--ads-color-canvas)', padding: '1rem' }}
				>
					<AdsSurface variant="raised">
						<AdsAccordion defaultValue={['account']} type="multiple">
							<AccordionItem title="Conta" value="account" />
							<AccordionItem disabled title="Integrações (em breve)" value="integrations" />
							<AccordionItem
								title="Notificações com um título bastante longo que precisa quebrar linha"
								value="notifications"
							/>
						</AdsAccordion>
					</AdsSurface>
				</div>
			))}
		</div>
	),
};
