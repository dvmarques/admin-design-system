import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsSurface } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Surface',
	component: AdsSurface,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Superfície composicional sem largura fixa ou regras de negócio.' },
		},
	},
} satisfies Meta<typeof AdsSurface>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-3">
			<AdsSurface>Neutra</AdsSurface>
			<AdsSurface variant="raised">Elevada</AdsSurface>
			<AdsSurface variant="outlined">Contornada</AdsSurface>
		</div>
	),
};
