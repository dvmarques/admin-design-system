'use client';

import {
	AdsHighlightedCodeSnippet,
	type AdsHighlightedCodeLanguage,
	type AdsHighlightedCodeTheme,
} from '@admin-ds/highlighted-code';
import '@admin-ds/highlighted-code/styles.css';
import { AdsField, AdsSelect, AdsSwitch } from '@admin-ds/components';
import { useState } from 'react';

const SAMPLES: Record<
	'java' | 'sql' | 'tsx',
	{ language: AdsHighlightedCodeLanguage; code: string }
> = {
	java: {
		language: 'java',
		code: `public final class PedidoService {
  public boolean confirmar(String id) {
    if (id == null || id.isBlank()) {
      return false;
    }
    return repository.marcarConfirmado(id);
  }
}`,
	},
	sql: {
		language: 'sql',
		code: `SELECT p.id, p.nome, SUM(i.quantidade) AS itens
FROM pedidos p
JOIN itens_pedido i ON i.pedido_id = p.id
WHERE p.status = 'ABERTO'
GROUP BY p.id, p.nome
ORDER BY itens DESC;`,
	},
	tsx: {
		language: 'tsx',
		code: `'use client';
import { AdsButton } from '@admin-ds/components';

export function SalvarPedido({ onSave }: { onSave: () => void }) {
  return (
    <AdsButton variant="primary" onClick={onSave}>
      Salvar pedido
    </AdsButton>
  );
}`,
	},
};

export function HighlightedCodeDemo() {
	const [sample, setSample] = useState<'java' | 'sql' | 'tsx'>('tsx');
	const [theme, setTheme] = useState<AdsHighlightedCodeTheme>('auto');
	const [showLineNumbers, setShowLineNumbers] = useState(true);
	const [wrapLines, setWrapLines] = useState(false);
	const current = SAMPLES[sample];

	return (
		<article className="demo-highlighted-code-page">
			<h1>Código destacado</h1>
			<p>
				Demonstração do pacote opcional <code>@admin-ds/highlighted-code</code> com Shiki carregado
				sob demanda. O texto plain aparece imediatamente; o destaque é aplicado de forma assíncrona.
			</p>
			<div className="demo-highlighted-code-controls">
				<AdsField label="Exemplo">
					<AdsSelect
						value={sample}
						onChange={(event) => setSample(event.target.value as 'java' | 'sql' | 'tsx')}
					>
						<option value="tsx">TSX (React)</option>
						<option value="java">Java</option>
						<option value="sql">SQL</option>
					</AdsSelect>
				</AdsField>
				<AdsField label="Tema do snippet">
					<AdsSelect
						value={theme}
						onChange={(event) => setTheme(event.target.value as AdsHighlightedCodeTheme)}
					>
						<option value="auto">Automático</option>
						<option value="light">Claro</option>
						<option value="dark">Escuro</option>
					</AdsSelect>
				</AdsField>
				<AdsField label="Numeração de linhas">
					<AdsSwitch
						label="Exibir números"
						checked={showLineNumbers}
						onChange={(event) => setShowLineNumbers(event.target.checked)}
					/>
				</AdsField>
				<AdsField label="Quebra de linha">
					<AdsSwitch
						label="Quebrar linhas longas"
						checked={wrapLines}
						onChange={(event) => setWrapLines(event.target.checked)}
					/>
				</AdsField>
			</div>
			<AdsHighlightedCodeSnippet
				code={current.code}
				language={current.language}
				theme={theme}
				showLineNumbers={showLineNumbers}
				wrapLines={wrapLines}
			/>
		</article>
	);
}
