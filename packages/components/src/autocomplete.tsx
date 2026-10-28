'use client';

import { useEffect, useRef, useState } from 'react';
import { AdsCombobox, type AdsComboboxOption, type AdsComboboxProps } from './combobox.js';

export interface AdsAutocompleteProps extends Omit<AdsComboboxProps, 'options' | 'filterOptions' | 'loading' | 'error' | 'onRetry'> {
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
  ...props
}: AdsAutocompleteProps) {
  const [typedQuery, setTypedQuery] = useState(defaultInputValue ?? '');
  const [retryKey, setRetryKey] = useState(0);
  const [remoteOptions, setRemoteOptions] = useState<readonly AdsComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!remote || query.trim().length < minQueryLength) {
      setLoading(false);
      setRemoteOptions([]);
      setError(null);
      return () => controller.abort();
    }
    setLoading(true);
    setRemoteOptions([]);
    setError(null);
    // New query invalidates the previous result immediately.
    const timeout = setTimeout(() => {
      void Promise.resolve()
        .then(() => loadOptionsRef.current?.(query, controller.signal) ?? [])
        .then((results) => {
          if (controller.signal.aborted || requestId !== generation.current) return;
          setRemoteOptions(results);
          setError(null);
          setLoading(false);
        })
        .catch((reason: unknown) => {
          if (controller.signal.aborted || requestId !== generation.current) return;
          setError(reason instanceof Error ? reason.message : 'Falha ao buscar opções');
          setRemoteOptions([]);
          setLoading(false);
          onLoadErrorRef.current?.(reason);
        });
    }, Math.max(0, debounceMs));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [debounceMs, minQueryLength, query, retryKey, remote]);
  const ready = query.trim().length >= minQueryLength;
  // Invalidate responses on the input event, before an obsolete provider settles.
  const onTyping: AdsComboboxProps['onInputValueChange'] = (text, reason) => {
    generation.current += 1;
    if (reason === 'input') {
      setTypedQuery(text);
      setError(null);
      setRemoteOptions([]);
      setLoading(Boolean(loadOptions && text.trim().length >= minQueryLength));
    } else if (reason === 'clear' || reason === 'select') {
      setTypedQuery('');
      setLoading(false);
      setError(null);
      setRemoteOptions([]);
    }
    onInputValueChange?.(text, reason);
  };

  return (
    <AdsCombobox
      {...props}
      defaultInputValue={defaultInputValue}
      error={remote && ready ? error : null}
      filterOptions={!remote}
      inputValue={inputValue}
      loading={remote && ready && loading}
      onInputValueChange={onTyping}
      onRetry={() => {
        setLoading(true);
        setError(null);
        setRetryKey((previous) => previous + 1);
      }}
      onValueChange={(value, option) => {
        onValueChange?.(value, option);
      }}
      options={remote ? (ready ? remoteOptions : []) : options}
    />
  );
}
