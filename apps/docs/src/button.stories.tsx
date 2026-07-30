import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsButton } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Button',
	component: AdsButton,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Ação nativa acessível com variantes, tamanhos e estado de carregamento.',
			},
		},
	},
} satisfies Meta<typeof AdsButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<AdsButton>Primário</AdsButton>
			<AdsButton variant="secondary">Secundário</AdsButton>
			<AdsButton variant="danger">Excluir</AdsButton>
			<AdsButton variant="ghost">Cancelar</AdsButton>
		</div>
	),
};
export const States: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<AdsButton isLoading>Salvando</AdsButton>
			<AdsButton disabled>Desabilitado</AdsButton>
		</div>
	),
};
