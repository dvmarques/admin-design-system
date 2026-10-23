import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdsDialog } from '../src/overlay-dialog';
import { AdsDropdown } from '../src/dropdown';
import { AdsIcon } from '../src/icon';
import { AdsThemeControl, type AdsThemePreference } from '../src/theme-control';
import { renderWithTheme } from './test-utils';

function Controlled({ onValueChange }: { onValueChange?: (value: AdsThemePreference) => void }) {
	const [value, setValue] = useState<AdsThemePreference>('light');
	return (
		<>
			<AdsThemeControl
				value={value}
				onValueChange={(next) => {
					onValueChange?.(next);
					setValue(next);
				}}
			/>
			<button onClick={() => setValue('dark')} type="button">
				externo
			</button>
		</>
	);
}

describe('AdsThemeControl icons', () => {
	it.each(['sun', 'moon', 'monitor'] as const)('renders %s decoratively', (name) => {
		const { container } = render(<AdsIcon name={name} />);
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
		expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
	});
});

describe('AdsThemeControl menu', () => {
	it('defaults to system and names the trigger after the current preference', () => {
		render(<AdsThemeControl />);
		const trigger = screen.getByRole('button', { name: 'Tema: Sistema' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('opens icon-only radio items focusing the checked one and picks any mode directly', async () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl defaultValue="light" onValueChange={onValueChange} />);
		const trigger = screen.getByRole('button', { name: 'Tema: Claro' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });

		const light = await screen.findByRole('menuitemradio', { name: 'Claro' });
		await waitFor(() => expect(light).toHaveFocus());
		expect(light).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByRole('menuitemradio', { name: 'Escuro' })).toHaveAttribute(
			'aria-checked',
			'false',
		);
		expect(light.textContent).toBe('');

		fireEvent.click(screen.getByRole('menuitemradio', { name: 'Sistema' }));

		expect(onValueChange).toHaveBeenCalledOnce();
		expect(onValueChange).toHaveBeenCalledWith('system');
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Tema: Sistema' })).toHaveFocus();
	});

	it('does not emit when the active option is chosen again', async () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl defaultValue="dark" onValueChange={onValueChange} />);
		fireEvent.click(screen.getByRole('button', { name: 'Tema: Escuro' }));
		fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Escuro' }));
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('returns focus to the trigger on Escape without emitting', async () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl onValueChange={onValueChange} />);
		const trigger = screen.getByRole('button', { name: 'Tema: Sistema' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'Enter' });
		const checked = await screen.findByRole('menuitemradio', { name: 'Sistema' });
		await waitFor(() => expect(checked).toHaveFocus());

		fireEvent.keyDown(checked, { key: 'Escape' });

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(trigger).toHaveFocus();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('moves focus with arrows, Home and End', async () => {
		render(<AdsThemeControl defaultValue="light" />);
		const trigger = screen.getByRole('button', { name: 'Tema: Claro' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		const light = await screen.findByRole('menuitemradio', { name: 'Claro' });
		await waitFor(() => expect(light).toHaveFocus());
		fireEvent.keyDown(light, { key: 'ArrowDown' });
		expect(screen.getByRole('menuitemradio', { name: 'Escuro' })).toHaveFocus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
		expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toHaveFocus();
		fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' });
		expect(light).toHaveFocus();
	});

	it('shows icon and text in the optional presentation', async () => {
		render(<AdsThemeControl optionDisplay="icon-text" />);
		fireEvent.click(screen.getByRole('button', { name: 'Tema: Sistema' }));
		const item = await screen.findByRole('menuitemradio', { name: 'Escuro' });
		expect(item).toHaveTextContent('Escuro');
		expect(item).not.toHaveAttribute('aria-label');
	});

	it('shows a tooltip on focus for the trigger and keeps the accessible name without it', async () => {
		render(<AdsThemeControl />);
		const trigger = screen.getByRole('button', { name: 'Tema: Sistema' });
		fireEvent.focus(trigger);
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Tema: Sistema');
		fireEvent.keyDown(trigger, { key: 'Escape' });
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(trigger).toHaveAccessibleName('Tema: Sistema');
	});

	it('can disable tooltips', () => {
		render(<AdsThemeControl tooltips={false} />);
		fireEvent.focus(screen.getByRole('button', { name: 'Tema: Sistema' }));
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('uses custom labels everywhere', async () => {
		render(
			<AdsThemeControl
				defaultValue="dark"
				labels={{ group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' }}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Theme: Dark' }));
		expect(await screen.findByRole('menuitemradio', { name: 'Light' })).toBeInTheDocument();
		expect(screen.getByRole('menu', { name: 'Theme' })).toBeInTheDocument();
	});

	it('does not open or emit when disabled', () => {
		render(<AdsThemeControl disabled />);
		const trigger = screen.getByRole('button', { name: 'Tema: Sistema' });
		expect(trigger).toBeDisabled();
		fireEvent.click(trigger);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('merges className and root attributes into its public element', () => {
		const { container } = render(<AdsThemeControl className="consumer" data-testid="root" />);
		expect(container.firstElementChild).toHaveClass('ads-theme-control', 'consumer');
		expect(container.firstElementChild).toHaveAttribute('data-testid', 'root');
	});
});

describe('AdsThemeControl controlled and external updates', () => {
	it('does not change by itself when controlled', async () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl onValueChange={onValueChange} value="light" />);
		fireEvent.click(screen.getByRole('button', { name: 'Tema: Claro' }));
		fireEvent.click(await screen.findByRole('menuitemradio', { name: 'Escuro' }));
		expect(onValueChange).toHaveBeenCalledWith('dark');
		expect(screen.getByRole('button', { name: 'Tema: Claro' })).toBeInTheDocument();
	});

	it('updates the trigger in place, keeping the same element and focus', () => {
		render(<Controlled />);
		const trigger = screen.getByRole('button', { name: 'Tema: Claro' });
		trigger.focus();
		const external = screen.getByRole('button', { name: 'externo' });
		fireEvent.click(external);
		const next = screen.getByRole('button', { name: 'Tema: Escuro' });
		expect(next).toBe(trigger);
	});

	it('keeps the focused group option mounted when the value changes externally', () => {
		function Group() {
			const [value, setValue] = useState<AdsThemePreference>('light');
			return (
				<>
					<AdsThemeControl onValueChange={setValue} value={value} variant="group" />
					<button onClick={() => setValue('system')} type="button">
						externo
					</button>
				</>
			);
		}
		render(<Group />);
		const option = screen.getByRole('radio', { name: 'Sistema' });
		option.focus();
		fireEvent.click(screen.getByRole('button', { name: 'externo' }));
		expect(screen.getByRole('radio', { name: 'Sistema' })).toBe(option);
		expect(option).toHaveFocus();
		expect(option).toHaveAttribute('aria-checked', 'true');
	});
});

describe('AdsThemeControl group', () => {
	it('exposes a named radiogroup with a single tab stop', () => {
		render(<AdsThemeControl defaultValue="dark" variant="group" />);
		expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeInTheDocument();
		const radios = screen.getAllByRole('radio');
		expect(radios.map((radio) => radio.getAttribute('aria-label'))).toEqual([
			'Claro',
			'Escuro',
			'Sistema',
		]);
		expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, 0, -1]);
		expect(radios[1]).toHaveAttribute('aria-checked', 'true');
	});

	it('selects with click and with arrows (circular), moving focus', () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl onValueChange={onValueChange} variant="group" />);
		fireEvent.click(screen.getByRole('radio', { name: 'Claro' }));
		expect(onValueChange).toHaveBeenLastCalledWith('light');

		const light = screen.getByRole('radio', { name: 'Claro' });
		light.focus();
		fireEvent.keyDown(light, { key: 'ArrowLeft' });
		expect(onValueChange).toHaveBeenLastCalledWith('system');
		expect(screen.getByRole('radio', { name: 'Sistema' })).toHaveFocus();
		fireEvent.keyDown(screen.getByRole('radio', { name: 'Sistema' }), { key: 'Home' });
		expect(onValueChange).toHaveBeenLastCalledWith('light');
		fireEvent.keyDown(screen.getByRole('radio', { name: 'Claro' }), { key: 'ArrowRight' });
		expect(onValueChange).toHaveBeenLastCalledWith('dark');
	});

	it('marks the selected option with a visual mark beyond color', () => {
		render(<AdsThemeControl defaultValue="dark" variant="group" />);
		const marks = document.querySelectorAll('.ads-theme-control-check');
		expect(marks).toHaveLength(1);
		expect(screen.getByRole('radio', { name: 'Escuro' }).contains(marks[0]!)).toBe(true);
	});

	it('shows visible text in the icon-text presentation', () => {
		render(<AdsThemeControl optionDisplay="icon-text" variant="group" />);
		expect(screen.getByRole('radio', { name: 'Claro' })).toHaveTextContent('Claro');
	});

	it('disables every option', () => {
		const onValueChange = vi.fn();
		render(<AdsThemeControl disabled onValueChange={onValueChange} variant="group" />);
		for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
	});
});

describe('AdsThemeControl accessibility and themes', () => {
	it.each(['menu', 'group'] as const)('has no axe violations (%s)', async (variant) => {
		const { container } = render(<AdsThemeControl variant={variant} />);
		expect((await axe.run(container)).violations).toEqual([]);
	});

	it('has no axe violations with the menu open', async () => {
		render(<AdsThemeControl />);
		fireEvent.click(screen.getByRole('button', { name: 'Tema: Sistema' }));
		await screen.findByRole('menu');
		expect(
			(await axe.run(document.body, { rules: { region: { enabled: false } } })).violations,
		).toEqual([]);
	});

	it.each(['light', 'dark'] as const)('renders in the %s theme', (theme) => {
		const { container } = renderWithTheme(<AdsThemeControl />, theme);
		expect(container.firstElementChild).toHaveAttribute('data-theme', theme);
		expect(screen.getByRole('button')).toBeVisible();
	});

	it('works inside a modal dialog', async () => {
		render(
			<AdsDialog onOpenChange={() => {}} open title="Preferências">
				<AdsThemeControl />
			</AdsDialog>,
		);
		// O diálogo repete o foco inicial num timeout; espera-o antes de mover o foco ao gatilho.
		await waitFor(() => expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus());
		await new Promise((resolve) => setTimeout(resolve, 10));
		const trigger = screen.getByRole('button', { name: 'Tema: Sistema' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		const item = await screen.findByRole('menuitemradio', { name: 'Sistema' });
		await waitFor(() => expect(item).toHaveFocus());
		fireEvent.keyDown(item, { key: 'Escape' });
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		expect(trigger).toHaveFocus();
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});

describe('AdsDropdown radio items', () => {
	it('keeps plain menuitem behavior and focuses the first item', async () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger>Mais</AdsDropdown.Trigger>
				<AdsDropdown.Content aria-label="Ações">
					<AdsDropdown.Item>Um</AdsDropdown.Item>
					<AdsDropdown.Item>Dois</AdsDropdown.Item>
				</AdsDropdown.Content>
			</AdsDropdown>,
		);
		const trigger = screen.getByRole('button', { name: 'Mais' });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: 'ArrowDown' });
		await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Um' })).toHaveFocus());
	});

	it('accepts trigger variant and size', () => {
		render(
			<AdsDropdown>
				<AdsDropdown.Trigger size="sm" variant="ghost">
					Mais
				</AdsDropdown.Trigger>
			</AdsDropdown>,
		);
		const classes = screen.getByRole('button').className;
		expect(classes).toContain('bg-transparent');
		expect(classes).toContain('control-sm');
	});
});

describe('AdsTooltip showOnFocus', () => {
	it('opens on pointer but not on focus when disabled', async () => {
		const { AdsTooltip } = await import('../src/overlay-anchored');
		render(
			<AdsTooltip content="Ajuda" showOnFocus={false}>
				<button type="button">Gatilho</button>
			</AdsTooltip>,
		);
		const button = screen.getByRole('button', { name: 'Gatilho' });
		fireEvent.focus(button);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		fireEvent.pointerEnter(button.parentElement!);
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Ajuda');
	});
});
