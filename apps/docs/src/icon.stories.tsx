import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsButton, AdsIcon, AdsIconSlot, AdsThemeControl } from '@dvmarques/admin-ds-components';
import { BellIcon } from '@heroicons/react/24/outline';
import { Sun, Truck } from 'lucide-react';

function LocalParcelIcon() {
	return (
		<svg aria-hidden="true" fill="none" height="20" stroke="currentColor" viewBox="0 0 24 24" width="20">
			<rect height="15" rx="2" width="16" x="4" y="5" />
			<path d="M4 10h16M12 5v20" />
		</svg>
	);
}

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

/** Catalogs below are dev-only: applications choose their own dependencies. */
export const VendorAgnosticComposition: Story = {
	args: { name: 'check' },
	render: () => (
		<div className="flex flex-wrap items-center gap-6 text-text">
			<div className="flex items-center gap-2">
				<AdsIcon name="user" />
				<span>ADS padrão</span>
			</div>
			<AdsButton>
				<Truck aria-hidden="true" size={18} />
				Entregas (Lucide)
			</AdsButton>
			<div className="flex items-center gap-2">
				<AdsIconSlot icon={<BellIcon aria-hidden="true" height={20} width={20} />} />
				<span>Heroicons</span>
			</div>
			<div className="flex items-center gap-2">
				<AdsIconSlot icon={<LocalParcelIcon />} />
				<span>SVG local</span>
			</div>
			<AdsIconSlot icon={<LocalParcelIcon />} label="Pacote" size="lg" />
			<AdsThemeControl
				icons={{
					light: <Sun aria-hidden="true" size={20} />,
					dark: <BellIcon aria-hidden="true" height={20} width={20} />,
					system: <LocalParcelIcon />,
				}}
				optionDisplay="icon-text"
				variant="group"
			/>
		</div>
	),
};
