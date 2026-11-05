import { AdsSurface, AdsTypography } from '@dvmarques/admin-ds-components';
import { TimePickerExamples } from './time-picker-examples';

export default function DatesPage() {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<AdsTypography as="h1" variant="heading1">Seleção de datas e horários</AdsTypography>
				<AdsSurface className="demo-panel" variant="raised">
					<TimePickerExamples />
				</AdsSurface>
			</div>
		</div>
	);
}
