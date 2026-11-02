import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AdsFileUpload } from '../src/index.js';

const file = (name: string, type = 'text/csv', bytes = 4) =>
	new File([new Uint8Array(bytes)], name, { type });

const input = () => screen.getByLabelText('Arquivo de dados') as HTMLInputElement;

describe('AdsFileUpload', () => {
	it('selects, displays metadata, removes, clears and reselects the same file', () => {
		const onFilesChange = vi.fn();
		render(<AdsFileUpload label="Arquivo de dados" onFilesChange={onFilesChange} />);
		const sample = file('dados.csv');
		expect(screen.getByText('Nenhum arquivo selecionado')).toBeInTheDocument();
		fireEvent.change(input(), { target: { files: [sample] } });
		expect(screen.getByText('dados.csv')).toBeInTheDocument();
		expect(screen.getByText(/4 B/)).toBeInTheDocument();
		expect(onFilesChange).toHaveBeenLastCalledWith([sample], 'select');
		expect(input().value).toBe('');
		fireEvent.click(screen.getByRole('button', { name: 'Remover dados.csv' }));
		expect(onFilesChange).toHaveBeenLastCalledWith([], 'remove');
		fireEvent.change(input(), { target: { files: [sample] } });
		expect(onFilesChange).toHaveBeenCalledTimes(3);
		fireEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }));
		expect(onFilesChange).toHaveBeenLastCalledWith([], 'clear');
	});

	it('rejects wrong extensions, MIME types, size and count, keeping valid files', () => {
		const onFilesChange = vi.fn();
		const onReject = vi.fn();
		render(
			<AdsFileUpload
				accept=".csv,application/json"
				label="Arquivo de dados"
				maxFiles={1}
				maxSizeBytes={10}
				multiple
				onFilesChange={onFilesChange}
				onReject={onReject}
			/>,
		);
		const good = file('dados.csv');
		fireEvent.change(input(), {
			target: {
				files: [
					file('ruim.txt', 'text/plain'),
					file('grande.csv', 'text/csv', 11),
					good,
					file('extra.json', 'application/json'),
				],
			},
		});
		expect(onFilesChange).toHaveBeenLastCalledWith([good], 'select');
		expect(onReject.mock.lastCall?.[0].map((item: { reason: string }) => item.reason)).toEqual([
			'type',
			'size',
			'count',
		]);
		expect(screen.getByRole('alert')).toHaveTextContent('ruim.txt');
		expect(screen.getByRole('alert')).toHaveTextContent('grande.csv');
		expect(screen.getByRole('alert')).toHaveTextContent('extra.json');
		expect(screen.getByRole('button', { name: 'Selecionar arquivos' })).toHaveAccessibleDescription(
			/tipo de arquivo não permitido/,
		);
		fireEvent.change(input(), {
			target: { files: [file('outro.exe', 'application/octet-stream')] },
		});
		expect(onFilesChange).toHaveBeenCalledTimes(1);
		expect(screen.getByText('dados.csv')).toBeInTheDocument();
	});

	it('keeps controlled value until consumer updates it', () => {
		const sample = file('dados.csv');
		const onFilesChange = vi.fn();
		const { rerender } = render(
			<AdsFileUpload files={[]} label="Arquivo de dados" onFilesChange={onFilesChange} />,
		);
		fireEvent.change(input(), { target: { files: [sample] } });
		expect(onFilesChange).toHaveBeenCalledWith([sample], 'select');
		expect(screen.queryByText('dados.csv')).not.toBeInTheDocument();
		rerender(
			<AdsFileUpload files={[sample]} label="Arquivo de dados" onFilesChange={onFilesChange} />,
		);
		expect(screen.getByText('dados.csv')).toBeInTheDocument();
	});

	it('does not change state when picker is cancelled', () => {
		const sample = file('dados.csv');
		const onFilesChange = vi.fn();
		render(
			<AdsFileUpload
				defaultFiles={[sample]}
				label="Arquivo de dados"
				onFilesChange={onFilesChange}
			/>,
		);
		fireEvent.change(input(), { target: { files: [] } });
		expect(onFilesChange).not.toHaveBeenCalled();
		expect(screen.getByText('dados.csv')).toBeInTheDocument();
	});

	it.each([{ disabled: true }, { isLoading: true }])(
		'blocks selection and removal for %o',
		(props) => {
			const onFilesChange = vi.fn();
			render(
				<AdsFileUpload
					{...props}
					defaultFiles={[file('dados.csv')]}
					label="Arquivo de dados"
					onFilesChange={onFilesChange}
				/>,
			);
			expect(input()).toBeDisabled();
			expect(screen.getByRole('button', { name: 'Selecionar arquivo' })).toBeDisabled();
			expect(screen.getByRole('button', { name: 'Remover dados.csv' })).toBeDisabled();
			fireEvent.change(input(), { target: { files: [file('outro.csv')] } });
			expect(onFilesChange).not.toHaveBeenCalled();
			if (props.isLoading) expect(screen.getByText('Enviando arquivos...')).toBeInTheDocument();
		},
	);

	it('preserves native picker ref and server rendering', () => {
		const ref = createRef<HTMLInputElement>();
		render(<AdsFileUpload label="Arquivo de dados" ref={ref} />);
		expect(ref.current).toBe(input());
		expect(input()).toHaveAttribute('type', 'file');
		expect(renderToString(<AdsFileUpload label="Arquivo de dados" />)).toContain('type="file"');
	});

	it('has accessible states and no automatic axe violations', async () => {
		const { container } = render(
			<AdsFileUpload error="Arquivo inválido" label="Arquivo de dados" />,
		);
		expect(screen.getByRole('alert')).toHaveTextContent('Arquivo inválido');
		expect(input()).toHaveAttribute('aria-invalid', 'true');
		expect((await axe.run(container)).violations).toEqual([]);
	});
});
