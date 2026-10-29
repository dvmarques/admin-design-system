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
			<AdsIcon name="alertTriangle" />
			<AdsIcon name="alertCircle" />
			<AdsIcon name="plus" />
			<AdsIcon name="search" size="lg" />
		</div>
	),
};

export const BuildingMIT: Story = {
	args: { name: 'building' },
	parameters: {
		docs: {
			description: {
			story: 'Building06Icon (MIT). Licença integral em THIRD_PARTY_NOTICES.md.',
		},
		},
	},
	render: () => (
		<div className="flex items-center gap-6">
			<AdsIcon name="building" size="sm" />
			<AdsIcon name="building" size="md" />
			<AdsIcon name="building" size="lg" label="Edifício" />
		</div>
	),
};

const allLicensedNames = [
	'alertCircle',
	'alertTriangle',
	'bell',
	'building',
	'calendar',
	'check',
	'chevronDown',
	'chevronLeft',
	'chevronRight',
	'chevronsUpDown',
	'close',
	'logOut',
	'monitor',
	'moon',
	'info',
	'plus',
	'sun',
	'settings',
	'search',
	'user',
] as const;

export const LicensedCatalog: Story = {
	args: { name: 'check' },
	parameters: {
		docs: {
			description: {
				story: '20 SVGs licenciados: 18 Feather (MIT), 1 Lucide (ISC), 1 Hugeicons Free (MIT).',
			},
		},
	},
	render: () => (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{allLicensedNames.map((name) => (
				<div className="flex items-center gap-2" key={name}>
					<AdsIcon name={name} size="md" />
					<code>{name}</code>
				</div>
			))}
		</div>
	),
};
