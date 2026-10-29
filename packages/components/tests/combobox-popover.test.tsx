import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { StrictMode, createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
	AdsAutocomplete,
	AdsCombobox,
	type AdsAutocompleteProps,
	type AdsComboboxProps,
	type AdsComboboxPopoverProps,
	AdsDialog,
	AdsField,
	type AdsComboboxOption,
} from '../src/index.js';

const options: AdsComboboxOption[] = [
	{ value: 'sp', label: 'São Paulo', description: 'Sudeste' },
	{ value: 'rj', label: 'Rio de Janeiro' },
	{ value: 'pr', label: 'Paraná', disabled: true },
	{ value: 'ba', label: 'Bahia' },
];

const triggerName = /Estado/;

function Basic(props: Partial<React.ComponentProps<typeof AdsCombobox>> = {}) {
	return (
		<AdsCombobox
			{...({ aria: undefined } as object)}
			aria-label="Estado"
			options={options}
			panelLabel="Escolher estado"
			presentation="popover"
			{...(props as object)}
		/>
	);
}

const trigger = () => screen.getByRole('button', { name: triggerName });

describe('AdsCombobox presentation="popover"', () => {
	it('uses a dialog trigger instead of role=combobox and opens a labelled non modal panel', async () => {
		const events = userEvent.setup();
		render(<Basic />);
		expect(screen.queryByRole('combobox')).toBeNull();
		expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		expect(trigger()).not.toHaveAttribute('aria-controls');

		await events.click(trigger());

		const panel = await screen.findByRole('dialog', { name: 'Escolher estado' });
		expect(panel).not.toHaveAttribute('aria-modal');
		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		expect(trigger()).toHaveAttribute('aria-controls', panel.id);
		const search = within(panel).getByRole('searchbox', { name: 'Pesquisar' });
		await waitFor(() => expect(search).toHaveFocus());
		const list = within(panel).getByRole('listbox', { name: 'Opções' });
		expect(search).toHaveAttribute('aria-controls', list.id);
		expect(within(list).getAllByRole('option')).toHaveLength(4);
	});

	it('toggles with a single owner: one click opens, the next closes, one callback each', async () => {
		const events = userEvent.setup();
		const onOpenChange = vi.fn();
		render(<Basic onOpenChange={onOpenChange} />);
		await events.click(trigger());
		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenLastCalledWith(true);
		await events.click(trigger());
		expect(onOpenChange).toHaveBeenCalledTimes(2);
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('filters by a separate query without changing the confirmed value', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		const onQuery = vi.fn();
		render(
			<form data-testid="f">
				<Basic
					defaultValue="sp"
					name="uf"
					onInputValueChange={onQuery}
					onValueChange={onValueChange}
				/>
			</form>,
		);
		expect(trigger()).toHaveTextContent('São Paulo');
		await events.click(trigger());
		const search = await screen.findByRole('searchbox');
		await events.type(search, 'rio');
		expect(screen.getAllByRole('option')).toHaveLength(1);
		expect(onQuery).toHaveBeenLastCalledWith('rio', 'input');
		expect(onValueChange).not.toHaveBeenCalled();
		expect(trigger()).toHaveTextContent('São Paulo');
		expect(new FormData(screen.getByTestId('f') as HTMLFormElement).get('uf')).toBe('sp');
		await events.clear(search);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(trigger()).toHaveTextContent('São Paulo');
	});

	it('selects with arrows and Enter, skipping disabled options, then closes and refocuses the trigger', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		const onQuery = vi.fn();
		render(<Basic onInputValueChange={onQuery} onValueChange={onValueChange} />);
		await events.click(trigger());
		const search = await screen.findByRole('searchbox');
		await waitFor(() => expect(search).toHaveFocus());

		await events.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
		expect(search).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-3'));
		await events.keyboard('{Enter}');

		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledWith('ba', expect.objectContaining({ label: 'Bahia' }));
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
		expect(trigger()).toHaveTextContent('Bahia');
	});

	it('resets the query on close with an explicit reason and does not duplicate selection callbacks', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		const onQuery = vi.fn();
		render(<Basic onInputValueChange={onQuery} onValueChange={onValueChange} />);
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'rio');
		await events.keyboard('{Enter}');
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(onQuery).toHaveBeenLastCalledWith('', 'select');
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'ba');
		await events.keyboard('{Escape}');
		expect(onQuery).toHaveBeenLastCalledWith('', 'close');
		await events.click(trigger());
		expect(await screen.findByRole('searchbox')).toHaveValue('');
	});

	it('does not emit when the already confirmed option is chosen again', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Basic defaultValue="rj" onValueChange={onValueChange} />);
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: /Rio/ }));
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('marks aria-selected only for the confirmed value and ignores disabled options', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Basic defaultValue="rj" onValueChange={onValueChange} />);
		await events.click(trigger());
		expect(await screen.findByRole('option', { name: /Rio/ })).toHaveAttribute(
			'aria-selected',
			'true',
		);
		const disabled = screen.getByRole('option', { name: 'Paraná' });
		expect(disabled).toHaveAttribute('aria-disabled', 'true');
		expect(disabled).toHaveAttribute('aria-selected', 'false');
		await events.click(disabled);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog')).toBeVisible();
	});

	it('closes on Escape without selecting and returns focus to the trigger', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Basic onValueChange={onValueChange} />);
		await events.click(trigger());
		await screen.findByRole('dialog');
		await events.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('closes on a click outside without stealing the focus from the clicked control', async () => {
		const events = userEvent.setup();
		render(
			<>
				<input aria-label="Outro" />
				<Basic />
			</>,
		);
		await events.click(trigger());
		await screen.findByRole('dialog');
		await events.click(screen.getByLabelText('Outro'));
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(screen.getByLabelText('Outro')).toHaveFocus();
	});

	it('opens with ArrowDown on the trigger', async () => {
		const events = userEvent.setup();
		render(<Basic />);
		trigger().focus();
		await events.keyboard('{ArrowDown}');
		expect(await screen.findByRole('dialog')).toBeVisible();
	});

	it('without search, focuses the listbox with an initial selected descendant and operates by keyboard', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Basic defaultValue="rj" onValueChange={onValueChange} searchable={false} />);
		await events.click(trigger());
		const list = await screen.findByRole('listbox');
		expect(screen.queryByRole('searchbox')).toBeNull();
		await waitFor(() => expect(list).toHaveFocus());
		expect(list).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-1'));
		await events.keyboard('{ArrowDown}');
		expect(list).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-3'));
		await events.keyboard('{Home}');
		expect(list).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'));
		await events.keyboard('{Enter}');
		expect(onValueChange).toHaveBeenCalledWith('sp', expect.any(Object));
		expect(trigger()).toHaveFocus();
	});

	it('supports a custom filterOption and filterOptions={false}', async () => {
		const events = userEvent.setup();
		const { unmount } = render(
			<Basic filterOption={(option, query) => option.description?.includes(query) ?? false} />,
		);
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'Sudeste');
		expect(screen.getAllByRole('option')).toHaveLength(1);
		unmount();
		render(<Basic filterOptions={false} />);
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'zzz');
		expect(screen.getAllByRole('option')).toHaveLength(4);
	});

	it('keeps the footer outside the listbox, reachable by Tab, and continues the page flow after the trigger at the end', async () => {
		const events = userEvent.setup();
		const onAction = vi.fn();
		render(
			<>
				<Basic
					footer={
						<button onClick={onAction} type="button">
							Gerenciar
						</button>
					}
				/>
				<input aria-label="Depois" />
			</>,
		);
		await events.click(trigger());
		const search = await screen.findByRole('searchbox');
		const action = screen.getByRole('button', { name: 'Gerenciar' });
		expect(within(screen.getByRole('listbox')).queryByRole('button')).toBeNull();
		expect(screen.getByRole('dialog')).toContainElement(action);
		await waitFor(() => expect(search).toHaveFocus());
		await events.tab();
		expect(action).toHaveFocus();
		await events.tab();
		expect(screen.queryByRole('dialog')).toBeNull();
		await waitFor(() => expect(screen.getByLabelText('Depois')).toHaveFocus());
	});

	it('keeps the controlled value and the panel open with closeOnSelect={false} until the consumer confirms', async () => {
		const events = userEvent.setup();
		const onValueChange = vi.fn();
		const { rerender } = render(
			<Basic closeOnSelect={false} onValueChange={onValueChange} value="sp" />,
		);
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Bahia' }));
		expect(onValueChange).toHaveBeenCalledWith('ba', expect.any(Object));
		expect(screen.getByRole('dialog')).toBeVisible();
		expect(trigger()).toHaveTextContent('São Paulo');
		expect(screen.getByRole('option', { name: 'Bahia' })).toHaveAttribute('aria-selected', 'false');
		rerender(<Basic closeOnSelect={false} onValueChange={onValueChange} value="ba" />);
		expect(trigger()).toHaveTextContent('Bahia');
		expect(screen.getByRole('option', { name: 'Bahia' })).toHaveAttribute('aria-selected', 'true');
	});

	it('supports controlled open, readOnly and disabled', async () => {
		const events = userEvent.setup();
		const onOpenChange = vi.fn();
		const { rerender } = render(<Basic onOpenChange={onOpenChange} open={false} />);
		await events.click(trigger());
		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.queryByRole('dialog')).toBeNull();
		rerender(<Basic open />);
		expect(await screen.findByRole('dialog')).toBeVisible();
		rerender(<Basic disabled open />);
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toBeDisabled();
		rerender(<Basic readOnly />);
		await events.click(trigger());
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('announces empty, loading and error states with an accessible retry', async () => {
		const events = userEvent.setup();
		const onRetry = vi.fn();
		const { rerender } = render(<Basic loading />);
		await events.click(trigger());
		expect(await screen.findByRole('status')).toHaveTextContent('Buscando opções...');
		expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('hidden');
		rerender(<Basic error="Falhou" onRetry={onRetry} />);
		expect(screen.getByRole('status')).toHaveTextContent('Falhou');
		await events.click(screen.getByRole('button', { name: 'Tentar novamente' }));
		expect(onRetry).toHaveBeenCalledTimes(1);
		rerender(<Basic options={[]} />);
		expect(screen.getByRole('status')).toHaveTextContent('Nenhuma opção encontrada');
	});

	it('uses renderTrigger with one toggle owner and exposes refs', async () => {
		const events = userEvent.setup();
		const triggerRef = createRef<HTMLButtonElement>();
		const searchInputRef = createRef<HTMLInputElement>();
		const onOpenChange = vi.fn();
		render(
			<AdsCombobox
				defaultValue="sp"
				onOpenChange={onOpenChange}
				options={options}
				presentation="popover"
				renderTrigger={({ selectedOption, triggerProps, open }) => (
					<button {...triggerProps} data-open={open}>
						<span aria-hidden="true">{selectedOption?.label.slice(0, 1)}</span>
						<strong>{selectedOption?.label}</strong>
						<small>{selectedOption?.description}</small>
					</button>
				)}
				searchInputRef={searchInputRef}
				triggerRef={triggerRef}
			/>,
		);
		const button = screen.getByRole('button', { name: /São Paulo/ });
		expect(triggerRef.current).toBe(button);
		await events.click(button);
		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(button).toHaveAttribute('data-open', 'true');
		expect(searchInputRef.current).toBe(await screen.findByRole('searchbox'));
	});

	it('renders custom options without interactive descendants inside role=option', async () => {
		const events = userEvent.setup();
		render(<Basic renderOption={(option) => <span>{option.label.toUpperCase()}</span>} />);
		await events.click(trigger());
		const items = await screen.findAllByRole('option');
		expect(items[0]).toHaveTextContent('SÃO PAULO');
		for (const item of items) expect(item.querySelector('button, a, input')).toBeNull();
	});

	it('works in StrictMode and renders a closed trigger on the server with stable ids', () => {
		render(
			<StrictMode>
				<Basic />
			</StrictMode>,
		);
		expect(trigger()).toBeVisible();
		const html = renderToString(<Basic />);
		expect(html).toContain('aria-haspopup="dialog"');
		expect(html).not.toContain('role="dialog"');
		expect(renderToString(<Basic />)).toBe(html);
	});

	it('does not change the input presentation or the AdsAutocomplete contract', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<>
				<AdsCombobox aria-label="UF" options={options} ref={ref} />
				<AdsAutocomplete aria-label="Cidade" options={options} />
			</>,
		);
		expect(ref.current).toBe(screen.getByRole('combobox', { name: 'UF' }));
		expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeVisible();
	});
});

describe('AdsCombobox popover forms', () => {
	it('submits only the confirmed value, validates required and focuses the trigger when invalid', async () => {
		const events = userEvent.setup();
		render(
			<form data-testid="f">
				<AdsField label="Estado">
					<AdsCombobox name="uf" options={options} presentation="popover" required />
				</AdsField>
			</form>,
		);
		const form = screen.getByTestId('f') as HTMLFormElement;
		const button = screen.getByRole('button', { name: 'Estado' });
		expect(form.checkValidity()).toBe(false);
		let reported = true;
		act(() => {
			reported = form.reportValidity();
		});
		expect(reported).toBe(false);
		expect(button).toHaveFocus();
		expect(button).toHaveAttribute('aria-invalid', 'true');
		expect(await screen.findByRole('alert')).toHaveTextContent('Selecione uma opção');

		await events.click(button);
		await events.click(await screen.findByRole('option', { name: 'Bahia' }));
		expect(form.checkValidity()).toBe(true);
		expect(new FormData(form).get('uf')).toBe('ba');
		expect(button).not.toHaveAttribute('aria-invalid');
	});

	it('creates no extra tab stop or accessible duplicate for the form control', () => {
		render(
			<form>
				<Basic name="uf" required />
			</form>,
		);
		const hidden = document.querySelector('input[name="uf"]')!;
		expect(hidden).toHaveAttribute('tabindex', '-1');
		expect(hidden).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('textbox')).toBeNull();
	});

	it('supports an external form attribute, disabled exclusion and reset to the initial value', async () => {
		const events = userEvent.setup();
		const { rerender } = render(
			<>
				<form data-testid="f" id="externo" />
				<Basic defaultValue="sp" form="externo" name="uf" />
			</>,
		);
		const form = screen.getByTestId('f') as HTMLFormElement;
		expect(new FormData(form).get('uf')).toBe('sp');
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Bahia' }));
		expect(new FormData(form).get('uf')).toBe('ba');
		act(() => form.reset());
		await waitFor(() => expect(trigger()).toHaveTextContent('São Paulo'));
		expect(new FormData(form).get('uf')).toBe('sp');
		rerender(
			<>
				<form data-testid="f" id="externo" />
				<Basic defaultValue="sp" disabled form="externo" name="uf" />
			</>,
		);
		expect(new FormData(form).has('uf')).toBe(false);
	});

	it('does not submit a label or a query', async () => {
		const events = userEvent.setup();
		render(
			<form data-testid="f">
				<Basic name="uf" />
			</form>,
		);
		await events.click(trigger());
		await events.type(await screen.findByRole('searchbox'), 'ba');
		const data = new FormData(screen.getByTestId('f') as HTMLFormElement);
		expect(data.get('uf')).toBe('');
		expect([...data.keys()]).toEqual(['uf']);
	});
});

describe('AdsCombobox popover overlays and accessibility', () => {
	it('opens above a dialog and Escape closes only the popover', async () => {
		const events = userEvent.setup();
		const onDialogClose = vi.fn();
		function View() {
			const [open, setOpen] = useState(true);
			return (
				<AdsDialog
					onOpenChange={(next) => {
						onDialogClose(next);
						setOpen(next);
					}}
					open={open}
					title="Filtro"
				>
					<Basic />
				</AdsDialog>
			);
		}
		render(<View />);
		await events.click(trigger());
		const panel = await screen.findByRole('dialog', { name: 'Escolher estado' });
		const search = within(panel).getByRole('searchbox');
		await waitFor(() => expect(search).toHaveFocus());
		await events.keyboard('{Escape}');
		expect(screen.queryByRole('dialog', { name: 'Escolher estado' })).toBeNull();
		expect(screen.getByRole('dialog', { name: 'Filtro' })).toBeVisible();
		expect(onDialogClose).not.toHaveBeenCalled();
		expect(trigger()).toHaveFocus();
		await events.click(trigger());
		await events.click(await screen.findByRole('option', { name: 'Bahia' }));
		expect(screen.getByRole('dialog', { name: 'Filtro' })).toBeVisible();
		expect(trigger()).toHaveTextContent('Bahia');
	});

	it('renders the panel in a portal outside overflow-clipping ancestors', async () => {
		const events = userEvent.setup();
		render(
			<div data-testid="clip" style={{ overflow: 'hidden', height: 20 }}>
				<Basic />
			</div>,
		);
		await events.click(trigger());
		const panel = await screen.findByRole('dialog');
		expect(screen.getByTestId('clip')).not.toContainElement(panel);
		expect(panel.closest('[data-ads-overlay-root]')?.parentElement).toBe(document.body);
		expect(panel).toHaveClass('ads-combobox__panel');
	});

	it('has no detectable axe violations closed, open with search and open without search', async () => {
		const events = userEvent.setup();
		const rules = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } };
		const { container, unmount } = render(
			<form>
				<AdsField label="Estado">
					<AdsCombobox
						footer={<a href="/gerenciar">Gerenciar</a>}
						name="uf"
						options={options}
						panelLabel="Escolher"
						presentation="popover"
						required
					/>
				</AdsField>
			</form>,
		);
		expect((await axe.run(container, rules)).violations).toEqual([]);
		await events.click(screen.getByRole('button', { name: 'Estado' }));
		await screen.findByRole('dialog');
		expect((await axe.run(document.body, rules)).violations).toEqual([]);
		unmount();
		render(<Basic searchable={false} />);
		await events.click(trigger());
		await screen.findByRole('listbox');
		expect((await axe.run(document.body, rules)).violations).toEqual([]);
	});

	it('is not pre-rendered open on the server even with open and keeps hydration markup stable', () => {
		const html = renderToString(<Basic open />);
		expect(html).toContain('aria-expanded="true"');
		expect(html).not.toContain('role="listbox"');
		fireEvent.focus(document.body);
	});
});

describe('AdsCombobox popover review follow-ups', () => {
	it('keeps one persistent, non aria-hidden status region that is filled after mounting', async () => {
		const events = userEvent.setup();
		const { rerender } = render(<Basic />);
		await events.click(trigger());
		const status = await screen.findByRole('status');
		expect(status).toBeEmptyDOMElement();
		expect(status.closest('[aria-hidden="true"]')).toBeNull();
		rerender(<Basic options={[]} />);
		expect(screen.getByRole('status')).toBe(status);
		expect(status).toHaveTextContent('Nenhuma opção encontrada');
		expect(status).toHaveClass('ads-combobox__state');
		expect(screen.getAllByRole('status')).toHaveLength(1);
	});

	it('names the dialog from the trigger when no panelLabel is given', async () => {
		const events = userEvent.setup();
		render(<AdsCombobox aria-label="Estado" options={options} presentation="popover" />);
		await events.click(trigger());
		expect(await screen.findByRole('dialog', { name: 'Estado' })).toBeVisible();
	});

	it('only focuses the trigger when it is the first invalid control of the form', () => {
		render(
			<form data-testid="f">
				<input aria-label="Antes" required />
				<AdsCombobox
					aria-label="Estado"
					name="uf"
					options={options}
					presentation="popover"
					required
				/>
			</form>,
		);
		const form = screen.getByTestId('f') as HTMLFormElement;
		act(() => {
			form.reportValidity();
		});
		expect(trigger()).not.toHaveFocus();
		expect(trigger()).toHaveAttribute('aria-invalid', 'true');
		screen.getByLabelText('Antes').setAttribute('value', 'x');
		(screen.getByLabelText('Antes') as HTMLInputElement).value = 'x';
		act(() => {
			form.reportValidity();
		});
		expect(trigger()).toHaveFocus();
	});

	it('treats Shift+Tab with the focus on the panel itself as the start of the panel', async () => {
		const events = userEvent.setup();
		render(
			<>
				<input aria-label="Antes" />
				<Basic loading searchable={false} />
			</>,
		);
		await events.click(trigger());
		const panel = await screen.findByRole('dialog');
		await waitFor(() => expect(panel).toHaveFocus());
		await events.tab({ shift: true });
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger()).toHaveFocus();
	});

	it('styles the keyboard-active option with its own outline, also over the selected one', () => {
		const css = readFileSync(join(process.cwd(), 'packages/components/src/styles.css'), 'utf8');
		expect(css).toMatch(
			/\.ads-combobox__option--popover\[data-active='true'\]\s*\{[^}]*outline: 2px solid var\(--ads-color-focus-ring\)/,
		);
		expect(css).toMatch(
			/forced-colors: active[^]*aria-selected='true'\]\s*\{\s*border-inline-start: 0\.25rem solid Highlight/,
		);
		expect(css).not.toMatch(/\.ads-combobox__option-description\s*\{[^}]*opacity/);
	});

	it('keeps the public types of the input presentation and AdsAutocomplete intact', () => {
		expectTypeOf<AdsAutocompleteProps>().toHaveProperty('onValueChange');
		expectTypeOf<AdsAutocompleteProps['presentation']>().toEqualTypeOf<'input' | undefined>();
		expectTypeOf<AdsComboboxProps['presentation']>().toEqualTypeOf<'input' | undefined>();
		expectTypeOf<AdsComboboxPopoverProps['presentation']>().toEqualTypeOf<'popover'>();
		expectTypeOf<AdsComboboxProps>().not.toHaveProperty('renderTrigger');
		const ref = createRef<HTMLInputElement>();
		void (<AdsCombobox options={[]} ref={ref} />);
		// @ts-expect-error o modo popover não aceita `ref` de input.
		void (<AdsCombobox options={[]} presentation="popover" ref={ref} />);
	});

	it('clears the reported invalid state when props make the form valid again', () => {
		const View = (props: Partial<React.ComponentProps<typeof AdsCombobox>>) => (
			<form data-testid="f">
				<Basic name="uf" required value={null} {...props} />
			</form>
		);
		const { rerender } = render(<View />);
		const form = screen.getByTestId('f') as HTMLFormElement;
		act(() => {
			form.reportValidity();
		});
		expect(trigger()).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('alert')).toBeInTheDocument();

		rerender(<View value="sp" />);
		expect(trigger()).not.toHaveAttribute('aria-invalid');
		expect(screen.queryByRole('alert')).toBeNull();
		expect(form.checkValidity()).toBe(true);

		// Voltar a ficar vazio não reexibe o erro sem uma nova validação.
		rerender(<View value={null} />);
		expect(trigger()).not.toHaveAttribute('aria-invalid');
		act(() => {
			form.reportValidity();
		});
		expect(trigger()).toHaveAttribute('aria-invalid', 'true');

		rerender(<View required={false} />);
		expect(trigger()).not.toHaveAttribute('aria-invalid');
		expect(form.checkValidity()).toBe(true);
	});

	it('does not trap a readOnly required field: valid form, value submitted, state exposed', async () => {
		const events = userEvent.setup();
		const { rerender } = render(
			<form data-testid="f">
				<Basic name="uf" readOnly required />
			</form>,
		);
		const form = screen.getByTestId('f') as HTMLFormElement;
		expect(form.checkValidity()).toBe(true);
		expect(trigger()).toHaveAttribute('aria-disabled', 'true');
		expect(trigger()).not.toBeDisabled();
		await events.click(trigger());
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(new FormData(form).get('uf')).toBe('');

		rerender(
			<form data-testid="f">
				<Basic name="uf" readOnly required value="rj" />
			</form>,
		);
		expect(new FormData(form).get('uf')).toBe('rj');

		rerender(
			<form data-testid="f">
				<Basic name="uf" required />
			</form>,
		);
		expect(trigger()).not.toHaveAttribute('aria-disabled');
		expect(form.checkValidity()).toBe(false);
	});
});
