'use client';

import { useEffect, useRef, useState } from 'react';
import { AdsCombobox, type AdsComboboxOption, type AdsComboboxProps } from './combobox.js';

export interface AdsAutocompleteProps
	extends Omit<
		AdsComboboxProps,
		'options' | 'filterOptions' | 'loading' | 'error' | 'onRetry'
	> {
	options?: readonly AdsComboboxOption[];
	loadOptions?: (query: string, signal: AbortSignal) => Promise<readonly AdsComboboxOption[]>;
	debounceMs?: number;
	minQueryLength?: number;
	onLoadError?: (error: unknown) => void;
}

/** Searchable single selection with either a local list or an optional async provider. */
export function AdsAutocomplete({
	options = [],
	loadOptions,
	debounceMs = 250,
	minQueryLength = 1,
	onInputValueChange,
	onValueChange,
	onLoadError,
	inputValue,
	defaultInputValue,
	disabled,
	...props
}: AdsAutocompleteProps) {
	const [typedQuery, setTypedQuery] = useState(defaultInputValue ?? '');
	const [retryKey, setRetryKey] = useState(0);
	const [remoteResult, setRemoteResult] = useState<{
		query: string;
		options: readonly AdsComboboxOption[];
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const [requestError, setRequestError] = useState<{ query: string; message: string } | null>(null);
	const generation = useRef(0);
	const loadOptionsRef = useRef(loadOptions);
	const onLoadErrorRef = useRef(onLoadError);
	useEffect(() => {
		loadOptionsRef.current = loadOptions;
		onLoadErrorRef.current = onLoadError;
	}, [loadOptions, onLoadError]);
	const remote = Boolean(loadOptions);
	const query = inputValue !== undefined ? inputValue : typedQuery;

	useEffect(() => {
		const requestId = ++generation.current;
		const controller = new AbortController();
		if (!remote || disabled || query.trim().length < minQueryLength) {
			setLoading(false);
			setRemoteResult(null);
			setRequestError(null);
			return () => controller.abort();
		}
		setLoading(true);
		setRemoteResult(null);
		setRequestError(null);
		// New query invalidates the previous result immediately.
		const timeout = setTimeout(() => {
			void Promise.resolve()
				.then(() => loadOptionsRef.current?.(query, controller.signal) ?? [])
				.then((results) => {
					if (controller.signal.aborted || requestId !== generation.current) return;
					setRemoteResult({ query, options: results });
					setRequestError(null);
					setLoading(false);
				})
				.catch((reason: unknown) => {
					if (controller.signal.aborted || requestId !== generation.current) return;
					setRequestError({
					query,
					message: reason instanceof Error ? reason.message : 'Falha ao buscar opções',
				});
					setRemoteResult(null);
					setLoading(false);
					onLoadErrorRef.current?.(reason);
				});
		}, Math.max(0, debounceMs));
		return () => {
			clearTimeout(timeout);
			controller.abort();
		};
	}, [debounceMs, disabled, minQueryLength, query, retryKey, remote]);
	const ready = !disabled && query.trim().length >= minQueryLength;
	const visibleOptions = remoteResult?.query === query ? remoteResult.options : [];
	const visibleError = requestError?.query === query ? requestError.message : null;
	// Invalidate responses on the input event, before an obsolete provider settles.
	const onTyping: AdsComboboxProps['onInputValueChange'] = (text, reason) => {
		generation.current += 1;
		if (reason === 'input') {
			setTypedQuery(text);
			setRequestError(null);
			setRemoteResult(null);
			setLoading(Boolean(loadOptions && text.trim().length >= minQueryLength));
		} else if (reason === 'clear' || reason === 'select') {
			setTypedQuery('');
			setLoading(false);
			setRequestError(null);
			setRemoteResult(null);
		}
		onInputValueChange?.(text, reason);
	};

	return (
		<AdsCombobox
			{...props}
			defaultInputValue={defaultInputValue}
			disabled={disabled}
			error={remote && ready ? visibleError : null}
			filterOptions={!remote}
			inputValue={inputValue}
			loading={remote && ready && loading}
			onInputValueChange={onTyping}
			onRetry={() => {
				setLoading(true);
				setRequestError(null);
				setRetryKey((previous) => previous + 1);
			}}
			onValueChange={(value, option) => {
				onValueChange?.(value, option);
			}}
			options={remote ? (ready ? visibleOptions : []) : options}
		/>
	);
}
