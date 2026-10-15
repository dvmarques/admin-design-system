'use client';

import { AdsPagination } from '@admin-ds/components';
import Link from 'next/link';

interface CustomersPaginationProps {
	page: number;
	pageCount: number;
}

/**
 * `AdsPagination` does not know about routing, so the application provides the link for each page
 * through `renderPageLink`, which keeps every page a real link without nested interactive content.
 */
export function CustomersPagination({ page, pageCount }: CustomersPaginationProps) {
	return (
		<AdsPagination
			page={page}
			pageCount={pageCount}
			renderPageLink={(target, props) => <Link href={`/clientes?pagina=${target}`} {...props} />}
		/>
	);
}
