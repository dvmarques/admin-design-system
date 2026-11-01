import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdsFileUpload, type AdsFileRejection } from '@dvmarques/admin-ds-components';

const meta = {
	title: 'Forms/FileUpload',
	component: AdsFileUpload,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Seleciona e valida arquivos sem enviar dados para backend. O accept é somente validação de UX; valide novamente no servidor. Arrastar e soltar fica fora do MVP.',
			},
		},
	},
} satisfies Meta<typeof AdsFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: { label: 'Arquivo de dados', accept: '.csv,.json', maxSizeBytes: 2_000_000 },
};

export const MultipleControlled: Story = {
	render: () => {
		const [files, setFiles] = useState<File[]>([]);
		const [rejected, setRejected] = useState<AdsFileRejection[]>([]);
		return (
			<div className="flex max-w-xl flex-col gap-3">
				<AdsFileUpload
					accept=".csv,.json"
					files={files}
					label="Arquivos de dados"
					maxFiles={3}
					maxSizeBytes={2_000_000}
					multiple
					onFilesChange={setFiles}
					onReject={setRejected}
				/>
				<p className="text-sm text-text-muted">Rejeições: {rejected.length}</p>
			</div>
		);
	},
};

export const States: Story = {
	render: () => (
		<div className="flex max-w-xl flex-col gap-4">
			<AdsFileUpload label="Vazio" />
			<AdsFileUpload error="Revise o arquivo selecionado." label="Com erro" />
			<AdsFileUpload disabled label="Desabilitado" />
			<AdsFileUpload isLoading label="Enviando" />
		</div>
	),
};
