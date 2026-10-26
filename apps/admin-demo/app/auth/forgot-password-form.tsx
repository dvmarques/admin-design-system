'use client';

import { AdsButton, AdsField, AdsInput, AdsTypography } from '@admin-ds/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, type FormEvent } from 'react';
import {
	demoAuthNotice,
	invalidEmailMessage,
	isValidEmail,
	requiredEmailMessage,
	simulatedAuthDelayMs,
} from '../../lib/auth-demo';
import { AuthIntro } from './auth-chrome';

export function ForgotPasswordForm() {
	const router = useRouter();
	const statusId = useId();
	const emailRef = useRef<HTMLInputElement>(null);
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

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

	return (
		<div className="demo-auth-form-shell">
			<AuthIntro
				description={`${demoAuthNotice} Nenhum e-mail será enviado.`}
				title="Recuperar senha"
			/>
			{sent ? (
				<div className="demo-auth-form">
					<p aria-live="polite" className="demo-auth-status" id={statusId} role="status">
						Envio simulado: se existisse um backend, instruções iriam para {email.trim()}. Continue
						a demonstração redefinindo a senha ou volte ao login.
					</p>
					<div className="demo-auth-actions demo-auth-actions--stack">
						<AdsButton onClick={() => router.push('/redefinir-senha')} type="button">
							Continuar para redefinição
						</AdsButton>
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
							name="email"
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
