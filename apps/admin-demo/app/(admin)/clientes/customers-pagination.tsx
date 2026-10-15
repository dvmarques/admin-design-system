'use client';

import { AdsPagination } from '@admin-ds/components';
import { useRouter } from 'next/navigation';

interface CustomersPaginationProps {
	page: number;
	pageCount: number;
}

/**
 * `AdsPagination` renders buttons and does not know about routing, so the application turns each
 * page change into a navigation here.
 */
export function CustomersPagination({ page, pageCount }: CustomersPaginationProps) {
	const router = useRouter();

	return (
		<AdsPagination
			onPageChange={(next) => router.push(`/clientes?pagina=${next}`)}
			page={page}
			pageCount={pageCount}
		/>
	);
}
