'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { AdsTypography } from '@dvmarques/admin-ds-components';
import type { ThemePreference } from '../../lib/theme';
import { ThemeControl } from '../theme-control';
import { AuthPanel } from './auth-panel';

export function AuthChrome({
	children,
	initialPreference,
}: {
	children: ReactNode;
	initialPreference: ThemePreference;
}) {
	return (
		<div className="demo-auth-page">
			<header className="demo-auth-header">
				<Link className="demo-auth-back" href="/">
					Voltar ao Demo
				</Link>
				<ThemeControl initialPreference={initialPreference} />
			</header>
			<div className="demo-auth-layout">
				<main aria-label="Autenticação demonstrativa" className="demo-auth-main" tabIndex={0}>
					{children}
				</main>
				<AuthPanel />
			</div>
		</div>
	);
}

export function AuthIntro({ description, title }: { description: string; title: string }) {
	return (
		<header className="demo-auth-intro">
			<p className="demo-kicker">Demonstração</p>
			<AdsTypography as="h1" className="demo-auth-title" variant="heading1">
				{title}
			</AdsTypography>
			<AdsTypography className="demo-auth-description" variant="muted">
				{description}
			</AdsTypography>
		</header>
	);
}
