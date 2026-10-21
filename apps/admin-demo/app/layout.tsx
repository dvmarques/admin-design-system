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
import { isStaticExport, readServerTheme } from '../lib/server-theme';
import { themeInitScript } from '../lib/theme';

export const metadata: Metadata = {
	title: 'Admin Design System Demo',
	description: 'Aplicação de referência do Admin Design System',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const theme = await readServerTheme();

	return (
		<html
			lang="pt-BR"
			data-scroll-behavior="smooth"
			data-theme={theme}
			// The static export applies the saved theme before hydration, so the attribute differs.
			suppressHydrationWarning={isStaticExport}
		>
			{isStaticExport ? (
				<head>
					<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
				</head>
			) : null}
			<body>{children}</body>
		</html>
	);
}
