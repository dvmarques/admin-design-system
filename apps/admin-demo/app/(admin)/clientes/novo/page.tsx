import { AdsTypography } from '@admin-ds/components';
import { NewCustomerForm } from './new-customer-form';

export default function NewCustomerPage() {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Cadastro</p>
					<AdsTypography as="h1" variant="heading1">
						Novo cliente
					</AdsTypography>
					<AdsTypography variant="muted">
						Formulário com validação de campos obrigatórios. Nenhum dado é salvo ou enviado.
					</AdsTypography>
				</header>
				<section aria-label="Formulário de cadastro" className="demo-section">
					<NewCustomerForm />
				</section>
			</div>
		</div>
	);
}
