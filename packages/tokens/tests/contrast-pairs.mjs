/**
 * Lista central dos pares de papéis de cor verificados contra o WCAG 2.2 AA.
 * Para incluir um novo papel na verificação, adicione uma entrada aqui.
 *
 * `text` exige 4,5:1 (1.4.3); `ui` exige 3:1 (1.4.11, limites de controles, foco e seleção).
 */
export const minimumRatio = { text: 4.5, ui: 3 };

const surfaces = ['canvas', 'surface', 'surfaceRaised', 'surfaceMuted', 'surfaceHover'];
const controlBackgrounds = ['surface', 'formBackground', 'surfaceMuted', 'surfaceHover'];

const chartSurfaces = ['surface', 'surfaceRaised'];

const against = (kind, foreground, backgrounds) =>
	backgrounds.map((background) => ({ kind, foreground, background }));

export const contrastPairs = [
	...against('text', 'text', surfaces),
	...against('text', 'textPrimary', surfaces),
	...against('text', 'textSecondary', surfaces),
	...against('text', 'textMuted', surfaces),
	...against('text', 'onSurfaceSelected', ['surfaceSelected']),
	...against('text', 'onPrimary', ['primary', 'success', 'warning', 'danger']),
	...against('text', 'info', ['infoBackground']),
	...against('text', 'success', ['successBackground']),
	...against('text', 'warning', ['warningBackground']),
	...against('text', 'danger', ['dangerBackground']),
	...against('text', 'overlayCloseContent', [
		'overlayCloseBackground',
		'overlayCloseBackgroundHover',
	]),
	...against('ui', 'borderControl', controlBackgrounds),
	...against('ui', 'focus', [...surfaces, 'formBackground', 'overlayCloseBackground']),
	...against('ui', 'focusRing', [...surfaces, 'formBackground']),
	...against('ui', 'formBorderFocus', ['formBackground']),
	...against('ui', 'primary', ['surface', 'formBackground']),
	...against('ui', 'formInvalid', ['formBackground']),
	...against('ui', 'formSuccess', ['formBackground']),
	// Cores categóricas de gráfico: marcas gráficas exigem 3:1 contra a superfície (1.4.11).
	...against('ui', 'chart1', chartSurfaces),
	...against('ui', 'chart2', chartSurfaces),
	...against('ui', 'chart3', chartSurfaces),
	...against('ui', 'chart4', chartSurfaces),
	...against('ui', 'chart5', chartSurfaces),
	...against('ui', 'chart6', chartSurfaces),
	...against('ui', 'chart7', chartSurfaces),
	...against('ui', 'chart8', chartSurfaces),
];
