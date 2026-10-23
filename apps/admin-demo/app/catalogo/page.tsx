'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const entries = [
  { name: 'AdsButton', group: 'Básicos', href: '/componentes' },
  { name: 'AdsBadge', group: 'Básicos', href: '/componentes' },
  { name: 'AdsAvatar', group: 'Básicos', href: '/componentes' },
  { name: 'AdsIcon', group: 'Básicos', href: '/componentes' },
  { name: 'AdsInput', group: 'Formulários', href: '/componentes' },
  { name: 'AdsDatePicker', group: 'Formulários', href: '/componentes/datas' },
  { name: 'AdsBreadcrumb', group: 'Navegação', href: '/componentes/navegacao' },
  { name: 'AdsTabs', group: 'Navegação', href: '/componentes/navegacao' },
  { name: 'AdsDialog', group: 'Feedback', href: '/componentes/overlays' },
  { name: 'AdsDrawer', group: 'Feedback', href: '/componentes/overlays' },
  { name: 'AdsTable', group: 'Dados', href: '/data-display' },
  { name: 'AdsCard', group: 'Dados', href: '/data-display' },
  { name: 'AdsSmartTable', group: 'Admin', href: '/clientes' },
  { name: 'AdsStepForm', group: 'Admin', href: '/clientes/novo' },
] as const;

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => entries.filter((entry) => entry.name.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))), [query]);
  return (
    <main className="demo-page demo-shell">
      <h1>Catálogo de componentes</h1>
      <p>Encontre exemplos existentes do Admin Design System. O catálogo será ampliado para cobrir todos os exports públicos.</p>
      <label htmlFor="catalog-search">Buscar componente</label>
      <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: AdsButton" className="demo-catalog-search" />
      <p aria-live="polite">{matches.length} resultados</p>
      {matches.length === 0 ? <p>Nenhum componente encontrado.</p> : (
        <ul className="demo-catalog-list">
          {matches.map((entry) => <li key={entry.name}><Link href={entry.href}>{entry.name}</Link> <span>— {entry.group}</span></li>)}
        </ul>
      )}
    </main>
  );
}
