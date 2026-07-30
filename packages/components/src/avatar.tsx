'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import { classNames } from './class-names.js';

const avatarSizes = {
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-12 w-12 text-base',
} as const;

export type AdsAvatarSize = keyof typeof avatarSizes;

export interface AdsAvatarProps extends Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	'children' | 'className' | 'onError' | 'src'
> {
	alt?: string;
	className?: string;
	fallback: string;
	size?: AdsAvatarSize;
	src?: string;
}

/** Represents an entity with an image and a resilient textual fallback. */
export function AdsAvatar({
	alt,
	className,
	fallback,
	size = 'md',
	src,
	...props
}: AdsAvatarProps) {
	const [imageFailed, setImageFailed] = useState(false);
	const showImage = Boolean(src) && !imageFailed;

	return (
		<span
			className={classNames(
				'ads-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised font-medium text-text',
				avatarSizes[size],
				className,
			)}
		>
			<span aria-hidden={showImage} className="truncate px-1">
				{fallback}
			</span>
			{showImage ? (
				<img
					{...props}
					alt={alt ?? ''}
					className="absolute inset-0 h-full w-full object-cover"
					onError={() => setImageFailed(true)}
					src={src}
				/>
			) : null}
		</span>
	);
}
