import type { ReactNode } from 'react';
import { readServerPreference } from '../../lib/server-theme';
import { AuthChrome } from '../auth/auth-chrome';

export default async function AuthRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
	const preference = await readServerPreference();

	return <AuthChrome initialPreference={preference}>{children}</AuthChrome>;
}
