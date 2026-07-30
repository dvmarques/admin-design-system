import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/.next/**',
			'**/storybook-static/**',
			'**/coverage/**',
			'**/playwright-report/**',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				console: 'readonly',
				URL: 'readonly',
				structuredClone: 'readonly',
				process: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['@admin-ds/*/src/*', '@admin-ds/*/scripts/*'],
							message: 'Use apenas pontos de entrada públicos declarados por cada pacote.',
						},
					],
				},
			],
		},
	},
);
