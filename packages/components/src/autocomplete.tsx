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
  const query = inputValue !== undefined ? inputValue : typedQuery;

  useEffect(() => {
    const requestId = ++generation.current;
    const controller = new AbortController();
    if (!loadOptions || query.trim().length < minQueryLength) {
      return () => controller.abort();
    }
    // New query invalidates the previous result immediately.
    const timeout = setTimeout(() => {
      void Promise.resolve()
        .then(() => loadOptions(query, controller.signal))
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
          onLoadError?.(reason);
        });
    }, Math.max(0, debounceMs));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [debounceMs, loadOptions, minQueryLength, onLoadError, query, retryKey]);

  const remote = Boolean(loadOptions);
  const ready = query.trim().length >= minQueryLength;
  // Render state is derived from the query generation to avoid showing stale entries.
  // Requests initialize loading on input events, not during render or in an effect.
  const onTyping: AdsComboboxProps['onInputValueChange'] = (text, reason) => {
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
