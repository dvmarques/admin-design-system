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

/**
 * Elegível ao foco inicial: não desabilitado (inclusive por `fieldset`), sem `inert` e visível
 * (sem `hidden`, `display: none` ou `visibility: hidden` no elemento ou em ancestrais até o contêiner).
 */
function isInitialFocusEligible(element: HTMLElement, container: HTMLElement) {
	if (element.matches(':disabled') || element.closest('[inert]')) return false;
	if (getComputedStyle(element).visibility !== 'visible') return false;
	for (
		let node: HTMLElement | null = element;
		node && container.contains(node);
		node = node.parentElement
	) {
		if (node.hidden || getComputedStyle(node).display === 'none') return false;
	}
	return true;
}

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

/**
 * Indica se `target` pertence a `container` na hierarquia lógica: dentro dele no DOM ou dentro de um
 * portal cuja origem (na árvore React) está, recursivamente, dentro dele.
 */
function logicalContains(container: Element | null, target: Node): boolean {
	const seen = new Set<Element>();
	let node: Node | null = target;
	while (node) {
		if (container?.contains(node)) return true;
		const element: Element | null = node instanceof Element ? node : node.parentElement;
		const root: Element | null = element?.closest(overlayRootSelector) ?? null;
		const source: Element | undefined = root ? overlaySources.get(root) : undefined;
		if (!root || !source || seen.has(root)) return false;
		seen.add(root);
		node = source;
	}
	return false;
}

function isTopModal(container: Element) {
	const top = openModals[openModals.length - 1];
	return Boolean(top && top.root.contains(container));
}

// Contêineres de camadas que fecham por clique externo e estão abertas, para o backdrop dos modais.
const dismissibleLayers = new Set<RefObject<HTMLElement | null>>();

/** Há um popup aberto, com clique externo, logicamente dentro de `container`? */
export function hasOpenDismissibleChild(container: Element | null) {
	if (!container) return false;
	for (const layer of dismissibleLayers) {
		if (layer.current && layer.current !== container && logicalContains(container, layer.current))
			return true;
	}
	return false;
}

// Scroll da página: aplicado pelo primeiro modal e liberado pelo último.
let scrollLock: { overflow: string; paddingRight: string; applied: [string, string] } | null = null;

function lockScroll() {
	const root = document.documentElement;
	const scrollbar = window.innerWidth - root.clientWidth;
	const overflow = root.style.overflow;
	const paddingRight = root.style.paddingRight;
	root.style.overflow = 'hidden';
	if (scrollbar > 0) {
		const base = Number.parseFloat(getComputedStyle(root).paddingRight) || 0;
		root.style.paddingRight = `${base + scrollbar}px`;
	}
	scrollLock = { overflow, paddingRight, applied: [root.style.overflow, root.style.paddingRight] };
}

function unlockScroll() {
	if (!scrollLock) return;
	const root = document.documentElement;
	// Só desfaz o que a biblioteca aplicou: uma escrita posterior do consumidor é preservada.
	if (root.style.overflow === scrollLock.applied[0]) root.style.overflow = scrollLock.overflow;
	if (root.style.paddingRight === scrollLock.applied[1])
		root.style.paddingRight = scrollLock.paddingRight;
	scrollLock = null;
}

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
	if (openModals.length === 1) lockScroll();
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
		unlockScroll();
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
			const first = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).find(
				(element) => isInitialFocusEligible(element, container),
			);
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
			// Só o modal superior governa o Tab; o foco num popup descendente segue o fluxo dele.
			if (!container || !isTopModal(container)) return;
			const active = document.activeElement;
			if (
				active &&
				active !== document.body &&
				!container.contains(active) &&
				logicalContains(container, active)
			)
				return;
			const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
			if (elements.length === 0) {
				event.preventDefault();
				container.focus();
				return;
			}
			const first = elements[0]!;
			const last = elements[elements.length - 1]!;
			if (!container.contains(active)) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
			} else if (event.shiftKey && active === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
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
		dismissibleLayers.add(containerRef);
		const listener = (event: MouseEvent) => {
			const target = event.target;
			if (target instanceof Node && !logicalContains(containerRef.current, target))
				onOutside(event);
		};
		document.addEventListener('mousedown', listener);
		return () => {
			dismissibleLayers.delete(containerRef);
			document.removeEventListener('mousedown', listener);
		};
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
		space[preferred] >= size || space[preferred] >= space[opposite] ? preferred : opposite;
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
		? clamp(anchorCenterX - x, Math.min(8, width / 2), Math.max(width / 2, width - 8))
		: clamp(anchorCenterY - y, Math.min(8, height / 2), Math.max(height / 2, height - 8));
	return { style: { left: x, top: y }, placement, arrowOffset };
}

export function useAnchoredPosition(
	open: boolean,
	anchorRef: RefObject<HTMLElement | null>,
	contentRef: RefObject<HTMLElement | null>,
	placement: AnchoredPlacement = 'bottom',
	align: AnchoredAlign = 'center',
) {
	const [panel, setPanel] = useState<HTMLElement | null>(null);
	// A ref de callback acompanha a montagem real do portal, inclusive anexos tardios.
	const attachContent = useCallback(
		(node: HTMLElement | null) => {
			contentRef.current = node;
			setPanel(node);
		},
		[contentRef],
	);
	const [position, setPosition] = useState<AnchoredPosition>({
		style: { opacity: 0 },
		placement,
		arrowOffset: 0,
	});
	useLayoutEffect(() => {
		const anchor = anchorRef.current;
		if (!open || !anchor || !panel) return;
		const view = panel.ownerDocument.defaultView;
		if (!view) return;
		const visual = view.visualViewport;
		let frame: number | null = null;
		let disposed = false;
		let fixedOrigin: HTMLDivElement | null = null;
		// Tooltip e Popover usam um span para eventos e para o portal. Em flex/stretch
		// esse span pode ocupar toda a largura, enquanto o gatilho visual é compacto.
		// Medir o elemento visível preserva também gatilhos de largura integral.
		const measuredAnchor = anchor.matches('.ads-tooltip-anchor, .ads-popover-anchor')
			? (anchor.firstElementChild ?? anchor)
			: anchor;
		const update = () => {
			if (disposed) return;
			const rect = panel.getBoundingClientRect();
			const anchorRect = measuredAnchor.getBoundingClientRect();
			// Uma origem fixed conhecida converte rects visuais sem identificar motores
			// por aliases CSS. Só precisamos medi-la quando há pan da viewport visual.
			let dx = 0;
			let dy = 0;
			if (visual && (visual.offsetLeft !== 0 || visual.offsetTop !== 0)) {
				if (!fixedOrigin) {
					fixedOrigin = panel.ownerDocument.createElement('div');
					fixedOrigin.setAttribute('data-ads-fixed-origin', '');
					fixedOrigin.setAttribute('aria-hidden', 'true');
					fixedOrigin.style.cssText =
						'all:initial;position:fixed;left:0;top:0;width:0;height:0;margin:0;padding:0;border:0;visibility:hidden;pointer-events:none';
					panel.ownerDocument.body.append(fixedOrigin);
				}
				const originRect = fixedOrigin.getBoundingClientRect();
				dx = -originRect.left;
				dy = -originRect.top;
			}
			const next = calculateAnchoredPosition(
				{
					left: anchorRect.left + dx,
					right: anchorRect.right + dx,
					top: anchorRect.top + dy,
					bottom: anchorRect.bottom + dy,
					width: anchorRect.width,
					height: anchorRect.height,
				},
				rect.width,
				rect.height,
				{
					left: visual?.offsetLeft ?? 0,
					top: visual?.offsetTop ?? 0,
					width: visual?.width ?? (view.document.documentElement.clientWidth || view.innerWidth),
					height:
						visual?.height ?? (view.document.documentElement.clientHeight || view.innerHeight),
				},
				placement,
				align,
			);
			setPosition((previous) =>
				previous.placement === next.placement &&
				previous.arrowOffset === next.arrowOffset &&
				previous.style.left === next.style.left &&
				previous.style.top === next.style.top &&
				previous.style.opacity === undefined
					? previous
					: next,
			);
		};
		const schedule = () => {
			if (disposed || frame !== null) return;
			frame = view.requestAnimationFrame(() => {
				frame = null;
				update();
			});
		};
		update();
		view.addEventListener('resize', schedule);
		view.addEventListener('scroll', schedule, true);
		visual?.addEventListener('resize', schedule);
		visual?.addEventListener('scroll', schedule);
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
		observer?.observe(anchor);
		if (measuredAnchor !== anchor) observer?.observe(measuredAnchor);
		observer?.observe(panel);
		return () => {
			disposed = true;
			fixedOrigin?.remove();
			if (frame !== null) view.cancelAnimationFrame(frame);
			observer?.disconnect();
			view.removeEventListener('resize', schedule);
			view.removeEventListener('scroll', schedule, true);
			visual?.removeEventListener('resize', schedule);
			visual?.removeEventListener('scroll', schedule);
		};
	}, [align, anchorRef, open, panel, placement]);
	return {
		...position,
		attachContent,
		style: open && panel ? position.style : { opacity: 0 },
	};
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
