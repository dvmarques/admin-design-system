import { describe, expect, it } from 'vitest';
import { calculateAnchoredPosition } from './overlay-utils.js';

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
		expect(result.arrowOffset).toBe(90);
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
