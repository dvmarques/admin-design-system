'use client';

import {
	useRef,
	useState,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactElement,
} from 'react';
import { classNames } from './class-names.js';
import { AdsDropdown } from './dropdown.js';
import { AdsIcon, type AdsIconName } from './icon.js';
import { AdsTooltip, type AdsOverlayPlacement } from './overlay-anchored.js';

/** A escolha da pessoa; `system` deixa a aplicação seguir o esquema de cores do sistema. */
export type AdsThemePreference = 'light' | 'dark' | 'system';
export type AdsThemeControlVariant = 'menu' | 'group';
export type AdsThemeControlOptionDisplay = 'icon' | 'icon-text';

export interface AdsThemeControlLabels {
	/** Nome do controle (grupo e gatilho). */
	group?: string;
	light?: string;
	dark?: string;
	system?: string;
}

export interface AdsThemeControlProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'defaultValue' | 'onChange'
> {
	/** Preferência inicial quando `value` não é informado. */
	defaultValue?: AdsThemePreference;
	disabled?: boolean;
	labels?: AdsThemeControlLabels;
	onValueChange?: (value: AdsThemePreference) => void;
	/** `icon` (padrão) mostra só ícones, com nome acessível e tooltip; `icon-text` acrescenta o texto. */
	optionDisplay?: AdsThemeControlOptionDisplay;
	/** Tooltips nas opções só com ícone. */
	tooltips?: boolean;
	/** Preferência controlada pela aplicação. */
	value?: AdsThemePreference;
	/** `menu` (padrão): botão compacto que abre as opções. `group`: opções inline. */
	variant?: AdsThemeControlVariant;
}

const options: readonly { icon: AdsIconName; value: AdsThemePreference }[] = [
	{ icon: 'sun', value: 'light' },
	{ icon: 'moon', value: 'dark' },
	{ icon: 'monitor', value: 'system' },
];

const defaultLabels = {
	group: 'Tema',
	light: 'Claro',
	dark: 'Escuro',
	system: 'Sistema',
} satisfies Required<AdsThemeControlLabels>;

const optionBase =
	'ads-theme-control-option relative inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-md border-0 px-2 [font-family:inherit] text-sm font-medium transition-[background-color,color] duration-[var(--ads-motion-fast)] ease-[var(--ads-motion-easing)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50';
const optionIdle = 'bg-transparent text-text hover:bg-surface-hover';
const optionSelected = 'bg-surface-selected! text-on-surface-selected!';

function SelectedMark({ floating }: { floating: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={classNames(
				'ads-theme-control-check inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary p-px text-[var(--ads-color-on-primary)]',
				floating ? 'absolute -right-0.5 -top-0.5' : 'ml-auto',
			)}
		>
			<AdsIcon className="h-full! w-full!" name="check" size="sm" />
		</span>
	);
}

function MaybeTooltip({
	children,
	content,
	enabled,
	placement = 'top',
	showOnFocus = true,
}: {
	children: ReactElement;
	content: string;
	enabled: boolean;
	placement?: AdsOverlayPlacement;
	showOnFocus?: boolean;
}) {
	return enabled ? (
		<AdsTooltip content={content} placement={placement} showOnFocus={showOnFocus}>
			{children}
		</AdsTooltip>
	) : (
		children
	);
}

/**
 * Seletor de preferência de tema (Claro, Escuro ou Sistema). Só apresenta e emite a escolha: a
 * aplicação persiste, resolve `system` e aplica o tema.
 */
export function AdsThemeControl({
	className,
	defaultValue = 'system',
	disabled = false,
	labels,
	onValueChange,
	optionDisplay = 'icon',
	tooltips = true,
	value,
	variant = 'menu',
	...props
}: AdsThemeControlProps) {
	const [internalValue, setInternalValue] = useState<AdsThemePreference>(defaultValue);
	const current = value ?? internalValue;
	const text = { ...defaultLabels, ...labels };
	const iconOnly = optionDisplay === 'icon';
	const optionRefs = useRef<Partial<Record<AdsThemePreference, HTMLButtonElement | null>>>({});

	const select = (next: AdsThemePreference) => {
		if (next === current) return;
		if (value === undefined) setInternalValue(next);
		onValueChange?.(next);
	};

	if (variant === 'group') {
		const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
			const keys: Record<string, number> = {
				ArrowRight: index + 1,
				ArrowDown: index + 1,
				ArrowLeft: index - 1,
				ArrowUp: index - 1,
				Home: 0,
				End: options.length - 1,
			};
			if (!(event.key in keys)) return;
			event.preventDefault();
			const target = options[(keys[event.key]! + options.length) % options.length]!;
			select(target.value);
			optionRefs.current[target.value]?.focus();
		};

		return (
			<div
				aria-disabled={disabled || undefined}
				aria-label={text.group}
				{...props}
				className={classNames(
					'ads-theme-control ads-theme-control-group inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-surface p-1 font-sans',
					className,
				)}
				role="radiogroup"
			>
				{options.map((option, index) => {
					const selected = option.value === current;
					return (
						<MaybeTooltip
							content={text[option.value]}
							enabled={tooltips && iconOnly}
							key={option.value}
						>
							<button
								aria-checked={selected}
								aria-label={iconOnly ? text[option.value] : undefined}
								className={classNames(optionBase, selected ? optionSelected : optionIdle)}
								disabled={disabled}
								onClick={() => select(option.value)}
								onKeyDown={(event) => move(event, index)}
								ref={(node) => {
									optionRefs.current[option.value] = node;
								}}
								role="radio"
								tabIndex={selected ? 0 : -1}
								type="button"
							>
								<AdsIcon name={option.icon} />
								{iconOnly ? null : <span>{text[option.value]}</span>}
								{selected ? <SelectedMark floating={iconOnly} /> : null}
							</button>
						</MaybeTooltip>
					);
				})}
			</div>
		);
	}

	const currentOption = options.find((option) => option.value === current) ?? options[2]!;
	const triggerLabel = `${text.group}: ${text[currentOption.value]}`;

	return (
		<AdsDropdown {...props} className={classNames('ads-theme-control', className)}>
			<MaybeTooltip content={triggerLabel} enabled={tooltips}>
				<AdsDropdown.Trigger
					aria-haspopup="menu"
					aria-label={triggerLabel}
					className="ads-theme-control-trigger min-h-10! min-w-10! px-0!"
					disabled={disabled}
				>
					<AdsIcon name={currentOption.icon} />
				</AdsDropdown.Trigger>
			</MaybeTooltip>
			<AdsDropdown.Content
				aria-label={text.group}
				className={iconOnly ? 'flex min-w-0 flex-col' : undefined}
			>
				{options.map((option) => {
					const selected = option.value === current;
					return (
						<MaybeTooltip
							content={text[option.value]}
							enabled={tooltips && iconOnly}
							key={option.value}
							placement="left"
							// Dentro do menu o foco já anuncia o nome; assim Escape fecha o menu de uma vez.
							showOnFocus={false}
						>
							<AdsDropdown.Item
								aria-checked={selected}
								aria-label={iconOnly ? text[option.value] : undefined}
								className={classNames(
									'ads-theme-control-option relative min-h-10 gap-2',
									iconOnly ? 'justify-center px-2' : undefined,
									selected ? optionSelected : undefined,
								)}
								onSelect={() => select(option.value)}
								role="menuitemradio"
							>
								<AdsIcon name={option.icon} />
								{iconOnly ? null : <span>{text[option.value]}</span>}
								{selected ? <SelectedMark floating={iconOnly} /> : null}
							</AdsDropdown.Item>
						</MaybeTooltip>
					);
				})}
			</AdsDropdown.Content>
		</AdsDropdown>
	);
}
