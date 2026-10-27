import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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

/** Alterna `isLoading` sem mudar a largura, a altura nem a posição do rótulo. */
export const LoadingTransition: Story = {
	render: function LoadingTransitionStory() {
		const [loading, setLoading] = useState(false);
		return (
			<div className="flex flex-col items-start gap-4">
				<AdsButton variant="secondary" onClick={() => setLoading(!loading)}>
					{loading ? 'Parar carregamento' : 'Iniciar carregamento'}
				</AdsButton>
				<div className="flex flex-wrap items-center gap-3">
					{(['sm', 'md', 'lg'] as const).map((size) => (
						<AdsButton key={size} size={size} isLoading={loading}>
							Salvar
						</AdsButton>
					))}
					<AdsButton isLoading={loading}>Enviar relatório mensal consolidado</AdsButton>
				</div>
			</div>
		);
	},
};
