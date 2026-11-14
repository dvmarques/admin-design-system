import { classNames } from '../class-names.js';
import type { AdsIconSlotProps, AdsIconSize } from './types.js';

const sizes: Record<AdsIconSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

/**
 * Layout and accessibility wrapper for a consumer-rendered icon.
 * Never clones its child or assumes library-specific SVG props.
 */
export function AdsIconSlot({
	className,
	icon,
	label,
	size = 'md',
	...props
}: AdsIconSlotProps) {
	const informative = Boolean(label);
	return (
		<span
			{...props}
			aria-hidden={informative ? undefined : true}
			aria-label={informative ? label : undefined}
			className={classNames(
				'ads-icon-slot inline-flex shrink-0 items-center justify-center align-middle text-current',
				sizes[size],
				className,
			)}
			role={informative ? 'img' : undefined}
		>
			{icon}
		</span>
	);
}
