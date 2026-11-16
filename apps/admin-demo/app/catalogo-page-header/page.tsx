'use client';

import { useEffect } from 'react';
import { PageHeaderDemo } from '../catalogo/catalog-demos';

/** Keep the PageHeader H1 inside its own document, not beneath the catalog's H1. */
export default function StandalonePageHeaderPreview() {
	useEffect(() => {
		document.documentElement.dataset.theme =
			new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light';
	}, []);

	return (
		<main style={{ boxSizing: 'border-box', padding: '1rem', minWidth: 0 }}>
			<PageHeaderDemo />
		</main>
	);
}
