'use client';

import {
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsPasswordInput,
	AdsTypography,
} from '@admin-ds/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import {
	demoAuthNotice,
	invalidEmailMessage,
	isValidEmail,
	requiredEmailMessage,
	requiredPasswordMessage,
	simulatedAuthDelayMs,
} from '../../lib/auth-demo';
import { AuthIntro } from './auth-chrome';

export function LoginForm() {
	const router = useRouter();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [emailError, setEmailError] = useState<string | undefined>();
	const [passwordError, setPasswordError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);

	function validate(): boolean {
		let valid = true;
		const nextEmailError =
			email.trim() === ''
				? requiredEmailMessage
				: !isValidEmail(email)
					? invalidEmailMessage
					: undefined;
		const nextPasswordError = password.trim() === '' ? requiredPasswordMessage : undefined;
		setEmailError(nextEmailError);
		setPasswordError(nextPasswordError);
		if (nextEmailError) {
			valid = false;
			emailRef.current?.focus();
		} else if (nextPasswordError) {
			valid = false;
			passwordRef.current?.focus();
		}
		return valid;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!validate()) return;

		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, simulatedAuthDelayMs));
		setLoading(false);
		router.push('/');
	}

	// Os campos não têm `name`: se o envio nativo (GET) ocorrer antes da hidratação ou sem
	// JavaScript, nenhum valor digitado vai para a URL.
	return (
		<div className="demo-auth-form-shell">
			<AuthIntro
				description={`${demoAuthNotice} Use qualquer e-mail válido e uma senha não vazia para continuar.`}
				title="Entrar"
			/>
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
				<AdsField
					label="Senha"
					validationState={passwordError ? 'error' : 'default'}
					{...(passwordError ? { error: passwordError } : {})}
				>
					<AdsPasswordInput
						autoComplete="current-password"
						onChange={(event) => {
							setPassword(event.target.value);
							setPasswordError(undefined);
						}}
						ref={passwordRef}
						required
						value={password}
					/>
				</AdsField>
				<AdsCheckbox
					checked={remember}
					label="Lembrar-me (somente demonstração)"
					onChange={(event) => setRemember(event.target.checked)}
				/>
				<div className="demo-auth-actions">
					<AdsButton isLoading={loading} type="submit">
						Entrar
					</AdsButton>
					<AdsTypography as="p" variant="muted">
						<Link className="demo-auth-inline-link" href="/esqueci-senha">
							Esqueci a senha
						</Link>
					</AdsTypography>
				</div>
			</form>
		</div>
	);
}
