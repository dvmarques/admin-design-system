import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { UsuariosTabela } from '../app/(admin)/usuarios/usuarios-tabela';
import { usuarios } from '../lib/data/usuarios';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ replace }),
	usePathname: () => '/usuarios',
}));

vi.mock('next/link', () => ({
	default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

const rows = usuarios.slice(0, 3);

describe('UsuariosTabela', () => {
	it('builds readable sort URLs and clears pagina when sorting', () => {
		render(
			<UsuariosTabela
				page={2}
				pageCount={2}
				params={{ q: 'ana', pagina: '2', status: 'ativo' }}
				rows={rows}
				sort={null}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Nome' }));
		expect(replace).toHaveBeenCalledWith('/usuarios?q=ana&status=ativo&ordem=nome:asc', {
			scroll: false,
		});
	});

	it('moves focus to the select-all checkbox when clearing selection', () => {
		render(<UsuariosTabela page={1} pageCount={1} params={{}} rows={rows} sort={null} />);
		fireEvent.click(screen.getByRole('checkbox', { name: 'Selecionar Ana Silva' }));
		const clear = screen.getByRole('button', { name: 'Limpar seleção' });
		clear.focus();
		fireEvent.click(clear);
		expect(screen.queryByRole('button', { name: 'Limpar seleção' })).toBeNull();
		expect(
			screen.getByRole('checkbox', { name: 'Selecionar todas as linhas da página' }),
		).toHaveFocus();
	});
});
