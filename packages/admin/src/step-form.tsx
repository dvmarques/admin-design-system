'use client';

import { AdsButton, AdsLoadingIndicator, AdsProgress } from '@dvmarques/admin-ds-components';
import {
	useEffect,
	useId,
	useRef,
	useState,
	type FormEvent,
	type FormHTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';

export interface AdsStepDefinition {
	/** Identificador estável, usado em `activeStepId`. */
	id: string;
	/** Título da etapa: indicador, título da seção e anúncio. */
	label: string;
	description?: ReactNode;
	/** Campos da etapa. Permanece montado (oculto) enquanto a etapa não está ativa. */
	content: ReactNode;
	/**
	 * Valida a etapa ao avançar ou confirmar. Retorne `false` para bloquear; os erros dos campos
	 * (por exemplo `aria-invalid`) são do consumidor, que guarda os dados. Pode retornar uma
	 * `Promise`: o formulário fica ocupado até ela resolver, e uma rejeição conta como `false`.
	 * Um retorno síncrono é tratado de forma síncrona.
	 */
	validate?: () => boolean | Promise<boolean>;
}

/** Textos da interface; os padrões estão em pt-BR. `{current}`, `{total}` e `{label}` são substituídos. */
export interface AdsStepFormLabels {
	stepsLabel: string;
	stepOf: string;
	stepAnnouncement: string;
	completed: string;
	current: string;
	upcoming: string;
	back: string;
	next: string;
	submit: string;
	cancel: string;
	invalidStep: string;
	validating: string;
}

const defaultLabels: AdsStepFormLabels = {
	stepsLabel: 'Etapas',
	stepOf: 'Etapa {current} de {total}',
	stepAnnouncement: 'Etapa {current} de {total}: {label}',
	completed: 'concluída',
	current: 'etapa atual',
	upcoming: 'pendente',
	back: 'Voltar',
	next: 'Próxima',
	submit: 'Confirmar',
	cancel: 'Cancelar',
	invalidStep: 'Corrija os campos desta etapa para continuar.',
	validating: 'Validando a etapa…',
};

export interface AdsStepFormProps extends Omit<
	FormHTMLAttributes<HTMLFormElement>,
	'children' | 'onSubmit'
> {
	steps: readonly AdsStepDefinition[];
	/** Etapa ativa. Se não existir em `steps`, a primeira é usada. */
	activeStepId: string;
	/** Recebe o id da etapa de destino; o consumidor atualiza `activeStepId`. */
	onActiveStepChange: (id: string) => void;
	/** Chamado pela confirmação final, depois de `validate` da última etapa. */
	onSubmit: () => void;
	onCancel?: () => void;
	/** Desabilita as ações e define `aria-busy`. */
	submitting?: boolean;
	labels?: Partial<AdsStepFormLabels>;
	/** Nome acessível do formulário. */
	'aria-label'?: string;
}

function isThenable(value: unknown): value is PromiseLike<boolean> {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as { then?: unknown }).then === 'function'
	);
}

/** Valores dos campos nativos da etapa, para detectar mudanças feitas sem evento `change`. */
function fieldSnapshot(section: HTMLElement | null | undefined): string {
	if (!section) return '';
	return JSON.stringify(
		Array.from(section.querySelectorAll<HTMLInputElement>('input, select, textarea')).map(
			(field) =>
				field.type === 'checkbox' || field.type === 'radio' ? field.checked : field.value,
		),
	);
}

function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}

/**
 * Formulário em etapas controlado pelo consumidor: indicador de progresso, validação por etapa,
 * foco e anúncio da etapa atual e confirmação final. O indicador navega para etapas anteriores e
 * para as já validadas ao avançar. Não envia dados nem usa o roteador.
 */
export function AdsStepForm({
	activeStepId,
	className,
	labels: labelOverrides,
	onActiveStepChange,
	onCancel,
	onSubmit,
	steps,
	submitting = false,
	...props
}: AdsStepFormProps) {
	const labels = { ...defaultLabels, ...labelOverrides };
	const baseId = useId().replace(/[^\w-]/g, '');
	const total = steps.length;
	const found = steps.findIndex((step) => step.id === activeStepId);
	const index = found === -1 ? 0 : found;
	const active = steps[index];
	const [invalid, setInvalid] = useState(false);
	/** Incrementa a cada falha de validação; o foco é movido depois da renderização do consumidor. */
	const [failures, setFailures] = useState(0);
	const [announcement, setAnnouncement] = useState('');
	/** Validação assíncrona em andamento; a ação que a iniciou mostra o carregamento. */
	const [validating, setValidating] = useState<'next' | 'submit' | null>(null);
	const validatingRef = useRef(false);
	/** Invalida resultados assíncronos obsoletos (etapa mudou ou componente desmontou). */
	const runToken = useRef(0);
	const silentToken = useRef(0);
	/** Etapas que passaram por `validate` ao avançar; editar a etapa remove a marca. */
	const validated = useRef(new Set<string>());
	const [, setValidatedVersion] = useState(0);
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
	const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
	const previousId = useRef<string | undefined>(active?.id);
	const handledFailures = useRef(0);
	/** Incrementa quando um campo da etapa inválida muda; a etapa é revalidada depois do render. */
	const [edits, setEdits] = useState(0);
	const stepAnnouncement = labels.stepAnnouncement;

	// Dependências completas: as guardas (`previousId`, `handledFailures`) evitam repetir o foco
	// quando só a identidade de `steps` ou dos textos muda.
	useEffect(() => {
		if (!active || previousId.current === active.id) return;
		previousId.current = active.id;
		runToken.current += 1;
		silentToken.current += 1;
		validatingRef.current = false;
		setValidating(null);
		setInvalid(false);
		setAnnouncement(fill(stepAnnouncement, { current: index + 1, total, label: active.label }));
		headingRefs.current[active.id]?.focus();
	}, [active, index, total, stepAnnouncement]);

	useEffect(() => {
		if (failures === handledFailures.current || !active) return;
		handledFailures.current = failures;
		const section = sectionRefs.current[active.id];
		const field = section?.querySelector<HTMLElement>('[aria-invalid="true"]');
		(field ?? headingRefs.current[active.id])?.focus();
	}, [failures, active]);

	useEffect(
		() => () => {
			runToken.current += 1;
			silentToken.current += 1;
		},
		[],
	);

	// Os campos não podem ser editados enquanto a validação assíncrona decide sobre os dados que
	// ela recebeu. `inert` por atributo (e não pela prop) para funcionar também no React 18.
	useEffect(() => {
		if (validating === null) return;
		const sections = Object.values(sectionRefs.current).filter(
			(section): section is HTMLElement => section !== null,
		);
		for (const section of sections) section.setAttribute('inert', '');
		return () => {
			for (const section of sections) section.removeAttribute('inert');
		};
	}, [validating]);

	// Com o alerta visível, revalida depois de cada edição (já com o estado novo do consumidor) e
	// remove o alerta quando a etapa fica válida. Não move o foco.
	const handledEdits = useRef(0);
	useEffect(() => {
		if (edits === handledEdits.current) return;
		handledEdits.current = edits;
		if (!invalid || !active) return;
		const result = active.validate ? active.validate() : true;
		if (!isThenable(result)) {
			if (result) setInvalid(false);
			return;
		}
		const token = ++silentToken.current;
		const id = active.id;
		result.then(
			(ok) => {
				if (ok && token === silentToken.current && previousId.current === id) setInvalid(false);
			},
			() => {},
		);
	}, [edits, invalid, active]);

	if (!active) return null;
	const last = index === total - 1;

	function markValid(id: string) {
		if (validated.current.has(id)) return;
		validated.current.add(id);
		setValidatedVersion((n) => n + 1);
	}

	function markEdited(id: string) {
		if (validated.current.delete(id)) setValidatedVersion((n) => n + 1);
	}

	/** Os dados mudaram durante a validação: o resultado pendente é obsoleto e fica descartado. */
	function cancelValidation() {
		if (!validatingRef.current) return;
		runToken.current += 1;
		validatingRef.current = false;
		setValidating(null);
		setAnnouncement('');
	}

	function finish(ok: boolean, then: () => void) {
		if (ok) {
			if (active) markValid(active.id);
			setInvalid(false);
			then();
			return;
		}
		setInvalid(true);
		setFailures((count) => count + 1);
	}

	/** Valida a etapa atual e chama `then` se válida; senão, avisa e move o foco. */
	function checkCurrent(action: 'next' | 'submit', then: () => void) {
		if (!active || validatingRef.current) return;
		const result = active.validate ? active.validate() : true;
		if (!isThenable(result)) {
			finish(result, then);
			return;
		}
		const token = ++runToken.current;
		const stepId = active.id;
		const before = fieldSnapshot(sectionRefs.current[stepId]);
		validatingRef.current = true;
		setValidating(action);
		setAnnouncement(labels.validating);
		result
			.then(
				(ok) => ok,
				() => false,
			)
			.then((ok) => {
				if (token !== runToken.current) return;
				validatingRef.current = false;
				setValidating(null);
				setAnnouncement('');
				// Valores alterados por código durante a espera: o resultado vale para dados antigos.
				if (fieldSnapshot(sectionRefs.current[stepId]) !== before) return;
				finish(ok, then);
			});
	}

	function goNext() {
		const next = steps[index + 1];
		if (next) checkCurrent('next', () => onActiveStepChange(next.id));
	}

	function goBack() {
		const previous = steps[index - 1];
		if (previous && !validatingRef.current) onActiveStepChange(previous.id);
	}

	function confirm() {
		checkCurrent('submit', onSubmit);
	}

	/** Anteriores sempre; posteriores só se a atual e as intermediárias já foram validadas. */
	function canNavigate(position: number) {
		if (submitting || validating || position === index) return false;
		if (position < index) return true;
		for (let i = index; i < position; i += 1) {
			const step = steps[i];
			if (!step || !validated.current.has(step.id)) return false;
		}
		return true;
	}

	function goTo(position: number) {
		const target = steps[position];
		if (target && canNavigate(position)) onActiveStepChange(target.id);
	}

	return (
		<form
			{...props}
			aria-busy={submitting || validating !== null || undefined}
			className={classNames('ads-step-form', className)}
			noValidate
			// Enter em um campo não envia nem avança: só os botões navegam.
			onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
		>
			<ol aria-label={labels.stepsLabel} className="ads-step-form-steps">
				{steps.map((step, position) => {
					const state =
						position < index ? 'completed' : position === index ? 'current' : 'upcoming';
					const content = (
						<>
							<span aria-hidden="true" className="ads-step-form-marker">
								{position + 1}
							</span>
							<span className="ads-step-form-step-label">{step.label}</span>
							<span className="ads-step-form-visually-hidden">({labels[state]})</span>
						</>
					);
					return (
						<li
							aria-current={state === 'current' ? 'step' : undefined}
							className="ads-step-form-step"
							data-state={state}
							key={step.id}
						>
							{canNavigate(position) ? (
								<button
									className="ads-step-form-step-button"
									onClick={() => goTo(position)}
									type="button"
								>
									{content}
								</button>
							) : (
								content
							)}
						</li>
					);
				})}
			</ol>
			<AdsProgress
				label={fill(labels.stepOf, { current: index + 1, total })}
				max={total}
				min={0}
				value={index + 1}
			/>
			<div aria-live="polite" className="ads-step-form-visually-hidden" role="status">
				{announcement}
			</div>
			{steps.map((step, position) => {
				const headingId = `${baseId}-${step.id.replace(/[^\w-]/g, '')}-${position}`;
				return (
					<section
						aria-labelledby={headingId}
						className="ads-step-form-panel"
						hidden={position !== index}
						key={step.id}
						onChange={
							position === index
								? () => {
										cancelValidation();
										markEdited(step.id);
										if (invalid) setEdits((n) => n + 1);
									}
								: undefined
						}
						ref={(node) => {
							sectionRefs.current[step.id] = node;
						}}
					>
						<h2
							className="ads-step-form-heading"
							id={headingId}
							ref={(node) => {
								headingRefs.current[step.id] = node;
							}}
							tabIndex={-1}
						>
							{step.label}
						</h2>
						{step.description ? (
							<p className="ads-step-form-description">{step.description}</p>
						) : null}
						{step.content}
					</section>
				);
			})}
			{invalid ? (
				<p className="ads-step-form-error" role="alert">
					{labels.invalidStep}
				</p>
			) : null}
			<div className="ads-step-form-actions">
				{onCancel ? (
					<AdsButton
						className="ads-step-form-cancel"
						aria-disabled={validating !== null || undefined}
						disabled={submitting}
						onClick={() => {
							if (!validatingRef.current) onCancel();
						}}
						variant="ghost"
					>
						{labels.cancel}
					</AdsButton>
				) : null}
				<AdsButton
					aria-disabled={validating !== null || undefined}
					disabled={submitting || index === 0}
					onClick={goBack}
					variant="secondary"
				>
					{labels.back}
				</AdsButton>
				{last ? (
					<AdsButton
						aria-disabled={validating !== null || undefined}
						disabled={submitting}
						isLoading={submitting}
						onClick={confirm}
					>
						{validating === 'submit' ? <AdsLoadingIndicator aria-hidden="true" size="sm" /> : null}
						{labels.submit}
					</AdsButton>
				) : (
					<AdsButton
						aria-disabled={validating !== null || undefined}
						disabled={submitting}
						onClick={goNext}
					>
						{validating === 'next' ? <AdsLoadingIndicator aria-hidden="true" size="sm" /> : null}
						{labels.next}
					</AdsButton>
				)}
			</div>
		</form>
	);
}
