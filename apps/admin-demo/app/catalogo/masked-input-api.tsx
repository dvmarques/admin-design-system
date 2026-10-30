import {
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
} from '@admin-ds/components';
import { AdsHighlightedCodeSnippet } from '@admin-ds/highlighted-code';

const importCode = `import { AdsMaskedInput } from '@admin-ds/components/masked-input';`;

const props = [
	[
		'mask',
		'AdsMask',
		'—',
		'Padrão, lista de padrões (dinâmica) ou opções; sem ele o campo é texto comum.',
	],
	[
		'value',
		'string',
		'—',
		'Texto formatado exibido (controlado). Só muda quando o consumidor o atualiza.',
	],
	[
		'defaultValue',
		'string',
		'—',
		'Texto formatado inicial (não controlado), aplicado uma vez na montagem.',
	],
	[
		'onValueChange',
		'(values: AdsMaskedInputValues) => void',
		'—',
		'Uma chamada por alteração aceita da pessoa usuária; nunca na montagem nem em atualizações externas de value.',
	],
	[
		'onChange',
		'ChangeEventHandler<HTMLInputElement>',
		'—',
		'Evento nativo do input, sem garantia de correspondência com o aceite da máscara.',
	],
	['ref / inputRef', 'Ref<HTMLInputElement>', '—', 'Ambos apontam para o mesmo input HTML.'],
	['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamanho do campo, igual ao de AdsInput.'],
	[
		'validationState',
		"'default' | 'success' | 'error'",
		"'default'",
		'Estado visual e aria-invalid; AdsField o repassa.',
	],
] as const;

const values = [
	['maskedValue', 'string', 'Texto exibido, com os caracteres literais da máscara.'],
	[
		'unmaskedValue',
		'string',
		'Texto sem os literais; sempre string, preservando zeros à esquerda. Em máscaras de data inclui os separadores.',
	],
	[
		'typedValue',
		'unknown',
		'number em máscaras Number, Date em máscaras Date; nos demais casos, o texto bruto.',
	],
	['complete', 'boolean', 'Todas as posições obrigatórias preenchidas (sempre true sem máscara).'],
] as const;

/** Instalação opt-in e contrato de eventos de AdsMaskedInput, exibidos na página oficial do componente (#231). */
export function MaskedInputApi() {
	return (
		<>
			<h2>Instalação e API</h2>
			<p>
				<code>AdsMaskedInput</code> fica no subpath opcional{' '}
				<code>@admin-ds/components/masked-input</code> e usa o peer opcional{' '}
				<code>react-imask</code>. O entrypoint <code>@admin-ds/components</code> não o reexporta nem
				o carrega: só quem importa o subpath precisa instalar <code>react-imask</code> (versão{' '}
				<code>^7.6.1</code>).
			</p>
			<AdsHighlightedCodeSnippet
				code="npm install react-imask"
				language="sh"
				codeLabel="Instalação do peer opcional"
			/>
			<AdsHighlightedCodeSnippet
				code={importCode}
				language="ts"
				codeLabel="Importação do subpath opcional"
			/>
			<p>
				<code>onValueChange</code> é adaptado do <code>onAccept</code> do motor de máscara; o DS não
				sintetiza <code>onChange</code>. Para migrar um campo mascarado existente, troque{' '}
				<code>onAccept(value, mask)</code> por{' '}
				<code>
					onValueChange({'{'} maskedValue, unmaskedValue {'}'})
				</code>{' '}
				e <code>unmask</code> por leitura de <code>unmaskedValue</code>. O formulário nativo envia
				sempre o texto formatado (<code>name</code>); <code>required</code> não valida a máscara
				completa — use <code>complete</code> para validar.
			</p>
			<AdsTable
				containerClassName="demo-api-table-scroll"
				containerProps={{
					role: 'region',
					'aria-labelledby': 'masked-input-props-caption',
					tabIndex: 0,
				}}
			>
				<AdsTableCaption id="masked-input-props-caption">Props de AdsMaskedInput</AdsTableCaption>
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
			<AdsTable
				containerClassName="demo-api-table-scroll"
				containerProps={{
					role: 'region',
					'aria-labelledby': 'masked-input-values-caption',
					tabIndex: 0,
				}}
			>
				<AdsTableCaption id="masked-input-values-caption">
					Valores de AdsMaskedInputValues
				</AdsTableCaption>
				<AdsTableHead>
					<AdsTableRow interactive={false}>
						<AdsTableHeader>Campo</AdsTableHeader>
						<AdsTableHeader>Tipo</AdsTableHeader>
						<AdsTableHeader>Descrição</AdsTableHeader>
					</AdsTableRow>
				</AdsTableHead>
				<AdsTableBody>
					{values.map(([name, type, description]) => (
						<AdsTableRow key={name}>
							<AdsTableCell>
								<code>{name}</code>
							</AdsTableCell>
							<AdsTableCell>
								<code>{type}</code>
							</AdsTableCell>
							<AdsTableCell>{description}</AdsTableCell>
						</AdsTableRow>
					))}
				</AdsTableBody>
			</AdsTable>
		</>
	);
}
