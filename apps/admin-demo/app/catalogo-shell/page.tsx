'use client';

import { useEffect } from 'react';
import { AdminShellDemo } from '../catalogo/catalog-demos';

/** Documento próprio evita main/header aninhados no shell do catálogo. */
export default function ShellPreviewPage() {
	useEffect(() => {
		document.documentElement.dataset.theme =
			new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light';
	}, []);
	return <AdminShellDemo />;
}
