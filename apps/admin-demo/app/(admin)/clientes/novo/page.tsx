import { AdsPageHeader } from '@dvmarques/admin-ds-components';
import { NewCustomerForm } from './new-customer-form';

export default function NewCustomerPage() {
	return (
		<div className="demo-page">
			<div className="demo-shell ads-layout-page">
				<AdsPageHeader
					eyebrow="Cadastro"
					title="Novo cliente"
					description="Formulário com validação de campos obrigatórios. Nenhum dado é salvo ou enviado."
				/>
				<section aria-label="Formulário de cadastro" className="demo-section">
					<NewCustomerForm />
				</section>
			</div>
		</div>
	);
}
