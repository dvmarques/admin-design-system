'use client';

import { AdsSwitch, AdsThemeControl, AdsTypography } from '@admin-ds/components';
import { useAdsAdminShell } from '@admin-ds/admin';
import { applyThemePreference, type ThemePreference } from '../../../lib/theme';
import { useThemePreference } from '../../use-theme';

/**
 * Appearance and layout preferences. It renders inside `AdsAdminShell`: the sidebar switch reads
 * and changes the shell state, and the theme group stays in sync with the header menu through
 * the preference kept on `<html>`.
 */
export function PreferencesContent({ initialPreference }: { initialPreference: ThemePreference }) {
	const preference = useThemePreference(initialPreference);
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
					<AdsThemeControl
						labels={{ group: 'Tema' }}
						onValueChange={applyThemePreference}
						optionDisplay="icon-text"
						value={preference}
						variant="group"
					/>
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
