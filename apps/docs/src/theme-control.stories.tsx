import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AdsDialog,
	AdsThemeControl,
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
