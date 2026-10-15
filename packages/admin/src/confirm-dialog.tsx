'use client';

import { AdsButton, AdsDialog, type AdsDialogProps } from '@admin-ds/components';
import type { ReactNode } from 'react';

export interface AdsConfirmDialogProps extends Omit<
	AdsDialogProps,
	'children' | 'showCloseButton' | 'title' | 'description'
> {
	title: ReactNode;
	description?: ReactNode;
	/** Chamado ao confirmar. O diálogo não fecha sozinho: o consumidor atualiza `open`. */
	onConfirm: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Usa a variante de perigo na confirmação. Padrão: `true`. */
	destructive?: boolean;
	/** Desabilita as ações enquanto o consumidor processa a confirmação. */
	pending?: boolean;
	/** Conteúdo adicional entre a descrição e as ações. */
	children?: ReactNode;
}

/**
 * Confirmação de ação destrutiva sobre `AdsDialog`. O foco inicial vai a "Cancelar", `Escape`
 * e o clique fora cancelam. O consumidor decide quando fechar.
 */
export function AdsConfirmDialog({
	cancelLabel = 'Cancelar',
	children,
	confirmLabel = 'Confirmar',
	destructive = true,
	onConfirm,
	onOpenChange,
	pending = false,
	...props
}: AdsConfirmDialogProps) {
	return (
		<AdsDialog {...props} onOpenChange={onOpenChange} showCloseButton={false}>
			{children}
			<div className="ads-confirm-dialog-actions">
				<AdsButton disabled={pending} onClick={() => onOpenChange(false)} variant="secondary">
					{cancelLabel}
				</AdsButton>
				<AdsButton
					disabled={pending}
					isLoading={pending}
					onClick={onConfirm}
					variant={destructive ? 'danger' : 'primary'}
				>
					{confirmLabel}
				</AdsButton>
			</div>
		</AdsDialog>
	);
}
