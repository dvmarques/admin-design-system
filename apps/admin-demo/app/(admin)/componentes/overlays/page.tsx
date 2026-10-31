'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
	AdsButton,
	AdsDropdown,
	AdsPopover,
	AdsTooltip,
	type AdsOverlayPlacement,
} from '@dvmarques/admin-ds-components';

export default function OverlayEdgesPage() {
	const [kind, setKind] = useState('Tooltip');
	const [corner, setCorner] = useState('bottom-right');
	const [placement, setPlacement] = useState<AdsOverlayPlacement>('bottom');
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const anchorStyle: CSSProperties = {
		position: 'fixed',
		zIndex: 'var(--ads-layer-overlay)',
		...(corner.startsWith('top') ? { top: 8 } : { bottom: 8 }),
		...(corner.endsWith('left') ? { left: 8 } : { right: 8 }),
	};
	return (
		<div className="demo-page">
			<h1>Overlays nas bordas</h1>
			<p>
				Experimente as quatro bordas, reduza a janela ou amplie a página. O painel acompanha a área
				visível e o conteúdo.
			</p>
			<Link className="demo-action-link" href="/componentes">
				Voltar ao catálogo
			</Link>
			<div style={{ display: 'grid', gap: 16, maxWidth: 280, marginTop: 24 }}>
				<label>
					Componente{' '}
					<select
						value={kind}
						onChange={(event) => {
							setOpen(false);
							setKind(event.target.value);
						}}
					>
						<option>Tooltip</option>
						<option>Popover</option>
						<option>Dropdown</option>
					</select>
				</label>
				<label>
					Canto{' '}
					<select value={corner} onChange={(event) => setCorner(event.target.value)}>
						{['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
				</label>
				<label>
					Lado preferido{' '}
					<select
						value={placement}
						onChange={(event) => setPlacement(event.target.value as AdsOverlayPlacement)}
					>
						{(['top', 'right', 'bottom', 'left'] as const).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
				</label>
			</div>
			<div style={{ height: '110vh' }} aria-hidden="true" />
			<div style={anchorStyle}>
				{kind === 'Tooltip' && (
					<AdsTooltip
						placement={placement}
						content="Informações adicionais junto à borda da tela, com seta alinhada ao gatilho."
					>
						<AdsButton>Tooltip na borda</AdsButton>
					</AdsTooltip>
				)}
				{kind === 'Popover' && (
					<AdsPopover
						aria-label="Popover na borda"
						placement={placement}
						open={open}
						onOpenChange={setOpen}
						content={
							<div style={{ width: 240, maxWidth: '100%' }}>
								<AdsButton onClick={() => setExpanded(!expanded)}>Alternar conteúdo</AdsButton>
								<p>
									{expanded
										? 'Conteúdo dinâmico que cresce sem fechar o painel. '.repeat(4)
										: 'Conteúdo breve.'}
								</p>
							</div>
						}
					>
						<AdsButton>Popover na borda</AdsButton>
					</AdsPopover>
				)}
				{kind === 'Dropdown' && (
					<AdsDropdown>
						<AdsDropdown.Trigger>Dropdown na borda</AdsDropdown.Trigger>
						<AdsDropdown.Content placement={placement} aria-label="Ações na borda">
							<AdsDropdown.Item>Editar registro</AdsDropdown.Item>
							<AdsDropdown.Item>Duplicar registro</AdsDropdown.Item>
							<AdsDropdown.Item disabled>Excluir registro</AdsDropdown.Item>
						</AdsDropdown.Content>
					</AdsDropdown>
				)}
			</div>
		</div>
	);
}
