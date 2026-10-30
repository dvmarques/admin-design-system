import {
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
} from '@dvmarques/admin-ds-components';
import { AdsHighlightedCodeSnippet } from '@dvmarques/admin-ds-highlighted-code';

const props = [
	['code', 'string', '—', 'Código exibido e copiado; renderizado sempre como texto.'],
	[
		'language',
		'string',
		'—',
		'Linguagem Shiki ou alias (ts, js, yml, sh); desconhecida mantém plain.',
	],
	['showLineNumbers', 'boolean', 'false', 'Exibe a numeração de linhas.'],
	['wrapLines', 'boolean', 'false', 'Quebra linhas longas em vez de rolagem horizontal.'],
	['theme', "'light' | 'dark' | 'auto'", "'auto'", 'Tema do destaque; auto segue o data-theme.'],
	['className', 'string', '—', 'Classe adicional no container.'],
	['codeLabel', 'string', '—', 'Nome acessível da região de código.'],
] as const;

const importCode = `import { AdsHighlightedCodeSnippet } from '@dvmarques/admin-ds-highlighted-code';
import '@dvmarques/admin-ds-tokens/styles.css';
import '@dvmarques/admin-ds-highlighted-code/styles.css';`;

/** Instalação e API do pacote opcional, exibidas na página oficial do componente (#241). */
export function HighlightedCodeApi() {
	return (
		<>
			<h2>Instalação e API</h2>
			<p>
				<code>AdsHighlightedCodeSnippet</code> pertence ao pacote opcional{' '}
				<code>@dvmarques/admin-ds-highlighted-code</code>, que ainda é privado: no monorepo ele já é um
				workspace e, após a publicação, será instalado com <code>npm install</code>. Ele não é
				reexportado por <code>@dvmarques/admin-ds-components</code>, portanto Shiki só entra no bundle de quem
				o importa explicitamente.
			</p>
			<AdsHighlightedCodeSnippet code={importCode} language="ts" codeLabel="Importação do pacote" />
			<AdsTable
				containerClassName="demo-api-table-scroll"
				containerProps={{
					role: 'region',
					'aria-labelledby': 'highlighted-code-props-caption',
					tabIndex: 0,
				}}
			>
				<AdsTableCaption id="highlighted-code-props-caption">
					Props de AdsHighlightedCodeSnippet
				</AdsTableCaption>
				<AdsTableHead>
					<AdsTableRow interactive={false}>
						<AdsTableHeader>Prop</AdsTableHeader>
						<AdsTableHeader>Tipo</AdsTableHeader>
						<AdsTableHeader>Padrão</AdsTableHeader>
						<AdsTableHeader>Descrição</AdsTableHeader>
					</AdsTableRow>
				</AdsTableHead>
				<AdsTableBody>
					{props.map(([name, type, fallback, description]) => (
						<AdsTableRow key={name}>
							<AdsTableCell>
								<code>{name}</code>
							</AdsTableCell>
							<AdsTableCell>
								<code>{type}</code>
							</AdsTableCell>
							<AdsTableCell>{fallback}</AdsTableCell>
							<AdsTableCell>{description}</AdsTableCell>
						</AdsTableRow>
					))}
				</AdsTableBody>
			</AdsTable>
		</>
	);
}
