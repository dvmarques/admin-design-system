import type { Preview } from '@storybook/react-vite'
import '@admin-ds/tokens/styles.css'
import '@admin-ds/components/styles.css'

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
			<div data-theme={context.globals.theme} style={{ background: 'var(--ads-color-background)', color: 'var(--ads-color-text)', minHeight: '100vh', padding: '2rem' }}>
				<Story />
			</div>
		),
	],
}

export default preview
