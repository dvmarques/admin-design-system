'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdsPagination, type AdsPaginationLinkProps } from '@dvmarques/admin-ds-components';
import { AdsSmartTable } from '@dvmarques/admin-ds-admin';

export default function PaginationPage() {
	const [page, setPage] = useState(25);
	const [count, setCount] = useState(50);
	const [width, setWidth] = useState(800);
	const [arrows, setArrows] = useState(false);
	const [links, setLinks] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstLast, setFirstLast] = useState(false);
	const [size, setSize] = useState(10);
	const totalItems = Math.max(0, count * size - 3);
	const rows = Array.from(
		{ length: Math.max(0, Math.min(size, totalItems - (page - 1) * size)) },
		(_, i) => ({ id: String((page - 1) * size + i + 1) }),
	);
	return (
		<div className="demo-page">
			<h1>Paginação responsiva</h1>
			<p>Experimente larguras, páginas e navegação por teclado nos controles e na tabela.</p>
			<Link className="demo-action-link" href="/componentes">
				Voltar ao catálogo
			</Link>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBlock: 24 }}>
				<label>
					Largura do contêiner{' '}
					<select value={width} onChange={(e) => setWidth(Number(e.target.value))}>
						<option value={800}>Largo</option>
						<option value={400}>Compacto</option>
						<option value={280}>Estreito</option>
						<option value={140}>Mínimo</option>
					</select>
				</label>
				<label>
					Total de páginas{' '}
					<input
						type="number"
						min={0}
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
					/>
				</label>
				<label>
					Página atual{' '}
					<input
						type="number"
						min={1}
						value={page}
						onChange={(e) => setPage(Number(e.target.value))}
					/>
				</label>
				<label>
					<input type="checkbox" checked={arrows} onChange={(e) => setArrows(e.target.checked)} />{' '}
					Navegar por setas
				</label>
				<label>
					<input
						type="checkbox"
						checked={firstLast}
						onChange={(e) => setFirstLast(e.target.checked)}
					/>{' '}
					Controles de primeira e última
				</label>
				<label>
					<input type="checkbox" checked={links} onChange={(e) => setLinks(e.target.checked)} />{' '}
					Usar links
				</label>
				<label>
					<input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} />{' '}
					Carregando
				</label>
			</div>
			<section aria-label="Exemplo isolado" style={{ width, maxWidth: '100%', minWidth: 0 }}>
				<h2>Paginação isolada</h2>
				<AdsPagination
					page={page}
					pageCount={count}
					onPageChange={setPage}
					loading={loading}
					navigationMode={arrows ? 'arrows' : 'text'}
					showFirstLast={firstLast}
					showPageJump
					aria-label="Paginação de exemplo"
					{...(links
						? {
								renderPageLink: (target: number, props: AdsPaginationLinkProps) => (
									<Link href={`#pagina-${target}`} {...props} onClick={() => setPage(target)} />
								),
							}
						: {})}
				/>
			</section>
			<section
				aria-label="Exemplo de tabela"
				style={{ width, maxWidth: '100%', minWidth: 0, marginTop: 24 }}
			>
				<h2>Tabela com resumo e tamanho de página</h2>
				<AdsSmartTable
					caption="Registros paginados"
					columns={[{ id: 'id', label: 'Registro', cell: (row) => `Registro ${row.id}` }]}
					rows={rows}
					getRowId={(row) => row.id}
					pageSize={size}
					onPageSizeChange={(next) => {
						setSize(next);
						setPage(1);
					}}
					totalItems={totalItems}
					loading={loading}
					pagination={{
						page,
						pageCount: count,
						onPageChange: setPage,
						showPageJump: true,
						navigationMode: arrows ? 'arrows' : 'text',
						'aria-label': 'Paginação da tabela',
					}}
				/>
			</section>
		</div>
	);
}
