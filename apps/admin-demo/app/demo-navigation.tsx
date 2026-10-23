'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const demoNavigationGroups = [
  { label: 'Visão geral', items: [{ href: '/', initials: 'Vg', label: 'Dashboard' }, { href: '/catalogo', initials: 'Ca', label: 'Catálogo' }] },
  { label: 'Componentes básicos', items: [{ href: '/componentes', initials: 'Co', label: 'Componentes' }] },
  { label: 'Formulários', items: [{ href: '/componentes/datas', initials: 'Dt', label: 'Datas' }] },
  { label: 'Navegação e feedback', items: [{ href: '/catalogo', initials: 'Nv', label: 'Navegação' }, { href: '/catalogo', initials: 'Ov', label: 'Overlays' }] },
  { label: 'Dados e tabelas', items: [{ href: '/data-display', initials: 'Ex', label: 'Exibição de dados' }] },
  { label: 'Exemplos de aplicação', items: [{ href: '/clientes', initials: 'Cl', label: 'Clientes' }, { href: '/clientes/novo', initials: 'Nc', label: 'Novo cliente' }, { href: '/preferencias', initials: 'Pr', label: 'Preferências' }] },
] as const;

export const demoNavigationItems = demoNavigationGroups.flatMap((group) => group.items);

/** Grouped, keyboard-accessible application navigation. */
export function DemoNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação da demonstração">
      {demoNavigationGroups.map((group) => (
        <div key={group.label} className="demo-nav-group">
          <p className="demo-nav-group-title">{group.label}</p>
          <ul className="demo-shell-nav-list">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link aria-current={pathname === item.href ? 'page' : undefined} className="demo-shell-nav-link" href={item.href}>
                  <span aria-hidden="true" className="demo-nav-initial">{item.initials}</span>
                  <span className="ads-admin-shell-sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
