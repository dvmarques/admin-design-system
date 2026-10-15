import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsBreadcrumb,
	AdsDropdown,
	AdsNav,
	AdsPagination,
	AdsSurface,
	AdsTabs,
} from '@admin-ds/components';

const meta = { title: 'Navigation/Components', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Structure: Story = {
	render: () => (
		<div className="grid gap-6">
			<AdsBreadcrumb
				items={[
					{ href: '#overview', label: 'Visão geral' },
					{ href: '#reports', label: 'Relatórios' },
					{ label: 'Mensal' },
				]}
			/>
			<AdsNav
				items={[
					{ href: '#overview', label: 'Visão geral', current: true },
					{ href: '#activity', label: 'Atividade' },
					{ label: 'Ações', onClick: () => undefined },
				]}
			/>
		</div>
	),
};
export const Tabs: Story = {
	render: () => (
		<AdsTabs defaultValue="details">
			<AdsTabs.List>
				<AdsTabs.Trigger value="details">Detalhes</AdsTabs.Trigger>
				<AdsTabs.Trigger value="history">Histórico</AdsTabs.Trigger>
			</AdsTabs.List>
			<AdsTabs.Panel value="details">Detalhes do registro.</AdsTabs.Panel>
			<AdsTabs.Panel value="history">Histórico do registro.</AdsTabs.Panel>
		</AdsTabs>
	),
};
/** Breadcrumb links and tabs keep AA contrast on an elevated surface in both themes. */
export const OnRaisedSurface: Story = {
	render: () => (
		<div className="grid gap-6">
			{(['light', 'dark'] as const).map((theme) => (
				<div
					data-theme={theme}
					key={theme}
					style={{ background: 'var(--ads-color-canvas)', padding: '1rem' }}
				>
					<AdsSurface variant="raised">
						<div className="grid gap-4">
							<AdsBreadcrumb
								aria-label={`Breadcrumb ${theme}`}
								items={[
									{ href: '#overview', label: 'Visão geral' },
									{ href: '#reports', label: 'Relatórios' },
									{ label: 'Mensal' },
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
						</div>
					</AdsSurface>
				</div>
			))}
		</div>
	),
};
export const Dropdown: Story = {
	render: () => (
		<AdsDropdown>
			<AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
			<AdsDropdown.Content>
				<AdsDropdown.Item href="#edit">Editar</AdsDropdown.Item>
				<AdsDropdown.Item disabled>Arquivar</AdsDropdown.Item>
			</AdsDropdown.Content>
		</AdsDropdown>
	),
};
export const Pagination: Story = {
	render: () => {
		const [page, setPage] = useState(5);
		return <AdsPagination page={page} pageCount={20} onPageChange={setPage} />;
	},
};
