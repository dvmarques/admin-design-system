'use client';

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
} from 'react';

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

/** Initials from an explicit value, or from the name: first letters of two words, or two letters. */
export function getInitials(name?: string, explicit?: string): string {
	if (explicit) return explicit;
	const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return '';
	const letters =
		words.length === 1
			? Array.from(words[0]!).slice(0, 2)
			: [words[0]!, words[words.length - 1]!].map((word) => Array.from(word)[0] ?? '');
	return letters.join('').toLocaleUpperCase();
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
	return Boolean(value) && typeof (value as PromiseLike<unknown>).then === 'function';
}

/** Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`) open state. */
export function useOpenState(
	open: boolean | undefined,
	defaultOpen: boolean,
	onOpenChange?: (open: boolean) => void,
) {
	const [uncontrolled, setUncontrolled] = useState(defaultOpen);
	const current = open ?? uncontrolled;
	const setOpen = useCallback(
		(next: boolean) => {
			if (open === undefined) setUncontrolled(next);
			onOpenChange?.(next);
		},
		[onOpenChange, open],
	);
	return [current, setOpen] as const;
}

/**
 * Runs an action that may be asynchronous. A second call while one is pending is ignored, so a
 * double activation never repeats a side effect such as signing out.
 */
export function useGuardedAction() {
	const pendingRef = useRef(false);
	const [pendingId, setPendingId] = useState<string | null>(null);
	const [failedId, setFailedId] = useState<string | null>(null);
	const mountedRef = useRef(true);
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const run = useCallback((id: string, action: () => unknown, onDone?: () => void) => {
		if (pendingRef.current) return;
		setFailedId(null);
		let result: unknown;
		try {
			result = action();
		} catch {
			setFailedId(id);
			return;
		}
		if (!isPromiseLike(result)) {
			onDone?.();
			return;
		}
		pendingRef.current = true;
		setPendingId(id);
		result.then(
			() => {
				pendingRef.current = false;
				if (!mountedRef.current) return;
				setPendingId(null);
				onDone?.();
			},
			() => {
				pendingRef.current = false;
				if (!mountedRef.current) return;
				setPendingId(null);
				setFailedId(id);
			},
		);
	}, []);

	const reset = useCallback(() => setFailedId(null), []);
	return { failedId, pendingId, reset, run };
}

interface PanelKeyboardOptions {
	/** Closes the panel; the trigger gets the focus back. */
	close: () => void;
}

/**
 * Keyboard behavior for a non modal panel opened by a trigger: arrows, Home and End move between
 * the `data-ads-panel-item` controls (typing fields keep their own keys), and Tab past either end
 * closes the panel so focus returns to the trigger and the page order continues from there.
 */
export function handlePanelKeyDown(
	event: KeyboardEvent<HTMLElement>,
	{ close }: PanelKeyboardOptions,
) {
	if (event.defaultPrevented) return;
	const panel = event.currentTarget;
	const target = event.target as HTMLElement;
	const isTextField = target.matches('input, textarea, select');
	const items = Array.from(
		panel.querySelectorAll<HTMLElement>(
			'[data-ads-panel-item]:not(:disabled):not([aria-disabled="true"])',
		),
	);
	const index = items.indexOf(document.activeElement as HTMLElement);

	if (event.key === 'Tab') {
		const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const atEnd = !event.shiftKey && (document.activeElement === last || focusable.length === 0);
		const atStart = event.shiftKey && document.activeElement === first;
		if (atEnd || atStart) {
			event.preventDefault();
			close();
		}
		return;
	}

	if (items.length === 0) return;
	if (event.key === 'ArrowDown' || (event.key === 'ArrowUp' && !isTextField)) {
		const step = event.key === 'ArrowDown' ? 1 : -1;
		const from = index === -1 ? (step === 1 ? -1 : 0) : index;
		event.preventDefault();
		items[(from + step + items.length) % items.length]?.focus();
	} else if (!isTextField && event.key === 'Home') {
		event.preventDefault();
		items[0]?.focus();
	} else if (!isTextField && event.key === 'End') {
		event.preventDefault();
		items[items.length - 1]?.focus();
	}
}

/**
 * Moves the focus into the panel when it mounts, and again when `focusKey` changes while the focus
 * is not inside it (for example a list that finishes loading): `[data-ads-initial-focus]`, the first
 * control, or the panel itself when nothing is focusable yet.
 */
export function PanelContent({
	children,
	className,
	focusKey,
}: {
	children: ReactNode;
	className?: string;
	focusKey?: string;
}) {
	const ref: RefObject<HTMLDivElement | null> = useRef(null);
	useEffect(() => {
		const root = ref.current;
		if (!root) return;
		const active = document.activeElement;
		if (active && root.contains(active) && active !== root) return;
		const target =
			root.querySelector<HTMLElement>('[data-ads-initial-focus]:not(:disabled)') ??
			root.querySelector<HTMLElement>(focusableSelector) ??
			root;
		target.focus({ preventScroll: true });
	}, [focusKey]);
	return (
		<div className={className} ref={ref} tabIndex={-1}>
			{children}
		</div>
	);
}
