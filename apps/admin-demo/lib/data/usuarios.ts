export interface Usuario {
	id: string;
	nome: string;
	perfil: string;
}

export const usuarios: readonly Usuario[] = [
	{ id: '1', nome: 'Ana Silva', perfil: 'Admin' },
	{ id: '2', nome: 'Bruno Costa', perfil: 'Editor' },
	{ id: '3', nome: 'Carla Dias', perfil: 'Leitor' },
	{ id: '4', nome: 'Diego Lima', perfil: 'Editor' },
	{ id: '5', nome: 'Elena Souza', perfil: 'Leitor' },
];

export const usuariosPageSize = 3;
