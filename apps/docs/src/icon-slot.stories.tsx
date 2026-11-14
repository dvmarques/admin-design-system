import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsIconSlot, AdsButton } from '@dvmarques/admin-ds-components';
import { Truck } from 'lucide-react';
import { BellIcon } from '@heroicons/react/24/outline';

const localSvg = (
	<svg aria-hidden="true" fill="none" height="20" stroke="currentColor" viewBox="0 0 24 24" width="20">
		<rect height="16" rx="2" width="16" x="4" y="4" />
	</svg>
);

const meta = {
	title: 'Primitives/IconSlot',
	component: AdsIconSlot,
	tags: ['autodocs'],
	args: { icon: localSvg },
	parameters: {
		docs: {
			description: {
				component:
					'Invólucro agnóstico: recebe ReactNode já renderizado, não clona nem impõe props ao SVG; bibliotecas externas são opcionais.',
			},
		},
	},
} satisfies Meta<typeof AdsIconSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocalSvg: Story = {
	args: { icon: localSvg, label: 'Caixa local' },
};

export const OptionalLibraries: Story = {
	args: { icon: localSvg },
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<AdsButton>
				<Truck aria-hidden="true" size={18} /> Entregas
			</AdsButton>
			<AdsIconSlot icon={<BellIcon aria-hidden="true" height={20} width={20} />} />
			<AdsIconSlot icon={localSvg} label="SVG próprio" />
		</div>
	),
};
