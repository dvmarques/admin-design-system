import { defineConfig, devices } from '@playwright/test';

// Por padrão o E2E serve o build de produção (`next start`), bem mais rápido que
// `next dev`. Execute `npm run build` antes; use E2E_DEV=1 para o servidor de dev.
const useDevServer = process.env.E2E_DEV === '1';

export default defineConfig({
	testDir: './e2e',
	webServer: {
		command: `npm run ${useDevServer ? 'dev' : 'start'} --workspace @admin-ds/admin-demo`,
		url: 'http://127.0.0.1:3000',
		reuseExistingServer: !process.env.CI,
	},
	use: {
		baseURL: 'http://127.0.0.1:3000',
		trace: 'on-first-retry',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
