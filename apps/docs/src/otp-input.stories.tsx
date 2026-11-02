import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsButton, AdsField, AdsOTPInput } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Forms/OTP input',
	component: AdsOTPInput,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Uma única entrada nativa para códigos numéricos, representada por caixas. Use AdsField para rótulo, ajuda e erro. onChange e onComplete entregam strings, preservando zeros. O componente não envia nem valida códigos remotamente.',
			},
		},
	},
} satisfies Meta<typeof AdsOTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<div className="max-w-sm">
			<AdsField description="Digite o código fictício de seis dígitos." label="Código de acesso">
				<AdsOTPInput name="otp" required />
			</AdsField>
		</div>
	),
};

export const Controlled: Story = {
	render: () => {
		function Example() {
			const [value, setValue] = useState('');
			const [complete, setComplete] = useState('');
			return (
				<div className="flex max-w-sm flex-col gap-3">
					<AdsField description="Quatro posições controladas." label="PIN">
						<AdsOTPInput
							length={4}
							onChange={(next) => {
								setValue(next);
								setComplete('');
							}}
							onComplete={setComplete}
							value={value}
						/>
					</AdsField>
					<p aria-live="polite">
						Dígitos: {value.length}/4. {complete ? 'Código completo.' : ''}
					</p>
					<AdsButton onClick={() => setValue('0012')} type="button" variant="secondary">
						Preencher exemplo 0012
					</AdsButton>
					<AdsButton
						onClick={() => {
							setValue('');
							setComplete('');
						}}
						type="button"
						variant="secondary"
					>
						Limpar
					</AdsButton>
				</div>
			);
		}
		return <Example />;
	},
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<AdsField error="Código inválido" label="Erro" validationState="error">
				<AdsOTPInput defaultValue="12" length={4} />
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsOTPInput defaultValue="123456" disabled />
			</AdsField>
			<AdsField label="Somente leitura">
				<AdsOTPInput defaultValue="001234" readOnly />
			</AdsField>
			<AdsField label="Confirmado" validationState="success">
				<AdsOTPInput defaultValue="123456" />
			</AdsField>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<AdsField key={size} label={`Tamanho ${size}`}>
					<AdsOTPInput defaultValue="01" length={6} size={size} />
				</AdsField>
			))}
		</div>
	),
};
