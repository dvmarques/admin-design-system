import { defineConfig, devices } from '@playwright/test';
import e2eConfig from './playwright.config';

// Suíte opt-in: não integra o testDir ./e2e nem gera snapshots oficiais.
export default defineConfig({
	...e2eConfig,
	testDir: './visual-audit',
	timeout: 600_000,
	fullyParallel: true,
	workers: 2,
	retries: 0,
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	globalSetup: './scripts/visual-audit-setup.mjs',
	globalTeardown: './scripts/visual-audit-report.mjs',
	outputDir: 'visual-audit-results/test-results',
});
