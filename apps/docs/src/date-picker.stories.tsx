import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsDatePicker, AdsField, type AdsDateRange } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Forms/DatePicker',
	component: AdsDatePicker,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Seleção de data única ou intervalo por digitação ou calendário acessível. Valores são strings ISO `AAAA-MM-DD`; o locale padrão é `pt-BR` e não há dependência de runtime para datas.',
			},
		},
	},
} satisfies Meta<typeof AdsDatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
	render: () => (
		<AdsField description="Digite dd/mm/aaaa ou use o calendário." label="Vencimento">
			<AdsDatePicker defaultValue="2026-03-10" />
		</AdsField>
	),
};

export const Range: Story = {
	render: () => {
		const [value, setValue] = useState<AdsDateRange>({ start: '2026-03-10', end: '2026-03-18' });
		return (
			<AdsField description={`${value.start ?? '—'} até ${value.end ?? '—'}`} label="Período">
				<AdsDatePicker mode="range" onValueChange={setValue} value={value} />
			</AdsField>
		);
	},
};

export const LimitsAndDisabledDates: Story = {
	render: () => (
		<AdsField description="Somente março de 2026, exceto fins de semana." label="Data útil">
			<AdsDatePicker
				defaultValue="2026-03-10"
				isDateDisabled={(iso) => {
					const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
					return day === 0 || day === 6;
				}}
				max="2026-03-31"
				min="2026-03-01"
			/>
		</AdsField>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-md flex-col gap-4">
			<AdsField label="Vazio">
				<AdsDatePicker />
			</AdsField>
			<AdsField error="Informe uma data válida." label="Com erro" validationState="error">
				<AdsDatePicker />
			</AdsField>
			<AdsField label="Desabilitado">
				<AdsDatePicker defaultValue="2026-03-10" disabled />
			</AdsField>
		</div>
	),
};

export const EnglishLocale: Story = {
	render: () => (
		<AdsField label="Date">
			<AdsDatePicker
				defaultValue="2026-03-10"
				labels={{
					calendar: 'Calendar',
					date: 'Date',
					nextMonth: 'Next month',
					openCalendar: 'Open calendar',
					previousMonth: 'Previous month',
				}}
				locale="en-US"
			/>
		</AdsField>
	),
};
