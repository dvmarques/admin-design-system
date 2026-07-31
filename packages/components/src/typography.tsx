import { createElement, type HTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const typographyVariants = {
	body: 'text-sm leading-normal text-text',
	bodySmall: 'text-sm leading-normal text-text',
	muted: 'text-sm leading-normal text-text-muted',
	lead: 'text-lg leading-normal text-text',
	heading1: 'text-4xl font-semibold leading-tight text-text',
	heading2: 'text-3xl font-semibold leading-tight text-text',
	heading3: 'text-2xl font-semibold leading-tight text-text',
	heading4: 'text-xl font-semibold leading-tight text-text',
} as const;

const typographyElements = {
	body: 'p',
	bodySmall: 'p',
	muted: 'p',
	lead: 'p',
	heading1: 'h1',
	heading2: 'h2',
	heading3: 'h3',
	heading4: 'h4',
} as const;

export type AdsTypographyVariant = keyof typeof typographyVariants;
export type AdsTypographyElement = keyof HTMLElementTagNameMap;

export interface AdsTypographyProps extends HTMLAttributes<HTMLElement> {
	as?: AdsTypographyElement;
	variant?: AdsTypographyVariant;
}

/** Applies a semantic typographic hierarchy without losing the chosen element. */
export function AdsTypography({
	as,
	children,
	className,
	variant = 'body',
	...props
}: AdsTypographyProps) {
	const element = as ?? typographyElements[variant];

	return createElement(
		element,
		{ ...props, className: classNames('ads-typography', typographyVariants[variant], className) },
		children,
	);
}
