import type { SVGAttributes } from 'react';
import { classNames } from './class-names.js';

const iconPaths = {
	alertCircle: <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 8v4m0 4h.01" />,
	alertTriangle: (
		<path d="m10.3 4.2-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.8l-8-14a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01" />
	),
	bell: <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Zm4.3 10a2 2 0 0 0 3.4 0" />,
	// Hugeicons Free Building06Icon (MIT); original paths and license in THIRD_PARTY_NOTICES.md.
	building: (
		<>
			<path
				d="M12 2H6C3.518 2 3 2.518 3 5V22H15V5C15 2.518 14.482 2 12 2Z"
				strokeLinecap="butt"
				strokeWidth="1.5"
			/>
			<path
				d="M18 8H15V22H21V11C21 8.518 20.482 8 18 8Z"
				strokeLinecap="butt"
				strokeWidth="1.5"
			/>
			<path
				d="M8 6L10 6M8 9L10 9M8 12L10 12"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M11.5 22V18C11.5 17.0572 11.5 16.5858 11.2071 16.2929C10.9142 16 10.4428 16 9.5 16H8.5C7.55719 16 7.08579 16 6.79289 16.2929C6.5 16.5858 6.5 17.0572 6.5 18V22"
				strokeLinecap="butt"
				strokeWidth="1.5"
			/>
		</>
	),
	calendar: (
		<path d="M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
	),
	check: <path d="m5 12 4 4L19 6" />,
	chevronDown: <path d="m6 9 6 6 6-6" />,
	chevronLeft: <path d="m15 6-6 6 6 6" />,
	chevronRight: <path d="m9 6 6 6-6 6" />,
	chevronsUpDown: <path d="m8 9 4-4 4 4m0 6-4 4-4-4" />,
	close: <path d="m6 6 12 12M18 6 6 18" />,
	logOut: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />,
	monitor: (
		<>
			<rect height="12" rx="2" width="18" x="3" y="4" />
			<path d="M8 20h8M12 16v4" />
		</>
	),
	moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
	info: <path d="M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
	plus: <path d="M12 5v14M5 12h14" />,
	sun: (
		<>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
		</>
	),
	settings: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
		</>
	),
	search: <path d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />,
	user: (
		<>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21a8 8 0 0 1 16 0" />
		</>
	),
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

/** Renders a small, typed icon set with documented third-party artwork. */
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
			strokeWidth="1.75"
			viewBox="0 0 24 24"
		>
			{iconPaths[name]}
		</svg>
	);
}
