'use client';

import {
	AdsButton,
	AdsField,
	AdsPasswordInput,
	AdsTypography,
	type AdsPasswordRule,
} from '@admin-ds/components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, type FormEvent } from 'react';
import { demoAuthNotice, passwordMismatchMessage, simulatedAuthDelayMs } from '../../lib/auth-demo';
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
	const router = useRouter();
	const statusId = useId();
	const confirmRef = useRef<HTMLInputElement>(null);
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [confirmError, setConfirmError] = useState<string | undefined>();
	const [formError, setFormError] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFormError(undefined);
		setConfirmError(undefined);

		if (!rulesMet(password)) {
			setFormError('Atenda todos os requisitos da senha antes de continuar.');
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

	return (
		<div className="demo-auth-form-shell">
			<AuthIntro
				description={`${demoAuthNotice} A nova senha não é salva em lugar algum.`}
				title="Redefinir senha"
			/>
			{success ? (
				<div className="demo-auth-form">
					<p aria-live="polite" className="demo-auth-status" id={statusId} role="status">
						Senha redefinida com sucesso (simulação). Você pode voltar ao login e entrar novamente
						no demo.
					</p>
					<AdsButton onClick={() => router.push('/login')} type="button">
						Voltar ao login
					</AdsButton>
				</div>
			) : (
				<form
					aria-describedby={formError ? statusId : undefined}
					className="demo-auth-form"
					noValidate
					onSubmit={handleSubmit}
				>
					<AdsField label="Nova senha">
						<AdsPasswordInput
							autoComplete="new-password"
							name="password"
							onChange={(event) => {
								setPassword(event.target.value);
								setFormError(undefined);
							}}
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
							name="confirmPassword"
							onChange={(event) => {
								setConfirm(event.target.value);
								setConfirmError(undefined);
							}}
							ref={confirmRef}
							showVisibilityToggle
							value={confirm}
						/>
					</AdsField>
					{formError ? (
						<p className="demo-auth-form-error" id={statusId} role="alert">
							{formError}
						</p>
					) : null}
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
