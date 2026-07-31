import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsBadge } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Badge',
	component: AdsBadge,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Rótulo textual compacto para status, com contraste legível nos temas claro e escuro.',
			},
		},
	},
} satisfies Meta<typeof AdsBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<AdsBadge>Neutro</AdsBadge>
			<AdsBadge variant="primary">Em análise</AdsBadge>
			<AdsBadge variant="success">Ativo</AdsBadge>
			<AdsBadge variant="warning">Pendente</AdsBadge>
			<AdsBadge variant="danger">Falhou</AdsBadge>
		</div>
	),
};
