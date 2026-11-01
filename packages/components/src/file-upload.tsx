'use client';

import { forwardRef, useId, useRef, useState, type ChangeEvent, type HTMLAttributes } from 'react';
import { AdsButton } from './button.js';
import { classNames } from './class-names.js';

export type AdsFileChangeReason = 'select' | 'remove' | 'clear';
export type AdsFileRejectionReason = 'type' | 'size' | 'count';

export interface AdsFileRejection {
	file: File;
	reason: AdsFileRejectionReason;
	message: string;
}

export interface AdsFileUploadProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'onChange' | 'defaultValue'
> {
	files?: readonly File[];
	defaultFiles?: readonly File[];
	onFilesChange?: (files: File[], reason: AdsFileChangeReason) => void;
	onReject?: (rejections: AdsFileRejection[]) => void;
	accept?: string;
	multiple?: boolean;
	maxFiles?: number;
	maxSizeBytes?: number;
	disabled?: boolean;
	isLoading?: boolean;
	error?: string;
	label?: string;
	selectLabel?: string;
	emptyLabel?: string;
	clearLabel?: string;
}

function fileMatchesAccept(file: File, accept?: string): boolean {
	if (!accept?.trim()) return true;
	const options = accept
		.split(',')
		.map((option) => option.trim().toLowerCase())
		.filter(Boolean);
	if (!options.length) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return options.some((option) => {
		if (option.startsWith('.')) return name.endsWith(option);
		if (option.endsWith('/*')) return type.startsWith(option.slice(0, -1));
		return type === option;
	});
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1).replace('.', ',') + ' KB';
	return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
}

/** File selection and validation only. Transport and security checks belong to the consumer. */
export const AdsFileUpload = forwardRef<HTMLInputElement, AdsFileUploadProps>(
	function AdsFileUpload(
		{
			files,
			defaultFiles = [],
			onFilesChange,
			onReject,
			accept,
			multiple = false,
			maxFiles,
			maxSizeBytes,
			disabled = false,
			isLoading = false,
			error,
			label = 'Arquivos',
			selectLabel,
			emptyLabel = 'Nenhum arquivo selecionado',
			clearLabel = 'Limpar seleção',
			className,
			...props
		},
		forwardedRef,
	) {
		const [internalFiles, setInternalFiles] = useState<File[]>(() => [...defaultFiles]);
		const [rejections, setRejections] = useState<AdsFileRejection[]>([]);
		const inputRef = useRef<HTMLInputElement | null>(null);
		const triggerRef = useRef<HTMLButtonElement>(null);
		const inputId = useId();
		const feedbackId = useId();
		const selected = files === undefined ? internalFiles : files;
		const blocked = disabled || isLoading;
		const visibleError = error || rejections.map((item) => item.message).join(' ');
		const selectionLabel = selectLabel ?? (multiple ? 'Selecionar arquivos' : 'Selecionar arquivo');

		function commit(next: File[], reason: AdsFileChangeReason) {
			if (files === undefined) setInternalFiles(next);
			setRejections([]);
			onFilesChange?.(next, reason);
		}

		function handleSelection(event: ChangeEvent<HTMLInputElement>) {
			const incoming = Array.from(event.currentTarget.files ?? []);
			// The same file must trigger change again on the next selection.
			event.currentTarget.value = '';
			if (blocked || incoming.length === 0) return;

			const accepted: File[] = [];
			const rejected: AdsFileRejection[] = [];
			const capacity = Math.min(multiple ? Infinity : 1, Math.max(0, maxFiles ?? Infinity));

			for (const file of incoming) {
				let reason: AdsFileRejectionReason | undefined;
				let message: string | undefined;
				if (!fileMatchesAccept(file, accept)) {
					reason = 'type';
					message = file.name + ': tipo de arquivo não permitido.';
				} else if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
					reason = 'size';
					message = file.name + ': tamanho máximo excedido.';
				} else if (accepted.length >= capacity) {
					reason = 'count';
					message = file.name + ': quantidade máxima de arquivos excedida.';
				}

				if (reason && message) rejected.push({ file, reason, message });
				else accepted.push(file);
			}

			if (accepted.length) commit(accepted, 'select');
			setRejections(rejected);
			if (rejected.length) onReject?.(rejected);
		}

		function removeAt(index: number) {
			if (blocked) return;
			triggerRef.current?.focus();
			commit(
				selected.filter((_, itemIndex) => itemIndex !== index),
				'remove',
			);
		}

		function clear() {
			if (blocked) return;
			triggerRef.current?.focus();
			commit([], 'clear');
		}

		return (
			<div
				{...props}
				aria-busy={isLoading || undefined}
				className={classNames(
					'ads-file-upload box-border min-w-0 rounded-md border border-border bg-surface p-4 font-sans text-text',
					disabled && 'opacity-60',
					className,
				)}
				data-state={
					visibleError ? 'error' : isLoading ? 'loading' : selected.length ? 'selected' : 'empty'
				}
			>
				<div className="flex min-w-0 flex-wrap items-center gap-3">
					<AdsButton
						aria-describedby={visibleError ? feedbackId : undefined}
						disabled={blocked}
						onClick={() => inputRef.current?.click()}
						ref={triggerRef}
						type="button"
						variant="secondary"
					>
						{selectionLabel}
					</AdsButton>
					<span className="text-sm font-medium">{label}</span>
				</div>
				<input
					accept={accept}
					aria-describedby={visibleError ? feedbackId : undefined}
					aria-invalid={Boolean(visibleError) || undefined}
					aria-label={label}
					className="sr-only"
					disabled={blocked}
					id={inputId}
					multiple={multiple}
					onChange={handleSelection}
					ref={(node) => {
						inputRef.current = node;
						if (typeof forwardedRef === 'function') forwardedRef(node);
						else if (forwardedRef) forwardedRef.current = node;
					}}
					tabIndex={-1}
					type="file"
				/>
				{selected.length ? (
					<ul className="mt-3 flex min-w-0 list-none flex-col gap-2 p-0">
						{selected.map((file, index) => (
							<li
								className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface-muted p-2"
								key={file.name + ':' + file.size + ':' + file.lastModified + ':' + index}
							>
								<span className="min-w-0 break-all text-sm">
									<strong>{file.name}</strong>
									{' · '}
									{formatBytes(file.size)}
									{' · '}
									{file.type || 'Tipo não informado'}
								</span>
								<AdsButton
									aria-label={'Remover ' + file.name}
									disabled={blocked}
									onClick={() => removeAt(index)}
									size="sm"
									type="button"
									variant="ghost"
								>
									Remover
								</AdsButton>
							</li>
						))}
					</ul>
				) : null}
				<div aria-live="polite" className="mt-2 text-sm text-text-muted" role="status">
					{isLoading
						? 'Enviando arquivos...'
						: selected.length
							? selected.length === 1
								? '1 arquivo selecionado'
								: selected.length + ' arquivos selecionados'
							: emptyLabel}
				</div>
				{selected.length > 0 ? (
					<AdsButton
						className="mt-2"
						disabled={blocked}
						onClick={clear}
						size="sm"
						type="button"
						variant="ghost"
					>
						{clearLabel}
					</AdsButton>
				) : null}
				{visibleError ? (
					<p className="mt-2 break-words text-sm text-form-invalid" id={feedbackId} role="alert">
						{visibleError}
					</p>
				) : null}
			</div>
		);
	},
);
