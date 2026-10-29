import type {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
	ReactElement,
	ReactNode,
	Ref,
} from 'react';
import type { AdsIconName } from './icon.js';
import type { AdsFormControlBase, AdsFormSize } from './form-types.js';

export interface AdsComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	description?: string;
	icon?: AdsIconName;
	avatar?: { src?: string | undefined; fallback: string };
}

export type AdsComboboxInputReason = 'input' | 'select' | 'clear';

/** Motivo da mudança da consulta na apresentação `popover`: digitação, seleção ou fechamento. */
export type AdsComboboxQueryReason = 'input' | 'select' | 'close';

export interface AdsComboboxProps
	extends
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'children' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'name' | 'className'
		>,
		AdsFormControlBase {
	/** Campo editável com lista de sugestões (padrão). */
	presentation?: 'input';
	options: readonly AdsComboboxOption[];
	value?: string | null;
	defaultValue?: string | null;
	onValueChange?: (value: string | null, option: AdsComboboxOption | null) => void;
	inputValue?: string;
	defaultInputValue?: string;
	onInputValueChange?: (text: string, reason: AdsComboboxInputReason) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	renderOption?: (option: AdsComboboxOption) => ReactNode;
	showOptionVisuals?: boolean;
	filterOptions?: boolean;
	loading?: boolean;
	error?: ReactNode;
	emptyText?: string;
	loadingText?: string;
	clearLabel?: string;
	clearable?: boolean;
	size?: AdsFormSize;
	name?: string;
	selectedOption?: AdsComboboxOption | null;
	onRetry?: () => void;
}

/** Contexto entregue a `renderTrigger` na apresentação `popover`. */
export interface AdsComboboxTriggerContext {
	open: boolean;
	selectedOption: AdsComboboxOption | null;
	disabled: boolean;
	/** Verdadeiro após uma validação de formulário falha por falta de seleção. */
	invalid: boolean;
	/**
	 * Propriedades do botão: ARIA, `type="button"`, `disabled`, `ref` e o único manipulador de
	 * abertura (`onClick`). Espalhe-as em **um** elemento `<button>`; não adicione outro toggle.
	 */
	triggerProps: ButtonHTMLAttributes<HTMLButtonElement> & { ref: Ref<HTMLButtonElement> };
}

/** Apresentação botão → painel com pesquisa separada e lista de seleção única. */
export interface AdsComboboxPopoverProps extends AdsFormControlBase {
	presentation: 'popover';
	options: readonly AdsComboboxOption[];
	value?: string | null | undefined;
	defaultValue?: string | null | undefined;
	/** Emitido ao solicitar outra opção. Não é emitido ao escolher a opção já confirmada. */
	onValueChange?: ((value: string | null, option: AdsComboboxOption | null) => void) | undefined;
	selectedOption?: AdsComboboxOption | null | undefined;
	/** Consulta de pesquisa (não o valor selecionado). */
	inputValue?: string | undefined;
	defaultInputValue?: string | undefined;
	onInputValueChange?: ((query: string, reason: AdsComboboxQueryReason) => void) | undefined;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	/**
	 * Com `false`, pedir outra opção emite `onValueChange` sem fechar o painel; use `value`
	 * controlado para confirmar. Escolher a opção já confirmada sempre fecha.
	 */
	closeOnSelect?: boolean | undefined;
	/** Campo de pesquisa separado (padrão `true`). Sem ele, a lista recebe o foco. */
	searchable?: boolean | undefined;
	/** Filtro por opção; por padrão, rótulo ou valor contêm a consulta. */
	filterOption?: ((option: AdsComboboxOption, query: string) => boolean) | undefined;
	/** Com `false`, `options` já chegam filtradas (por exemplo, por busca remota). */
	filterOptions?: boolean | undefined;
	renderOption?: ((option: AdsComboboxOption) => ReactNode) | undefined;
	showOptionVisuals?: boolean | undefined;
	/** Substitui o botão padrão. Deve devolver um único elemento com `triggerProps` espalhadas. */
	renderTrigger?: ((context: AdsComboboxTriggerContext) => ReactElement) | undefined;
	/** Conteúdo do painel fora da `listbox` (ações, links). */
	footer?: ReactNode | undefined;
	triggerRef?: Ref<HTMLButtonElement> | undefined;
	searchInputRef?: Ref<HTMLInputElement> | undefined;
	loading?: boolean | undefined;
	error?: ReactNode | undefined;
	emptyText?: string | undefined;
	loadingText?: string | undefined;
	retryLabel?: string | undefined;
	onRetry?: (() => void) | undefined;
	/** Mensagem adicional anunciada na região viva do painel (por exemplo, operação pendente). */
	statusMessage?: string | undefined;
	/** Rótulo acessível do painel (diálogo). */
	panelLabel?: string | undefined;
	/** Rótulo acessível do campo de pesquisa. */
	searchLabel?: string | undefined;
	searchPlaceholder?: string | undefined;
	/** Rótulo acessível da lista de opções. */
	listLabel?: string | undefined;
	/** Texto do botão padrão sem seleção. */
	placeholder?: string | undefined;
	panelClassName?: string | undefined;
	placement?: 'top' | 'right' | 'bottom' | 'left' | undefined;
	/** Alinhamento do painel ao gatilho (padrão `start`). */
	align?: 'start' | 'center' | undefined;
	size?: AdsFormSize | undefined;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	required?: boolean | undefined;
	name?: string | undefined;
	form?: string | undefined;
	id?: string | undefined;
	'aria-label'?: string | undefined;
	'aria-labelledby'?: string | undefined;
	'aria-describedby'?: string | undefined;
	'aria-invalid'?: boolean | 'false' | 'true' | undefined;
}
