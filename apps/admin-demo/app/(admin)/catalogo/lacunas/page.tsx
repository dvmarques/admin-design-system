'use client';

import { useState } from 'react';
import {
	AdsButton,
	AdsFieldDescription,
	AdsFieldLabel,
	AdsFieldMessage,
	AdsInput,
	AdsInputGroup,
	AdsTable,
	AdsTableBody,
	AdsTableCaption,
	AdsTableCell,
	AdsTableHead,
	AdsTableHeader,
	AdsTableRow,
} from '@admin-ds/components';

export default function MissingExamplesPage() {
	const [amount, setAmount] = useState('120');
	const [error, setError] = useState(false);
	return (
		<div className="demo-page demo-shell">
			<h1>Composição de campos e tabelas</h1>
			<p>Exemplos explícitos dos componentes de composição e seus estados.</p>
			<section aria-labelledby="field-heading" className="demo-section">
				<h2 id="field-heading">AdsInputGroup e auxiliares de campo</h2>
				<div className="demo-form-surface">
					<AdsFieldLabel id="catalog-amount-label">Valor em reais</AdsFieldLabel>
					<AdsInputGroup
						startContent="R$"
						endContent={
							<AdsButton type="button" onClick={() => setAmount('0')}>
								Limpar
							</AdsButton>
						}
					>
						<AdsInput
							aria-labelledby="catalog-amount-label"
							id="catalog-amount"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
							aria-describedby={
								error
									? 'catalog-amount-description catalog-amount-error'
									: 'catalog-amount-description'
							}
							aria-invalid={error}
							validationState={error ? 'error' : 'default'}
						/>
					</AdsInputGroup>
					<AdsFieldDescription id="catalog-amount-description">
						Digite um valor e use o botão para limpar.
					</AdsFieldDescription>
					{error ? (
						<AdsFieldMessage id="catalog-amount-error">Informe um valor válido.</AdsFieldMessage>
					) : null}
					<AdsButton type="button" onClick={() => setError((previous) => !previous)}>
						{error ? 'Ocultar erro' : 'Mostrar erro'}
					</AdsButton>
				</div>
			</section>
			<section aria-labelledby="table-heading" className="demo-section">
				<h2 id="table-heading">AdsTableCaption</h2>
				<AdsTable density="compact">
					<AdsTableCaption>Resumo de valores de demonstração</AdsTableCaption>
					<AdsTableHead>
						<AdsTableRow interactive={false}>
							<AdsTableHeader>Item</AdsTableHeader>
							<AdsTableHeader align="end">Valor</AdsTableHeader>
						</AdsTableRow>
					</AdsTableHead>
					<AdsTableBody>
						<AdsTableRow>
							<AdsTableCell>Exemplo A</AdsTableCell>
							<AdsTableCell align="end">R$ 120</AdsTableCell>
						</AdsTableRow>
					</AdsTableBody>
				</AdsTable>
			</section>
		</div>
	);
}
