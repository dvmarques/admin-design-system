import { AdsTypography } from '@admin-ds/components';
import { AdsAdminShell } from '@admin-ds/admin';
import type { ReactNode } from 'react';
import { readServerTheme } from '../../lib/server-theme';
import { DemoNavigation } from '../demo-navigation';
import { RouteChangeHandler } from '../route-change-handler';
import { StorybookLink } from '../storybook-link';
import { ThemeControl } from '../theme-control';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	const theme = await readServerTheme();

	return (
		<AdsAdminShell>
			<RouteChangeHandler />

			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsAdminShell.SidebarToggle />
				<AdsTypography as="strong" variant="heading4">
					Admin Design System
				</AdsTypography>
				<div className="demo-header-tools">
					<StorybookLink />
					<ThemeControl initialTheme={theme} />
				</div>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar label="Navegação do demo" mobileTitle="Navegação do demo">
					<DemoNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>{children}</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
