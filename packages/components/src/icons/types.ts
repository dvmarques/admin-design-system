import type { SVGAttributes } from 'react';
import type { iconPaths } from './paths.js';

export type AdsIconName = keyof typeof iconPaths;
export type AdsIconSize = 'sm' | 'md' | 'lg';

export interface AdsIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role'> {
	label?: string;
	name: AdsIconName;
	size?: AdsIconSize;
}
