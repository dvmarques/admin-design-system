import { describe, expect, it } from 'vitest';
import { calculateAnchoredPosition } from '../src/overlay-utils.js';

const anchor = (left: number, top: number, width = 20, height = 20) => ({
	left,
	top,
	width,
	height,
	right: left + width,
	bottom: top + height,
});
const viewport = { left: 0, top: 0, width: 320, height: 240 };

describe('calculateAnchoredPosition', () => {
	it.each([
		['top', 150, 8, 'bottom'],
		['bottom', 150, 212, 'top'],
		['left', 8, 100, 'right'],
		['right', 292, 100, 'left'],
	] as const)('flips %s to its opposite', (preferred, x, y, effective) => {
		const result = calculateAnchoredPosition(anchor(x, y), 80, 40, viewport, preferred);
		expect(result.placement).toBe(effective);
	});

	it.each(['top', 'bottom', 'left', 'right'] as const)('preserves %s when it fits', (side) => {
		expect(calculateAnchoredPosition(anchor(150, 100), 40, 20, viewport, side).placement).toBe(
			side,
		);
	});

	it('chooses the larger opposite space when neither side fits and shifts the main axis', () => {
		const result = calculateAnchoredPosition(anchor(150, 150), 80, 200, viewport, 'bottom');
		expect(result.placement).toBe('top');
		expect(result.style.top).toBe(8);
	});

	it('preserves the preference on a tie', () => {
		expect(calculateAnchoredPosition(anchor(150, 110), 80, 200, viewport, 'bottom').placement).toBe(
			'bottom',
		);
	});

	it('shifts vertical cross axis and points a lateral arrow at the anchor', () => {
		const result = calculateAnchoredPosition(anchor(150, 220), 40, 100, viewport, 'left');
		expect(result.style.top).toBe(132);
		// Centro da âncora fora do painel: reserva de 8px na borda (100 - 8).
		expect(result.arrowOffset).toBe(92);
	});

	it('preserves start alignment until a viewport collision requires shifting', () => {
		expect(
			calculateAnchoredPosition(anchor(30, 100), 80, 40, viewport, 'bottom', 'start').style.left,
		).toBe(30);
		expect(
			calculateAnchoredPosition(anchor(300, 100), 80, 40, viewport, 'bottom', 'start').style.left,
		).toBe(232);
	});

	it('keeps the arrow inside a very small panel', () => {
		const result = calculateAnchoredPosition(anchor(300, 100), 6, 6, viewport, 'bottom');
		expect(result.arrowOffset).toBe(3);
	});

	it('anchors oversized panels at the safe leading edges', () => {
		const result = calculateAnchoredPosition(anchor(100, 100), 500, 400, viewport, 'bottom');
		expect(result.style).toEqual({ left: 8, top: 8 });
	});

	it('supports a viewport smaller than the safety margins', () => {
		const result = calculateAnchoredPosition(
			anchor(0, 0),
			20,
			20,
			{ left: 0, top: 0, width: 4, height: 4 },
			'left',
		);
		expect(result.style).toEqual({ left: 8, top: 8 });
	});
	it('preserves preferred placement when it fits', () => {
		const result = calculateAnchoredPosition(anchor(150, 100), 80, 40, viewport, 'bottom');
		expect(result.placement).toBe('bottom');
		expect(result.style.top).toBe(128);
	});
	it('flips above when bottom does not fit', () => {
		const result = calculateAnchoredPosition(anchor(150, 210), 80, 40, viewport, 'bottom');
		expect(result.placement).toBe('top');
		expect(result.style.top).toBe(162);
	});
	it('flips left when right does not fit', () => {
		const result = calculateAnchoredPosition(anchor(290, 100), 80, 40, viewport, 'right');
		expect(result.placement).toBe('left');
		expect(result.style.left).toBe(202);
	});
	it('shifts horizontally and aligns arrow to anchor', () => {
		const result = calculateAnchoredPosition(anchor(300, 100), 100, 40, viewport, 'bottom');
		expect(result.style.left).toBe(212);
		// Centro da âncora fora do painel: reserva de 8px na borda (100 - 8).
		expect(result.arrowOffset).toBe(92);
	});
	it('keeps finite coordinates for oversized content', () => {
		const result = calculateAnchoredPosition(anchor(2, 2), 500, 400, viewport, 'top');
		expect(Number.isFinite(result.style.left as number)).toBe(true);
		expect(Number.isFinite(result.style.top as number)).toBe(true);
	});
	it('uses the visual viewport offset', () => {
		const result = calculateAnchoredPosition(
			anchor(140, 100),
			100,
			40,
			{ left: 100, top: 50, width: 150, height: 120 },
			'bottom',
		);
		expect(result.style.left).toBeGreaterThanOrEqual(108);
		expect(result.style.top).toBeGreaterThanOrEqual(58);
	});
});
