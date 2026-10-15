'use client';

import { AdsStepForm, type AdsStepDefinition } from '@admin-ds/admin';
import {
	AdsField,
	AdsInput,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsToast,
	AdsTypography,
} from '@admin-ds/components';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type FieldName = 'nome' | 'email';
type FieldErrors = Partial<Record<FieldName, string>>;

const requiredMessages: Record<FieldName, string> = {
	nome: 'Informe o nome do cliente.',
	email: 'Informe o e-mail do cliente.',
};

const invalidEmailMessage = 'Informe um e-mail válido, como nome@exemplo.com.br.';

/** Local part, `@` and a domain with at least one dot, without spaces. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentity(nome: string, email: string): FieldErrors {
	const errors: FieldErrors = {};
	if (nome.trim() === '') errors.nome = requiredMessages.nome;
	if (email.trim() === '') errors.email = requiredMessages.email;
	else if (!emailPattern.test(email.trim())) errors.email = invalidEmailMessage;
	return errors;
}

/**
 * Registration form in steps. Nothing is sent or stored: a valid submission only shows a
 * confirmation toast.
 */
export function NewCustomerForm() {
	const router = useRouter();
	const [step, setStep] = useState('dados');
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState('ativo');
	const [periodicidade, setPeriodicidade] = useState('mensal');
	const [errors, setErrors] = useState<FieldErrors>({});
	const [toastOpen, setToastOpen] = useState(false);

	function clearError(field: FieldName) {
		setErrors((current) => {
			if (current[field] === undefined) return current;
			const next = { ...current };
			delete next[field];
			return next;
		});
	}

	const steps = useMemo((): AdsStepDefinition[] => {
		return [
			{
				id: 'dados',
				label: 'Dados do cliente',
				validate: () => {
					const nextErrors = validateIdentity(nome, email);
					setErrors(nextErrors);
					return Object.keys(nextErrors).length === 0;
				},
				content: (
					<>
						<AdsField
							description="Campo obrigatório."
							label="Nome"
							validationState={errors.nome ? 'error' : 'default'}
							{...(errors.nome ? { error: errors.nome } : {})}
						>
							<AdsInput
								autoComplete="name"
								name="nome"
								onChange={(event) => {
									setNome(event.target.value);
									clearError('nome');
								}}
								required
								value={nome}
							/>
						</AdsField>
						<AdsField
							description="Campo obrigatório."
							label="E-mail"
							validationState={errors.email ? 'error' : 'default'}
							{...(errors.email ? { error: errors.email } : {})}
						>
							<AdsInput
								autoComplete="email"
								name="email"
								onChange={(event) => {
									setEmail(event.target.value);
									clearError('email');
								}}
								required
								type="email"
								value={email}
							/>
						</AdsField>
					</>
				),
			},
			{
				id: 'plano',
				label: 'Plano e status',
				content: (
					<>
						<AdsField label="Status">
							<AdsSelect
								name="status"
								onChange={(event) => setStatus(event.target.value)}
								value={status}
							>
								<option value="ativo">Ativo</option>
								<option value="pendente">Pendente</option>
								<option value="inativo">Inativo</option>
							</AdsSelect>
						</AdsField>
						<AdsSelectionGroup legend="Periodicidade">
							<AdsRadio
								checked={periodicidade === 'mensal'}
								label="Mensal"
								name="periodicidade"
								onChange={() => setPeriodicidade('mensal')}
								value="mensal"
							/>
							<AdsRadio
								checked={periodicidade === 'trimestral'}
								label="Trimestral"
								name="periodicidade"
								onChange={() => setPeriodicidade('trimestral')}
								value="trimestral"
							/>
							<AdsRadio
								checked={periodicidade === 'anual'}
								label="Anual"
								name="periodicidade"
								onChange={() => setPeriodicidade('anual')}
								value="anual"
							/>
						</AdsSelectionGroup>
					</>
				),
			},
			{
				id: 'revisao',
				label: 'Revisão',
				content: (
					<div className="demo-new-customer-review">
						<AdsTypography variant="muted">Confira os dados antes de cadastrar.</AdsTypography>
						<dl>
							<div>
								<dt>Nome</dt>
								<dd>{nome.trim() || '—'}</dd>
							</div>
							<div>
								<dt>E-mail</dt>
								<dd>{email.trim() || '—'}</dd>
							</div>
							<div>
								<dt>Status</dt>
								<dd>{status}</dd>
							</div>
							<div>
								<dt>Periodicidade</dt>
								<dd>{periodicidade}</dd>
							</div>
						</dl>
					</div>
				),
			},
		];
	}, [email, errors.email, errors.nome, nome, periodicidade, status]);

	function handleSubmit() {
		const nextErrors = validateIdentity(nome, email);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			setStep('dados');
			return;
		}
		setToastOpen(true);
	}

	return (
		<>
			<AdsStepForm
				activeStepId={step}
				aria-label="Cadastro de cliente"
				className="demo-new-customer-form"
				labels={{ submit: 'Cadastrar cliente' }}
				onActiveStepChange={setStep}
				onCancel={() => router.push('/clientes')}
				onSubmit={handleSubmit}
				steps={steps}
			/>
			<AdsToast onClose={() => setToastOpen(false)} open={toastOpen} variant="success">
				Cliente cadastrado com sucesso.
			</AdsToast>
		</>
	);
}
