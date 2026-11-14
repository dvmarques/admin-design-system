import type { HTMLAttributes, ReactNode, SVGAttributes } from 'react';
import type { iconPaths } from './paths.js';

export type AdsIconName = keyof typeof iconPaths;
export type AdsIconSize = 'sm' | 'md' | 'lg';

/** A rendered SVG or React icon supplied by the consumer; no required icon library. */
export interface AdsIconSlotProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	'children' | 'role' | 'aria-label' | 'aria-hidden'
> {
	icon: ReactNode;
	/** Accessible name for informative icons; without it, the slot is decorative. */
	label?: string;
	/** Size of the layout box; does not mutate or resize the consumer's SVG. */
	size?: AdsIconSize;
}

export interface AdsIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role'> {
	label?: string;
	name: AdsIconName;
	size?: AdsIconSize;
}
