import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { createElement } from 'react';
import { classNames } from './class-names.js';

export type AdsLoadingTextSpeed = 'slow' | 'normal' | 'fast';

export interface AdsLoadingTextProps extends HTMLAttributes<HTMLElement> {
	/** Texto preservado durante a atualização. */
	children: ReactNode;
	/** Ativa o shimmer visual. Não inicia requisições nem anuncia status. */
	loading?: boolean;
	/** Velocidade do shimmer; normal equivale a 2,5 segundos. */
	speed?: AdsLoadingTextSpeed;
	/** Elemento semântico; span por padrão. */
	as?: ElementType;
}

/** Indicador visual de texto mutável, sem estado ou dependência de Client Components. */
export function AdsLoadingText({
	as: Component = 'span',
	children,
	className,
	loading = false,
	speed = 'normal',
	...props
}: AdsLoadingTextProps) {
	return createElement(
		Component,
		{
			...props,
			className: classNames('ads-loading-text', className),
			'data-loading': loading ? 'true' : undefined,
			'data-speed': loading ? speed : undefined,
		},
		children,
	);
}
