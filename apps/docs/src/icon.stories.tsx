import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsIcon } from '@dvmarques/admin-ds-components';

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
		<div className="flex flex-wrap items-center gap-4">
			<AdsIcon name="alertCircle" />
			<AdsIcon name="alertTriangle" />
			<AdsIcon name="bell" />
			<AdsIcon name="building" />
			<AdsIcon name="calendar" />
			<AdsIcon name="check" />
			<AdsIcon name="chevronDown" />
			<AdsIcon name="chevronLeft" />
			<AdsIcon name="chevronRight" />
			<AdsIcon name="chevronsUpDown" />
			<AdsIcon name="close" />
			<AdsIcon name="logOut" />
			<AdsIcon name="monitor" />
			<AdsIcon name="moon" />
			<AdsIcon name="info" />
			<AdsIcon name="plus" />
			<AdsIcon name="sun" />
			<AdsIcon name="settings" />
			<AdsIcon name="search" />
			<AdsIcon name="user" />
		</div>
	),
};
