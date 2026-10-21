'use client';

import {
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type RefObject,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

const focusableSelector = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export function useStableId(prefix: string) {
	const reactId = useId();
	return `${prefix}-${reactId.replaceAll(':', '')}`;
}

export function useMounted() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return mounted;
}

type OverlayLayer = 'modal' | 'popup' | 'toast';

interface OpenModal {
	root: HTMLElement;
}

const openModals: OpenModal[] = [];
// Nós de `body` que a biblioteca marcou como inertes e que ela mesma desfaz ao liberar.
const inertOwned = new Set<Element>();
// Origem lógica (na árvore React) do root de cada portal: decide se um popup nasceu dentro de um modal.
const overlaySources = new WeakMap<Element, Element>();
// Elemento que abriu cada modal, por root, para o fallback do retorno de foco.
const overlayOrigins = new WeakMap<Element, RefObject<HTMLElement | null>>();
let bodyObserver: MutationObserver | null = null;
const nonRenderedTags = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE']);
const overlayRootSelector = '[data-ads-overlay-root]';

// Um root de overlay continua interativo se for o modal mais recente, um toast, ou um popup cuja
// origem está dentro de um overlay interativo. Um modal ainda não registrado é tratado como novo.
function isInteractiveRoot(root: Element): boolean {
	const layer = root.getAttribute('data-ads-overlay-layer');
	if (layer === 'toast') return true;
	if (layer === 'modal') {
		return (
			root === openModals[openModals.length - 1]?.root ||
			!openModals.some((modal) => modal.root === root)
		);
	}
	const host = overlaySources.get(root)?.closest(overlayRootSelector);
	return host ? isInteractiveRoot(host) : false;
}

function shouldBeInert(child: Element) {
	if (nonRenderedTags.has(child.tagName)) return false;
	return !(child.hasAttribute('data-ads-overlay-root') && isInteractiveRoot(child));
}

// Uma escrita externa em `inert` num nó que a biblioteca marcou transfere a posse ao consumidor:
// se ele acrescentou o atributo, ele permanece depois do modal; se o removeu, o nó é marcado de novo
// enquanto houver modal aberto e o atributo volta a faltar ao liberar.
function adoptExternalWrites(records: MutationRecord[]) {
	for (const record of records) {
		if (record.type === 'attributes') inertOwned.delete(record.target as Element);
	}
}

/**
 * Reconcilia o `inert` de `body` com os modais abertos: tudo fora do modal mais recente, de toasts
 * e de popups nascidos dentro dele fica inerte, inclusive nós criados depois da abertura. Nós que já
 * tinham `inert` não são tocados.
 */
function syncInert(records: MutationRecord[] = bodyObserver?.takeRecords() ?? []) {
	if (!bodyObserver) return;
	adoptExternalWrites(records);
	const children = Array.from(document.body.children);
	// Um nó marcado que saiu de `body` devolve o estado: se for reinserido, não volta inerte sozinho.
	for (const owned of inertOwned) {
		if (children.includes(owned)) continue;
		owned.removeAttribute('inert');
		inertOwned.delete(owned);
	}
	for (const child of children) {
		bodyObserver.observe(child, { attributes: true, attributeFilter: ['inert'] });
		if (shouldBeInert(child)) {
			if (!inertOwned.has(child) && !child.hasAttribute('inert')) {
				child.setAttribute('inert', '');
				inertOwned.add(child);
			}
		} else if (inertOwned.has(child)) {
			child.removeAttribute('inert');
			inertOwned.delete(child);
		}
	}
	// Descarta os registros das próprias escritas.
	bodyObserver.takeRecords();
}

function registerModal(root: HTMLElement) {
	const modal = { root };
	openModals.push(modal);
	if (!bodyObserver) {
		bodyObserver = new MutationObserver((records) => syncInert(records));
		bodyObserver.observe(document.body, { childList: true });
	}
	syncInert();
	return () => {
		const index = openModals.indexOf(modal);
		if (index !== -1) openModals.splice(index, 1);
		if (openModals.length > 0) {
			syncInert();
			return;
		}
		adoptExternalWrites(bodyObserver?.takeRecords() ?? []);
		bodyObserver?.disconnect();
		bodyObserver = null;
		for (const node of inertOwned) node.removeAttribute('inert');
		inertOwned.clear();
	};
}

/**
 * Candidatos para devolver o foco quando o elemento que abriu o modal saiu da página: os elementos
 * que abriram os modais ao redor, do mais próximo ao mais externo.
 */
function collectFocusFallbacks(origin: HTMLElement | null) {
	const chain: HTMLElement[] = [];
	const seen = new Set<Element>();
	let node: Element | null = origin;
	while (node) {
		const root: Element | null = node.closest(overlayRootSelector);
		if (!root) break;
		const modalOrigin = overlayOrigins.get(root)?.current;
		const next: Element | undefined = modalOrigin ?? overlaySources.get(root);
		if (!next || seen.has(next)) break;
		seen.add(next);
		if (modalOrigin) chain.push(modalOrigin);
		node = next;
	}
	return chain;
}

export function OverlayPortal({
	children,
	layer = 'popup',
}: {
	children: ReactNode;
	layer?: OverlayLayer;
}) {
	const mounted = useMounted();
	const rootRef = useRef<HTMLDivElement>(null);
	const sourceRef = useRef<HTMLSpanElement>(null);
	const [theme, setTheme] = useState<string | null>(null);

	useLayoutEffect(() => {
		const source = sourceRef.current;
		if (!source) return;
		const themeRoot = source.closest<HTMLElement>('[data-theme]') ?? document.documentElement;
		const syncTheme = () => setTheme(themeRoot.getAttribute('data-theme'));
		syncTheme();
		const observer = new MutationObserver(syncTheme);
		observer.observe(themeRoot, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	}, []);

	useLayoutEffect(() => {
		const root = rootRef.current;
		const source = sourceRef.current;
		if (mounted && root && source) overlaySources.set(root, source);
	}, [mounted]);

	// O cleanup roda na desmontagem do portal, antes de `useOverlayFocus` devolver o foco: um
	// elemento inerte não recebe foco.
	useEffect(() => {
		const root = rootRef.current;
		if (!mounted || layer !== 'modal' || !root) return;
		return registerModal(root);
	}, [layer, mounted]);

	return (
		<>
			<span aria-hidden="true" hidden ref={sourceRef} />
			{mounted
				? createPortal(
						<div
							className="contents"
							data-ads-overlay-layer={layer}
							data-ads-overlay-root=""
							data-theme={theme ?? undefined}
							ref={rootRef}
						>
							{children}
						</div>,
						document.body,
					)
				: null}
		</>
	);
}

export function useOverlayFocus(
	open: boolean,
	containerRef: RefObject<HTMLElement | null>,
	restoreFocusRef: RefObject<HTMLElement | null>,
	fallbackFocusRef?: RefObject<HTMLElement[]>,
) {
	const previousOpen = useRef(false);

	useLayoutEffect(() => {
		if (!open || previousOpen.current) return;
		const focus = () => {
			const container = containerRef.current;
			if (!container) return;
			const first = container.querySelector<HTMLElement>(focusableSelector);
			(first ?? container).focus();
		};
		focus();
		const timer = window.setTimeout(focus, 0);
		return () => window.clearTimeout(timer);
	}, [containerRef, open]);

	useEffect(() => {
		if (open && !previousOpen.current) previousOpen.current = true;
		if (!open && previousOpen.current) {
			previousOpen.current = false;
			// Se o elemento de origem saiu da página, usa o que abriu o modal ao redor.
			const target = [restoreFocusRef.current, ...(fallbackFocusRef?.current ?? [])].find(
				(element) => element?.isConnected,
			);
			target?.focus();
		}
	}, [fallbackFocusRef, open, restoreFocusRef]);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return;
			const container = containerRef.current;
			if (!container) return;
			const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
			if (elements.length === 0) {
				event.preventDefault();
				container.focus();
				return;
			}
			const first = elements[0]!;
			const last = elements[elements.length - 1]!;
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [containerRef, open]);
}

interface EscapeLayer {
	canClose: boolean;
	onEscape: () => void;
}

// Camadas abertas na ordem de abertura: a última é a superior. Só é tocada em efeitos, no cliente.
const escapeLayers: EscapeLayer[] = [];

function handleEscapeKeyDown(event: KeyboardEvent) {
	if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
	const top = escapeLayers[escapeLayers.length - 1];
	if (!top) return;
	// Marca o evento como tratado sem interromper a propagação para outros observadores.
	event.preventDefault();
	if (top.canClose) top.onEscape();
}

function registerEscapeLayer(layer: EscapeLayer) {
	if (escapeLayers.length === 0) document.addEventListener('keydown', handleEscapeKeyDown);
	escapeLayers.push(layer);
	return () => {
		const index = escapeLayers.indexOf(layer);
		if (index !== -1) escapeLayers.splice(index, 1);
		if (escapeLayers.length === 0) document.removeEventListener('keydown', handleEscapeKeyDown);
	};
}

/**
 * Registra uma camada para o Escape. Só a camada superior trata o evento. Com `canClose` falso, ela
 * continua absorvendo o Escape sem fechar, para que uma camada inferior não feche em seu lugar.
 */
export function useEscapeKey(open: boolean, onEscape?: () => void, canClose = true) {
	const layerRef = useRef<EscapeLayer>({ canClose, onEscape: () => undefined });

	useEffect(() => {
		layerRef.current.canClose = canClose;
		layerRef.current.onEscape = onEscape ?? (() => undefined);
	});

	const active = open && Boolean(onEscape);
	useEffect(() => {
		if (!active) return;
		return registerEscapeLayer(layerRef.current);
	}, [active]);
}

export function useClickOutside(
	open: boolean,
	containerRef: RefObject<HTMLElement | null>,
	onOutside?: (event: MouseEvent) => void,
) {
	useEffect(() => {
		if (!open || !onOutside) return;
		const listener = (event: MouseEvent) => {
			const target = event.target;
			if (target instanceof Node && !containerRef.current?.contains(target)) onOutside(event);
		};
		document.addEventListener('mousedown', listener);
		return () => document.removeEventListener('mousedown', listener);
	}, [containerRef, onOutside, open]);
}

type AnchoredPlacement = 'top' | 'right' | 'bottom' | 'left';
type AnchoredAlign = 'center' | 'start';

const oppositePlacement: Record<AnchoredPlacement, AnchoredPlacement> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

export interface AnchoredPosition {
	style: React.CSSProperties;
	placement: AnchoredPlacement;
	arrowOffset: number;
}

/** Calcula a geometria sem acessar o DOM, para permitir testes determinísticos. */
export function calculateAnchoredPosition(
	anchor: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>,
	width: number,
	height: number,
	viewport: { left: number; top: number; width: number; height: number },
	preferred: AnchoredPlacement,
	align: AnchoredAlign = 'center',
): AnchoredPosition {
	const gap = 8;
	const margin = 8;
	const bounds = {
		left: viewport.left + margin,
		top: viewport.top + margin,
		right: viewport.left + viewport.width - margin,
		bottom: viewport.top + viewport.height - margin,
	};
	const space: Record<AnchoredPlacement, number> = {
		top: anchor.top - bounds.top - gap,
		bottom: bounds.bottom - anchor.bottom - gap,
		left: anchor.left - bounds.left - gap,
		right: bounds.right - anchor.right - gap,
	};
	const size = preferred === 'top' || preferred === 'bottom' ? height : width;
	const opposite = oppositePlacement[preferred];
	const placement =
		space[preferred] >= size || space[preferred] >= space[opposite]
			? preferred
			: opposite;
	const clamp = (value: number, min: number, max: number) =>
		Math.min(Math.max(value, min), Math.max(min, max));
	const horizontal = placement === 'top' || placement === 'bottom';
	const anchorCenterX = anchor.left + anchor.width / 2;
	const anchorCenterY = anchor.top + anchor.height / 2;
	const left = horizontal
		? align === 'start'
			? anchor.left
			: anchorCenterX - width / 2
		: placement === 'left'
			? anchor.left - width - gap
			: anchor.right + gap;
	const top = horizontal
		? placement === 'top'
			? anchor.top - height - gap
			: anchor.bottom + gap
		: anchorCenterY - height / 2;
	const x = clamp(left, bounds.left, bounds.right - width);
	const y = clamp(top, bounds.top, bounds.bottom - height);
	const arrowOffset = horizontal
		? clamp(anchorCenterX - x, 8, width - 8)
		: clamp(anchorCenterY - y, 8, height - 8);
	return { style: { left: x, top: y }, placement, arrowOffset };
}

export function useAnchoredPosition(
	open: boolean,
	anchorRef: RefObject<HTMLElement | null>,
	contentRef: RefObject<HTMLElement | null>,
	placement: AnchoredPlacement = 'bottom',
	align: AnchoredAlign = 'center',
): AnchoredPosition {
	const [position, setPosition] = useState<AnchoredPosition>({
		style: {},
		placement,
		arrowOffset: 0,
	});
	const update = useCallback(() => {
		const anchor = anchorRef.current;
		const content = contentRef.current;
		if (!anchor || !content) return;
		const visual = window.visualViewport;
		const viewport = {
			left: visual?.offsetLeft ?? 0,
			top: visual?.offsetTop ?? 0,
			width: visual?.width ?? window.innerWidth,
			height: visual?.height ?? window.innerHeight,
		};
		const next = calculateAnchoredPosition(
			anchor.getBoundingClientRect(),
			content.getBoundingClientRect().width || content.offsetWidth,
			content.getBoundingClientRect().height || content.offsetHeight,
			viewport,
			placement,
			align,
		);
		setPosition((previous) =>
			previous.placement === next.placement &&
			previous.arrowOffset === next.arrowOffset &&
			previous.style.left === next.style.left &&
			previous.style.top === next.style.top
				? previous
				: next,
		);
	}, [align, anchorRef, contentRef, placement]);

	useLayoutEffect(() => {
		if (!open) return;
		let frame = 0;
		const schedule = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				update();
			});
		};
		update();
		// Portals can attach their content after this layout effect.
		const timer = window.setTimeout(schedule, 0);
		window.addEventListener('resize', schedule);
		window.addEventListener('scroll', schedule, true);
		window.visualViewport?.addEventListener('resize', schedule);
		window.visualViewport?.addEventListener('scroll', schedule);
		const observer =
			typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
		if (anchorRef.current) observer?.observe(anchorRef.current);
		if (contentRef.current) observer?.observe(contentRef.current);
		// The portal can be mounted asynchronously: observe its panel on the next tick.
		const observeTimer = window.setTimeout(() => {
			if (contentRef.current) observer?.observe(contentRef.current);
			schedule();
		}, 0);
		return () => {
			window.clearTimeout(timer);
			window.clearTimeout(observeTimer);
			if (frame) window.cancelAnimationFrame(frame);
			observer?.disconnect();
			window.removeEventListener('resize', schedule);
			window.removeEventListener('scroll', schedule, true);
			window.visualViewport?.removeEventListener('resize', schedule);
			window.visualViewport?.removeEventListener('scroll', schedule);
		};
	}, [anchorRef, contentRef, open, update]);

	return position;
}

export function useOverlayOrigin(restoreFocusRef: RefObject<HTMLElement | null>) {
	const fallbackFocusRef = useRef<HTMLElement[]>([]);
	const attachPanel = useCallback(
		(panel: HTMLElement | null) => {
			const root = panel?.closest(overlayRootSelector);
			if (root) overlayOrigins.set(root, restoreFocusRef);
		},
		[restoreFocusRef],
	);
	const captureOrigin = useCallback(
		(origin: HTMLElement | null) => {
			restoreFocusRef.current = origin;
			fallbackFocusRef.current = collectFocusFallbacks(origin);
		},
		[restoreFocusRef],
	);
	return { attachPanel, captureOrigin, fallbackFocusRef };
}
