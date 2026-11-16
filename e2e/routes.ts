/** Every admin route of the demo, with the label of its item in the main navigation. */
export const routes = [
	{ path: '/', label: 'Visão geral' },
	{ path: '/clientes', label: 'Clientes' },
	{ path: '/clientes/novo', label: 'Novo cliente' },
	{ path: '/preferencias', label: 'Preferências' },
	{ path: '/componentes', label: 'Componentes' },
	{ path: '/data-display', label: 'Exibição de dados' },
] as const;

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];
