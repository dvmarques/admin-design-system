import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsTypography } from '@admin-ds/components';

const meta = {
	title: 'Primitives/Typography',
	component: AdsTypography,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Hierarquia tipográfica semântica baseada em tokens públicos.' },
		},
	},
} satisfies Meta<typeof AdsTypography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
	render: () => (
		<div className="grid gap-3">
			<AdsTypography variant="heading1">Título principal</AdsTypography>
			<AdsTypography variant="heading2">Título de seção</AdsTypography>
			<AdsTypography variant="lead">Texto de destaque para introduzir o conteúdo.</AdsTypography>
			<AdsTypography>Texto padrão de uma interface administrativa.</AdsTypography>
			<AdsTypography variant="muted">Texto auxiliar e secundário.</AdsTypography>
		</div>
	),
};
