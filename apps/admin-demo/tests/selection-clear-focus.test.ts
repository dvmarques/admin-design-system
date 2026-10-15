import { afterEach, describe, expect, it, vi } from 'vitest';
import { restoreFocusAfterClearSelection } from '../lib/selection-clear-focus';

describe('restoreFocusAfterClearSelection', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});
	it('focuses select-all when the trigger was removed and focus was lost', () => {
		const trigger = document.createElement('button');
		const selectAll = document.createElement('input');
		selectAll.type = 'checkbox';
		const focus = vi.spyOn(selectAll, 'focus');
		document.body.append(trigger, selectAll);
		trigger.remove();
		restoreFocusAfterClearSelection(trigger, { selectAll });
		expect(focus).toHaveBeenCalled();
	});

	it('focuses the scroll region when select-all is missing or disabled', () => {
		const trigger = document.createElement('button');
		const scroll = document.createElement('div');
		scroll.tabIndex = 0;
		const focus = vi.spyOn(scroll, 'focus');
		document.body.append(trigger, scroll);
		trigger.remove();
		restoreFocusAfterClearSelection(trigger, { scrollRegion: scroll });
		expect(focus).toHaveBeenCalled();
	});

	it('does not move focus when the trigger is still connected', () => {
		const trigger = document.createElement('button');
		const selectAll = document.createElement('input');
		selectAll.type = 'checkbox';
		const focus = vi.spyOn(selectAll, 'focus');
		document.body.append(trigger, selectAll);
		restoreFocusAfterClearSelection(trigger, { selectAll });
		expect(focus).not.toHaveBeenCalled();
		trigger.remove();
	});
});
