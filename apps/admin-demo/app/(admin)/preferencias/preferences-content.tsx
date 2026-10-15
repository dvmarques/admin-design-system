'use client';

import { AdsRadio, AdsSelectionGroup, AdsSwitch, AdsTypography } from '@admin-ds/components';
import { useAdsAdminShell } from '@admin-ds/admin';
import { applyTheme, type Theme } from '../../../lib/theme';
import { useTheme } from '../../use-theme';

/**
 * Appearance and layout preferences. It renders inside `AdsAdminShell`: the sidebar switch reads
 * and changes the shell state, and the theme group stays in sync with the header toggle through
 * the `data-theme` attribute.
 */
export function PreferencesContent({ initialTheme }: { initialTheme: Theme }) {
	const theme = useTheme(initialTheme);
	const { collapsed, isDesktop, setCollapsed } = useAdsAdminShell();

	return (
		<div className="demo-page">
			<div className="demo-shell">
				<header className="demo-section">
					<p className="demo-kicker">Conta</p>
					<AdsTypography as="h1" variant="heading1">
						Preferências
					</AdsTypography>
					<AdsTypography variant="muted">
						Aparência e layout do admin. As escolhas valem apenas neste navegador.
					</AdsTypography>
				</header>

				<section aria-labelledby="preferences-appearance" className="demo-section">
					<AdsTypography as="h2" id="preferences-appearance" variant="heading2">
						Aparência
					</AdsTypography>
					<AdsSelectionGroup legend="Tema">
						<AdsRadio
							checked={theme === 'light'}
							label="Claro"
							name="tema"
							onChange={() => applyTheme('light')}
							value="light"
						/>
						<AdsRadio
							checked={theme === 'dark'}
							label="Escuro"
							name="tema"
							onChange={() => applyTheme('dark')}
							value="dark"
						/>
					</AdsSelectionGroup>
				</section>

				<section aria-labelledby="preferences-layout" className="demo-section">
					<AdsTypography as="h2" id="preferences-layout" variant="heading2">
						Layout
					</AdsTypography>
					<AdsSwitch
						aria-describedby="sidebar-preference-help"
						checked={collapsed}
						disabled={!isDesktop}
						label="Recolher a barra lateral"
						onChange={(event) => setCollapsed(event.target.checked)}
					/>
					<p className="demo-preference-help" id="sidebar-preference-help">
						{isDesktop
							? 'A preferência vale até recarregar a página.'
							: 'Disponível apenas no layout desktop.'}
					</p>
				</section>
			</div>
		</div>
	);
}
