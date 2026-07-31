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

export function OverlayPortal({ children }: { children: ReactNode }) {
	const mounted = useMounted();
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

	return (
		<>
			<span aria-hidden="true" hidden ref={sourceRef} />
			{mounted
				? createPortal(
						<div className="contents" data-ads-overlay-root="" data-theme={theme ?? undefined}>
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
			restoreFocusRef.current?.focus();
		}
	}, [open, restoreFocusRef]);

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

export function useEscapeKey(open: boolean, onEscape?: () => void) {
	useEffect(() => {
		if (!open || !onEscape) return;
		const listener = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onEscape();
		};
		document.addEventListener('keydown', listener);
		return () => document.removeEventListener('keydown', listener);
	}, [onEscape, open]);
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

export function useAnchoredPosition(
	open: boolean,
	anchorRef: RefObject<HTMLElement | null>,
	contentRef: RefObject<HTMLElement | null>,
	placement: 'top' | 'right' | 'bottom' | 'left' = 'bottom',
) {
	const [position, setPosition] = useState<React.CSSProperties>({});
	const update = useCallback(() => {
		const anchor = anchorRef.current;
		const content = contentRef.current;
		if (!anchor || !content) return;
		const rect = anchor.getBoundingClientRect();
		const width = content.offsetWidth;
		const height = content.offsetHeight;
		const gap = 8;
		let left = rect.left + rect.width / 2 - width / 2;
		let top = rect.bottom + gap;
		if (placement === 'top') top = rect.top - height - gap;
		if (placement === 'left') {
			left = rect.left - width - gap;
			top = rect.top + rect.height / 2 - height / 2;
		}
		if (placement === 'right') {
			left = rect.right + gap;
			top = rect.top + rect.height / 2 - height / 2;
		}
		left = Math.min(Math.max(8, left), Math.max(8, window.innerWidth - width - 8));
		top = Math.min(Math.max(8, top), Math.max(8, window.innerHeight - height - 8));
		setPosition({ left, top });
	}, [anchorRef, contentRef, placement]);

	useLayoutEffect(() => {
		if (!open) return;
		update();
		const timer = window.setTimeout(update, 0);
		window.addEventListener('resize', update);
		window.addEventListener('scroll', update, true);
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener('resize', update);
			window.removeEventListener('scroll', update, true);
		};
	}, [open, update]);

	return position;
}
