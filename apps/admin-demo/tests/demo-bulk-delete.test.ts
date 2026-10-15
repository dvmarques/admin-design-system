import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	DEMO_BULK_DELETE_DELAY_MS,
	waitForDemoBulkDelete,
} from '../app/(admin)/clientes/demo-bulk-delete';

describe('waitForDemoBulkDelete', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('resolves after the configured demo delay', async () => {
		vi.useFakeTimers();
		const pending = waitForDemoBulkDelete();
		let settled = false;
		void pending.then(() => {
			settled = true;
		});
		await vi.advanceTimersByTimeAsync(DEMO_BULK_DELETE_DELAY_MS - 1);
		expect(settled).toBe(false);
		await vi.advanceTimersByTimeAsync(1);
		await pending;
		expect(settled).toBe(true);
	});
});
