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
					'AdsPageHeader oferece H1, descrição e ações responsivas. Seções usam HTML nativo com headings H2–H4; AdsCard é opcional e reservado a conteúdos autocontidos. Os exemplos usam apenas APIs públicas.',
			},
		},
	},
	args: { title: 'Título de página' },
} satisfies Meta<typeof AdsPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const pageStyle = { display: 'grid', gap: '2rem', minWidth: 0 } as const;
const sectionStyle = { display: 'grid', gap: '1rem', minWidth: 0 } as const;
const actionStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' } as const;

function ConsultationExample() {
	const [query, setQuery] = useState('');
	const people = ['Ana Silva', 'Bruno Costa', 'Carla Souza'];
	const filtered = people.filter((person) =>
		person.toLowerCase().includes(query.trim().toLowerCase()),
	);
	return (
		<main style={pageStyle}>
			<AdsPageHeader
				title="Consulta administrativa"
				description="Pesquise registros sem colocar o conteúdo da página dentro de um card."
				actions={<AdsButton type="button" onClick={() => setQuery('')}>Nova consulta</AdsButton>}
			/>
			<section aria-labelledby="storybook-registros" style={sectionStyle}>
				<AdsTypography as="h2" id="storybook-registros" variant="heading2">Registros</AdsTypography>
				<AdsField label="Buscar pelo nome">
					<AdsInput type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
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
								<AdsTableRow key={person}><AdsTableCell>{person}</AdsTableCell></AdsTableRow>
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
		<main style={pageStyle}>
			<AdsPageHeader title="Formulário administrativo" description="Seções semânticas, validação e ações sem card obrigatório." />
			<form noValidate style={sectionStyle} onSubmit={(event) => {
				event.preventDefault();
				setMessage(name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Dados válidos.' : 'Preencha nome e e-mail válido.');
			}}>
				<section aria-labelledby="storybook-identificacao" style={sectionStyle}>
					<AdsTypography as="h2" id="storybook-identificacao" variant="heading2">Identificação</AdsTypography>
					<AdsField label="Nome"><AdsInput value={name} onChange={(event) => setName(event.target.value)} /></AdsField>
					<AdsField label="E-mail"><AdsInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></AdsField>
				</section>
				<section aria-labelledby="storybook-revisao" style={sectionStyle}>
					<AdsTypography as="h2" id="storybook-revisao" variant="heading2">Revisão</AdsTypography>
					<AdsTypography as="h3" variant="heading4">Conferência de dados</AdsTypography>
					<AdsTypography variant="muted">Nenhum dado é enviado para um servidor.</AdsTypography>
				</section>
				<div style={actionStyle}>
					<AdsButton type="submit">Validar</AdsButton>
					<AdsButton type="reset" variant="secondary" onClick={() => {
						setName('');
						setEmail('');
						setMessage('');
					}}>Limpar</AdsButton>
				</div>
				<p role="status">{message}</p>
			</form>
		</main>
	);
}

function DashboardExample() {
	return (
		<main style={pageStyle}>
			<AdsPageHeader title="Dashboard administrativo" description="Cards apenas para métricas e resumos autocontidos." />
			<section aria-labelledby="storybook-indicadores" style={sectionStyle}>
				<AdsTypography as="h2" id="storybook-indicadores" variant="heading2">Indicadores</AdsTypography>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 13rem), 1fr))', gap: '1rem' }}>
					<AdsMetricCard title="Cadastros ativos" value="1.284" />
					<AdsMetricCard title="Novos registros" value="72" />
				</div>
			</section>
			<section aria-labelledby="storybook-resumos" style={sectionStyle}>
				<AdsTypography as="h2" id="storybook-resumos" variant="heading2">Resumos</AdsTypography>
				<AdsCard>
					<AdsCardHeader><AdsTypography as="h3" variant="heading3">Leitura operacional</AdsTypography></AdsCardHeader>
					<AdsCardContent><AdsTypography>Resumo independente em card.</AdsTypography></AdsCardContent>
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
		<main style={{ ...pageStyle, width: 'min(100%, 20rem)' }}>
			<AdsPageHeader
				title="TítuloDePáginaAdministrativaLongoSemEspaçosParaTestarQuebra"
				description="Descrição extensa para verificar a legibilidade e quebra de linhas em uma largura estreita, inclusive zoom elevado."
				actions={
					<>
						<AdsButton type="button">Ação principal</AdsButton>
						<AdsButton type="button" variant="secondary">Ação secundária</AdsButton>
					</>
				}
			/>
		</main>
	),
};
export const WithoutOptionalSlots: Story = {
	render: () => <main><AdsPageHeader title="Página sem descrição e sem ações" /></main>,
};
