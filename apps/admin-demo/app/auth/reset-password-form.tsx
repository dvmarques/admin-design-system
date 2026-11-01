'use client';

import {
	AdsButton,
	AdsField,
	AdsPasswordInput,
	AdsTypography,
	type AdsPasswordRule,
} from '@dvmarques/admin-ds-components';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
	demoAuthNotice,
	passwordMismatchMessage,
	passwordRulesMessage,
	simulatedAuthDelayMs,
} from '../../lib/auth-demo';
import { AuthIntro } from './auth-chrome';

const passwordRules: readonly AdsPasswordRule[] = [
	{
		id: 'length',
		label: 'Pelo menos 8 caracteres',
		test: (value) => value.length >= 8,
	},
	{
		id: 'upper',
		label: 'Uma letra maiúscula',
		test: (value) => /[A-Z]/.test(value),
	},
	{
		id: 'number',
		label: 'Um número',
		test: (value) => /[0-9]/.test(value),
	},
];

function rulesMet(password: string): boolean {
	return passwordRules.every((rule) => rule.test(password));
}

export function ResetPasswordForm() {
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmRef = useRef<HTMLInputElement>(null);
	const statusRef = useRef<HTMLParagraphElement>(null);
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [passwordError, setPasswordError] = useState<string | undefined>();
	const [confirmError, setConfirmError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	// O formulário é desmontado no sucesso; o foco vai para a mensagem para não cair no <body>.
	useEffect(() => {
		if (success) statusRef.current?.focus();
	}, [success]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPasswordError(undefined);
		setConfirmError(undefined);

		if (!rulesMet(password)) {
			setPasswordError(passwordRulesMessage);
			passwordRef.current?.focus();
			return;
		}
		if (password !== confirm) {
			setConfirmError(passwordMismatchMessage);
			confirmRef.current?.focus();
			return;
		}

		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, simulatedAuthDelayMs));
		setLoading(false);
		setSuccess(true);
	}

	// Os campos não têm `name`: um envio nativo (GET) antes da hidratação ou sem JavaScript não
	// leva as senhas para a URL.
	return (
		<div className="demo-auth-form-shell">
			<AuthIntro
				description={`${demoAuthNotice} A nova senha não é salva em lugar algum.`}
				title="Redefinir senha"
			/>
			{success ? (
				<div className="demo-auth-form">
					<p className="demo-auth-status" ref={statusRef} role="status" tabIndex={-1}>
						Senha redefinida com sucesso (simulação). Você pode voltar ao login e entrar novamente
						no demo.
					</p>
					<div className="demo-auth-actions">
						<Link className="demo-auth-link-button" href="/login">
							Voltar ao login
						</Link>
					</div>
				</div>
			) : (
				<form className="demo-auth-form" noValidate onSubmit={handleSubmit}>
					<AdsField
						label="Nova senha"
						validationState={passwordError ? 'error' : 'default'}
						{...(passwordError ? { error: passwordError } : {})}
					>
						<AdsPasswordInput
							autoComplete="new-password"
							onChange={(event) => {
								setPassword(event.target.value);
								setPasswordError(undefined);
							}}
							ref={passwordRef}
							rules={passwordRules}
							showStrength
							value={password}
						/>
					</AdsField>
					<AdsField
						label="Confirmar senha"
						validationState={confirmError ? 'error' : 'default'}
						{...(confirmError ? { error: confirmError } : {})}
					>
						<AdsPasswordInput
							autoComplete="new-password"
							onChange={(event) => {
								setConfirm(event.target.value);
								setConfirmError(undefined);
							}}
							ref={confirmRef}
							showVisibilityToggle
							value={confirm}
						/>
					</AdsField>
					<div className="demo-auth-actions">
						<AdsButton isLoading={loading} type="submit">
							Salvar senha simulada
						</AdsButton>
						<AdsTypography as="p" variant="muted">
							<Link className="demo-auth-inline-link" href="/login">
								Voltar ao login
							</Link>
						</AdsTypography>
					</div>
				</form>
			)}
		</div>
	);
}
