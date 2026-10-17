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

export const Elevation: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Os níveis `sm`, `md` e `lg` (`--ads-elevation-*`) têm valores próprios nos temas claro e escuro; alterne o tema para comparar.',
			},
		},
	},
	render: () => (
		<div className="grid gap-6 md:grid-cols-3">
			{(['sm', 'md', 'lg'] as const).map((level) => (
				<AdsSurface
					key={level}
					style={{ boxShadow: `var(--ads-elevation-${level})` }}
					variant="raised"
				>
					Elevação {level}
				</AdsSurface>
			))}
		</div>
	),
};

export const Levels: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-3">
			<AdsSurface>Neutra</AdsSurface>
			<AdsSurface variant="raised">Elevada</AdsSurface>
			<AdsSurface variant="outlined">Contornada</AdsSurface>
		</div>
	),
};
