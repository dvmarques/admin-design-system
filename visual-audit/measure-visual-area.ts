/**
 * Mede sinais de geometria no browser (Playwright serializa esta função em page.evaluate).
 * Não captura dependências externas nem declara bugs confirmados.
 */
export function measureVisualArea(element: Element, boundary: 'element' | 'viewport') {
	const frame =
		boundary === 'element'
			? element.getBoundingClientRect()
			: { left: 0, right: window.innerWidth };
	const controls = [
		...element.querySelectorAll<HTMLElement>(
			'button, input, select, textarea, [role="button"], [role="combobox"]',
		),
	].filter((node) => {
		const style = getComputedStyle(node);
		const rect = node.getBoundingClientRect();
		return (
			style.display !== 'none' &&
			style.visibility !== 'hidden' &&
			rect.width > 0 &&
			rect.height > 0
		);
	});
	const outOfBounds = controls.filter((node) => {
		const rect = node.getBoundingClientRect();
		return rect.left < frame.left - 2 || rect.right > frame.right + 2;
	}).length;
	const clippedLabels = controls.filter((node) => {
		const style = getComputedStyle(node);
		const rect = node.getBoundingClientRect();
		const clipsContent = style.overflowX === 'hidden' || style.overflowX === 'clip';
		return (
			// Ignora controles visualmente ocultos (ex.: input sr-only de 1×1px).
			rect.width > 2 &&
			rect.height > 2 &&
			node.clientWidth > 0 &&
			node.scrollWidth > node.clientWidth + 2 &&
			// Overflow visível não recorta o ícone e não comprova truncamento.
			clipsContent
		);
	}).length;
	return {
		documentOverflowPx:
			Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0) -
			window.innerWidth,
		previewOverflowPx: element.scrollWidth - element.clientWidth,
		controlsOutOfBounds: outOfBounds,
		controlsWithOverflow: clippedLabels,
	};
}
