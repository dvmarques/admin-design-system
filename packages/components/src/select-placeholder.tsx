'use client';

import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ChangeEvent,
	type ComponentPropsWithoutRef,
} from 'react';

export type AdsSelectValue = ComponentPropsWithoutRef<'select'>['value'] | null;

export interface AdsSelectPlaceholderProps extends Omit<
	ComponentPropsWithoutRef<'select'>,
	'value' | 'defaultValue' | 'placeholder' | 'multiple'
> {
	placeholder: string;
	value?: AdsSelectValue;
	defaultValue?: AdsSelectValue;
}

const placeholderAttribute = 'data-ads-select-placeholder';
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

function toKey(value: AdsSelectValue) {
	return value === null || value === undefined ? '' : String(value);
}

/** Seleção simples com ausência de escolha: a primeira opção, vazia e desabilitada, é a *placeholder label option* nativa; a opção real `""` é distinguida por identidade. */
export function AdsSelectPlaceholder({
	children,
	defaultValue,
	onChange,
	placeholder,
	value,
	...props
}: AdsSelectPlaceholderProps) {
	const ref = useRef<HTMLSelectElement>(null);
	const mounted = useRef(false);
	const [, refresh] = useState(0);
	const controlled = value !== undefined;
	const current = controlled ? value : defaultValue;
	// Ausência não é repassada ao React; ele selecionaria também a opção real de valor vazio.
	const initial = current === null || current === undefined ? undefined : toKey(current);

	useIsomorphicLayoutEffect(() => {
		const select = ref.current;
		if (!select) return;
		const options = Array.from(select.options);
		const empty = options.find((option) => option.hasAttribute(placeholderAttribute));
		if (!empty) return;
		// Desabilitada só após a montagem: o HTML do servidor nunca marca `selected` em duas opções vazias.
		empty.disabled = true;
		const realEmpty = options.find((option) => option !== empty && option.value === '');
		if (controlled || !mounted.current) {
			const key = toKey(current);
			const target =
				current === null || current === undefined
					? empty
					: key === ''
						? (realEmpty ?? empty)
						: (options.find((option) => option !== empty && option.value === key) ?? empty);
			if (!controlled) {
				// O reset nativo restaura `defaultSelected`.
				empty.defaultSelected = target === empty;
				target.defaultSelected = true;
			}
			if (!target.selected) target.selected = true;
		}
		mounted.current = true;
	});

	useEffect(() => {
		const form = ref.current?.form;
		if (!controlled || !form) return;
		// Controlado: após o reset nativo a seleção volta ao valor das props.
		const onReset = () => setTimeout(() => refresh((count) => count + 1), 0);
		form.addEventListener('reset', onReset);
		return () => form.removeEventListener('reset', onReset);
	}, [controlled]);

	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		onChange?.(event);
		// Reaplica o valor controlado quando o consumidor não o atualiza.
		if (controlled) refresh((count) => count + 1);
	}

	return (
		<select {...props} defaultValue={initial} onChange={handleChange} ref={ref}>
			<option data-ads-select-placeholder="" value="">
				{placeholder}
			</option>
			{children}
		</select>
	);
}
