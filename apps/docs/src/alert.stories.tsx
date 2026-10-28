import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsAlert, AdsButton } from '@admin-ds/components';

const meta = {
	title: 'Feedback/Alert',
	component: AdsAlert,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Feedback persistente inline, diferente de AdsToast (notificação em portal).',
			},
		},
	},
} satisfies Meta<typeof AdsAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem' }}>
			{(['info', 'success', 'warning', 'error'] as const).map((variant) => (
				<AdsAlert key={variant} variant={variant} title={variant}>
					Mensagem persistente de exemplo.
				</AdsAlert>
			))}
		</div>
	),
};

export const Interactive: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return (
			<div style={{ display: 'grid', gap: '1rem' }}>
				<AdsButton onClick={() => setOpen(true)}>Mostrar alerta</AdsButton>
				<AdsAlert
					title="Revisar configuração"
					appearance="callout"
					variant="warning"
					open={open}
					dismissible
					onClose={() => setOpen(false)}
					actions={
						<AdsButton size="sm" onClick={() => setOpen(false)}>
							Entendi
						</AdsButton>
					}
				>
					Verifique as permissões antes de continuar.
				</AdsAlert>
			</div>
		);
	},
};
