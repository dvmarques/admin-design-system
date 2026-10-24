'use client';

import { useState } from 'react';
import { AdsButton, AdsField, AdsSelect } from '@admin-ds/components';
import { applyThemePreference, resolvePreference } from '../../lib/theme';
import { useTheme, useThemePreference } from '../use-theme';
import { catalogDemos } from './catalog-demos';

export function CatalogPreview({
	demo,
	source,
}: {
	demo: keyof typeof catalogDemos;
	source: string;
}) {
	const preference = useThemePreference('system');
	const theme = useTheme('light');
	const [width, setWidth] = useState('100%');
	const [copyStatus, setCopyStatus] = useState('');
	const Demo = catalogDemos[demo];
	async function copy() {
		try {
			await navigator.clipboard.writeText(source);
			setCopyStatus('Código copiado.');
		} catch {
			setCopyStatus('Não foi possível copiar. Selecione o código abaixo.');
		}
	}
	return (
		<>
			<div className="demo-catalog-controls">
				<AdsField label="Tema da demonstração">
					<AdsSelect
						value={preference}
						onChange={(event) => applyThemePreference(resolvePreference(event.target.value))}
					>
						<option value="light">Claro</option>
						<option value="dark">Escuro</option>
						<option value="system">Sistema</option>
					</AdsSelect>
				</AdsField>
				<AdsField label="Largura da demonstração">
					<AdsSelect value={width} onChange={(event) => setWidth(event.target.value)}>
						<option value="100%">Disponível</option>
						<option value="320px">320 px</option>
						<option value="768px">768 px</option>
					</AdsSelect>
				</AdsField>
			</div>
			<section
				aria-label="Demonstração interativa"
				className="demo-catalog-preview"
				data-theme={theme}
				style={{ width, maxWidth: '100%' }}
			>
				{demo === 'AdminShell' ? (
					<iframe
						title="Shell administrativo independente"
						src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/catalogo-shell/?theme=${theme}`}
						style={{ width: '100%', height: '32rem', border: 0 }}
					/>
				) : (
					<Demo />
				)}
			</section>
			<p>
				Interaja com os controles e navegue por Tab e pelas setas quando aplicável. O tema é
				aplicado também aos painéis em portal. A largura limita o conteúdo do exemplo; overlays usam
				a viewport real.
			</p>
			<h2>Código React/TSX</h2>
			<AdsButton onClick={copy}>Copiar código</AdsButton>
			<p role="status">{copyStatus}</p>
			<pre className="demo-catalog-code" tabIndex={0} aria-label="Código do exemplo">
				<code>{source}</code>
			</pre>
		</>
	);
}
