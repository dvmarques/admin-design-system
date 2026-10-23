'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

export const defaultColumnMinWidth = 80;
export const defaultColumnMaxWidth = 640;
export const defaultColumnWidth = 160;
const keyboardStep = 10;
const keyboardLargeStep = 50;

export function clampWidth(width: number, min: number, max: number) {
	return Math.round(Math.min(Math.max(width, min), Math.max(min, max)));
}

interface ResizerProps {
	label: string;
	formatValue: (width: number) => string;
	/** Largura controlada pelo consumidor; sem ela, vale a medida do cabeçalho ou `fallback`. */
	width: number | undefined;
	fallback: number;
	min: number;
	max: number;
	onResize: (width: number) => void;
	onReset: () => void;
}

/** Alça de redimensionamento: separador focável (padrão window splitter) com ponteiro e teclado. */
export function SmartTableResizer({
	formatValue,
	fallback,
	label,
	max,
	min,
	onReset,
	onResize,
	width,
}: ResizerProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const [measured, setMeasured] = useState(0);
	const measure = () => ref.current?.closest('th')?.getBoundingClientRect().width ?? 0;
	useEffect(() => {
		const next = Math.round(measure());
		if (next > 0) setMeasured(next);
	});
	const current = clampWidth(width ?? (measured || fallback), min, max);
	const drag = useRef<{ x: number; width: number; direction: 1 | -1 } | null>(null);

	const direction = (element: HTMLElement): 1 | -1 =>
		getComputedStyle(element).direction === 'rtl' ? -1 : 1;

	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		const sign = direction(event.currentTarget);
		const step = event.shiftKey ? keyboardLargeStep : keyboardStep;
		const start = clampWidth(Math.round(measure()) || current, min, max);
		let next: number | null = null;
		if (event.key === 'ArrowRight') next = start + step * sign;
		else if (event.key === 'ArrowLeft') next = start - step * sign;
		else if (event.key === 'Home') next = min;
		else if (event.key === 'End') next = max;
		else if (event.key === 'Enter') {
			event.preventDefault();
			onReset();
			return;
		}
		if (next === null) return;
		event.preventDefault();
		onResize(clampWidth(next, min, max));
	};

	const onPointerDown = (event: PointerEvent<HTMLElement>) => {
		if (event.button !== 0) return;
		event.preventDefault();
		event.currentTarget.focus();
		event.currentTarget.setPointerCapture?.(event.pointerId);
		drag.current = {
			x: event.clientX,
			width: clampWidth(Math.round(measure()) || current, min, max),
			direction: direction(event.currentTarget),
		};
	};

	const onPointerMove = (event: PointerEvent<HTMLElement>) => {
		const state = drag.current;
		if (!state) return;
		onResize(clampWidth(state.width + (event.clientX - state.x) * state.direction, min, max));
	};

	const endDrag = (event: PointerEvent<HTMLElement>) => {
		drag.current = null;
		if (event.currentTarget.hasPointerCapture?.(event.pointerId))
			event.currentTarget.releasePointerCapture(event.pointerId);
	};

	return (
		<span
			aria-label={label}
			aria-orientation="vertical"
			aria-valuemax={max}
			aria-valuemin={min}
			aria-valuenow={current}
			aria-valuetext={formatValue(current)}
			className="ads-smart-table-resizer"
			onDoubleClick={onReset}
			onKeyDown={onKeyDown}
			onPointerCancel={endDrag}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={endDrag}
			ref={ref}
			role="separator"
			tabIndex={0}
		/>
	);
}
