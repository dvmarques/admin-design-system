'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { catalogEntries } from './catalog-data';

export default function CatalogPage() {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => catalogEntries.filter((entry) => entry.name.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))), [query]);
  return (
    <main className="demo-page demo-shell">
      <h1>Catálogo de componentes</h1>
      <p><Link href="/catalogo/lacunas">Ver demonstrações de composição de campos e tabelas</Link></p>
      <p>Explore o inventário dos componentes públicos. Os links apontam para exemplos por categoria enquanto as demonstrações individuais são implementadas.</p>
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
