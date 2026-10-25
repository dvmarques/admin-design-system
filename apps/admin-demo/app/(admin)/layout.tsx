import { AdsTypography } from '@admin-ds/components';
import { AdsAdminShell } from '@admin-ds/admin';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { readServerPreference } from '../../lib/server-theme';
import { DemoNavigation } from '../demo-navigation';
import { DemoAccountMenu, DemoNotifications, DemoOrganizationSwitcher } from '../header-controls';
import { RouteChangeHandler } from '../route-change-handler';
import { StorybookLink } from '../storybook-link';
import { ThemeControl } from '../theme-control';

/** `next/image` não aplica o `basePath` a um `src` raiz-relativo; só o export do Pages define um. */
const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/icon.svg`;

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	const preference = await readServerPreference();

	return (
		<AdsAdminShell>
			<RouteChangeHandler />

			<AdsAdminShell.Header>
				<AdsAdminShell.NavigationTrigger />
				<AdsAdminShell.SidebarToggle />
				<div className="demo-brand-heading">
					<Image src={logoSrc} alt="" width={30} height={30} priority />
					<AdsTypography as="strong" variant="heading4">
						Admin Design System
					</AdsTypography>
				</div>
				<div className="demo-header-tools">
					<StorybookLink />
					<ThemeControl initialPreference={preference} />
					<DemoNotifications />
					<DemoAccountMenu />
				</div>
			</AdsAdminShell.Header>
			<AdsAdminShell.Body>
				<AdsAdminShell.Sidebar label="Navegação do demo" mobileTitle="Navegação do demo">
					<DemoOrganizationSwitcher />
					<DemoNavigation />
				</AdsAdminShell.Sidebar>
				<AdsAdminShell.Main>{children}</AdsAdminShell.Main>
			</AdsAdminShell.Body>
		</AdsAdminShell>
	);
}
