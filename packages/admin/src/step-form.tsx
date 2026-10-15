'use client';

import { AdsButton, AdsProgress } from '@admin-ds/components';
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
	 * (por exemplo `aria-invalid`) são do consumidor, que guarda os dados.
	 */
	validate?: () => boolean;
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

function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}

/**
 * Formulário em etapas controlado pelo consumidor: indicador de progresso, validação por etapa,
 * foco e anúncio da etapa atual e confirmação final. Não envia dados nem usa o roteador.
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

	// Com o alerta visível, revalida depois de cada edição (já com o estado novo do consumidor) e
	// remove o alerta quando a etapa fica válida. Não move o foco.
	const handledEdits = useRef(0);
	useEffect(() => {
		if (edits === handledEdits.current) return;
		handledEdits.current = edits;
		if (!invalid || !active) return;
		if (!active.validate || active.validate()) setInvalid(false);
	}, [edits, invalid, active]);

	if (!active) return null;
	const last = index === total - 1;

	/** Retorna `true` quando a etapa atual é válida; senão, avisa e move o foco. */
	function checkCurrent(): boolean {
		if (!active || !active.validate || active.validate()) {
			setInvalid(false);
			return true;
		}
		setInvalid(true);
		setFailures((count) => count + 1);
		return false;
	}

	function goNext() {
		const next = steps[index + 1];
		if (next && checkCurrent()) onActiveStepChange(next.id);
	}

	function goBack() {
		const previous = steps[index - 1];
		if (previous) onActiveStepChange(previous.id);
	}

	function confirm() {
		if (checkCurrent()) onSubmit();
	}

	return (
		<form
			{...props}
			aria-busy={submitting || undefined}
			className={classNames('ads-step-form', className)}
			noValidate
			// Enter em um campo não envia nem avança: só os botões navegam.
			onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
		>
			<ol aria-label={labels.stepsLabel} className="ads-step-form-steps">
				{steps.map((step, position) => {
					const state =
						position < index ? 'completed' : position === index ? 'current' : 'upcoming';
					return (
						<li
							aria-current={state === 'current' ? 'step' : undefined}
							className="ads-step-form-step"
							data-state={state}
							key={step.id}
						>
							<span aria-hidden="true" className="ads-step-form-marker">
								{position + 1}
							</span>
							<span className="ads-step-form-step-label">{step.label}</span>
							<span className="ads-step-form-visually-hidden">({labels[state]})</span>
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
						onChange={position === index && invalid ? () => setEdits((n) => n + 1) : undefined}
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
						disabled={submitting}
						onClick={onCancel}
						variant="ghost"
					>
						{labels.cancel}
					</AdsButton>
				) : null}
				<AdsButton disabled={submitting || index === 0} onClick={goBack} variant="secondary">
					{labels.back}
				</AdsButton>
				{last ? (
					<AdsButton disabled={submitting} isLoading={submitting} onClick={confirm}>
						{labels.submit}
					</AdsButton>
				) : (
					<AdsButton disabled={submitting} onClick={goNext}>
						{labels.next}
					</AdsButton>
				)}
			</div>
		</form>
	);
}
