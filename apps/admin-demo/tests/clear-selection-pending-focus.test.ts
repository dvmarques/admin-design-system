import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	applyPendingClearSelectionFocus,
	findSelectionClearFocusTargets,
} from '../lib/clear-selection-pending-focus';

describe('applyPendingClearSelectionFocus', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});
	it('focuses the select-all checkbox when the clear button was removed', () => {
		const root = document.createElement('div');
		const selectAll = document.createElement('input');
		selectAll.type = 'checkbox';
		selectAll.setAttribute('aria-label', 'Selecionar todas as linhas da página');
		const trigger = document.createElement('button');
		root.append(selectAll);
		document.body.append(root, trigger);
		trigger.focus();
		trigger.remove();
		expect(applyPendingClearSelectionFocus(trigger, root)).toBe('applied');
		expect(selectAll).toHaveFocus();
		root.remove();
	});

	it('falls back to the scroll region when select-all is disabled', () => {
		const root = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'ads-smart-table-scroll';
		scroll.tabIndex = 0;
		const selectAll = document.createElement('input');
		selectAll.type = 'checkbox';
		selectAll.disabled = true;
		selectAll.setAttribute('aria-label', 'Selecionar todas as linhas da página');
		const trigger = document.createElement('button');
		root.append(selectAll, scroll);
		document.body.append(root, trigger);
		trigger.focus();
		trigger.remove();
		const focus = vi.spyOn(scroll, 'focus');
		expect(applyPendingClearSelectionFocus(trigger, root)).toBe('applied');
		expect(focus).toHaveBeenCalled();
		root.remove();
	});

	it('waits while the trigger stays connected', () => {
		const trigger = document.createElement('button');
		document.body.append(trigger);
		expect(applyPendingClearSelectionFocus(trigger, null)).toBe('waiting');
		trigger.remove();
	});
});

describe('findSelectionClearFocusTargets', () => {
	it('locates select-all and scroll region inside the example root', () => {
		const root = document.createElement('div');
		const selectAll = document.createElement('input');
		selectAll.type = 'checkbox';
		selectAll.setAttribute('aria-label', 'Selecionar todas as linhas da página');
		const scroll = document.createElement('div');
		scroll.className = 'ads-smart-table-scroll';
		root.append(selectAll, scroll);
		expect(findSelectionClearFocusTargets(root).selectAll).toBe(selectAll);
		expect(findSelectionClearFocusTargets(root).scrollRegion).toBe(scroll);
	});
});
