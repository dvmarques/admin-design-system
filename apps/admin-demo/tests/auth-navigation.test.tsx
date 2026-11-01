import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdsAdminShell } from '@dvmarques/admin-ds-admin';
import { DemoNavigation, demoNavigationItems } from '../app/demo-navigation';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('auth demo navigation', () => {
	it('lists the login example in application destinations', () => {
		expect(demoNavigationItems.some((item) => item.href === '/login')).toBe(true);
		render(
			<AdsAdminShell>
				<DemoNavigation />
			</AdsAdminShell>,
		);
		expect(screen.getByRole('link', { name: 'Login (exemplo)', hidden: true })).toHaveAttribute(
			'href',
			'/login',
		);
	});
});
