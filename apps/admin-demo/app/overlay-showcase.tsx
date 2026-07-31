'use client';

import { useState } from 'react';
import {
	AdsButton,
	AdsDialog,
	AdsDrawer,
	AdsPopover,
	AdsToast,
	AdsTooltip,
} from '@admin-ds/components';

export function OverlayShowcase() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [toastOpen, setToastOpen] = useState(false);

	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
			<AdsButton onClick={() => setDialogOpen(true)}>Abrir diálogo</AdsButton>
			<AdsButton variant="secondary" onClick={() => setDrawerOpen(true)}>
				Abrir drawer
			</AdsButton>
			<AdsTooltip content="Ações adicionais">
				<AdsButton variant="ghost">Tooltip</AdsButton>
			</AdsTooltip>
			<AdsPopover
				aria-label="Ações rápidas"
				content={<AdsButton onClick={() => setPopoverOpen(false)}>Editar</AdsButton>}
				onOpenChange={setPopoverOpen}
				open={popoverOpen}
			>
				<AdsButton variant="secondary">Popover</AdsButton>
			</AdsPopover>
			<AdsButton variant="ghost" onClick={() => setToastOpen(true)}>
				Mostrar toast
			</AdsButton>
			<AdsDialog
				description="Este é um fluxo controlado pela aplicação consumidora."
				onOpenChange={setDialogOpen}
				open={dialogOpen}
				title="Exemplo de diálogo"
			>
				<AdsButton onClick={() => setDialogOpen(false)}>Fechar</AdsButton>
			</AdsDialog>
			<AdsDrawer onOpenChange={setDrawerOpen} open={drawerOpen} title="Exemplo de drawer">
				<p>Conteúdo lateral responsivo.</p>
			</AdsDrawer>
			{toastOpen ? (
				<AdsToast onClose={() => setToastOpen(false)} variant="success">
					Operação concluída.
				</AdsToast>
			) : null}
		</div>
	);
}
