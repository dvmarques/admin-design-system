'use client';

import {
	AdsButton,
	AdsField,
	AdsInput,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsToast,
} from '@admin-ds/components';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';

type FieldName = 'nome' | 'email';
type FieldErrors = Partial<Record<FieldName, string>>;

const requiredMessages: Record<FieldName, string> = {
	nome: 'Informe o nome do cliente.',
	email: 'Informe o e-mail do cliente.',
};

const invalidEmailMessage = 'Informe um e-mail válido, como nome@exemplo.com.br.';

/** Local part, `@` and a domain with at least one dot, without spaces. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): FieldErrors {
	const errors: FieldErrors = {};
	for (const field of ['nome', 'email'] as const) {
		if (String(data.get(field) ?? '').trim() === '') errors[field] = requiredMessages[field];
	}
	const email = String(data.get('email') ?? '').trim();
	if (errors.email === undefined && !emailPattern.test(email)) errors.email = invalidEmailMessage;
	return errors;
}

/**
 * Registration form. Nothing is sent or stored: a valid submission only shows a confirmation.
 * `noValidate` keeps the browser from blocking the submit event with its own bubbles, so the
 * errors always appear next to their fields.
 */
export function NewCustomerForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submissions, setSubmissions] = useState(0);
	const [toastOpen, setToastOpen] = useState(false);

	// `aria-invalid` is only present after the errors render, so focus moves in an effect. The
	// submission counter makes it run again when a second submit leaves the errors unchanged.
	useEffect(() => {
		if (submissions === 0) return;
		formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
	}, [submissions]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextErrors = validate(new FormData(event.currentTarget));
		setErrors(nextErrors);
		setSubmissions((count) => count + 1);
		setToastOpen(Object.keys(nextErrors).length === 0);
	}

	function clearError(field: FieldName) {
		setErrors((current) => {
			if (current[field] === undefined) return current;
			const next = { ...current };
			delete next[field];
			return next;
		});
	}

	return (
		<>
			<form className="demo-new-customer-form" noValidate onSubmit={handleSubmit} ref={formRef}>
				<AdsField
					description="Campo obrigatório."
					label="Nome"
					validationState={errors.nome ? 'error' : 'default'}
					{...(errors.nome ? { error: errors.nome } : {})}
				>
					<AdsInput autoComplete="name" name="nome" onChange={() => clearError('nome')} required />
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
						onChange={() => clearError('email')}
						required
						type="email"
					/>
				</AdsField>
				<AdsField label="Status">
					<AdsSelect defaultValue="ativo" name="status">
						<option value="ativo">Ativo</option>
						<option value="pendente">Pendente</option>
						<option value="inativo">Inativo</option>
					</AdsSelect>
				</AdsField>
				<AdsSelectionGroup legend="Periodicidade">
					<AdsRadio defaultChecked label="Mensal" name="periodicidade" value="mensal" />
					<AdsRadio label="Trimestral" name="periodicidade" value="trimestral" />
					<AdsRadio label="Anual" name="periodicidade" value="anual" />
				</AdsSelectionGroup>
				<div className="demo-new-customer-actions">
					<AdsButton type="submit">Cadastrar cliente</AdsButton>
					<Link className="demo-action-link" href="/clientes">
						Cancelar
					</Link>
				</div>
			</form>
			<AdsToast onClose={() => setToastOpen(false)} open={toastOpen} variant="success">
				Cliente cadastrado com sucesso.
			</AdsToast>
		</>
	);
}
