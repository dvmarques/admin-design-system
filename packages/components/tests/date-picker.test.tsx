import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axe from 'axe-core';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsDatePicker, type AdsDateRange } from '../src/date-picker';
import { AdsField } from '../src/field';

async function openCalendar() {
	fireEvent.click(screen.getByRole('button', { name: 'Abrir calendário' }));
	return screen.findByRole('grid');
}

describe('AdsDatePicker single date', () => {
	it('renders a deterministic pt-BR placeholder and a labelled field', () => {
		render(
			<AdsField description="Dica" error="Obrigatório" label="Vencimento" validationState="error">
				<AdsDatePicker />
			</AdsField>,
		);
		const input = screen.getByLabelText('Vencimento');
		expect(input).toHaveAttribute('placeholder', 'dd/mm/aaaa');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.getAttribute('aria-describedby')).toContain('-error');
		expect(input).toHaveValue('');
	});

	it('selects a day from the calendar, closes it and restores focus', async () => {
		const onValueChange = vi.fn();
		render(<AdsDatePicker defaultValue="2026-03-10" onValueChange={onValueChange} />);
		const trigger = screen.getByRole('button', { name: 'Abrir calendário' });
		trigger.focus();
		const grid = await openCalendar();
		expect(screen.getByText('março de 2026')).toBeInTheDocument();
		fireEvent.click(within(grid).getByRole('button', { name: /(^|\s)15 de março de 2026/ }));
		expect(onValueChange).toHaveBeenCalledWith('2026-03-15');
		expect(screen.getByRole('textbox')).toHaveValue('15/03/2026');
		await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
		expect(document.activeElement).toBe(trigger);
	});

	it('parses typed dates and flags invalid, disabled and out-of-range text', () => {
		const onValueChange = vi.fn();
		render(
			<AdsDatePicker
				isDateDisabled={(iso) => iso === '2026-05-20'}
				max="2026-12-31"
				min="2026-01-01"
				onValueChange={onValueChange}
			/>,
		);
		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '05/04/2026' } });
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(onValueChange).toHaveBeenLastCalledWith('2026-04-05');
		for (const text of ['31/02/2026', '20/05/2026', '31/12/2027', 'abc']) {
			fireEvent.change(input, { target: { value: text } });
			fireEvent.blur(input);
			expect(input).toHaveAttribute('aria-invalid', 'true');
		}
		expect(onValueChange).toHaveBeenCalledTimes(1);
		fireEvent.change(input, { target: { value: '' } });
		fireEvent.blur(input);
		expect(onValueChange).toHaveBeenLastCalledWith(null);
	});

	it('supports a controlled value', async () => {
		function Controlled() {
			const [value, setValue] = useState<string | null>('2026-01-05');
			return (
				<>
					<AdsDatePicker onValueChange={setValue} value={value} />
					<button onClick={() => setValue('2026-02-14')} type="button">
						Alterar
					</button>
				</>
			);
		}
		render(<Controlled />);
		expect(screen.getByRole('textbox')).toHaveValue('05/01/2026');
		fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
		expect(screen.getByRole('textbox')).toHaveValue('14/02/2026');
	});

	it('blocks dates outside min/max and disabled dates in the calendar', async () => {
		const onValueChange = vi.fn();
		render(
			<AdsDatePicker
				defaultValue="2026-03-10"
				isDateDisabled={(iso) => iso === '2026-03-12'}
				max="2026-03-20"
				min="2026-03-05"
				onValueChange={onValueChange}
			/>,
		);
		const grid = await openCalendar();
		const early = within(grid).getByRole('button', { name: /(^|\s)3 de março/ });
		const blocked = within(grid).getByRole('button', { name: /(^|\s)12 de março/ });
		expect(early).toHaveAttribute('aria-disabled', 'true');
		expect(blocked).toHaveAttribute('aria-disabled', 'true');
		fireEvent.click(early);
		fireEvent.click(blocked);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Mês anterior' })).toHaveAttribute(
			'aria-disabled',
			'true',
		);
	});

	it('navigates the grid with the keyboard', async () => {
		render(<AdsDatePicker defaultValue="2026-03-10" />);
		const grid = await openCalendar();
		await waitFor(() => expect(document.activeElement).toHaveAttribute('data-date', '2026-03-10'));
		fireEvent.keyDown(grid, { key: 'ArrowRight' });
		await waitFor(() => expect(document.activeElement).toHaveAttribute('data-date', '2026-03-11'));
		fireEvent.keyDown(grid, { key: 'ArrowDown' });
		await waitFor(() => expect(document.activeElement).toHaveAttribute('data-date', '2026-03-18'));
		fireEvent.keyDown(grid, { key: 'Home' });
		await waitFor(() => expect(document.activeElement).toHaveAttribute('data-date', '2026-03-15'));
		fireEvent.keyDown(grid, { key: 'PageDown' });
		await waitFor(() => expect(screen.getByText('abril de 2026')).toBeInTheDocument());
		expect(document.activeElement).toHaveAttribute('data-date', '2026-04-15');
		fireEvent.keyDown(grid, { key: 'PageUp', shiftKey: true });
		await waitFor(() => expect(screen.getByText('abril de 2025')).toBeInTheDocument());
		expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
	});

	it('closes with Escape', async () => {
		render(<AdsDatePicker defaultValue="2026-03-10" />);
		await openCalendar();
		fireEvent.keyDown(document, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
	});

	it('uses the locale for names, format and first day of the week', async () => {
		render(<AdsDatePicker defaultValue="2026-03-10" locale="en-US" />);
		expect(screen.getByRole('textbox')).toHaveValue('03/10/2026');
		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'mm/dd/yyyy');
		await openCalendar();
		expect(screen.getByText('March 2026')).toBeInTheDocument();
		expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Sun');
	});

	it('defaults to a Sunday-first week in pt-BR and allows overriding it', async () => {
		const { unmount } = render(<AdsDatePicker defaultValue="2026-03-10" />);
		await openCalendar();
		expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(/dom/i);
		unmount();
		render(<AdsDatePicker defaultValue="2026-03-10" firstDayOfWeek={1} />);
		await openCalendar();
		expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent(/seg/i);
	});

	it('disables everything and submits the ISO value through a hidden field', () => {
		const { container, rerender } = render(<AdsDatePicker defaultValue="2026-03-10" name="due" />);
		expect(container.querySelector<HTMLInputElement>('input[name="due"]')?.value).toBe(
			'2026-03-10',
		);
		rerender(<AdsDatePicker defaultValue="2026-03-10" disabled name="due" />);
		expect(screen.getByRole('textbox')).toBeDisabled();
		expect(screen.getByRole('button', { name: 'Abrir calendário' })).toBeDisabled();
	});

	it('renders identical markup for the same initial value on the server and client', () => {
		const html = renderToString(<AdsDatePicker defaultValue="2026-03-10" />);
		const { container } = render(<AdsDatePicker defaultValue="2026-03-10" />);
		expect(html).toContain('value="10/03/2026"');
		expect(container.querySelector('input')?.getAttribute('value')).toBe('10/03/2026');
	});

	it('has no axe violations closed and open', async () => {
		const { container } = render(
			<AdsField label="Data">
				<AdsDatePicker defaultValue="2026-03-10" />
			</AdsField>,
		);
		expect((await axe.run(container)).violations).toEqual([]);
		await openCalendar();
		expect(
			(await axe.run(document.body, { rules: { region: { enabled: false } } })).violations,
		).toEqual([]);
	});
});

describe('AdsDatePicker range', () => {
	it('selects a range and swaps reversed ends', async () => {
		const onValueChange = vi.fn();
		render(
			<AdsDatePicker
				defaultValue={{ start: '2026-03-10', end: null }}
				mode="range"
				onValueChange={onValueChange}
			/>,
		);
		let grid = await openCalendar();
		fireEvent.click(within(grid).getByRole('button', { name: /(^|\s)20 de março/ }));
		expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-03-20', end: null });
		grid = screen.getByRole('grid');
		fireEvent.click(within(grid).getByRole('button', { name: /(^|\s)8 de março/ }));
		expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-03-08', end: '2026-03-20' });
		expect(
			screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value),
		).toEqual(['08/03/2026', '20/03/2026']);
		await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
	});

	it('types both ends, rejects a start after the end and supports control', () => {
		function Controlled() {
			const [value, setValue] = useState<AdsDateRange>({ start: '2026-03-10', end: '2026-03-20' });
			return (
				<AdsDatePicker
					mode="range"
					onValueChange={setValue}
					startName="from"
					endName="to"
					value={value}
				/>
			);
		}
		const { container } = render(<Controlled />);
		const [start, end] = screen.getAllByRole('textbox');
		expect(start).toHaveAccessibleName('Data inicial');
		expect(end).toHaveAccessibleName('Data final');
		fireEvent.change(start!, { target: { value: '25/03/2026' } });
		fireEvent.blur(start!);
		expect(start).toHaveAttribute('aria-invalid', 'true');
		fireEvent.change(start!, { target: { value: '01/03/2026' } });
		fireEvent.blur(start!);
		expect(container.querySelector<HTMLInputElement>('input[name="from"]')?.value).toBe(
			'2026-03-01',
		);
		expect(container.querySelector<HTMLInputElement>('input[name="to"]')?.value).toBe('2026-03-20');
	});

	it('highlights the selected period', async () => {
		render(
			<AdsDatePicker defaultValue={{ start: '2026-03-10', end: '2026-03-12' }} mode="range" />,
		);
		const grid = await openCalendar();
		const middle = within(grid)
			.getByRole('button', { name: /(^|\s)11 de março/ })
			.closest('td');
		expect(middle).toHaveAttribute('aria-selected', 'true');
		expect(
			within(grid)
				.getByRole('button', { name: /(^|\s)13 de março/ })
				.closest('td'),
		).toHaveAttribute('aria-selected', 'false');
	});
});
