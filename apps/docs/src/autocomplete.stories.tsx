import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAutocomplete, AdsField } from '@admin-ds/components';

const options = [
	{ value: 'SP', label: 'São Paulo' },
	{ value: 'RJ', label: 'Rio de Janeiro' },
];
async function mockLoad(query: string, signal: AbortSignal) {
	await new Promise((resolve) => setTimeout(resolve, 350));
	if (signal.aborted) return [];
	if (query === 'erro') throw new Error('Falha simulada');
	return options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
}
const meta = {
	title: 'Forms/Autocomplete',
	component: AdsAutocomplete,
	tags: ['autodocs'],
} satisfies Meta<typeof AdsAutocomplete>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Local: Story = {
	render: () => (
		<AdsField label="Busca local">
			<AdsAutocomplete options={options} />
		</AdsField>
	),
};
export const Async: Story = {
	render: () => (
		<AdsField label="Busca remota" description="Digite erro para simular falha.">
			<AdsAutocomplete loadOptions={mockLoad} debounceMs={200} />
		</AdsField>
	),
};

export const Avatars: Story = {
	args: {
		options: [
			{ value: 'ana', label: 'Ana', avatar: { src: './admin-ds-favicon.svg', fallback: 'AN' } },
			{ value: 'bia', label: 'Bia' },
		],
		defaultValue: 'ana',
	},
};
export const AvatarsHidden: Story = { args: { ...Avatars.args, showOptionVisuals: false } };
