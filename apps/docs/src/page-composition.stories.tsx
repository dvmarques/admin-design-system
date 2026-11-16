import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AdsMetricCard } from '@dvmarques/admin-ds-admin';
import {
	AdsButton,
	AdsCard,
	AdsCardContent,
	AdsCardHeader,
	AdsField,
	AdsInput,
	AdsPageHeader,
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Patterns/Page composition',
	component: AdsPageHeader,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'AdsPageHeader oferece H1, descrição e ações responsivas. Seções usam HTML nativo e classes CSS opt-in ads-layout-* (container, stack, grid, cluster), sem Tailwind no consumidor. AdsCard é opcional e reservado a conteúdos autocontidos.',
			},
		},
	},
	args: { title: 'Título de página' },
} satisfies Meta<typeof AdsPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function ConsultationExample() {
	const [query, setQuery] = useState('');
	const people = ['Ana Silva', 'Bruno Costa', 'Carla Souza'];
	const filtered = people.filter((person) =>
		person.toLowerCase().includes(query.trim().toLowerCase()),
	);
	return (
		<main className="ads-layout-stack">
			<AdsPageHeader
				title="Consulta administrativa"
				description="Pesquise registros sem colocar o conteúdo da página dentro de um card."
				actions={
					<AdsButton type="button" onClick={() => setQuery('')}>
						Nova consulta
					</AdsButton>
				}
			/>
			<section aria-labelledby="storybook-registros" className="ads-layout-stack">
				<AdsTypography as="h2" id="storybook-registros" variant="heading2">
					Registros
				</AdsTypography>
				<AdsField label="Buscar pelo nome">
					<AdsInput
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</AdsField>
				<p role="status">{filtered.length} resultados</p>
				<div style={{ minWidth: 0, overflowX: 'auto' }}>
					<AdsTable>
						<AdsTableCaption>Pessoas encontradas</AdsTableCaption>
						<AdsTableHead>
							<AdsTableRow interactive={false}>
								<AdsTableHeader scope="col">Pessoa</AdsTableHeader>
							</AdsTableRow>
						</AdsTableHead>
						<AdsTableBody>
							{filtered.map((person) => (
								<AdsTableRow key={person}>
									<AdsTableCell>{person}</AdsTableCell>
								</AdsTableRow>
							))}
						</AdsTableBody>
					</AdsTable>
				</div>
			</section>
		</main>
	);
}

function FormExample() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	return (
		<main className="ads-layout-stack">
			<AdsPageHeader
				title="Formulário administrativo"
				description="Seções semânticas, validação e ações sem card obrigatório."
			/>
			<form
				noValidate
				className="ads-layout-stack"
				onSubmit={(event) => {
					event.preventDefault();
					setMessage(
						name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
							? 'Dados válidos.'
							: 'Preencha nome e e-mail válido.',
					);
				}}
			>
				<section aria-labelledby="storybook-identificacao" className="ads-layout-stack">
					<AdsTypography as="h2" id="storybook-identificacao" variant="heading2">
						Identificação
					</AdsTypography>
					<div className="ads-layout-grid">
						<AdsField label="Nome">
							<AdsInput value={name} onChange={(event) => setName(event.target.value)} />
						</AdsField>
						<AdsField label="E-mail">
							<AdsInput
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</AdsField>
					</div>
				</section>
				<section aria-labelledby="storybook-revisao" className="ads-layout-stack">
					<AdsTypography as="h2" id="storybook-revisao" variant="heading2">
						Revisão
					</AdsTypography>
					<AdsTypography as="h3" variant="heading4">
						Conferência de dados
					</AdsTypography>
					<AdsTypography variant="muted">Nenhum dado é enviado para um servidor.</AdsTypography>
				</section>
				<div className="ads-layout-cluster">
					<AdsButton type="submit">Validar</AdsButton>
					<AdsButton
						type="reset"
						variant="secondary"
						onClick={() => {
							setName('');
							setEmail('');
							setMessage('');
						}}
					>
						Limpar
					</AdsButton>
				</div>
				<p role="status">{message}</p>
			</form>
		</main>
	);
}

function DashboardExample() {
	return (
		<main className="ads-layout-stack">
			<AdsPageHeader
				title="Dashboard administrativo"
				description="Cards apenas para métricas e resumos autocontidos."
			/>
			<section aria-labelledby="storybook-indicadores" className="ads-layout-stack">
				<AdsTypography as="h2" id="storybook-indicadores" variant="heading2">
					Indicadores
				</AdsTypography>
				<div className="ads-layout-grid">
					<AdsMetricCard title="Cadastros ativos" value="1.284" />
					<AdsMetricCard title="Novos registros" value="72" />
				</div>
			</section>
			<section aria-labelledby="storybook-resumos" className="ads-layout-stack">
				<AdsTypography as="h2" id="storybook-resumos" variant="heading2">
					Resumos
				</AdsTypography>
				<AdsCard>
					<AdsCardHeader>
						<AdsTypography as="h3" variant="heading3">
							Leitura operacional
						</AdsTypography>
					</AdsCardHeader>
					<AdsCardContent>
						<AdsTypography>Resumo independente em card.</AdsTypography>
					</AdsCardContent>
				</AdsCard>
			</section>
		</main>
	);
}

export const Consultation: Story = { render: () => <ConsultationExample /> };
export const ValidatedForm: Story = { render: () => <FormExample /> };
export const Dashboard: Story = { render: () => <DashboardExample /> };
export const LongTitleAndActions: Story = {
	render: () => (
		<main className="ads-layout-stack" style={{ width: 'min(100%, 20rem)' }}>
			<AdsPageHeader
				title="TítuloDePáginaAdministrativaLongoSemEspaçosParaTestarQuebra"
				description="Descrição extensa para verificar a legibilidade e quebra de linhas em uma largura estreita, inclusive zoom elevado."
				actions={
					<>
						<AdsButton type="button">Ação principal</AdsButton>
						<AdsButton type="button" variant="secondary">
							Ação secundária
						</AdsButton>
					</>
				}
			/>
		</main>
	),
};
export const WithoutOptionalSlots: Story = {
	render: () => (
		<main>
			<AdsPageHeader title="Página sem descrição e sem ações" />
		</main>
	),
};

/** HTML nativo, duas camadas de grids e conteúdo longo sem dependências adicionais. */
export const NestedResponsiveGrid: Story = {
	render: () => (
		<main className="ads-layout-container ads-layout-stack">
			<AdsPageHeader
				title="Grade aninhada"
				description="As colunas usam a largura disponível do contêiner, não a largura da viewport."
			/>
			<section aria-labelledby="nested-layout-title" className="ads-layout-stack">
				<AdsTypography as="h2" id="nested-layout-title" variant="heading2">
					Áreas de trabalho
				</AdsTypography>
				<div className="ads-layout-grid">
					<div className="ads-layout-stack">
						<AdsTypography as="h3" variant="heading3">
							Primeira área
						</AdsTypography>
						<div className="ads-layout-grid">
							<AdsTypography variant="muted">
								Conteúdo de painel que se ajusta ao espaço disponível.
							</AdsTypography>
							<AdsTypography variant="muted" style={{ overflowWrap: 'anywhere' }}>
								IdentificadorAdministrativoExtensoSemEspacosQuePrecisaQuebrar
							</AdsTypography>
						</div>
					</div>
					<div className="ads-layout-stack">
						<AdsTypography as="h3" variant="heading3">
							Segunda área
						</AdsTypography>
						<div className="ads-layout-cluster">
							<AdsButton type="button">Ação principal</AdsButton>
							<AdsButton type="button" variant="secondary">
								Ação secundária
							</AdsButton>
						</div>
					</div>
				</div>
			</section>
		</main>
	),
};

/** Índice de integração sem copiar as rotas nem depender de Next.js no Storybook. */
export const IntegratedAdmin: Story = {
	render: () => (
		<main className="ads-layout-container ads-layout-stack">
			<AdsPageHeader
				title="Integração administrativa"
				description="Execute o percurso completo de consulta, formulário, shell e indicadores no Admin Demo, com APIs públicas e dados fictícios."
			/>
			<section aria-labelledby="integration-story-examples" className="ads-layout-stack">
				<AdsTypography id="integration-story-examples" as="h2" variant="heading2">
					Matriz de exemplos
				</AdsTypography>
				<ul className="ads-layout-stack">
					<li>Consulta: filtros, paginação, ações, vazio, carregamento e erro.</li>
					<li>Formulário: validação, feedback e campo desabilitado.</li>
					<li>Shell: sidebar, footer opcional, dropdown agrupado e temas.</li>
					<li>Dashboard: cards somente para indicadores e resumos.</li>
				</ul>
				<p>
					<a href="https://dvmarques.github.io/admin-design-system/exemplos/integracao/">
						Abrir cenários integrados no Admin Demo
					</a>
				</p>
			</section>
		</main>
	),
};
