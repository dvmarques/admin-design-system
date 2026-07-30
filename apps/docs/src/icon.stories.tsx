import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsIcon } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Icon',
	component: AdsIcon,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Ícones SVG tipados, decorativos por padrão e nomeáveis quando informativos.',
			},
		},
	},
} satisfies Meta<typeof AdsIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Set: Story = {
	args: { name: 'check' },
	render: () => (
		<div className="flex items-center gap-4">
			<AdsIcon name="check" />
			<AdsIcon name="close" />
			<AdsIcon name="info" label="Informações" />
			<AdsIcon name="plus" />
			<AdsIcon name="search" size="lg" />
		</div>
	),
};
