'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
	AdsButton,
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

const customers = [
	{ id: '101', name: 'Ana Silva', status: 'Ativo' },
	{ id: '102', name: 'Bruno Costa', status: 'Pendente' },
	{ id: '103', name: 'Carla Souza', status: 'Ativo' },
];

export default function SemanticConsultationPage() {
	const [query, setQuery] = useState('');
	const results = customers.filter((row) =>
		row.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')),
	);

	return (
		<div className="demo-page">
			<div className="ads-layout-container ads-layout-stack demo-semantic-page">
				<AdsPageHeader
					title="Consulta administrativa"
					description="Pesquise os registros fictícios, examine os resultados e navegue para o cadastro sem envolver a página em um card."
					actions={
						<Link className="demo-action-link" href="/exemplos/composicao-semantica/formulario">
							Novo cadastro
						</Link>
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
						<AdsField label="Filtrar clientes">
							<AdsInput
								type="search"
								placeholder="Nome"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
							/>
						</AdsField>
						<AdsButton type="button" variant="secondary" onClick={() => setQuery('')}>
							Limpar filtro
						</AdsButton>
					</div>
					<p role="status">
						{results.length}{' '}
						{results.length === 1 ? 'registro encontrado' : 'registros encontrados'}
					</p>
					<div className="demo-semantic-results">
						<AdsTable>
							<AdsTableCaption>Resultados da consulta</AdsTableCaption>
							<AdsTableHead>
								<AdsTableRow interactive={false}>
									<AdsTableHeader scope="col">Código</AdsTableHeader>
									<AdsTableHeader scope="col">Nome</AdsTableHeader>
									<AdsTableHeader scope="col">Situação</AdsTableHeader>
								</AdsTableRow>
							</AdsTableHead>
							<AdsTableBody>
								{results.map((row) => (
									<AdsTableRow key={row.id}>
										<AdsTableCell>{row.id}</AdsTableCell>
										<AdsTableCell>{row.name}</AdsTableCell>
										<AdsTableCell>{row.status}</AdsTableCell>
									</AdsTableRow>
								))}
							</AdsTableBody>
						</AdsTable>
					</div>
					{results.length === 0 && (
						<AdsTypography variant="muted">Nenhum registro encontrado.</AdsTypography>
					)}
				</section>
			</div>
		</div>
	);
}
