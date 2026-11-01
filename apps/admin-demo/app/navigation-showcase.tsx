'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
	AdsAccordion,
	AdsBreadcrumb,
	AdsDropdown,
	AdsNav,
	AdsPagination,
	AdsTabs,
} from '@dvmarques/admin-ds-components';

export function NavigationShowcase() {
	const [page, setPage] = useState(2);
	return (
		<div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr)' }}>
			<AdsBreadcrumb
				items={[
					{
						label: 'Início',
						renderLink: (props) => <Link href="#home" {...props} />,
					},
					{
						label: 'Relatórios',
						renderLink: (props) => <Link href="#reports" {...props} />,
					},
					{ label: 'Mensal' },
				]}
			/>
			<AdsBreadcrumb
				aria-label="Trilha de navegação"
				expandLabel="Mostrar caminho completo"
				items={[
					{ label: 'Início', renderLink: (props) => <Link href="#home" {...props} /> },
					{ label: 'Relatórios', renderLink: (props) => <Link href="#reports" {...props} /> },
					{ label: 'Vendas', renderLink: (props) => <Link href="#sales" {...props} /> },
					{ label: 'Região', renderLink: (props) => <Link href="#region" {...props} /> },
					{ label: 'Estado', renderLink: (props) => <Link href="#state" {...props} /> },
					{ label: 'Mensal' },
				]}
				maxItems={4}
				separator="›"
			/>
			<AdsNav
				items={[
					{
						label: 'Visão geral',
						current: true,
						renderLink: (props) => <Link href="#overview" {...props} />,
					},
					{
						label: 'Atividade',
						renderLink: (props) => <Link href="#activity" {...props} />,
					},
					{ label: 'Ações', onClick: () => undefined },
				]}
			/>
			<AdsTabs defaultValue="summary">
				<AdsTabs.List>
					<AdsTabs.Trigger value="summary">Resumo</AdsTabs.Trigger>
					<AdsTabs.Trigger value="history">Histórico</AdsTabs.Trigger>
					<AdsTabs.Trigger disabled value="future">
						Em breve
					</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="summary">Resumo da conta.</AdsTabs.Panel>
				<AdsTabs.Panel value="history">Histórico de alterações.</AdsTabs.Panel>
			</AdsTabs>
			<AdsTabs activationMode="automatic" defaultValue="profile" keepMounted orientation="vertical">
				<AdsTabs.List aria-label="Configurações da conta">
					<AdsTabs.Trigger value="profile">Perfil</AdsTabs.Trigger>
					<AdsTabs.Trigger value="security">Segurança</AdsTabs.Trigger>
					<AdsTabs.Trigger disabled value="billing">
						Cobrança
					</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="profile">Dados do perfil.</AdsTabs.Panel>
				<AdsTabs.Panel value="security">Opções de segurança.</AdsTabs.Panel>
				<AdsTabs.Panel value="billing">Dados de cobrança.</AdsTabs.Panel>
			</AdsTabs>
			<AdsAccordion collapsible defaultValue="faq-1" type="single">
				<AdsAccordion.Item value="faq-1">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Como altero minha senha?</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>
						Acesse as preferências da conta e escolha segurança.
					</AdsAccordion.Panel>
				</AdsAccordion.Item>
				<AdsAccordion.Item value="faq-2">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Posso exportar os relatórios?</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>
						Sim, em CSV a partir do menu de ações do relatório.
					</AdsAccordion.Panel>
				</AdsAccordion.Item>
				<AdsAccordion.Item disabled value="faq-3">
					<AdsAccordion.Header>
						<AdsAccordion.Trigger>Integrações (em breve)</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>Disponível em breve.</AdsAccordion.Panel>
				</AdsAccordion.Item>
			</AdsAccordion>
			<AdsAccordion defaultValue={['shipping']} type="multiple" unmountOnCollapse>
				<AdsAccordion.Item value="shipping">
					<AdsAccordion.Header level={4}>
						<AdsAccordion.Trigger>Entrega</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>Previsão de entrega em três dias úteis.</AdsAccordion.Panel>
				</AdsAccordion.Item>
				<AdsAccordion.Item value="payment">
					<AdsAccordion.Header level={4}>
						<AdsAccordion.Trigger>Pagamento</AdsAccordion.Trigger>
					</AdsAccordion.Header>
					<AdsAccordion.Panel>Pago com cartão de crédito em duas parcelas.</AdsAccordion.Panel>
				</AdsAccordion.Item>
			</AdsAccordion>
			<AdsDropdown>
				<AdsDropdown.Trigger>Ações do relatório</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item href="#export">Exportar</AdsDropdown.Item>
					<AdsDropdown.Item onSelect={() => undefined}>Duplicar</AdsDropdown.Item>
					<AdsDropdown.Item disabled>Arquivar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>
			<AdsPagination page={page} pageCount={8} onPageChange={setPage} />
		</div>
	);
}
