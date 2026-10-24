import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
import '@admin-ds/admin/styles.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { readServerPreference } from '../lib/server-theme';
import { themeForPreference, themeInitScript } from '../lib/theme';
import { ThemeSystemSync } from './theme-system-sync';

export const metadata: Metadata = {
	title: 'Admin Design System Demo',
	description: 'Aplicação de referência do Admin Design System',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const preference = await readServerPreference();

	return (
		<html
			lang="pt-BR"
			data-scroll-behavior="smooth"
			// With `system` the server renders the light fallback; the init script corrects it (and
			// applies the saved preference in the static export) before the first paint.
			data-theme={themeForPreference(preference)}
			data-theme-preference={preference}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body>
				<ThemeSystemSync />
				{children}
			</body>
		</html>
	);
}
