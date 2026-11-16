/**
 * Mede sinais de geometria no browser (Playwright serializa a função em page.evaluate).
 * Não captura dependências externas nem confirma defeitos visuais.
 */
export function measureVisualArea(element: Element, boundary: 'element' | 'viewport') {
	const rect = element.getBoundingClientRect();
	const left = boundary === 'element' ? rect.left : 0;
	const right = boundary === 'element' ? rect.right : window.innerWidth;
	const selector = 'button, input, select, textarea, [role="button"], [role="combobox"]';
	const controls = Array.from(element.querySelectorAll<HTMLElement>(selector)).filter((node) => {
		const style = getComputedStyle(node);
		const size = node.getBoundingClientRect();
		if (style.display === 'none' || style.visibility === 'hidden') return false;
		return size.width > 0 && size.height > 0;
	});
	const outOfBounds = controls.filter((node) => {
		const size = node.getBoundingClientRect();
		return size.left < left - 2 || size.right > right + 2;
	}).length;
	const clippedLabels = controls.filter((node) => {
		const size = node.getBoundingClientRect();
		if (size.width <= 2 || size.height <= 2) return false;
		if (node.clientWidth <= 0 || node.scrollWidth <= node.clientWidth + 2) return false;
		// Overflow visível só é recorte se o próprio nó ou um ancestral que recorta cortar o conteúdo.
		const clips = (value: string) => value === 'hidden' || value === 'clip';
		if (clips(getComputedStyle(node).overflowX)) return true;
		const contentRight = size.left + node.scrollWidth;
		for (let parent = node.parentElement; parent; parent = parent.parentElement) {
			if (!clips(getComputedStyle(parent).overflowX)) continue;
			if (contentRight > parent.getBoundingClientRect().right + 2) return true;
		}
		return false;
	}).length;
	const documentWidth = Math.max(
		document.documentElement.scrollWidth,
		document.body?.scrollWidth ?? 0,
	);
	return {
		documentOverflowPx: documentWidth - window.innerWidth,
		previewOverflowPx: element.scrollWidth - element.clientWidth,
		controlsOutOfBounds: outOfBounds,
		controlsWithOverflow: clippedLabels,
	};
}
