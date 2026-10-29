import { StrictMode, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdsPopover, AdsTooltip } from '../src/overlay-anchored.js';
import { AdsDropdown } from '../src/dropdown.js';
import { OverlayPortal, useAnchoredPosition } from '../src/overlay-utils.js';

const rect = (left: number, top: number, width: number, height: number) =>
	({
		left,
		top,
		width,
		height,
		right: left + width,
		bottom: top + height,
		x: left,
		y: top,
		toJSON() {},
	}) as DOMRect;

let anchorRect: DOMRect;
let panelRect: DOMRect;
let fixedOriginRect: DOMRect;
let callbacks: ResizeObserverCallback[];
let observers: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }[];
let visual: EventTarget & { offsetLeft: number; offsetTop: number; width: number; height: number };

function Harness({ open = true, attach = true }: { open?: boolean; attach?: boolean }) {
	const anchor = useRef<HTMLButtonElement>(null);
	const content = useRef<HTMLDivElement>(null);
	const position = useAnchoredPosition(open, anchor, content, 'bottom');
	return (
		<>
			<button ref={anchor}>Âncora</button>
			{open && attach && (
				<OverlayPortal>
					<div
						ref={position.attachContent}
						data-testid="panel"
						data-placement={position.placement}
						style={position.style}
					>
						Painel
					</div>
				</OverlayPortal>
			)}
		</>
	);
}

beforeEach(() => {
	vi.useFakeTimers();
	anchorRect = rect(150, 210, 20, 20);
	panelRect = rect(0, 0, 80, 40);
	fixedOriginRect = rect(0, 0, 0, 0);
	visual = Object.assign(new EventTarget(), {
		offsetLeft: 0,
		offsetTop: 0,
		width: 320,
		height: 240,
	});
	vi.stubGlobal('visualViewport', visual);
	callbacks = [];
	observers = [];
	vi.stubGlobal(
		'ResizeObserver',
		class {
			observe = vi.fn();
			disconnect = vi.fn();
			unobserve = vi.fn();
			constructor(callback: ResizeObserverCallback) {
				callbacks.push(callback);
				observers.push(this);
			}
		},
	);
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
		this: HTMLElement,
	) {
		if (this.hasAttribute('data-ads-fixed-origin')) return fixedOriginRect;
		return this.matches('button, .ads-tooltip-anchor, .ads-popover-anchor')
			? anchorRect
			: panelRect;
	});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

const flush = () =>
	act(() => {
		vi.advanceTimersByTime(20);
	});
const resize = () =>
	act(() => {
		for (const callback of callbacks) callback([], {} as ResizeObserver);
	});

describe('anchored portal lifecycle', () => {
	it('measures and observes a portal attached long after opening', () => {
		const view = render(<Harness attach={false} />);
		act(() => vi.advanceTimersByTime(1000));
		view.rerender(<Harness attach />);
		const panel = screen.getByTestId('panel');
		expect(panel).toHaveStyle({ top: '162px', left: '120px' });
		expect(panel).toHaveAttribute('data-placement', 'top');
		expect(observers.at(-1)?.observe).toHaveBeenCalledWith(panel);
	});

	it('measures the first rendered child of a multi-child trigger and follows visibility changes', () => {
		vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockImplementation(function (
			this: HTMLElement,
		) {
			if (this.dataset.testid === 'first') return rect(10, 10, 20, 20);
			if (this.dataset.testid === 'second') return anchorRect;
			return this.hasAttribute('data-ads-fixed-origin') ? fixedOriginRect : panelRect;
		});
		let firstShown = false;
		function Multi() {
			const anchor = useRef<HTMLDivElement>(null);
			const content = useRef<HTMLDivElement>(null);
			const position = useAnchoredPosition(true, anchor, content, 'bottom');
			return (
				<>
					<div ref={anchor} className="ads-popover-anchor">
						<button style={{ display: firstShown ? undefined : 'none' }} data-testid="first">
							Primeiro
						</button>
						<button data-testid="second">Segundo</button>
					</div>
					<OverlayPortal>
						<div ref={position.attachContent} data-testid="panel" style={position.style}>
							Painel
						</div>
					</OverlayPortal>
				</>
			);
		}
		const view = render(<Multi />);
		const panel = screen.getByTestId('panel');
		expect(panel).toHaveStyle({ top: '162px', left: '120px' });
		expect(observers.at(-1)?.observe).toHaveBeenCalledWith(screen.getByTestId('first'));
		firstShown = true;
		view.rerender(<Multi />);
		resize();
		flush();
		expect(panel).toHaveStyle({ top: '38px', left: '8px' });
	});

	it('repositions after content and anchor resize and coalesces notifications', () => {
		render(
			<StrictMode>
				<Harness />
			</StrictMode>,
		);
		const panel = screen.getByTestId('panel');
		panelRect = rect(0, 0, 100, 100);
		resize();
		resize();
		flush();
		expect(panel).toHaveStyle({ top: '102px', left: '110px' });
		anchorRect = rect(100, 20, 60, 20);
		resize();
		flush();
		expect(panel).toHaveAttribute('data-placement', 'bottom');
		expect(panel).toHaveStyle({ top: '48px', left: '80px' });
		const measure = vi.mocked(HTMLElement.prototype.getBoundingClientRect);
		measure.mockClear();
		resize();
		resize();
		flush();
		expect(measure).toHaveBeenCalledTimes(2);
		flush();
		expect(measure).toHaveBeenCalledTimes(2);
	});

	it('handles ancestor scroll, window resize and visual viewport pan/zoom', () => {
		render(
			<div data-testid="scroller">
				<Harness />
			</div>,
		);
		anchorRect = rect(100, 50, 20, 20);
		fireEvent.scroll(screen.getByTestId('scroller'));
		flush();
		expect(screen.getByTestId('panel')).toHaveStyle({ top: '78px' });
		visual.width = 160;
		visual.height = 120;
		visual.offsetLeft = 80;
		visual.offsetTop = 40;
		act(() => visual.dispatchEvent(new Event('resize')));
		flush();
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '88px' });
		visual.offsetLeft = 100;
		act(() => visual.dispatchEvent(new Event('scroll')));
		flush();
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '108px' });
		anchorRect = rect(150, 80, 20, 20);
		fireEvent.resize(window);
		flush();
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '120px' });
	});

	it('disconnects observers, removes listeners and cancels queued work on close/unmount', () => {
		const cancel = vi.spyOn(window, 'cancelAnimationFrame');
		const remove = vi.spyOn(window, 'removeEventListener');
		const visualRemove = vi.spyOn(visual, 'removeEventListener');
		const view = render(<Harness />);
		resize();
		view.rerender(<Harness open={false} />);
		expect(observers.every((observer) => observer.disconnect.mock.calls.length > 0)).toBe(true);
		expect(cancel).toHaveBeenCalled();
		expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
		expect(visualRemove).toHaveBeenCalledWith('resize', expect.any(Function));
		expect(visualRemove).toHaveBeenCalledWith('scroll', expect.any(Function));
		const measure = vi.mocked(HTMLElement.prototype.getBoundingClientRect);
		measure.mockClear();
		resize();
		fireEvent.resize(window);
		flush();
		expect(measure).not.toHaveBeenCalled();
		view.rerender(<Harness />);
		expect(screen.getByTestId('panel')).toHaveStyle({ top: '162px' });
		view.unmount();
		expect(observers.every((observer) => observer.disconnect.mock.calls.length > 0)).toBe(true);
	});

	it('works without ResizeObserver or visualViewport', () => {
		vi.stubGlobal('ResizeObserver', undefined);
		vi.stubGlobal('visualViewport', undefined);
		vi.stubGlobal('innerWidth', 320);
		vi.stubGlobal('innerHeight', 240);
		render(<Harness />);
		expect(screen.getByTestId('panel')).toHaveStyle({ top: '162px' });
	});

	it('does not double-count pan when a layout-rect engine accepts the CSS alias', () => {
		vi.stubGlobal('CSS', { supports: () => true });
		visual.offsetLeft = 80;
		visual.offsetTop = 40;
		visual.width = 160;
		visual.height = 120;
		anchorRect = rect(100, 50, 20, 20);
		render(<Harness />);
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '88px', top: '78px' });
	});

	it('reuses the fixed origin during pan and removes it on close and unmount', () => {
		const view = render(<Harness />);
		expect(document.querySelector('[data-ads-fixed-origin]')).toBeNull();
		visual.offsetLeft = 80;
		visual.offsetTop = 40;
		act(() => visual.dispatchEvent(new Event('scroll')));
		flush();
		const origin = document.querySelector('[data-ads-fixed-origin]')!;
		expect(origin).not.toBeNull();
		expect(origin).toHaveAttribute('aria-hidden', 'true');
		expect(origin).toHaveStyle({
			position: 'fixed',
			left: '0px',
			top: '0px',
			width: '0px',
			height: '0px',
			visibility: 'hidden',
			pointerEvents: 'none',
		});
		act(() => visual.dispatchEvent(new Event('scroll')));
		flush();
		expect(document.querySelectorAll('[data-ads-fixed-origin]')).toHaveLength(1);
		expect(document.querySelector('[data-ads-fixed-origin]')).toBe(origin);
		view.rerender(<Harness open={false} />);
		expect(document.querySelector('[data-ads-fixed-origin]')).toBeNull();
		view.rerender(<Harness />);
		expect(document.querySelector('[data-ads-fixed-origin]')).not.toBeNull();
		view.unmount();
		expect(document.querySelector('[data-ads-fixed-origin]')).toBeNull();
	});

	it('normalizes WebKit visual rects to fixed layout coordinates during pinch zoom', () => {
		vi.stubGlobal('CSS', { supports: () => false });
		fixedOriginRect = rect(-80, -40, 0, 0);
		visual.offsetLeft = 80;
		visual.offsetTop = 40;
		visual.width = 160;
		visual.height = 120;
		anchorRect = rect(20, 10, 20, 20);
		render(<Harness />);
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '88px', top: '78px' });
		fixedOriginRect = rect(-100, -50, 0, 0);
		anchorRect = rect(0, 0, 20, 20);
		visual.offsetLeft = 100;
		visual.offsetTop = 50;
		act(() => visual.dispatchEvent(new Event('scroll')));
		flush();
		expect(screen.getByTestId('panel')).toHaveStyle({ left: '108px', top: '78px' });
	});
});

describe('overlay integration', () => {
	it('hydrates the server portal marker without mismatches', () => {
		const errors = vi.spyOn(console, 'error');
		const container = document.createElement('div');
		container.innerHTML = renderToString(<Harness />);
		document.body.append(container);
		render(<Harness />, { container, hydrate: true });
		expect(screen.getByTestId('panel')).toHaveStyle({ top: '162px' });
		expect(errors).not.toHaveBeenCalled();
	});
	it('uses the effective tooltip arrow side and offset and preserves focus/Escape', () => {
		anchorRect = rect(300, 210, 20, 20);
		render(
			<AdsTooltip content="Ajuda" placement="bottom">
				<button>Ajuda</button>
			</AdsTooltip>,
		);
		const trigger = screen.getByRole('button');
		act(() => trigger.focus());
		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveAttribute('data-placement', 'top');
		expect(tooltip.querySelector('[aria-hidden]')).toHaveStyle({ left: '72px' });
		expect(tooltip.querySelector('[aria-hidden]')).toHaveClass('-bottom-1', '-translate-x-1/2');
		expect(tooltip.querySelector('[aria-hidden]')).not.toHaveClass('left-1/2');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('tooltip')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('updates popover placement after dynamic content changes without closing', () => {
		function Example() {
			const [open, setOpen] = useState(true);
			return (
				<AdsPopover aria-label="Contexto" content="Conteúdo" open={open} onOpenChange={setOpen}>
					<button>Abrir</button>
				</AdsPopover>
			);
		}
		render(<Example />);
		expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'top');
		anchorRect = rect(100, 20, 20, 20);
		panelRect = rect(0, 0, 120, 80);
		resize();
		flush();
		expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'bottom');
		expect(screen.getByRole('dialog')).toHaveStyle({ top: '48px' });
	});

	it('positions an initially open dropdown and preserves start alignment', () => {
		render(
			<AdsDropdown defaultOpen>
				<AdsDropdown.Trigger>Ações</AdsDropdown.Trigger>
				<AdsDropdown.Content>
					<AdsDropdown.Item>Editar</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		expect(screen.getByRole('menu')).toHaveAttribute('data-placement', 'top');
		expect(screen.getByRole('menu')).toHaveStyle({ left: '150px', top: '162px' });
	});

	it('renders an open portal safely on the server without reading geometry', () => {
		const measure = vi.mocked(HTMLElement.prototype.getBoundingClientRect);
		measure.mockClear();
		vi.stubGlobal('window', undefined);
		const html = renderToString(<Harness />);
		expect(html).toContain('Âncora');
		expect(html).not.toContain('Painel');
		expect(measure).not.toHaveBeenCalled();
		vi.unstubAllGlobals();
	});
});
