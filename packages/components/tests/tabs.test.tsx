import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdsTabs } from '../src/index.js';

function renderTabs(props: Parameters<typeof AdsTabs>[0] = {}) {
	return render(
		<AdsTabs defaultValue="one" {...props}>
			<AdsTabs.List>
				<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
				<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				<AdsTabs.Trigger value="three">Três</AdsTabs.Trigger>
			</AdsTabs.List>
			<AdsTabs.Panel value="one">Painel um</AdsTabs.Panel>
			<AdsTabs.Panel value="two">Painel dois</AdsTabs.Panel>
			<AdsTabs.Panel value="three">Painel três</AdsTabs.Panel>
		</AdsTabs>,
	);
}

describe('AdsTabs activation mode', () => {
	it('keeps manual activation by default: the focus moves without changing the active tab', () => {
		renderTabs();
		const first = screen.getByRole('tab', { name: 'Um' });
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(screen.getByRole('tab', { name: 'Dois' })).toHaveFocus();
		expect(first).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByText('Painel um')).toBeInTheDocument();
	});

	it('activates the focused tab as the focus moves in automatic mode', () => {
		renderTabs({ activationMode: 'automatic' });
		const first = screen.getByRole('tab', { name: 'Um' });
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(screen.getByRole('tab', { name: 'Dois' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByText('Painel dois')).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Dois' }), { key: 'End' });
		expect(screen.getByRole('tab', { name: 'Três' })).toHaveAttribute('aria-selected', 'true');
		fireEvent.keyDown(screen.getByRole('tab', { name: 'Três' }), { key: 'Home' });
		expect(screen.getByRole('tab', { name: 'Um' })).toHaveAttribute('aria-selected', 'true');
	});

	it('notifies the change in automatic mode', () => {
		const changes: string[] = [];
		renderTabs({ activationMode: 'automatic', onValueChange: (value) => changes.push(value) });
		const first = screen.getByRole('tab', { name: 'Um' });
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(changes).toEqual(['two']);
	});
});

describe('AdsTabs orientation', () => {
	it('exposes the horizontal orientation by default', () => {
		renderTabs();
		expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('uses the vertical arrows, and ignores the horizontal ones, in the vertical orientation', () => {
		renderTabs({ orientation: 'vertical' });
		expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
		const first = screen.getByRole('tab', { name: 'Um' });
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(first).toHaveFocus();
		fireEvent.keyDown(first, { key: 'ArrowDown' });
		const second = screen.getByRole('tab', { name: 'Dois' });
		expect(second).toHaveFocus();
		fireEvent.keyDown(second, { key: 'ArrowUp' });
		expect(first).toHaveFocus();
		fireEvent.keyDown(first, { key: 'End' });
		expect(screen.getByRole('tab', { name: 'Três' })).toHaveFocus();
	});

	it('ignores the vertical arrows in the horizontal orientation', () => {
		renderTabs();
		const first = screen.getByRole('tab', { name: 'Um' });
		first.focus();
		fireEvent.keyDown(first, { key: 'ArrowDown' });
		expect(first).toHaveFocus();
	});

	it('marks the active vertical tab with a side indicator, not the bottom border', () => {
		renderTabs({ orientation: 'vertical' });
		const active = screen.getByRole('tab', { name: 'Um' });
		const inactive = screen.getByRole('tab', { name: 'Dois' });
		expect(active).toHaveClass('border-r-2', 'border-r-primary', 'bg-surface-selected');
		expect(active).not.toHaveClass('border-b-2', 'border-b-primary');
		expect(inactive).toHaveClass('border-r-border', 'bg-transparent');
		expect(screen.getByRole('tablist')).toHaveClass('flex-col', 'border-r');
	});
});

describe('AdsTabs mounting', () => {
	it('mounts only the active panel by default', () => {
		renderTabs();
		expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
		expect(screen.queryByText('Painel dois')).toBeNull();
	});

	it('keeps inactive panels hidden and out of the keyboard order with keepMounted', () => {
		renderTabs({ keepMounted: true });
		const panels = screen.getAllByRole('tabpanel', { hidden: true });
		expect(panels).toHaveLength(3);
		expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
		const hidden = screen.getByText('Painel dois');
		expect(hidden).toHaveAttribute('hidden');
		expect(hidden).not.toHaveAttribute('tabindex');
		expect(screen.getByText('Painel um')).toHaveAttribute('tabindex', '0');
	});

	it('preserves the state of a kept panel', () => {
		render(
			<AdsTabs defaultValue="one" keepMounted>
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="one">Painel um</AdsTabs.Panel>
				<AdsTabs.Panel value="two">
					<input aria-label="Nome" />
				</AdsTabs.Panel>
			</AdsTabs>,
		);
		fireEvent.click(screen.getByRole('tab', { name: 'Dois' }));
		fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
		fireEvent.click(screen.getByRole('tab', { name: 'Um' }));
		const input = screen.getByLabelText('Nome');
		expect(input.closest('[role="tabpanel"]')).toHaveAttribute('hidden');
		fireEvent.click(screen.getByRole('tab', { name: 'Dois' }));
		expect(screen.getByLabelText('Nome')).toBe(input);
		expect(input).toHaveValue('Ana');
	});

	it('lets a panel override keepMounted of the root', () => {
		render(
			<AdsTabs defaultValue="one" keepMounted>
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="one">Painel um</AdsTabs.Panel>
				<AdsTabs.Panel keepMounted={false} value="two">
					Painel dois
				</AdsTabs.Panel>
			</AdsTabs>,
		);
		expect(screen.queryByText('Painel dois')).toBeNull();
	});
});

describe('AdsTabs ids and tab stop', () => {
	it('generates valid and distinct ids for values with spaces and special characters', () => {
		render(
			<AdsTabs defaultValue="a b" keepMounted>
				<AdsTabs.List>
					<AdsTabs.Trigger value="a b">A B</AdsTabs.Trigger>
					<AdsTabs.Trigger value="a_b">A_B</AdsTabs.Trigger>
					<AdsTabs.Trigger value="a:b/ç">Especial</AdsTabs.Trigger>
				</AdsTabs.List>
				<AdsTabs.Panel value="a b">P1</AdsTabs.Panel>
				<AdsTabs.Panel value="a_b">P2</AdsTabs.Panel>
				<AdsTabs.Panel value="a:b/ç">P3</AdsTabs.Panel>
			</AdsTabs>,
		);
		const tabs = screen.getAllByRole('tab');
		const ids = tabs.map((tab) => tab.id);
		expect(new Set(ids).size).toBe(3);
		for (const tab of tabs) {
			expect(tab.id).toMatch(/^[A-Za-z0-9_-]+$/);
			const panelId = tab.getAttribute('aria-controls') ?? '';
			expect(panelId).toMatch(/^[A-Za-z0-9_-]+$/);
			const panel = document.getElementById(panelId);
			expect(panel).toHaveAttribute('aria-labelledby', tab.id);
			expect(document.querySelector(`#${tab.id}`)).toBe(tab);
		}
	});

	it('gives the tab stop to the active tab', () => {
		renderTabs();
		const stops = screen.getAllByRole('tab').filter((tab) => tab.getAttribute('tabindex') === '0');
		expect(stops).toEqual([screen.getByRole('tab', { name: 'Um' })]);
	});

	it('gives the tab stop to the first enabled tab when the active tab is disabled', () => {
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger disabled value="one">
						Um
					</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
					<AdsTabs.Trigger value="three">Três</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		const stops = screen.getAllByRole('tab').filter((tab) => tab.getAttribute('tabindex') === '0');
		expect(stops).toEqual([screen.getByRole('tab', { name: 'Dois' })]);
	});

	it('gives the tab stop to the first enabled tab when no tab is active', () => {
		render(
			<AdsTabs defaultValue="">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		expect(screen.getByRole('tab', { name: 'Um' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('tab', { name: 'Dois' })).toHaveAttribute('tabindex', '-1');
	});

	it('moves the tab stop back to the active tab when it becomes enabled', () => {
		const { rerender } = render(
			<AdsTabs defaultValue="two">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger disabled value="two">
						Dois
					</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		expect(screen.getByRole('tab', { name: 'Um' })).toHaveAttribute('tabindex', '0');
		rerender(
			<AdsTabs defaultValue="two">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger value="two">Dois</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		expect(screen.getByRole('tab', { name: 'Dois' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('tab', { name: 'Um' })).toHaveAttribute('tabindex', '-1');
	});

	it('renders the triggers as non-submit buttons', () => {
		renderTabs();
		for (const tab of screen.getAllByRole('tab')) expect(tab).toHaveAttribute('type', 'button');
	});
});

describe('AdsTabs references and handlers', () => {
	it('only references panels that exist in the document', () => {
		renderTabs();
		expect(screen.getByRole('tab', { name: 'Um' })).toHaveAttribute('aria-controls');
		expect(screen.getByRole('tab', { name: 'Dois' })).not.toHaveAttribute('aria-controls');
	});

	it('references every panel when they are kept mounted', () => {
		renderTabs({ keepMounted: true });
		for (const tab of screen.getAllByRole('tab')) {
			expect(document.getElementById(tab.getAttribute('aria-controls') ?? '')).not.toBeNull();
		}
	});

	it('calls the consumer onClick and lets it prevent the activation', () => {
		const calls: string[] = [];
		render(
			<AdsTabs defaultValue="one">
				<AdsTabs.List>
					<AdsTabs.Trigger value="one">Um</AdsTabs.Trigger>
					<AdsTabs.Trigger onClick={() => calls.push('two')} value="two">
						Dois
					</AdsTabs.Trigger>
					<AdsTabs.Trigger onClick={(event) => event.preventDefault()} value="three">
						Três
					</AdsTabs.Trigger>
				</AdsTabs.List>
			</AdsTabs>,
		);
		fireEvent.click(screen.getByRole('tab', { name: 'Dois' }));
		expect(calls).toEqual(['two']);
		expect(screen.getByRole('tab', { name: 'Dois' })).toHaveAttribute('aria-selected', 'true');
		fireEvent.click(screen.getByRole('tab', { name: 'Três' }));
		expect(screen.getByRole('tab', { name: 'Três' })).toHaveAttribute('aria-selected', 'false');
	});

	it('keeps the inactive panel free of display utilities, which would defeat the hidden attribute', () => {
		renderTabs({ keepMounted: true });
		const panel = screen.getByText('Painel dois');
		expect(panel).toHaveAttribute('hidden');
		expect(panel.className).not.toMatch(/(^|\s)(block|flex|grid|inline|contents)(\s|$)/);
	});
});
