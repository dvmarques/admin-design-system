import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAvatar } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Avatar',
	component: AdsAvatar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Representação de pessoa ou entidade com imagem e fallback acessível.',
			},
		},
	},
} satisfies Meta<typeof AdsAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fallbacks: Story = {
	args: { fallback: 'AS' },
	render: () => (
		<div className="flex items-center gap-3">
			<AdsAvatar alt="Ana Silva" fallback="AS" size="sm" />
			<AdsAvatar alt="Bruno Costa" fallback="BC" />
			<AdsAvatar alt="Carla Lima" fallback="CL" size="lg" />
		</div>
	),
};
