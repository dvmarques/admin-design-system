import { defineConfig, devices } from '@playwright/test';
import { checkE2eBuild } from './scripts/e2e-build-stamp.mjs';

// Por padrão o E2E serve o build de produção (`next start`), bem mais rápido que
// `next dev`. Execute `npm run build` antes; use E2E_DEV=1 para o servidor de dev.
const useDevServer = process.env.E2E_DEV === '1';

// Um build desatualizado daria verde falso; os workers recarregam este arquivo, então só o
// processo principal verifica.
if (!useDevServer && !process.env.TEST_WORKER_INDEX) {
	const problem = checkE2eBuild(__dirname);
	if (problem) throw new Error(problem);
}

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
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		// Firefox e WebKit executam só o smoke: sem snapshots, que são baselines do Chromium/Linux.
		{ name: 'firefox', testMatch: /smoke\.spec\.ts$/, use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', testMatch: /smoke\.spec\.ts$/, use: { ...devices['Desktop Safari'] } },
	],
});
