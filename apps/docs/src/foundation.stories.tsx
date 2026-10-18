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

// 6rem = 2 × 2rem do padding do decorator (`.storybook/preview.tsx`) + 2 × 1rem do padding do
// `layout: 'centered'`; sem isso, os 20rem estouram a largura em telas estreitas.
export const Surfaces: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', minWidth: 'min(20rem, calc(100vw - 6rem))' }}>
			<StyleFixture>Superfície neutra</StyleFixture>
			<StyleFixture variant="primary">Ação primária</StyleFixture>
			<StyleFixture variant="danger">Estado de perigo</StyleFixture>
		</div>
	),
};

export const ThemeControl: Story = {
	render: () => <ThemeToggle />,
};

export const SemanticStates: Story = {
	render: () => (
		<div className="grid gap-3">
			<div
				className="rounded-md p-3"
				style={{
					background: 'var(--ads-color-info-background)',
					border: '1px solid var(--ads-color-info-border)',
					color: 'var(--ads-color-info)',
				}}
			>
				Informação contextual
			</div>
			<div
				className="rounded-md p-3"
				style={{
					background: 'var(--ads-color-success-background)',
					border: '1px solid var(--ads-color-success-border)',
					color: 'var(--ads-color-success)',
				}}
			>
				Operação concluída com sucesso
			</div>
			<div
				className="rounded-md p-3"
				style={{
					background: 'var(--ads-color-warning-background)',
					border: '1px solid var(--ads-color-warning-border)',
					color: 'var(--ads-color-warning)',
				}}
			>
				Atenção: verifique os dados
			</div>
			<div
				className="rounded-md p-3"
				style={{
					background: 'var(--ads-color-danger-background)',
					border: '1px solid var(--ads-color-danger-border)',
					color: 'var(--ads-color-danger)',
				}}
			>
				Não foi possível concluir a operação
			</div>
		</div>
	),
};

export const Tokens: Story = {
	render: () => (
		<dl>
			{Object.entries(tokenValues)
				.slice(0, 12)
				.map(([name, value]) => (
					<div key={name} style={{ display: 'flex', flexWrap: 'wrap', columnGap: '1rem' }}>
						<dt style={{ flex: '0 0 12rem', maxWidth: '100%', minWidth: 0, width: '12rem' }}>
							{name}
						</dt>
						<dd style={{ flex: '1 1 12rem', minWidth: 0, overflowWrap: 'anywhere' }}>{value}</dd>
					</div>
				))}
		</dl>
	),
};
