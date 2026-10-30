import type { Preview } from '@storybook/react-vite';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@admin-ds/tokens/styles.css';
import '@admin-ds/components/styles.css';
import '@admin-ds/admin/styles.css';

const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'Tema do design system',
			defaultValue: 'light',
			toolbar: { items: ['light', 'dark'] },
		},
	},
	decorators: [
		(Story, context) => (
			<div
				data-theme={context.globals.theme}
				style={{
					background: 'var(--ads-color-background)',
					color: 'var(--ads-color-text)',
					fontFamily: 'var(--ads-typography-font-family)',
					// Em Docs cada exemplo é embutido na página: altura da viewport deixaria um vazio abaixo dele.
					minHeight: context.viewMode === 'docs' ? undefined : '100vh',
					padding: '2rem',
				}}
			>
				<Story />
			</div>
		),
	],
};

export default preview;
