'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdsAdminShell } from '@dvmarques/admin-ds-admin';

/** O consumidor escolhe em quais páginas utiliza a região opt-in do shell. */
export function DemoFooter() {
	const pathname = usePathname();
	const isConsultation = pathname?.replace(/\/$/, '').endsWith('/exemplos/composicao-semantica/consulta');
	if (!isConsultation) return null;

	return (
		<AdsAdminShell.Footer
			start={<span>Admin Design System · Consulta administrativa</span>}
			end={<Link href="/preferencias">Preferências do Demo</Link>}
		/>
	);
}
