import { act } from '@testing-library/react';
import { vi } from 'vitest';

type Listener = () => void;

/** Simulates `matchMedia` for the shell breakpoint so tests can cross it deterministically. */
export function installViewport(initialDesktop: boolean) {
	const original = window.matchMedia;
	let desktop = initialDesktop;
	const listeners = new Set<Listener>();
	window.matchMedia = vi.fn((query: string) => ({
		get matches() {
			return desktop;
		},
		media: query,
		onchange: null,
		addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
		removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
		addListener: (listener: Listener) => listeners.add(listener),
		removeListener: (listener: Listener) => listeners.delete(listener),
		dispatchEvent: () => false,
	})) as unknown as typeof window.matchMedia;

	return {
		setDesktop(next: boolean) {
			desktop = next;
			act(() => {
				listeners.forEach((listener) => listener());
			});
		},
		restore() {
			window.matchMedia = original as typeof window.matchMedia;
		},
	};
}
