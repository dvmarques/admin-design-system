import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsBulkActionBar, AdsListFlow, AdsStepForm } from '../src/index.js';

function Flows() {
	return (
		<>
			<AdsListFlow
				bulkActions={<button type="button">Excluir</button>}
				caption="Usuários"
				columns={[{ id: 'name', label: 'Nome', cell: (r: { id: string }) => r.id }]}
				getRowId={(r) => r.id}
				onSelectionChange={() => {}}
				rows={[{ id: 'a' }, { id: 'b' }]}
				selectedIds={['a']}
			/>
			<AdsBulkActionBar selectedCount={2} />
			<AdsStepForm
				activeStepId="b"
				onActiveStepChange={() => {}}
				onSubmit={() => {}}
				steps={[
					{ id: 'a', label: 'Dados', content: <input aria-label="Nome" /> },
					{ id: 'b', label: 'Revisão', content: <p>Resumo</p> },
				]}
			/>
		</>
	);
}

describe('admin flows SSR and hydration', () => {
	it('hydrates the server markup without errors', async () => {
		const html = renderToString(<Flows />);
		expect(html).toContain('1 item selecionado');
		expect(html).toContain('aria-current="step"');
		const container = document.createElement('div');
		container.innerHTML = html;
		document.body.append(container);
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		await act(async () => {
			hydrateRoot(container, <Flows />);
		});
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
		container.remove();
	});
});
