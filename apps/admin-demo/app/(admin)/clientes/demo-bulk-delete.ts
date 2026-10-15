/** Simula latência de exclusão no demo para exercitar `pending` do `AdsConfirmDialog`. */
export const DEMO_BULK_DELETE_DELAY_MS = 600;

export function waitForDemoBulkDelete(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, DEMO_BULK_DELETE_DELAY_MS));
}
