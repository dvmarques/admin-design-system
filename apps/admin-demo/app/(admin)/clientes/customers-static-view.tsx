'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { CustomersContent } from './customers-content';
import { buildCustomersView, type CustomersSearchParams } from './customers-view';

/**
 * Static export only: there is no server to read the search parameters, so the same view is built
 * in the browser from the URL. The regular build keeps resolving it on the server (`page.tsx`).
 */
export function CustomersStaticView() {
	const searchParams = useSearchParams();
	const view = useMemo(() => {
		const params: CustomersSearchParams = {};
		for (const key of new Set(searchParams.keys())) {
			const values = searchParams.getAll(key);
			params[key] = values.length > 1 ? values : values[0];
		}
		return buildCustomersView(params);
	}, [searchParams]);

	return <CustomersContent {...view} />;
}
