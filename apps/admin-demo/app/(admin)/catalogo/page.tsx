'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AdsField, AdsInput, AdsEmptyState } from '@admin-ds/components';
import { catalogSearchEntries } from '../../catalogo/catalog-families';

export default function CatalogPage() {
	const [query, setQuery] = useState('');
	const matches = catalogSearchEntries.filter((entry) =>
		`${entry.name} ${entry.group} ${entry.description} ${entry.family ?? ''}`
			.toLocaleLowerCase('pt-BR')
			.includes(query.trim().toLocaleLowerCase('pt-BR')),
	);
	return (
		<div className="demo-page demo-shell demo-catalog-page">
			<h1>Catálogo de componentes</h1>
			<p>Exemplos executáveis, variações e código dos componentes públicos do design system.</p>
			<AdsField label="Buscar componente">
				<AdsInput
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Ex.: AdsButton"
				/>
			</AdsField>
			<p role="status">{matches.length} resultados</p>
			{matches.length === 0 ? (
				<AdsEmptyState title="Nenhum componente encontrado" />
			) : (
				[...new Set(matches.map((entry) => entry.group))].map((group) => (
					<section
						key={group}
						id={group
							.toLocaleLowerCase('pt-BR')
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, '')}
					>
						<h2>{group}</h2>
						<ul className="demo-catalog-list">
							{matches
								.filter((entry) => entry.group === group)
								.map((entry) => (
									<li key={entry.name}>
										<Link href={entry.href}>{entry.name}</Link>
										<p>{entry.family && entry.name !== `Ads${entry.family}` ? `${entry.name} · ${entry.family}. ` : ''}{entry.description}</p>
									</li>
								))}
						</ul>
					</section>
				))
			)}
		</div>
	);
}
