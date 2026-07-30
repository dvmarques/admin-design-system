import { StyleFixture } from '@admin-ds/components';
import { tokenValues } from '@admin-ds/tokens';
import { cookies } from 'next/headers';
import { resolveTheme } from '../lib/theme';
import { ThemeControl } from './theme-control';

export default async function HomePage() {
	const cookieStore = await cookies();
	const theme = resolveTheme(cookieStore.get('ads-theme')?.value);

	return (
		<main style={{ margin: '0 auto', maxWidth: '72rem', padding: '2rem' }}>
			<header
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '1rem',
				}}
			>
				<div>
					<p style={{ color: 'var(--ads-color-text-muted)', margin: 0 }}>Admin Design System</p>
					<h1>Aplicação de referência</h1>
				</div>
				<ThemeControl initialTheme={theme} />
			</header>
			<section aria-labelledby="foundations" style={{ marginTop: '2rem' }}>
				<h2 id="foundations">Fundação visual</h2>
				<div
					style={{
						display: 'grid',
						gap: '1rem',
						gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
					}}
				>
					<StyleFixture>Superfície neutra</StyleFixture>
					<StyleFixture variant="primary">Ação primária</StyleFixture>
					<StyleFixture variant="danger">Estado de perigo</StyleFixture>
				</div>
			</section>
			<section aria-labelledby="tokens" style={{ marginTop: '2rem' }}>
				<h2 id="tokens">Tokens públicos</h2>
				<p>{Object.keys(tokenValues).length} tokens estão disponíveis pela API pública.</p>
			</section>
		</main>
	);
}
