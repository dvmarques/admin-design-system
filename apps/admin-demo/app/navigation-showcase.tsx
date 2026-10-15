'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AdsBreadcrumb, AdsDropdown, AdsNav, AdsPagination, AdsTabs } from '@admin-ds/components';

export function NavigationShowcase() {
	const [page, setPage] = useState(2);
	return (
		<div style={{ display: 'grid', gap: '1.5rem' }}>
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
