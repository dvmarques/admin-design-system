'use client';

import { AdsSmartTable, type AdsSmartTableSort } from '@admin-ds/admin';
import { AdsButton } from '@admin-ds/components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import type { Usuario } from '../../../lib/data/usuarios';
import { restoreFocusAfterClearSelection } from '../../../lib/selection-clear-focus';
import { hrefWithParams, type SearchParams } from '../../../lib/url-search-params';

interface UsuariosTabelaProps {
	rows: Usuario[];
	page: number;
	pageCount: number;
	sort: AdsSmartTableSort | null;
	params: SearchParams;
}

export function UsuariosTabela({ rows, page, pageCount, sort, params }: UsuariosTabelaProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [selected, setSelected] = useState<string[]>([]);
	const [hidden, setHidden] = useState<string[]>([]);
	const rootRef = useRef<HTMLDivElement>(null);
	const pendingClearRef = useRef<HTMLElement | null>(null);

	const href = (changes: Record<string, string | null>) =>
		hrefWithParams(pathname, params, changes);

	function onSortChange(next: AdsSmartTableSort | null) {
		const ordem = next ? `${next.columnId}:${next.direction}` : null;
		router.replace(href({ ordem, pagina: null }), { scroll: false });
	}

	function clearSelection(event: ReactMouseEvent<HTMLButtonElement>) {
		pendingClearRef.current = event.currentTarget;
		setSelected([]);
	}

	useLayoutEffect(() => {
		const pending = pendingClearRef.current;
		if (pending === null) return;
		const active = document.activeElement;
		const focusLost = !active || active === document.body;
		if (!focusLost && !rootRef.current?.contains(active)) {
			pendingClearRef.current = null;
			return;
		}
		if (pending.isConnected) return;
		pendingClearRef.current = null;
		if (!focusLost) return;
		const root = rootRef.current;
		restoreFocusAfterClearSelection(pending, {
			selectAll:
				root?.querySelector<HTMLInputElement>(
					'input[type="checkbox"][aria-label="Selecionar todas as linhas da página"]',
				) ?? null,
			scrollRegion: root?.querySelector<HTMLElement>('.ads-smart-table-scroll') ?? null,
		});
	}, [selected]);

	return (
		<div ref={rootRef}>
			{selected.length > 0 ? (
				<AdsButton onClick={clearSelection} size="sm" variant="secondary">
					Limpar seleção
				</AdsButton>
			) : null}
			<AdsSmartTable<Usuario>
				caption="Usuários"
				columns={[
					{ id: 'nome', label: 'Nome', sortable: true, hideable: false, cell: (u) => u.nome },
					{ id: 'perfil', label: 'Perfil', sortable: true, cell: (u) => u.perfil },
				]}
				getRowId={(u) => u.id}
				getRowLabel={(u) => u.nome}
				hiddenColumnIds={hidden}
				onHiddenColumnsChange={setHidden}
				onSelectionChange={setSelected}
				onSortChange={onSortChange}
				pagination={{
					page,
					pageCount,
					renderPageLink: (target, { children, ...props }) => (
						<Link
							href={href({ pagina: target > 1 ? String(target) : null })}
							scroll={false}
							{...props}
						>
							{children}
						</Link>
					),
				}}
				rows={rows}
				selectedIds={selected}
				sort={sort}
			/>
		</div>
	);
}
