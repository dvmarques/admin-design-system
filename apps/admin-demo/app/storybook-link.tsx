import { AdsAdminShell } from '@admin-ds/admin';

/** Optional external catalog destination, styled like the other sidebar items. */
export function StorybookLink() {
	const href = process.env.NEXT_PUBLIC_STORYBOOK_URL;
	if (!href) return null;

	return (
		<AdsAdminShell.NavigationItem>
			<a
				aria-label="Storybook (abre em nova aba)"
				href={href}
				rel="noopener"
				target="_blank"
				title="Storybook (abre em nova aba)"
			>
				<span aria-hidden="true" className="ads-sidebar-icon">
					<span className="demo-nav-monogram">Sb</span>
				</span>
				<span className="ads-admin-shell-sidebar-label">Storybook</span>
			</a>
		</AdsAdminShell.NavigationItem>
	);
}
