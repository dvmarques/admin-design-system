'use client';

import { AdsButton } from '@admin-ds/components';
import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';

/** Textos da interface; os padrões estão em pt-BR. */
export interface AdsBulkActionBarLabels {
	/** Nome acessível do grupo de ações. */
	region: string;
	selected: (count: number) => string;
	clear: string;
}

const defaultLabels: AdsBulkActionBarLabels = {
	region: 'Ações em massa',
	selected: (count) => (count === 1 ? '1 item selecionado' : `${count} itens selecionados`),
	clear: 'Limpar seleção',
};

export interface AdsBulkActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Quantidade de itens selecionados. Com zero, a barra não é renderizada. */
	selectedCount: number;
	/** Ações em massa do consumidor, normalmente `AdsButton`. */
	children?: ReactNode;
	/** Chamado por "Limpar seleção". O botão só existe quando `onClear` é informado. */
	onClear?: () => void;
	labels?: Partial<AdsBulkActionBarLabels>;
}

/**
 * Barra de ações em massa. Aparece só com itens selecionados e anuncia a quantidade por uma
 * região de status que permanece no DOM, para que o anúncio ocorra quando a barra surge.
 */
export function AdsBulkActionBar({
	children,
	className,
	labels: labelOverrides,
	onClear,
	selectedCount,
	...props
}: AdsBulkActionBarProps) {
	const labels = { ...defaultLabels, ...labelOverrides };
	const count = Number.isFinite(selectedCount) ? Math.max(0, Math.floor(selectedCount)) : 0;
	const text = count > 0 ? labels.selected(count) : '';
	return (
		<>
			<div aria-live="polite" className="ads-bulk-action-bar-status" role="status">
				{text}
			</div>
			{count > 0 ? (
				<div
					aria-label={labels.region}
					{...props}
					className={classNames('ads-bulk-action-bar', className)}
					role="group"
				>
					<span aria-hidden="true" className="ads-bulk-action-bar-count">
						{text}
					</span>
					<div className="ads-bulk-action-bar-actions">{children}</div>
					{onClear ? (
						<AdsButton onClick={onClear} size="sm" variant="ghost">
							{labels.clear}
						</AdsButton>
					) : null}
				</div>
			) : null}
		</>
	);
}
