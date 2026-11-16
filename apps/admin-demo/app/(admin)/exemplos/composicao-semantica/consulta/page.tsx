'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	AdsButton,
	AdsDropdown,
	AdsField,
	AdsInput,
	AdsPageHeader,
	AdsPagination,
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

const customers = [
	{ id: '101', name: 'Ana Silva', status: 'Ativo' },
	{ id: '102', name: 'Bruno Costa', status: 'Pendente' },
	{ id: '103', name: 'Carla Souza', status: 'Ativo' },
];

export default function SemanticConsultationPage() {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [view, setView] = useState<'dados' | 'carregando' | 'erro'>('dados');
	const [lastAction, setLastAction] = useState<string | null>(null);
	const router = useRouter();
	const results = customers.filter((row) =>
		row.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')),
	);
	const pageCount = Math.max(1, Math.ceil(results.length / 2));
	const visibleRows = results.slice((page - 1) * 2, page * 2);

	return (
		<div className="demo-page">
			<div className="ads-layout-container ads-layout-stack demo-semantic-page">
				<AdsPageHeader
					title="Consulta administrativa"
					description="Pesquise os registros fictícios, examine os resultados e navegue para o cadastro sem envolver a página em um card."
					actions={
						<div className="ads-layout-cluster">
							<Link className="demo-action-link" href="/exemplos/composicao-semantica/formulario">
								Novo cadastro
							</Link>
							<AdsDropdown.Root>
								<AdsDropdown.Trigger>Mais ações</AdsDropdown.Trigger>
								<AdsDropdown.Content aria-label="Ações da consulta">
									<div role="group" aria-labelledby="consulta-menu-cadastros">
										<AdsDropdown.Header id="consulta-menu-cadastros">Cadastros</AdsDropdown.Header>
										<AdsDropdown.Item onSelect={() => router.push('/clientes')}>
											Ver clientes
										</AdsDropdown.Item>
										<AdsDropdown.Item onSelect={() => router.push('/clientes/novo')}>
											Cadastrar cliente
										</AdsDropdown.Item>
									</div>
									<AdsDropdown.Divider />
									<div role="group" aria-labelledby="consulta-menu-configuracoes">
										<AdsDropdown.Header id="consulta-menu-configuracoes">
											Configurações
										</AdsDropdown.Header>
										<AdsDropdown.Item onSelect={() => router.push('/preferencias')}>
											Preferências
										</AdsDropdown.Item>
									</div>
								</AdsDropdown.Content>
							</AdsDropdown.Root>
						</div>
					}
				/>
				<section
					aria-labelledby="consulta-registros"
					className="ads-layout-stack demo-semantic-section"
				>
					<AdsTypography as="h2" id="consulta-registros" variant="heading2">
						Registros
					</AdsTypography>
					<div className="ads-layout-cluster demo-semantic-filters">
						<AdsField className="demo-semantic-filter-field" label="Filtrar clientes">
							<AdsInput
								type="search"
								placeholder="Nome"
								value={query}
								onChange={(event) => {
									setQuery(event.target.value);
									setPage(1);
									setView('dados');
									setLastAction(null);
								}}
							/>
						</AdsField>
						<AdsButton
							type="button"
							variant="secondary"
							onClick={() => {
								setQuery('');
								setPage(1);
								setView('dados');
								setLastAction(null);
							}}
						>
							Limpar filtro
						</AdsButton>
					</div>
					<div className="ads-layout-cluster" role="group" aria-label="Estados de demonstração">
						<AdsButton type="button" variant="secondary" onClick={() => setView('carregando')}>
							Simular carregamento
						</AdsButton>
						<AdsButton type="button" variant="secondary" onClick={() => setView('erro')}>
							Simular erro
						</AdsButton>
						<AdsButton type="button" variant="secondary" onClick={() => setView('dados')}>
							Mostrar dados
						</AdsButton>
					</div>
					{view === 'carregando' ? (
						<p role="status">Carregando registros de demonstração.</p>
					) : view === 'erro' ? (
						<div role="alert" className="ads-layout-stack">
							<p>Não foi possível carregar os registros fictícios.</p>
							<div>
								<AdsButton type="button" onClick={() => setView('dados')}>
									Tentar novamente
								</AdsButton>
							</div>
						</div>
					) : (
						<>
							<p role="status">
								{results.length}{' '}
								{results.length === 1 ? 'registro encontrado' : 'registros encontrados'}
							</p>
							<div className="demo-semantic-results">
								<AdsTable
									containerProps={{
										role: 'region',
										'aria-label': 'Resultados da consulta',
										tabIndex: 0,
									}}
								>
									<AdsTableCaption>Resultados da consulta</AdsTableCaption>
									<AdsTableHead>
										<AdsTableRow interactive={false}>
											<AdsTableHeader scope="col">Código</AdsTableHeader>
											<AdsTableHeader scope="col">Nome</AdsTableHeader>
											<AdsTableHeader scope="col">Situação</AdsTableHeader>
											<AdsTableHeader scope="col">Ações</AdsTableHeader>
										</AdsTableRow>
									</AdsTableHead>
									<AdsTableBody>
										{visibleRows.map((row) => (
											<AdsTableRow key={row.id}>
												<AdsTableCell>{row.id}</AdsTableCell>
												<AdsTableCell>{row.name}</AdsTableCell>
												<AdsTableCell>{row.status}</AdsTableCell>
												<AdsTableCell>
													<AdsButton
														type="button"
														variant="secondary"
														size="sm"
														onClick={() => setLastAction(row.name)}
													>
														Detalhes do registro {row.id}
													</AdsButton>
												</AdsTableCell>
											</AdsTableRow>
										))}
									</AdsTableBody>
								</AdsTable>
							</div>
							{results.length === 0 && (
								<AdsTypography variant="muted">Nenhum registro encontrado.</AdsTypography>
							)}
							{results.length > 2 && (
								<AdsPagination
									page={page}
									pageCount={pageCount}
									onPageChange={(next) => {
										setPage(next);
										setLastAction(null);
									}}
									aria-label="Paginação da consulta"
								/>
							)}
							{lastAction && <p role="alert">Detalhes fictícios de {lastAction} selecionados.</p>}
						</>
					)}
				</section>
			</div>
		</div>
	);
}
