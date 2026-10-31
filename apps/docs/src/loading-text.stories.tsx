import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsLoadingText } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Primitives/LoadingText',
	component: AdsLoadingText,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Texto com brilho deslizante enquanto os dados mudam. Não substitui status acessível, spinner ou skeleton; respeita movimento reduzido e temas.',
			},
		},
	},
} satisfies Meta<typeof AdsLoadingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
	args: { loading: true, children: 'Processando registros...' },
};

export const Completed: Story = {
	args: { loading: false, children: 'Processamento concluído.' },
};

export const Speeds: Story = {
	args: { children: 'Velocidades do brilho' },
	render: () => (
		<div style={{ display: 'grid', gap: '1rem' }}>
			{(['slow', 'normal', 'fast'] as const).map((speed) => (
				<AdsLoadingText key={speed} loading speed={speed}>
					{speed}: Atualizando informações da execução
				</AdsLoadingText>
			))}
			<AdsLoadingText as="p" loading>
				<span>Texto extenso pode quebrar linha e continuar legível em diferentes larguras.</span>
			</AdsLoadingText>
		</div>
	),
};
