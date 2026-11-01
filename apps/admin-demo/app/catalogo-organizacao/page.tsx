'use client';

import { useEffect, useState } from 'react';
import { OrganizationShellExample } from '../catalogo/catalog-demos';

/** Documento próprio: compara a sidebar com e sem o seletor opcional (`?variante=com|sem`). */
export default function OrganizationPreviewPage() {
	const [withSwitcher, setWithSwitcher] = useState<boolean | null>(null);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		document.documentElement.dataset.theme = params.get('theme') === 'dark' ? 'dark' : 'light';
		setWithSwitcher(params.get('variante') !== 'sem');
	}, []);
	return withSwitcher === null ? null : <OrganizationShellExample withSwitcher={withSwitcher} />;
}
