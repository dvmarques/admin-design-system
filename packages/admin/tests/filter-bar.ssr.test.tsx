import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsFilterBar } from '../src/index.js';

function Bar() {
	return (
		<AdsFilterBar
			filters={[
				{ id: 'q', type: 'text', label: 'Busca' },
				{ id: 'periodo', type: 'date-range', label: 'Período' },
			]}
			onChange={() => {}}
			value={{ q: 'ana', periodo: { start: '2026-01-01', end: '2026-01-31' } }}
		/>
	);
}

describe('AdsFilterBar SSR and hydration', () => {
	it('hydrates the server markup without errors, collapsed by default', async () => {
		const html = renderToString(<Bar />);
		expect(html).toContain('data-expanded="false"');
		expect(html).toContain('Remover filtro Busca: ana');
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		await act(async () => {
			hydrateRoot(container, <Bar />);
		});
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
		container.remove();
	});
});
