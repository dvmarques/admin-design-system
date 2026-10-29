import { useState, type Ref } from 'react';
import { AdsAvatar } from './avatar.js';
import { AdsIcon } from './icon.js';
import type { AdsComboboxOption } from './combobox-types.js';

/** Visual decorativo de uma opção (avatar ou ícone), compartilhado pelas duas apresentações. */
export function OptionVisual({ option }: { option: AdsComboboxOption }) {
	if (option.avatar)
		return <AdsAvatar size="sm" fallback={option.avatar.fallback} src={option.avatar.src} />;
	if (option.icon) return <AdsIcon name={option.icon} size="sm" />;
	return null;
}

/**
 * Seleção única controlada ou não: o valor confirmado, a opção correspondente (nas `options`, em
 * `selectedOption` ou na última escolhida) e o armazenamento interno quando não controlado.
 */
export function useComboboxSelection({
	defaultValue,
	options,
	selectedOption,
	value,
}: {
	defaultValue: string | null;
	options: readonly AdsComboboxOption[];
	selectedOption: AdsComboboxOption | null | undefined;
	value: string | null | undefined;
}) {
	const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue);
	const selectedValue = value !== undefined ? value : uncontrolledValue;
	const [cachedOption, setCachedOption] = useState<AdsComboboxOption | null>(
		selectedOption ?? null,
	);
	const selected =
		options.find((option) => option.value === selectedValue) ??
		(selectedOption?.value === selectedValue ? selectedOption : null) ??
		(cachedOption?.value === selectedValue ? cachedOption : null);
	return { selected, selectedValue, setCachedOption, setUncontrolledValue };
}

/** Filtro padrão: o rótulo ou o valor contêm a consulta, sem diferenciar maiúsculas. */
export function defaultOptionMatch(option: AdsComboboxOption, query: string) {
	return (
		option.label.toLocaleLowerCase().includes(query) ||
		option.value.toLocaleLowerCase().includes(query)
	);
}

export function enabledIndicesOf(matches: readonly AdsComboboxOption[]) {
	return matches.flatMap((option, index) => (option.disabled ? [] : [index]));
}

/** Próximo índice habilitado, circular; sem destaque, `previous` parte do último. */
export function stepEnabledIndex(
	enabled: readonly number[],
	active: number,
	direction: 'next' | 'previous',
) {
	const position = enabled.indexOf(active);
	const next =
		direction === 'next'
			? (position + 1) % enabled.length
			: position < 0
				? enabled.length - 1
				: (position - 1 + enabled.length) % enabled.length;
	return enabled[next]!;
}

export function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
	if (typeof ref === 'function') ref(node);
	else if (ref) (ref as { current: T | null }).current = node;
}
