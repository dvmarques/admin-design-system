import { AdsDatePicker, AdsField, AdsSurface, AdsTypography } from '@admin-ds/components';

export default function DatesPage() {
	return (
		<div className="demo-page">
			<div className="demo-shell">
				<AdsTypography as="h1" variant="heading1">
					Seleção de datas
				</AdsTypography>
				<AdsSurface className="demo-panel" variant="raised">
					<AdsField label="Data do registro">
						<AdsDatePicker defaultValue="2026-03-10" />
					</AdsField>
					<AdsField label="Período do registro">
						<AdsDatePicker defaultValue={{ start: '2026-03-10', end: '2026-03-18' }} mode="range" />
					</AdsField>
				</AdsSurface>
			</div>
		</div>
	);
}
