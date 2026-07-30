import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsLoadingIndicator } from '@admin-ds/components';

const meta = {
	title: 'Primitives/LoadingIndicator',
	component: AdsLoadingIndicator,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Indicador acessível de progresso indeterminado que respeita movimento reduzido.',
			},
		},
	},
} satisfies Meta<typeof AdsLoadingIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<AdsLoadingIndicator label="Carregando pequeno" size="sm" />
			<AdsLoadingIndicator label="Carregando médio" />
			<AdsLoadingIndicator label="Carregando grande" size="lg" />
		</div>
	),
};
