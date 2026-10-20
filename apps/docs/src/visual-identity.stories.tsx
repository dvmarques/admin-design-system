import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

const meta = {
	title: 'Foundation/Visual identity',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Paleta, tipografia, espaçamento, superfícies e cores de gráfico dos tokens, nos temas claro e escuro. Veja docs/visual-identity.md.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const themes = ['light', 'dark'] as const;
const cssVar = (name: string) => `var(--ads-${name})`;

/** Cada tema é um escopo `data-theme` próprio, então os dois aparecem lado a lado. */
function ThemePanels({ children }: { children: (theme: (typeof themes)[number]) => ReactNode }) {
	return (
		<div
			style={{
				display: 'grid',
				gap: '1rem',
				gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
			}}
		>
			{themes.map((theme) => (
				<section
					key={theme}
					data-theme={theme}
					aria-label={`Tema ${theme === 'light' ? 'claro' : 'escuro'}`}
					style={{
						background: cssVar('color-background'),
						border: `1px solid ${cssVar('color-border')}`,
						borderRadius: cssVar('radius-md'),
						color: cssVar('color-text'),
						padding: cssVar('spacing-4'),
					}}
				>
					<h3
						style={{
							margin: 0,
							marginBottom: cssVar('spacing-3'),
							fontSize: cssVar('typography-font-size-md'),
						}}
					>
						{theme === 'light' ? 'Tema claro' : 'Tema escuro'}
					</h3>
					{children(theme)}
				</section>
			))}
		</div>
	);
}

const swatch = (background: string): CSSProperties => ({
	background,
	border: `1px solid ${cssVar('color-border-strong')}`,
	borderRadius: cssVar('radius-sm'),
	display: 'inline-block',
	flex: 'none',
	height: '1.5rem',
	width: '2.5rem',
});

function Row({ name, color }: { name: string; color: string }) {
	return (
		<li style={{ alignItems: 'center', display: 'flex', gap: '0.75rem', padding: '0.125rem 0' }}>
			<span aria-hidden="true" style={swatch(color)} />
			<code style={{ fontSize: cssVar('typography-font-size-sm'), overflowWrap: 'anywhere' }}>
				--ads-{name}
			</code>
		</li>
	);
}

const list: CSSProperties = { listStyle: 'none', margin: 0, padding: 0 };

const paletteRoles = [
	'color-primary',
	'color-primary-hover',
	'color-text',
	'color-text-muted',
	'color-border',
	'color-border-control',
	'color-focus-ring',
	'color-surface-selected',
	'color-info',
	'color-success',
	'color-warning',
	'color-danger',
];

export const Palette: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<ul style={list}>
					{paletteRoles.map((name) => (
						<Row key={name} name={name} color={cssVar(name)} />
					))}
				</ul>
			)}
		</ThemePanels>
	),
};

const surfaces = [
	['color-background', 'Fundo da página'],
	['color-surface-muted', 'Superfície esmaecida'],
	['color-surface', 'Superfície'],
	['color-surface-raised', 'Superfície elevada'],
	['color-surface-hover', 'Item em hover'],
] as const;

export const Surfaces: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div style={{ display: 'grid', gap: '0.5rem' }}>
					{surfaces.map(([name, label]) => (
						<div
							key={name}
							style={{
								background: cssVar(name),
								border: `1px solid ${cssVar('color-border')}`,
								borderRadius: cssVar('radius-sm'),
								color: cssVar('color-text'),
								padding: '0.5rem 0.75rem',
							}}
						>
							{label} <code style={{ color: cssVar('color-text-muted') }}>--ads-{name}</code>
						</div>
					))}
					<div
						style={{
							background: cssVar('color-surface-raised'),
							borderRadius: cssVar('radius-md'),
							boxShadow: cssVar('elevation-md'),
							padding: '0.5rem',
						}}
					>
						<div
							style={{
								background: cssVar('color-surface-hover'),
								borderRadius: cssVar('radius-sm'),
								padding: '0.5rem 0.75rem',
							}}
						>
							Item em hover sobre superfície elevada
						</div>
					</div>
				</div>
			)}
		</ThemePanels>
	),
};

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

export const Typography: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<div style={{ fontFamily: cssVar('typography-font-family') }}>
					{sizes.map((size) => (
						<p
							key={size}
							style={{
								fontSize: cssVar(`typography-font-size-${size}`),
								lineHeight: cssVar('typography-line-height-heading'),
								margin: 0,
							}}
						>
							{size} · Painel administrativo
						</p>
					))}
					<p style={{ margin: 0, marginTop: '0.5rem' }}>
						{['regular', 'medium', 'semibold', 'bold'].map((weight) => (
							<span
								key={weight}
								style={{
									fontWeight: cssVar(`typography-font-weight-${weight}`),
									marginRight: '0.75rem',
								}}
							>
								{weight}
							</span>
						))}
					</p>
				</div>
			)}
		</ThemePanels>
	),
};

const spacings = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];

export const Spacing: Story = {
	render: () => (
		<ul style={{ ...list, display: 'grid', gap: '0.5rem', color: cssVar('color-text') }}>
			{spacings.map((step) => (
				<li key={step} style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
					<code style={{ flex: '0 0 11rem', fontSize: cssVar('typography-font-size-sm') }}>
						--ads-spacing-{step}
					</code>
					<span
						aria-hidden="true"
						style={{
							background: cssVar('color-primary'),
							height: '0.75rem',
							width: cssVar(`spacing-${step}`),
						}}
					/>
				</li>
			))}
		</ul>
	),
};

const chartIndexes = [1, 2, 3, 4, 5, 6, 7, 8];
const markers = ['●', '■', '▲', '◆', '○', '□', '△', '◇'];

/** Cada série também tem forma e rótulo: gráficos não devem depender só de cor. */
export const ChartColors: Story = {
	render: () => (
		<ThemePanels>
			{() => (
				<ul
					style={{
						...list,
						background: cssVar('color-surface'),
						borderRadius: cssVar('radius-sm'),
						padding: '0.5rem 0.75rem',
					}}
				>
					{chartIndexes.map((index) => (
						<li
							key={index}
							style={{
								alignItems: 'center',
								display: 'flex',
								gap: '0.75rem',
								padding: '0.125rem 0',
							}}
						>
							<span
								aria-hidden="true"
								style={{
									color: cssVar(`color-chart-${index}`),
									fontSize: '1.25rem',
									lineHeight: 1,
								}}
							>
								{markers[index - 1]}
							</span>
							<span>Série {index}</span>
							<code
								style={{
									color: cssVar('color-text-muted'),
									fontSize: cssVar('typography-font-size-sm'),
								}}
							>
								--ads-color-chart-{index}
							</code>
						</li>
					))}
				</ul>
			)}
		</ThemePanels>
	),
};
