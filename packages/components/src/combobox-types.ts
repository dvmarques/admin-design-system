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
	value?: string | null;
	defaultValue?: string | null;
	/** Emitido ao solicitar outra opção. Não é emitido ao escolher a opção já confirmada. */
	onValueChange?: (value: string | null, option: AdsComboboxOption | null) => void;
	selectedOption?: AdsComboboxOption | null;
	/** Consulta de pesquisa (não o valor selecionado). */
	inputValue?: string;
	defaultInputValue?: string;
	onInputValueChange?: (query: string, reason: AdsComboboxQueryReason) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * Com `false`, pedir outra opção emite `onValueChange` sem fechar o painel; use `value`
	 * controlado para confirmar. Escolher a opção já confirmada sempre fecha.
	 */
	closeOnSelect?: boolean;
	/** Campo de pesquisa separado (padrão `true`). Sem ele, a lista recebe o foco. */
	searchable?: boolean;
	/** Filtro por opção; por padrão, rótulo ou valor contêm a consulta. */
	filterOption?: (option: AdsComboboxOption, query: string) => boolean;
	/** Com `false`, `options` já chegam filtradas (por exemplo, por busca remota). */
	filterOptions?: boolean;
	renderOption?: (option: AdsComboboxOption) => ReactNode;
	showOptionVisuals?: boolean;
	/** Substitui o botão padrão. Deve devolver um único elemento com `triggerProps` espalhadas. */
	renderTrigger?: (context: AdsComboboxTriggerContext) => ReactElement;
	/** Conteúdo do painel fora da `listbox` (ações, links). */
	footer?: ReactNode;
	triggerRef?: Ref<HTMLButtonElement>;
	searchInputRef?: Ref<HTMLInputElement>;
	loading?: boolean;
	error?: ReactNode;
	emptyText?: string;
	loadingText?: string;
	retryLabel?: string;
	onRetry?: () => void;
	/** Mensagem adicional anunciada na região viva do painel (por exemplo, operação pendente). */
	statusMessage?: string;
	/** Rótulo acessível do painel (diálogo). */
	panelLabel?: string;
	/** Rótulo acessível do campo de pesquisa. */
	searchLabel?: string;
	searchPlaceholder?: string;
	/** Rótulo acessível da lista de opções. */
	listLabel?: string;
	/** Texto do botão padrão sem seleção. */
	placeholder?: string;
	panelClassName?: string;
	placement?: 'top' | 'right' | 'bottom' | 'left';
	/** Alinhamento do painel ao gatilho (padrão `start`). */
	align?: 'start' | 'center';
	size?: AdsFormSize;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	id?: string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	'aria-invalid'?: boolean | 'false' | 'true';
}
