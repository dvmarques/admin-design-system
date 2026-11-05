'use client';

import { useState } from 'react';
import { AdsButton, AdsDatePicker, AdsField, AdsTimePicker, type AdsTimePickerProps } from '@dvmarques/admin-ds-components';

export function TimePickerExamples() {
	const [time, setTime] = useState<string | null>('14:30');
	const [format, setFormat] = useState<NonNullable<AdsTimePickerProps['format']>>('24h');
	return (
		<div className="flex flex-col gap-5">
			<AdsField label="Horário de atendimento" description="Entre 09:00 e 18:00, a cada 15 minutos.">
				<AdsTimePicker min="09:00" max="18:00" minuteStep={15} name="atendimento" defaultValue="09:15" />
			</AdsField>
			<AdsField label="Horário controlado" description={'Valor canônico: ' + (time ?? 'não selecionado')}>
				<AdsTimePicker format={format} name="controlado" value={time} onValueChange={setTime} />
			</AdsField>
			<div className="flex flex-wrap gap-2">
				<AdsButton type="button" variant="secondary" onClick={() => setFormat(format === '24h' ? '12h' : '24h')}>Alternar 12h/24h</AdsButton>
				<AdsButton type="button" variant="ghost" onClick={() => setTime(null)}>Limpar horário</AdsButton>
			</div>
			<AdsField label="Horário obrigatório" error="Selecione um horário válido." validationState="error">
				<AdsTimePicker required />
			</AdsField>
			<AdsField label="Horário desabilitado"><AdsTimePicker defaultValue="17:00" disabled /></AdsField>
			<AdsField label="Data independente"><AdsDatePicker defaultValue="2026-11-05" /></AdsField>
			<AdsField label="Hora independente"><AdsTimePicker defaultValue="10:45" /></AdsField>
		</div>
	);
}
