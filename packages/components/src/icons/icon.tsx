import { classNames } from '../class-names.js';
import { iconPaths } from './paths.js';
import type { AdsIconProps, AdsIconSize } from './types.js';

const iconSizes: Record<AdsIconSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

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
