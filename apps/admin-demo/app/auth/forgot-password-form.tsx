'use client';

import { AdsButton, AdsField, AdsInput, AdsTypography } from '@dvmarques/admin-ds-components';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
	demoAuthNotice,
	invalidEmailMessage,
	isValidEmail,
	requiredEmailMessage,
	simulatedAuthDelayMs,
} from '../../lib/auth-demo';
import { AuthIntro } from './auth-chrome';

export function ForgotPasswordForm() {
	const emailRef = useRef<HTMLInputElement>(null);
	const statusRef = useRef<HTMLParagraphElement>(null);
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	// O formulário é desmontado ao confirmar; o foco vai para a mensagem para não cair no <body>.
	useEffect(() => {
		if (sent) statusRef.current?.focus();
	}, [sent]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmed = email.trim();
		if (trimmed === '') {
			setEmailError(requiredEmailMessage);
			emailRef.current?.focus();
			return;
		}
		if (!isValidEmail(trimmed)) {
			setEmailError(invalidEmailMessage);
			emailRef.current?.focus();
			return;
		}
		setEmailError(undefined);
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, simulatedAuthDelayMs));
		setLoading(false);
		setSent(true);
	}

	// O campo não tem `name`: um envio nativo (GET) antes da hidratação ou sem JavaScript não
	// leva o e-mail para a URL.
	return (
		<div className="demo-auth-form-shell">
			<AuthIntro
				description={`${demoAuthNotice} Nenhum e-mail será enviado.`}
				title="Recuperar senha"
			/>
			{sent ? (
				<div className="demo-auth-form">
					<p className="demo-auth-status" ref={statusRef} role="status" tabIndex={-1}>
						Envio simulado: se existisse um backend, instruções iriam para {email.trim()}. Continue
						a demonstração redefinindo a senha ou volte ao login.
					</p>
					<div className="demo-auth-actions demo-auth-actions--stack">
						<Link className="demo-auth-link-button" href="/redefinir-senha">
							Continuar para redefinição
						</Link>
						<AdsTypography as="p" variant="muted">
							<Link className="demo-auth-inline-link" href="/login">
								Voltar ao login
							</Link>
						</AdsTypography>
					</div>
				</div>
			) : (
				<form className="demo-auth-form" noValidate onSubmit={handleSubmit}>
					<AdsField
						label="E-mail"
						validationState={emailError ? 'error' : 'default'}
						{...(emailError ? { error: emailError } : {})}
					>
						<AdsInput
							autoComplete="email"
							onChange={(event) => {
								setEmail(event.target.value);
								setEmailError(undefined);
							}}
							ref={emailRef}
							required
							type="email"
							value={email}
						/>
					</AdsField>
					<div className="demo-auth-actions">
						<AdsButton isLoading={loading} type="submit">
							Enviar instruções simuladas
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
