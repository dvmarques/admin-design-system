'use client';

import { useState, type FormEvent } from 'react';
import {
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsPageHeader,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

export default function SemanticFormPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
	const [submitted, setSubmitted] = useState(false);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextErrors = {
			...(!name.trim() ? { name: 'Informe o nome.' } : {}),
			...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
				? { email: 'Informe um e-mail válido.' }
				: {}),
		};
		setErrors(nextErrors);
		setSubmitted(Object.keys(nextErrors).length === 0);
	}

	return (
		<div className="demo-page">
			<div className="ads-layout-container ads-layout-stack demo-semantic-page">
				<AdsPageHeader
					title="Formulário administrativo"
					description="Duas seções semânticas, validação de campos obrigatórios e ações acessíveis; demonstração sem envio de dados."
				/>
				<form className="ads-layout-stack demo-semantic-form" noValidate onSubmit={submit}>
					<section
						aria-labelledby="form-identificacao"
						className="ads-layout-stack demo-semantic-section"
					>
						<AdsTypography as="h2" id="form-identificacao" variant="heading2">
							Identificação
						</AdsTypography>
						<div className="ads-layout-grid demo-semantic-form-fields">
							<AdsField
								label="Nome"
								validationState={errors.name ? 'error' : 'default'}
								error={errors.name}
							>
								<AdsInput
									name="nome"
									required
									value={name}
									onChange={(event) => {
										setName(event.target.value);
										setErrors((current) => ({ ...current, name: '' }));
										setSubmitted(false);
									}}
								/>
							</AdsField>
							<AdsField
								label="E-mail"
								validationState={errors.email ? 'error' : 'default'}
								error={errors.email}
							>
								<AdsInput
									name="email"
									type="email"
									required
									value={email}
									onChange={(event) => {
										setEmail(event.target.value);
										setErrors((current) => ({ ...current, email: '' }));
										setSubmitted(false);
									}}
								/>
							</AdsField>
						</div>
						<AdsField label="Código (desabilitado)">
							<AdsInput value="DEMO-001" disabled />
						</AdsField>
					</section>
					<section
						aria-labelledby="form-preferencias"
						className="ads-layout-stack demo-semantic-section"
					>
						<AdsTypography as="h2" id="form-preferencias" variant="heading2">
							Preferências
						</AdsTypography>
						<AdsTypography as="h3" variant="heading4">
							Comunicações
						</AdsTypography>
						<AdsCheckbox label="Receber novidades por e-mail" name="newsletter" />
					</section>
					<div className="ads-layout-cluster">
						<AdsButton type="submit">Validar cadastro</AdsButton>
						<AdsButton
							type="reset"
							variant="secondary"
							onClick={() => {
								setName('');
								setEmail('');
								setErrors({});
								setSubmitted(false);
							}}
						>
							Limpar dados
						</AdsButton>
					</div>
					<p role="status">
						{submitted ? 'Cadastro válido (simulação).' : 'Nenhum cadastro validado.'}
					</p>
				</form>
			</div>
		</div>
	);
}
