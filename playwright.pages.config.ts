import { defineConfig, devices } from '@playwright/test';

// Verifica o site do GitHub Pages montado em `site/` (npm run build:pages), servido sob o
// subcaminho do repositório. Config separada: o E2E principal usa o `next start` na raiz.
const origin = 'http://127.0.0.1:4173';

export default defineConfig({
	testDir: './e2e-pages',
	webServer: {
		command: 'node scripts/serve-pages-site.mjs 4173',
		url: `${origin}/admin-design-system/`,
		reuseExistingServer: !process.env.CI,
	},
	use: { baseURL: origin, trace: 'on-first-retry' },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
