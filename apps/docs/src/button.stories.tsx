import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AdsButton } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Button',
	component: AdsButton,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			description: 'Tratamento visual da ação; preserve contraste e intenção semântica.',
			control: 'select',
			options: ['primary', 'secondary', 'danger', 'ghost'],
			table: { type: { summary: 'AdsButtonVariant' }, defaultValue: { summary: 'primary' } },
		},
		size: {
			description: 'Altura e espaçamento conforme os tokens de controle.',
			control: 'select',
			options: ['sm', 'md', 'lg'],
			table: { type: { summary: 'AdsButtonSize' }, defaultValue: { summary: 'md' } },
		},
		type: {
			description: 'Tipo HTML do botão; o padrão evita submissão acidental de formulários.',
			table: { type: { summary: "'button' | 'submit' | 'reset'" }, defaultValue: { summary: 'button' } },
		},
		disabled: {
			description: 'Desabilita a interação nativa, inclusive por teclado.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
		},
		isLoading: {
			description: 'Anuncia aria-busy, exibe indicador e desabilita o botão durante a operação.',
			table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
		},
		loadingLabel: {
			description: 'Nome acessível do indicador de progresso.',
			table: { type: { summary: 'string' }, defaultValue: { summary: 'Carregando' } },
		},
	},
	parameters: {
		docs: {
			description: {
				component:
					'Ação nativa acessível com variantes, tamanhos e estado de carregamento. Aceita as propriedades do elemento HTML button e encaminha ref ao botão. Navegação por Tab e ativação por Enter/Espaço seguem a semântica nativa. Durante isLoading, aria-busy sinaliza a operação e o botão fica desabilitado. Valores padrão conferidos em packages/components/src/button.tsx.',
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
