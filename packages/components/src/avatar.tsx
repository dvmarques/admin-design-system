'use client';

import { useState, type ImgHTMLAttributes, type RefCallback } from 'react';
import { classNames } from './class-names.js';

const avatarSizes = {
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-12 w-12 text-base',
} as const;

// Mesmas variantes do AdsBadge; `neutral` é o padrão anterior (sem mudança para quem já usa).
const avatarTones = {
	neutral: 'border-border bg-surface-raised text-text',
	primary: 'border-transparent bg-primary text-[var(--ads-color-on-primary)]',
	success: 'border-success-border bg-success-background text-success',
	warning: 'border-warning-border bg-warning-background text-warning',
	danger: 'border-danger-border bg-danger-background text-danger',
} as const;

export type AdsAvatarSize = keyof typeof avatarSizes;
export type AdsAvatarTone = keyof typeof avatarTones;

export interface AdsAvatarProps extends Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	'children' | 'className' | 'onError' | 'src'
> {
	alt?: string;
	/**
	 * Cor de fundo livre (qualquer cor CSS), que prevalece sobre `tone`. Combine com
	 * `foregroundColor` para manter o contraste do texto.
	 */
	backgroundColor?: string | undefined;
	className?: string;
	fallback: string;
	/** Cor livre (qualquer cor CSS) das iniciais. */
	foregroundColor?: string | undefined;
	size?: AdsAvatarSize;
	/** Cor de fundo a partir dos tokens do tema; claro e escuro têm contraste adequado. */
	tone?: AdsAvatarTone;
	/** Aceita `undefined` explícito: uma foto ausente cai no fallback. */
	src?: string | undefined;
}

/** Represents an entity with an image and a resilient textual fallback. */
export function AdsAvatar({
	alt,
	backgroundColor,
	className,
	fallback,
	foregroundColor,
	size = 'md',
	src,
	tone = 'neutral',
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
				'ads-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border font-medium',
				avatarTones[tone],
				avatarSizes[size],
				className,
			)}
			style={
				backgroundColor || foregroundColor
					? { backgroundColor, color: foregroundColor, borderColor: backgroundColor }
					: undefined
			}
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
