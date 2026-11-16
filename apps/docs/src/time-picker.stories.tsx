import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsDatePicker, AdsField, AdsTimePicker } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Forms/TimePicker',
	component: AdsTimePicker,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Seleção acessível de horas/minutos com selects nativos; valores HH:mm em 24h mesmo quando format="12h". Sem fuso horário ou backend.',
			},
		},
	},
} satisfies Meta<typeof AdsTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<AdsField label="Horário">
			<AdsTimePicker defaultValue="14:30" />
		</AdsField>
	),
};

function ControlledTimePickerStory() {
	const [time, setTime] = useState<string | null>('12:15');
	return (
		<AdsField label="Horário 12h" description={'Valor: ' + (time ?? 'vazio')}>
			<AdsTimePicker format="12h" value={time} onValueChange={setTime} />
		</AdsField>
	);
}

export const ControlledTwelveHour: Story = {
	render: () => <ControlledTimePickerStory />,
};

export const Constraints: Story = {
	render: () => (
		<AdsField label="Agendamento" description="09h até 17h, em quartos de hora.">
			<AdsTimePicker min="09:00" max="17:00" minuteStep={15} defaultValue="09:15" />
		</AdsField>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Obrigatório" error="Selecione o horário." validationState="error">
				<AdsTimePicker required />
			</AdsField>
			<AdsField label="Bloqueado">
				<AdsTimePicker disabled defaultValue="13:00" />
			</AdsField>
		</div>
	),
};

export const DateComposition: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Dia">
				<AdsDatePicker defaultValue="2026-11-05" />
			</AdsField>
			<AdsField label="Hora">
				<AdsTimePicker defaultValue="13:30" />
			</AdsField>
		</div>
	),
};
