'use client';

import {
	AdsButton,
	AdsDialog,
	AdsLoadingIndicator,
	type AdsDialogProps,
} from '@admin-ds/components';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { isFocusLost } from './selection-focus.js';

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
	/**
	 * Usa a variante de perigo na confirmação e o papel `alertdialog` (a menos que `role` seja
	 * informado). Padrão: `true`.
	 */
	destructive?: boolean;
	/**
	 * Enquanto o consumidor processa a confirmação: as ações ficam indisponíveis
	 * (`aria-disabled`, sem perder o foco) e `Escape` e o clique fora não cancelam, mesmo com
	 * `closeOnEscape` ou `closeOnBackdrop` informados.
	 */
	pending?: boolean;
	/**
	 * Destino do foco ao fechar quando o elemento que abriu o diálogo não está mais na página
	 * (por exemplo, a barra de ações em massa sumiu depois da exclusão).
	 */
	returnFocusRef?: RefObject<HTMLElement | null>;
	/** Conteúdo adicional entre a descrição e as ações. */
	children?: ReactNode;
}

/**
 * Confirmação de ação destrutiva sobre `AdsDialog`. O foco inicial vai a "Cancelar", `Escape`
 * e o clique fora cancelam (exceto com `pending`). O consumidor decide quando fechar. Se `children`
 * tiver controles focáveis, o foco inicial vai ao primeiro deles, antes de "Cancelar".
 */
export function AdsConfirmDialog({
	cancelLabel = 'Cancelar',
	children,
	confirmLabel = 'Confirmar',
	destructive = true,
	onConfirm,
	onOpenChange,
	pending = false,
	returnFocusRef,
	role,
	...props
}: AdsConfirmDialogProps) {
	const wasOpen = useRef(props.open);
	const actionsRef = useRef<HTMLDivElement>(null);

	// O fundo não é focável: sem isto, clicar nele move o foco para o `<body>`, tanto com
	// `pending` (o diálogo continua aberto) quanto ao cancelar (depois de o foco voltar à origem).
	useEffect(() => {
		if (!props.open) return;
		const keepFocus = (event: MouseEvent) => {
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				target.dataset['overlay'] === 'backdrop' &&
				actionsRef.current &&
				target.contains(actionsRef.current)
			) {
				event.preventDefault();
			}
		};
		document.addEventListener('mousedown', keepFocus, true);
		return () => document.removeEventListener('mousedown', keepFocus, true);
	}, [props.open]);

	// Roda depois do efeito do `AdsDialog` (filho), que devolve o foco ao elemento de origem. Se ele
	// saiu da página, o foco ficou no `<body>`: usa `returnFocusRef`.
	useEffect(() => {
		if (wasOpen.current && !props.open && isFocusLost()) returnFocusRef?.current?.focus();
		wasOpen.current = props.open;
	}, [props.open, returnFocusRef]);

	return (
		<AdsDialog
			{...props}
			// Durante o processamento, `Escape` e o clique fora não cancelam, mesmo se informados.
			closeOnBackdrop={!pending && (props.closeOnBackdrop ?? true)}
			closeOnEscape={!pending && (props.closeOnEscape ?? true)}
			onOpenChange={onOpenChange}
			// Ação destrutiva pede resposta imediata: `alertdialog`, salvo `role` explícito.
			role={role ?? (destructive ? 'alertdialog' : 'dialog')}
			showCloseButton={false}
		>
			{children}
			<div className="ads-confirm-dialog-actions" ref={actionsRef}>
				{/* `aria-disabled` em vez de `disabled`: o botão focado não perde o foco para o body. */}
				<AdsButton
					aria-disabled={pending || undefined}
					onClick={() => {
						if (!pending) onOpenChange(false);
					}}
					variant="secondary"
				>
					{cancelLabel}
				</AdsButton>
				<AdsButton
					aria-disabled={pending || undefined}
					onClick={() => {
						if (!pending) onConfirm();
					}}
					variant={destructive ? 'danger' : 'primary'}
				>
					{pending ? <AdsLoadingIndicator aria-hidden="true" size="sm" /> : null}
					{confirmLabel}
				</AdsButton>
			</div>
		</AdsDialog>
	);
}
