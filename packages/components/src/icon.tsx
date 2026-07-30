import type { SVGAttributes } from 'react';
import { classNames } from './class-names.js';

const iconPaths = {
	check: <path d="m5 12 4 4L19 6" />,
	close: <path d="m6 6 12 12M18 6 6 18" />,
	info: <path d="M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
	plus: <path d="M12 5v14M5 12h14" />,
	search: <path d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />,
} as const;

const iconSizes = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

export type AdsIconName = keyof typeof iconPaths;
export type AdsIconSize = keyof typeof iconSizes;

export interface AdsIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role'> {
	label?: string;
	name: AdsIconName;
	size?: AdsIconSize;
}

/** Renders a small, independently authored, typed icon set. */
export function AdsIcon({ className, label, name, size = 'md', ...props }: AdsIconProps) {
	const isInformative = Boolean(label);

	return (
		<svg
			{...props}
			aria-hidden={isInformative ? undefined : true}
			aria-label={label}
			className={classNames('ads-icon inline-block shrink-0', iconSizes[size], className)}
			fill="none"
			role={isInformative ? 'img' : undefined}
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			{iconPaths[name]}
		</svg>
	);
}
