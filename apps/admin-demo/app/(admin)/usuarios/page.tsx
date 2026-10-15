import { usuarios, usuariosPageSize } from '../../../lib/data/usuarios';
import { normalizePage, readUsuariosParams, sortUsuarios } from '../../../lib/usuarios-query';
import { UsuariosTabela } from './usuarios-tabela';

interface UsuariosPageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsuariosPage({ searchParams }: UsuariosPageProps) {
	const params = await searchParams;
	const { pageRaw, sort } = readUsuariosParams(params);
	const pageCount = Math.ceil(usuarios.length / usuariosPageSize);
	const page = normalizePage(pageRaw, pageCount);
	const start = (page - 1) * usuariosPageSize;
	const rows = sortUsuarios(usuarios, sort).slice(start, start + usuariosPageSize);

	return (
		<div className="demo-page">
			<UsuariosTabela page={page} pageCount={pageCount} params={params} rows={rows} sort={sort} />
		</div>
	);
}
