import { describe, expect, it, vi } from 'vitest';
import { restoreFocusAfterClearSelection } from '../lib/selection-clear-focus';

describe('restoreFocusAfterClearSelection', () => {
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
