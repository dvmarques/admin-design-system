import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['{packages,apps}/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text-summary', 'json-summary', 'lcov'],
			reportsDirectory: 'coverage/vitest',
			include: ['packages/*/src/**/*.{ts,tsx}'],
			exclude: ['**/*.d.ts', '**/*.stories.tsx'],
		},
	},
});
