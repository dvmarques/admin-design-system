import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsHighlightedCodeSnippet } from '@admin-ds/highlighted-code';
import '@admin-ds/highlighted-code/styles.css';

const meta = {
	title: 'Data/HighlightedCodeSnippet',
	component: AdsHighlightedCodeSnippet,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Componente público do pacote opcional @admin-ds/highlighted-code, com carregamento assíncrono de Shiki, cópia do texto original e fallback plain. Não faz parte de @admin-ds/components.',
			},
		},
	},
} satisfies Meta<typeof AdsHighlightedCodeSnippet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {
	args: {
		code: 'export function ola(nome: string) { return `Olá, ${nome}!`; }',
		language: 'ts',
		theme: 'auto',
		showLineNumbers: true,
	},
};

export const Sql: Story = {
	args: {
		code: 'SELECT id, nome FROM clientes ORDER BY nome;',
		language: 'sql',
		theme: 'dark',
		wrapLines: true,
	},
};

export const PlainFallback: Story = {
	args: {
		code: 'Uma linguagem desconhecida permanece legível e copiável.',
		language: 'linguagem-desconhecida',
		theme: 'light',
	},
};
