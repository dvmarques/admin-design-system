import { Suspense } from 'react';
import { isStaticExport } from '../../../lib/server-theme';
import { CustomersContent } from './customers-content';
import { CustomersStaticView } from './customers-static-view';
import { buildCustomersView, type CustomersSearchParams } from './customers-view';

interface CustomersPageProps {
	searchParams: Promise<CustomersSearchParams>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
	if (isStaticExport) {
		return (
			<Suspense fallback={<CustomersContent {...buildCustomersView({ estado: 'carregando' })} />}>
				<CustomersStaticView />
			</Suspense>
		);
	}

	return <CustomersContent {...buildCustomersView(await searchParams)} />;
}
