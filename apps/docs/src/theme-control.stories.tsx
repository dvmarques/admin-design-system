import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsDialog,
	AdsThemeControl,
	AdsDropdown,
	type AdsThemePreference,
} from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Foundation/AdsThemeControl',
	component: AdsThemeControl,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof AdsThemeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Menu compacto só com ícones: o gatilho mostra a preferência (sol, lua ou monitor). */
export const CompactMenu: Story = {
	args: { defaultValue: 'system' },
};

/** Apresentação opcional com ícone e texto nas opções do menu. */
export const MenuWithText: Story = {
	args: { defaultValue: 'light', optionDisplay: 'icon-text' },
};

/** Opções inline como grupo de seleção exclusiva, só com ícones e tooltips. */
export const IconGroup: Story = {
	args: { defaultValue: 'dark', variant: 'group' },
};

export const GroupWithText: Story = {
	args: { defaultValue: 'system', optionDisplay: 'icon-text', variant: 'group' },
};

/** Botão sem borda (`ghost`), como no cabeçalho do admin demo, com o nome nas opções do menu. */
export const BorderlessTrigger: Story = {
	args: { defaultValue: 'system', optionDisplay: 'icon-text', triggerVariant: 'ghost' },
};

export const Disabled: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '1rem' }}>
			<AdsThemeControl defaultValue="light" disabled />
			<AdsThemeControl defaultValue="light" disabled variant="group" />
		</div>
	),
};

/** Estado controlado: a aplicação guarda a preferência e a aplica; mudanças externas não remontam. */
export const Controlled: Story = {
	render: () => {
		const [preference, setPreference] = useState<AdsThemePreference>('light');
		return (
			<div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
				<AdsThemeControl onValueChange={setPreference} value={preference} />
				<AdsThemeControl onValueChange={setPreference} value={preference} variant="group" />
				<p role="status">Preferência: {preference}</p>
			</div>
		);
	},
};

export const CustomLabels: Story = {
	args: {
		defaultValue: 'dark',
		labels: { dark: 'Dark', group: 'Theme', light: 'Light', system: 'System' },
	},
};

/** O menu abre sobre o modal e Escape fecha só o menu, devolvendo o foco ao gatilho. */
export const InsideDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(true);
		return (
			<AdsDialog onOpenChange={setOpen} open={open} title="Preferências">
				<AdsThemeControl />
			</AdsDialog>
		);
	},
};

/** Controlled preference and local scope (the portal receives the effective data-theme). */
export const ThemePreferenceWithPortal: Story = {
	render: () => {
		const [preference, setPreference] = useState<AdsThemePreference>('system');
		const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
		useEffect(() => {
			const query = window.matchMedia('(prefers-color-scheme: dark)');
			const sync = () => setSystemTheme(query.matches ? 'dark' : 'light');
			sync();
			query.addEventListener('change', sync);
			return () => query.removeEventListener('change', sync);
		}, []);
		const effective = preference === 'system' ? systemTheme : preference;
		return (
			<div data-theme={effective} className="ads-layout-stack rounded-lg border border-border bg-surface p-4">
				<AdsThemeControl value={preference} onValueChange={setPreference} optionDisplay="icon-text" variant="group" />
				<p role="status">Preferência: {preference}; tema efetivo: {effective}</p>
				<AdsDropdown>
					<AdsDropdown.Trigger>Abrir overlay no tema {effective}</AdsDropdown.Trigger>
					<AdsDropdown.Content
						aria-label="Overlay tematizado"
						style={
							{
								'--ads-color-surface-raised': 'var(--ads-color-surface-selected)',
							} as CSSProperties
						}
					>
						<AdsDropdown.Header>Tokens do tema</AdsDropdown.Header>
						<AdsDropdown.Item>Opção</AdsDropdown.Item>
					</AdsDropdown.Content>
				</AdsDropdown>
				<p>Para customizar tokens em portais, use seletores [data-theme] após o CSS distribuído.</p>
			</div>
		);
	},
};
