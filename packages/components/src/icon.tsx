import type { SVGAttributes } from 'react';
import { classNames } from './class-names.js';

const iconPaths = {
	// Feather Icons (MIT): icons/alert-circle.svg.
	alertCircle: (
		<>
			<circle cx="12" cy="12" r="10" strokeWidth="2" />
			<line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
			<line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/alert-triangle.svg.
	alertTriangle: (
		<>
			<path
				d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
				strokeWidth="2"
			/>
			<line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
			<line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/bell.svg.
	bell: (
		<>
			<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" />
			<path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" />
		</>
	),
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
	// Feather Icons (MIT): icons/calendar.svg.
	calendar: (
		<>
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
			<line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
			<line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
			<line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/check.svg.
	check: (
		<>
			<polyline points="20 6 9 17 4 12" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/chevron-down.svg.
	chevronDown: (
		<>
			<polyline points="6 9 12 15 18 9" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/chevron-left.svg.
	chevronLeft: (
		<>
			<polyline points="15 18 9 12 15 6" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/chevron-right.svg.
	chevronRight: (
		<>
			<polyline points="9 18 15 12 9 6" strokeWidth="2" />
		</>
	),
	// Lucide Icons (ISC): icons/chevrons-up-down.svg.
	chevronsUpDown: (
		<>
			<path d="m7 15 5 5 5-5" strokeWidth="2" />
			<path d="m7 9 5-5 5 5" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/x.svg.
	close: (
		<>
			<line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
			<line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/log-out.svg.
	logOut: (
		<>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" />
			<polyline points="16 17 21 12 16 7" strokeWidth="2" />
			<line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/monitor.svg.
	monitor: (
		<>
			<rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
			<line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
			<line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/moon.svg.
	moon: (
		<>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/info.svg.
	info: (
		<>
			<circle cx="12" cy="12" r="10" strokeWidth="2" />
			<line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
			<line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/plus.svg.
	plus: (
		<>
			<line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" />
			<line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/sun.svg.
	sun: (
		<>
			<circle cx="12" cy="12" r="5" strokeWidth="2" />
			<line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
			<line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" />
			<line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" />
			<line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/settings.svg.
	settings: (
		<>
			<circle cx="12" cy="12" r="3" strokeWidth="2" />
			<path
				d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
				strokeWidth="2"
			/>
		</>
	),
	// Feather Icons (MIT): icons/search.svg.
	search: (
		<>
			<circle cx="11" cy="11" r="8" strokeWidth="2" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
		</>
	),
	// Feather Icons (MIT): icons/user.svg.
	user: (
		<>
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
			<circle cx="12" cy="7" r="4" strokeWidth="2" />
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
