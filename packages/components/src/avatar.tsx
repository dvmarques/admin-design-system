'use client';

import { useState, type ImgHTMLAttributes, type RefCallback } from 'react';
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
	/** Aceita `undefined` explícito: uma foto ausente cai no fallback. */
	src?: string | undefined;
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
	// Guarda a origem que falhou, não um booleano: trocar `src` tenta a nova imagem.
	const [failedSrc, setFailedSrc] = useState<string | undefined>();
	const showImage = Boolean(src) && failedSrc !== src;
	// Com SSR a imagem pode falhar antes da hidratação, quando `onError` ainda não existe: ao
	// anexar, uma imagem já concluída e sem dimensões é tratada como falha.
	const attachImage: RefCallback<HTMLImageElement> = (node) => {
		if (node?.complete && node.naturalWidth === 0 && node.currentSrc !== '') setFailedSrc(src);
	};

	return (
		<span
			className={classNames(
				'ads-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-raised font-medium text-text',
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
					onError={() => setFailedSrc(src)}
					ref={attachImage}
					src={src}
				/>
			) : null}
		</span>
	);
}
