import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsSparkline } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Data display/Sparkline',
	component: AdsSparkline,
	tags: ['autodocs'],
	args: { label: 'Receita diária', values: [10, 8, 12, 11, 15, 14, 20, 18] },
	parameters: {
		docs: {
			description: {
				component:
					'Gráfico de linha minúsculo em SVG, sem eixos nem animação, que ocupa a largura do contêiner (`className` define a altura). Funciona em Server Components. O nome acessível resume a série (pontos, primeiro e último valor, mínimo e máximo); use `label`, `labels`, `formatValue` e `summary` para ajustá-lo. A cor (`tone`) usa tokens públicos e nunca é a única informação.',
			},
		},
	},
	render: (args) => (
		<div className="w-64">
			<AdsSparkline {...args} />
		</div>
	),
} satisfies Meta<typeof AdsSparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
	name: 'Tons',
	render: (args) => (
		<div className="grid w-64 gap-4">
			{(['default', 'positive', 'negative'] as const).map((tone) => (
				<AdsSparkline {...args} key={tone} label={`Série ${tone}`} tone={tone} />
			))}
		</div>
	),
};

export const WithLabels: Story = {
	name: 'Rótulos por ponto e formatação',
	args: {
		formatValue: (value: number) => `R$ ${value} mil`,
		label: 'Receita mensal',
		labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago'],
	},
};

export const FixedScale: Story = {
	name: 'Escala fixa',
	args: { label: 'Uso da meta', max: 100, min: 0, values: [20, 35, 40, 55, 70] },
};

export const EdgeCases: Story = {
	name: 'Dados curtos, constantes e ausentes',
	render: () => (
		<div className="grid w-64 gap-4">
			<AdsSparkline label="Um ponto" values={[7]} />
			<AdsSparkline label="Constante" values={[5, 5, 5, 5]} />
			<AdsSparkline label="Com lacunas" values={[3, null, 6, undefined, 4, Number.NaN, 9]} />
			<p className="text-sm text-text-muted">Sem pontos válidos o componente não renderiza nada.</p>
			<AdsSparkline label="Vazia" values={[]} />
		</div>
	),
};
