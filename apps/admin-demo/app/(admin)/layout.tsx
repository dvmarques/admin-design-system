import { AdsAdminShell } from '@dvmarques/admin-ds-admin';
import type { ReactNode } from 'react';
import { DemoBrand } from '../demo-brand';
import { readServerPreference } from '../../lib/server-theme';
import { DemoNavigation } from '../demo-navigation';
import { DemoAccountMenu, DemoNotifications, DemoOrganizationSwitcher } from '../header-controls';
import { RouteChangeHandler } from '../route-change-handler';
import { ThemeControl } from '../theme-control';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	const preference = await readServerPreference();

	return (
		<AdsAdminShell className="demo-admin-shell" layout="sidebar-header">
			<RouteChangeHandler />

			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<div className="demo-mobile-brand">
					<DemoBrand compact />
				</div>
				<div className="demo-header-tools">
					<ThemeControl initialPreference={preference} />
					<DemoNotifications />
					<DemoAccountMenu />
				</div>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar
					header={
						<>
							<DemoBrand />
							<AdsAdminShell.SidebarToggle />
						</>
					}
					label="Navegação do demo"
				>
					<DemoOrganizationSwitcher />
					<DemoNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>{children}</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
