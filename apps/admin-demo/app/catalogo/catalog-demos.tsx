'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
	AdsButton,
	AdsBadge,
	AdsAvatar,
	AdsIcon,
	AdsTypography,
	AdsSurface,
	AdsLoadingIndicator,
	AdsSkeleton,
	AdsSparkline,
	AdsInput,
	AdsTextarea,
	AdsSelect,
	AdsCheckbox,
	AdsRadio,
	AdsSwitch,
	AdsField,
	AdsFieldLabel,
	AdsFieldDescription,
	AdsFieldMessage,
	AdsInputGroup,
	AdsSelectionGroup,
	AdsDatePicker,
	AdsBreadcrumb,
	AdsNav,
	AdsTabs,
	AdsTabsList,
	AdsTabsPanel,
	AdsTabsTrigger,
	AdsAccordion,
	AdsAccordionHeader,
	AdsAccordionItem,
	AdsAccordionPanel,
	AdsAccordionTrigger,
	AdsDropdown,
	AdsPagination,
	AdsDialog,
	AdsDrawer,
	AdsPopover,
	AdsTooltip,
	AdsToast,
	AdsEmptyState,
	AdsProgress,
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsCard,
	AdsCardActions,
	AdsCardContent,
	AdsCardHeader,
	AdsList,
	AdsListItem,
	ThemeToggle,
	AdsThemeControl,
	type AdsThemePreference,
	StyleFixture,
} from '@admin-ds/components';
import {
	AdsAdminShell,
	AdsDashboardGrid,
	AdsDashboardPanel,
	AdsMetricCard,
	AdsFilterBar,
	AdsSmartTable,
	AdsBulkActionBar,
	AdsConfirmDialog,
	AdsListFlow,
	AdsStepForm,
	type AdsFilterValues,
	type AdsSmartTableSort,
} from '@admin-ds/admin';

export function ButtonDemo() {
	const [count, setCount] = useState(0);
	return (
		<>
			<p role="status">{count} ações</p>
			{(['primary', 'secondary', 'danger', 'ghost'] as const).map((variant) => (
				<AdsButton key={variant} variant={variant} onClick={() => setCount(count + 1)}>
					{variant}
				</AdsButton>
			))}
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsButton key={size} size={size} onClick={() => setCount(count + 1)}>
					{size}
				</AdsButton>
			))}
			<AdsButton disabled>Desabilitado</AdsButton>
			<AdsButton isLoading>Salvando</AdsButton>
		</>
	);
}

export function BadgeDemo() {
	return (
		<>
			{(['neutral', 'primary', 'success', 'warning', 'danger'] as const).map((variant) => (
				<AdsBadge key={variant} variant={variant}>
					{variant}
				</AdsBadge>
			))}
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsBadge key={size} size={size}>
					{size}
				</AdsBadge>
			))}
		</>
	);
}

export function AvatarDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsAvatar key={size} size={size} alt="Ana Silva" fallback="AS" />
			))}
			<AdsAvatar alt="Perfil sem foto" fallback="?" />
		</>
	);
}

export function IconDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsIcon key={size} size={size} name="check" label={`Confirmado ${size}`} />
			))}
			<AdsIcon name="search" />
			<span>Busca (ícone decorativo)</span>
		</>
	);
}

export function TypographyDemo() {
	return (
		<>
			<AdsTypography as="p" variant="heading1">
				Título visual
			</AdsTypography>
			<AdsTypography as="p" variant="heading2">
				Subtítulo visual
			</AdsTypography>
			<AdsTypography as="p" variant="heading3">
				Seção visual
			</AdsTypography>
			<AdsTypography>Texto de leitura</AdsTypography>
			<AdsTypography variant="muted">Informação auxiliar</AdsTypography>
		</>
	);
}

export function SurfaceDemo() {
	return (
		<>
			{(['neutral', 'raised', 'outlined'] as const).map((variant) => (
				<AdsSurface key={variant} variant={variant} style={{ padding: '1rem' }}>
					{variant}
				</AdsSurface>
			))}
		</>
	);
}

export function LoadingIndicatorDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsLoadingIndicator key={size} size={size} label={`Carregando ${size}`} />
			))}
		</>
	);
}

export function SkeletonDemo() {
	return (
		<div aria-busy="true" aria-label="Carregando perfil">
			<AdsSkeleton style={{ height: '3rem', width: '3rem', borderRadius: '50%' }} />
			<AdsSkeleton style={{ height: '1rem', width: '12rem', maxWidth: '100%' }} />
			<span>Carregando perfil</span>
		</div>
	);
}

export function SparklineDemo() {
	return (
		<>
			{(['default', 'positive', 'negative'] as const).map((tone) => (
				<AdsSparkline
					key={tone}
					label={`Evolução ${tone}`}
					tone={tone}
					values={[1, 3, null, 2, 6]}
				/>
			))}
			<AdsSparkline label="Série constante" values={[2, 2, 2]} />
			<AdsSparkline label="Um ponto" values={[5]} />
			<AdsSparkline label="Sem dados" values={[]} />
			<p>Série vazia não desenha gráfico.</p>
		</>
	);
}

export function InputDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsInput placeholder="Digite aqui" size={size} />
				</AdsField>
			))}
			<AdsField label="Desabilitado">
				<AdsInput placeholder="Digite aqui" disabled />
			</AdsField>
			<AdsField label="Inválido" validationState="error" error="Revise o valor">
				<AdsInput placeholder="Digite aqui" />
			</AdsField>
			<AdsField label="Válido" validationState="success">
				<AdsInput placeholder="Digite aqui" />
			</AdsField>
		</>
	);
}

export function TextareaDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsTextarea placeholder="Digite aqui" size={size} />
				</AdsField>
			))}
			<AdsField label="Desabilitado">
				<AdsTextarea placeholder="Digite aqui" disabled />
			</AdsField>
			<AdsField label="Inválido" validationState="error" error="Revise o valor">
				<AdsTextarea placeholder="Digite aqui" />
			</AdsField>
			<AdsField label="Válido" validationState="success">
				<AdsTextarea placeholder="Digite aqui" />
			</AdsField>
		</>
	);
}

export function SelectDemo() {
	return (
		<>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsSelect size={size}>
						<option value="">Escolha</option>
						<option value="a">Ativo</option>
						<option value="i">Inativo</option>
					</AdsSelect>
				</AdsField>
			))}
			<AdsField label="Desabilitado">
				<AdsSelect disabled>
					<option value="">Escolha</option>
					<option value="a">Ativo</option>
					<option value="i">Inativo</option>
				</AdsSelect>
			</AdsField>
			<AdsField label="Inválido" validationState="error" error="Revise o valor">
				<AdsSelect>
					<option value="">Escolha</option>
					<option value="a">Ativo</option>
					<option value="i">Inativo</option>
				</AdsSelect>
			</AdsField>
			<AdsField label="Válido" validationState="success">
				<AdsSelect>
					<option value="">Escolha</option>
					<option value="a">Ativo</option>
					<option value="i">Inativo</option>
				</AdsSelect>
			</AdsField>
		</>
	);
}

export function CheckboxDemo() {
	return (
		<AdsSelectionGroup legend="Preferências">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsCheckbox key={size} name="preferencia" value={size} size={size} label={size} />
			))}
			<AdsCheckbox name="fixo" defaultChecked disabled label="Selecionado e desabilitado" />
		</AdsSelectionGroup>
	);
}

export function RadioDemo() {
	return (
		<AdsSelectionGroup legend="Preferências">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsRadio key={size} name="preferencia" value={size} size={size} label={size} />
			))}
			<AdsRadio name="fixo" defaultChecked disabled label="Selecionado e desabilitado" />
		</AdsSelectionGroup>
	);
}

export function SwitchDemo() {
	return (
		<AdsSelectionGroup legend="Preferências">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsSwitch key={size} name="preferencia" value={size} size={size} label={size} />
			))}
			<AdsSwitch name="fixo" defaultChecked disabled label="Selecionado e desabilitado" />
		</AdsSelectionGroup>
	);
}

export function FieldDemo() {
	const [value, setValue] = useState('120');
	const [error, setError] = useState(false);
	return (
		<>
			<AdsFieldLabel id="amount-label">Valor em reais</AdsFieldLabel>
			<AdsInputGroup
				startContent="R$"
				endContent={
					<>
						<AdsButton onClick={() => setValue('0')}>Limpar valor</AdsButton>
						<AdsButton onClick={() => setValue('120')}>Restaurar</AdsButton>
					</>
				}
			>
				<AdsInput
					aria-labelledby="amount-label"
					id="amount"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					validationState={error ? 'error' : 'default'}
					aria-invalid={error}
					aria-describedby={error ? 'amount-help amount-error' : 'amount-help'}
				/>
			</AdsInputGroup>
			<AdsFieldDescription id="amount-help">
				Use os adendos para alterar o valor.
			</AdsFieldDescription>
			{error && <AdsFieldMessage id="amount-error">Informe um valor válido.</AdsFieldMessage>}
			<AdsButton onClick={() => setError(!error)}>Alternar erro</AdsButton>
			<AdsField
				label="Campo composto"
				description="Associação automática"
				validationState={error ? 'error' : 'default'}
				error={error ? 'Campo obrigatório' : undefined}
			>
				<AdsInput />
			</AdsField>
		</>
	);
}

export function SelectionGroupDemo() {
	return (
		<AdsSelectionGroup legend="Canais">
			<AdsCheckbox defaultChecked label="Email" />
			<AdsCheckbox label="SMS" />
			<AdsCheckbox disabled label="Telefone indisponível" />
		</AdsSelectionGroup>
	);
}

export function DatePickerDemo() {
	return (
		<>
			<AdsDatePicker
				aria-label="Data única"
				defaultValue="2026-10-23"
				min="2026-10-01"
				max="2026-10-31"
			/>
			<AdsDatePicker
				aria-label="Período"
				mode="range"
				defaultValue={{ start: '2026-10-01', end: '2026-10-10' }}
			/>
			<AdsDatePicker aria-label="Data desabilitada" disabled />
			<AdsDatePicker aria-label="Data inválida" validationState="error" />
		</>
	);
}

export function BreadcrumbDemo() {
	return (
		<AdsBreadcrumb
			maxItems={3}
			expandLabel="Mostrar caminho completo"
			items={[
				{ label: 'Início', renderLink: (props) => <Link href="/" {...props} /> },
				{ label: 'Catálogo', renderLink: (props) => <Link href="/catalogo" {...props} /> },
				{
					label: 'Navegação',
					renderLink: (props) => <Link href="/catalogo#navegacao" {...props} />,
				},
				{ label: 'Trilha' },
			]}
		/>
	);
}

export function NavDemo() {
	const [current, setCurrent] = useState('Resumo');
	return (
		<>
			<AdsNav
				items={['Resumo', 'Atividade'].map((label) => ({
					label,
					current: current === label,
					onClick: () => setCurrent(label),
				}))}
			/>
			<p role="status">Seção: {current}</p>
		</>
	);
}

export function TabsDemo() {
	return (
		<AdsTabs defaultValue="summary">
			<AdsTabsList aria-label="Informações">
				<AdsTabsTrigger value="summary">Resumo</AdsTabsTrigger>
				<AdsTabsTrigger value="history">Histórico</AdsTabsTrigger>
				<AdsTabsTrigger value="disabled" disabled>
					Indisponível
				</AdsTabsTrigger>
			</AdsTabsList>
			<AdsTabsPanel value="summary">Resumo da conta.</AdsTabsPanel>
			<AdsTabsPanel value="history">Histórico de alterações.</AdsTabsPanel>
		</AdsTabs>
	);
}

export function AccordionDemo() {
	return (
		<AdsAccordion type="multiple" defaultValue={['first']}>
			<AdsAccordionItem value="first">
				<AdsAccordionHeader>
					<AdsAccordionTrigger>Primeira seção</AdsAccordionTrigger>
				</AdsAccordionHeader>
				<AdsAccordionPanel>Conteúdo da primeira seção.</AdsAccordionPanel>
			</AdsAccordionItem>
			<AdsAccordionItem value="second">
				<AdsAccordionHeader>
					<AdsAccordionTrigger>Segunda seção</AdsAccordionTrigger>
				</AdsAccordionHeader>
				<AdsAccordionPanel>Conteúdo da segunda seção.</AdsAccordionPanel>
			</AdsAccordionItem>
			<AdsAccordionItem value="disabled" disabled>
				<AdsAccordionHeader>
					<AdsAccordionTrigger>Seção indisponível</AdsAccordionTrigger>
				</AdsAccordionHeader>
				<AdsAccordionPanel>Indisponível</AdsAccordionPanel>
			</AdsAccordionItem>
		</AdsAccordion>
	);
}

export function DropdownDemo() {
	const [message, setMessage] = useState('Nenhuma ação');
	return (
		<>
			<AdsDropdown>
				<AdsDropdown.Trigger>Abrir ações</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item onSelect={() => setMessage('Exportado')}>Exportar</AdsDropdown.Item>
					<AdsDropdown.Item disabled>Indisponível</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>
			<p role="status">{message}</p>
		</>
	);
}

export function PaginationDemo() {
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	return (
		<>
			<AdsPagination
				page={page}
				pageCount={20}
				aria-label="Paginação de resultados"
				onPageChange={setPage}
				showPageJump
				loading={loading}
			/>
			<AdsButton onClick={() => setLoading(!loading)}>Alternar carregamento</AdsButton>
			<p role="status">Página {page}, 20 páginas</p>
			<AdsPagination
				aria-label="Paginação sem resultados"
				page={1}
				pageCount={0}
				onPageChange={setPage}
			/>
		</>
	);
}

export function DialogDemo() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setOpen(true)}>Abrir Dialog</AdsButton>
			<AdsDialog
				title="Exemplo de Dialog"
				description="Confira o conteúdo antes de continuar."
				open={open}
				onOpenChange={setOpen}
			>
				<p>Conteúdo do painel.</p>
			</AdsDialog>
		</>
	);
}

export function DrawerDemo() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setOpen(true)}>Abrir Drawer</AdsButton>
			<AdsDrawer
				title="Exemplo de Drawer"
				description="Confira o conteúdo antes de continuar."
				open={open}
				onOpenChange={setOpen}
			>
				<p>Conteúdo do painel.</p>
			</AdsDrawer>
		</>
	);
}

export function ConfirmDialogDemo() {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	return (
		<>
			<AdsButton onClick={() => setOpen(true)}>Abrir ConfirmDialog</AdsButton>
			<AdsConfirmDialog
				title="Exemplo de ConfirmDialog"
				description="Confira o conteúdo antes de continuar."
				open={open}
				onOpenChange={setOpen}
				onConfirm={() => {
					setOpen(false);
					setMessage('Confirmado');
				}}
			>
				<p>Conteúdo do painel.</p>
			</AdsConfirmDialog>
			<p role="status">{message}</p>
		</>
	);
}

export function PopoverDemo() {
	const [open, setOpen] = useState(false);
	return (
		<AdsPopover
			open={open}
			onOpenChange={setOpen}
			content={<AdsButton onClick={() => setOpen(false)}>Concluir</AdsButton>}
		>
			<AdsButton>Abrir popover</AdsButton>
		</AdsPopover>
	);
}

export function TooltipDemo() {
	return (
		<AdsTooltip content="Informação adicional">
			<AdsButton>Ajuda</AdsButton>
		</AdsTooltip>
	);
}

export function ToastDemo() {
	const [open, setOpen] = useState(false);
	const [variant, setVariant] = useState<'info' | 'success' | 'warning' | 'error'>('success');
	return (
		<>
			<AdsField label="Tom">
				<AdsSelect
					value={variant}
					onChange={(event) => setVariant(event.target.value as typeof variant)}
				>
					{['info', 'success', 'warning', 'error'].map((value) => (
						<option key={value}>{value}</option>
					))}
				</AdsSelect>
			</AdsField>
			<AdsButton onClick={() => setOpen(true)}>Mostrar notificação</AdsButton>
			<AdsToast open={open} variant={variant} onClose={() => setOpen(false)}>
				Operação de demonstração: {variant}
			</AdsToast>
		</>
	);
}

export function EmptyStateDemo() {
	const [empty, setEmpty] = useState(true);
	return empty ? (
		<AdsEmptyState
			title="Nenhum resultado"
			description="Tente outra consulta."
			actions={<AdsButton onClick={() => setEmpty(false)}>Carregar exemplo</AdsButton>}
		/>
	) : (
		<>
			<p>Resultado carregado</p>
			<AdsButton onClick={() => setEmpty(true)}>Limpar resultado</AdsButton>
		</>
	);
}

export function ProgressDemo() {
	const [value, setValue] = useState(40);
	return (
		<>
			<AdsProgress value={value} label="Importação" />
			<AdsButton onClick={() => setValue(Math.min(100, value + 20))}>Avançar progresso</AdsButton>
			<AdsButton onClick={() => setValue(0)}>Reiniciar progresso</AdsButton>
			<AdsProgress label="Aguardando resposta" />
		</>
	);
}

export function TableDemo() {
	const [compact, setCompact] = useState(false);
	return (
		<>
			<AdsButton onClick={() => setCompact(!compact)}>Alternar densidade</AdsButton>
			<AdsTable density={compact ? 'compact' : 'comfortable'}>
				<AdsTableCaption>Resumo de valores</AdsTableCaption>
				<AdsTableHead>
					<AdsTableRow interactive={false}>
						<AdsTableHeader>Item</AdsTableHeader>
						<AdsTableHeader align="end">Valor</AdsTableHeader>
					</AdsTableRow>
				</AdsTableHead>
				<AdsTableBody>
					<AdsTableRow>
						<AdsTableCell>Exemplo A</AdsTableCell>
						<AdsTableCell align="end">R$ 120</AdsTableCell>
					</AdsTableRow>
				</AdsTableBody>
			</AdsTable>
		</>
	);
}

export function CardDemo() {
	const [saved, setSaved] = useState(false);
	return (
		<AdsCard>
			<AdsCardHeader>
				<h3>Relatório</h3>
				<p>Composição de conteúdo</p>
			</AdsCardHeader>
			<AdsCardContent>
				<p role="status">{saved ? 'Relatório salvo' : 'Relatório pendente'}</p>
			</AdsCardContent>
			<AdsCardActions>
				<AdsButton onClick={() => setSaved(!saved)}>Alternar status</AdsButton>
			</AdsCardActions>
		</AdsCard>
	);
}

export function ListDemo() {
	return (
		<AdsList>
			<AdsListItem>Primeiro item</AdsListItem>
			<AdsListItem>
				Segundo item com uma descrição mais longa que pode quebrar em telas estreitas.
			</AdsListItem>
		</AdsList>
	);
}

export function AdminShellDemo() {
	return (
		<div style={{ height: '26rem', width: '100%', overflow: 'auto' }}>
			<AdsAdminShell>
				<AdsAdminShell.Header>
					<AdsAdminShell.NavigationTrigger />
					<AdsAdminShell.SidebarToggle />
					<span>Shell de exemplo</span>
				</AdsAdminShell.Header>
				<AdsAdminShell.Body>
					<AdsAdminShell.Sidebar
						label="Navegação do shell de exemplo"
						mobileTitle="Menu do exemplo"
					>
						<AdsAdminShell.Navigation>
							<AdsAdminShell.NavigationSection label="Exemplos">
								<AdsAdminShell.NavigationGroup label="Páginas" icon={<AdsIcon name="info" />} open>
									<AdsAdminShell.NavigationItem>
										<a href="#shell-content" aria-current="page">
											Conteúdo
										</a>
									</AdsAdminShell.NavigationItem>
								</AdsAdminShell.NavigationGroup>
							</AdsAdminShell.NavigationSection>
						</AdsAdminShell.Navigation>
					</AdsAdminShell.Sidebar>
					<AdsAdminShell.Main>
						<h1>Shell administrativo</h1>
						<p id="shell-content">
							Conteúdo administrativo. Use os controles para recolher ou abrir o menu.
						</p>
					</AdsAdminShell.Main>
				</AdsAdminShell.Body>
			</AdsAdminShell>
		</div>
	);
}

export function DashboardDemo() {
	return (
		<AdsDashboardGrid>
			<AdsMetricCard
				title="Receita"
				value="R$ 120"
				change="+12%"
				trend="up"
				sparkline={{ label: 'Receita diária', values: [1, 3, 2, 5] }}
			/>
			<AdsMetricCard title="Carregando" value="0" loading />
			<AdsDashboardPanel title="Erro" error="Falha ao carregar" />
			<AdsDashboardPanel title="Sem dados" empty={<AdsEmptyState title="Sem registros" />} />
			<AdsDashboardPanel title="Resumo" span={2}>
				<p>Painel com conteúdo</p>
			</AdsDashboardPanel>
		</AdsDashboardGrid>
	);
}

export function FilterBarDemo() {
	const [value, setValue] = useState<AdsFilterValues>({});
	return (
		<>
			<AdsFilterBar
				value={value}
				onChange={setValue}
				filters={[
					{ id: 'query', type: 'text', label: 'Buscar nome' },
					{
						id: 'status',
						type: 'select',
						label: 'Status',
						options: [{ label: 'Ativo', value: 'active' }],
					},
					{
						id: 'tags',
						type: 'multiselect',
						label: 'Tags',
						options: [
							{ label: 'Novo', value: 'new' },
							{ label: 'VIP', value: 'vip' },
						],
					},
					{ id: 'date', type: 'date', label: 'Data' },
					{ id: 'period', type: 'date-range', label: 'Período' },
				]}
			/>
			<output aria-label="Valores dos filtros">{JSON.stringify(value)}</output>
		</>
	);
}

export function SmartTableDemo() {
	const [selected, setSelected] = useState<string[]>([]);
	const [sort, setSort] = useState<AdsSmartTableSort | null>(null);
	const [hidden, setHidden] = useState<string[]>([]);
	const [filters, setFilters] = useState<AdsFilterValues>({});
	const [state, setState] = useState('ready');
	const [page, setPage] = useState(1);
	const allRows = [
		{ id: '1', name: 'Ana' },
		{ id: '2', name: 'Bruno' },
		{ id: '3', name: 'Carla' },
	];
	const rows = allRows
		.filter((row) => row.name.toLowerCase().includes(String(filters.query ?? '').toLowerCase()))
		.sort((a, b) =>
			sort ? a.name.localeCompare(b.name) * (sort.direction === 'asc' ? 1 : -1) : 0,
		);
	return (
		<>
			<AdsField label="Estado da tabela">
				<AdsSelect value={state} onChange={(event) => setState(event.target.value)}>
					{['ready', 'loading', 'error', 'empty'].map((value) => (
						<option key={value}>{value}</option>
					))}
				</AdsSelect>
			</AdsField>
			<AdsSmartTable
				caption="Pessoas de demonstração"
				columns={[{ id: 'name', label: 'Nome', sortable: true, cell: (row) => row.name }]}
				rows={state === 'empty' ? [] : rows.slice(page - 1, page)}
				getRowId={(row) => row.id}
				getRowLabel={(row) => row.name}
				sort={sort}
				onSortChange={setSort}
				selectedIds={selected}
				onSelectionChange={setSelected}
				hiddenColumnIds={hidden}
				onHiddenColumnsChange={setHidden}
				loading={state === 'loading'}
				error={state === 'error' ? 'Falha de demonstração' : undefined}
				onRetry={() => setState('ready')}
				pagination={{ page, pageCount: Math.max(1, rows.length), onPageChange: setPage }}
				filters={
					<AdsFilterBar
						filters={[{ id: 'query', type: 'text', label: 'Buscar nome' }]}
						value={filters}
						onChange={setFilters}
					/>
				}
			/>
			<output aria-label="Seleção atual">{selected.join(', ') || 'Nenhuma seleção'}</output>
		</>
	);
}

export function ListFlowDemo() {
	const [selected, setSelected] = useState<string[]>([]);
	const [sort, setSort] = useState<AdsSmartTableSort | null>(null);
	const [hidden, setHidden] = useState<string[]>([]);
	const [filters, setFilters] = useState<AdsFilterValues>({});
	const [state, setState] = useState('ready');
	const [page, setPage] = useState(1);
	const allRows = [
		{ id: '1', name: 'Ana' },
		{ id: '2', name: 'Bruno' },
		{ id: '3', name: 'Carla' },
	];
	const rows = allRows
		.filter((row) => row.name.toLowerCase().includes(String(filters.query ?? '').toLowerCase()))
		.sort((a, b) =>
			sort ? a.name.localeCompare(b.name) * (sort.direction === 'asc' ? 1 : -1) : 0,
		);
	return (
		<>
			<AdsField label="Estado da tabela">
				<AdsSelect value={state} onChange={(event) => setState(event.target.value)}>
					{['ready', 'loading', 'error', 'empty'].map((value) => (
						<option key={value}>{value}</option>
					))}
				</AdsSelect>
			</AdsField>
			<AdsListFlow
				caption="Pessoas de demonstração"
				columns={[{ id: 'name', label: 'Nome', sortable: true, cell: (row) => row.name }]}
				rows={state === 'empty' ? [] : rows.slice(page - 1, page)}
				getRowId={(row) => row.id}
				getRowLabel={(row) => row.name}
				sort={sort}
				onSortChange={setSort}
				selectedIds={selected}
				onSelectionChange={setSelected}
				hiddenColumnIds={hidden}
				onHiddenColumnsChange={setHidden}
				loading={state === 'loading'}
				error={state === 'error' ? 'Falha de demonstração' : undefined}
				onRetry={() => setState('ready')}
				pagination={{ page, pageCount: Math.max(1, rows.length), onPageChange: setPage }}
				filterBar={{
					filters: [{ id: 'query', type: 'text', label: 'Buscar nome' }],
					value: filters,
					onChange: setFilters,
				}}
				bulkActions={<AdsButton onClick={() => setSelected([])}>Concluir seleção</AdsButton>}
			/>
			<output aria-label="Seleção atual">{selected.join(', ') || 'Nenhuma seleção'}</output>
		</>
	);
}

export function BulkActionBarDemo() {
	const [count, setCount] = useState(0);
	return (
		<>
			<AdsButton onClick={() => setCount(count + 1)}>Selecionar item</AdsButton>
			<AdsBulkActionBar selectedCount={count} onClear={() => setCount(0)}>
				<AdsButton onClick={() => setCount(0)}>Concluir ação em massa</AdsButton>
			</AdsBulkActionBar>
		</>
	);
}

export function StepFormDemo() {
	const [active, setActive] = useState('name');
	const [name, setName] = useState('');
	const [error, setError] = useState(false);
	const [done, setDone] = useState(false);
	return (
		<>
			<AdsStepForm
				aria-label="Cadastro de exemplo"
				activeStepId={active}
				onActiveStepChange={setActive}
				onSubmit={() => setDone(true)}
				steps={[
					{
						id: 'name',
						label: 'Identificação',
						// Validação assíncrona simulada (por exemplo, consulta de disponibilidade no servidor).
						validate: async () => {
							await new Promise((resolve) => setTimeout(resolve, 300));
							setError(!name.trim());
							return Boolean(name.trim());
						},
						content: (
							<AdsField
								label="Nome"
								validationState={error ? 'error' : 'default'}
								error={error ? 'Informe o nome' : undefined}
							>
								<AdsInput value={name} onChange={(event) => setName(event.target.value)} />
							</AdsField>
						),
					},
					{ id: 'review', label: 'Revisão', content: <p>Confirme o cadastro de {name}.</p> },
				]}
			/>
			<p role="status">{done ? 'Cadastro confirmado' : 'Cadastro em andamento'}</p>
		</>
	);
}

export function ThemeControlDemo() {
	const [preference, setPreference] = useState<AdsThemePreference>('system');
	return (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
				<AdsThemeControl onValueChange={setPreference} value={preference} />
				<AdsThemeControl
					optionDisplay="icon-text"
					onValueChange={setPreference}
					value={preference}
				/>
				<AdsThemeControl disabled value={preference} />
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
				<AdsThemeControl onValueChange={setPreference} value={preference} variant="group" />
				<AdsThemeControl
					optionDisplay="icon-text"
					onValueChange={setPreference}
					value={preference}
					variant="group"
				/>
			</div>
			<p role="status">Preferência: {preference}</p>
		</div>
	);
}

export function ThemeToggleDemo() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	return (
		<div
			data-theme={theme}
			style={{
				background: 'var(--ads-color-surface)',
				color: 'var(--ads-color-text)',
				padding: '1rem',
			}}
		>
			<ThemeToggle initialTheme="light" onThemeChange={setTheme} />
			<p>Tema do exemplo: {theme}</p>
		</div>
	);
}

export function StyleFixtureDemo() {
	return (
		<>
			<StyleFixture>Superfície neutra</StyleFixture>
			<StyleFixture variant="primary">Superfície de marca</StyleFixture>
		</>
	);
}

export const catalogDemos = {
	Button: ButtonDemo,
	Badge: BadgeDemo,
	Avatar: AvatarDemo,
	Icon: IconDemo,
	Typography: TypographyDemo,
	Surface: SurfaceDemo,
	LoadingIndicator: LoadingIndicatorDemo,
	Skeleton: SkeletonDemo,
	Sparkline: SparklineDemo,
	Input: InputDemo,
	Textarea: TextareaDemo,
	Select: SelectDemo,
	Checkbox: CheckboxDemo,
	Radio: RadioDemo,
	Switch: SwitchDemo,
	Field: FieldDemo,
	SelectionGroup: SelectionGroupDemo,
	DatePicker: DatePickerDemo,
	Breadcrumb: BreadcrumbDemo,
	Nav: NavDemo,
	Tabs: TabsDemo,
	Accordion: AccordionDemo,
	Dropdown: DropdownDemo,
	Pagination: PaginationDemo,
	Dialog: DialogDemo,
	Drawer: DrawerDemo,
	ConfirmDialog: ConfirmDialogDemo,
	Popover: PopoverDemo,
	Tooltip: TooltipDemo,
	Toast: ToastDemo,
	EmptyState: EmptyStateDemo,
	Progress: ProgressDemo,
	Table: TableDemo,
	Card: CardDemo,
	List: ListDemo,
	AdminShell: AdminShellDemo,
	Dashboard: DashboardDemo,
	FilterBar: FilterBarDemo,
	SmartTable: SmartTableDemo,
	ListFlow: ListFlowDemo,
	BulkActionBar: BulkActionBarDemo,
	StepForm: StepFormDemo,
	ThemeControl: ThemeControlDemo,
	ThemeToggle: ThemeToggleDemo,
	StyleFixture: StyleFixtureDemo,
};
