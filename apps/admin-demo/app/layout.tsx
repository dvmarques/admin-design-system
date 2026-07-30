import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import './globals.css';
import { resolveTheme } from '../lib/theme';

export const metadata: Metadata = {
	title: 'Admin Design System Demo',
	description: 'Aplicação de referência do Admin Design System',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const cookieStore = await cookies();
	const theme = resolveTheme(cookieStore.get('ads-theme')?.value);

	return (
		<html lang="pt-BR" data-theme={theme}>
			<body>{children}</body>
		</html>
	);
}
