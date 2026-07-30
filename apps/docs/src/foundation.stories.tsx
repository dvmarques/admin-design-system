import type { Meta, StoryObj } from '@storybook/react-vite';
import { StyleFixture, ThemeToggle } from '@admin-ds/components';
import { tokenValues } from '@admin-ds/tokens';

const meta = {
	title: 'Foundation/Components',
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surfaces: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', minWidth: '20rem' }}>
			<StyleFixture>Superfície neutra</StyleFixture>
			<StyleFixture variant="primary">Ação primária</StyleFixture>
			<StyleFixture variant="danger">Estado de perigo</StyleFixture>
		</div>
	),
};

export const ThemeControl: Story = {
	render: () => <ThemeToggle />,
};

export const Tokens: Story = {
	render: () => (
		<dl>
			{Object.entries(tokenValues)
				.slice(0, 12)
				.map(([name, value]) => (
					<div
						key={name}
						style={{ display: 'grid', gridTemplateColumns: '12rem 1fr', gap: '1rem' }}
					>
						<dt>{name}</dt>
						<dd>{value}</dd>
					</div>
				))}
		</dl>
	),
};
