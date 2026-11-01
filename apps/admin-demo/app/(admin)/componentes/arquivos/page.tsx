'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	AdsButton,
	AdsDialog,
	AdsFileUpload,
	AdsSurface,
	AdsTypography,
} from '@dvmarques/admin-ds-components';

export default function FileImportPage() {
	const [open, setOpen] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [busy, setBusy] = useState(false);
	const [notice, setNotice] = useState('');

	const close = () => {
		if (busy) return;
		setOpen(false);
		setFiles([]);
	};

	const simulate = () => {
		const [first] = files;
		if (busy || files.length !== 1 || !first) return;
		const name = first.name;
		setBusy(true);
		window.setTimeout(() => {
			setBusy(false);
			setOpen(false);
			setFiles([]);
			setNotice('Importação simulada de ' + name + ' concluída. Nenhum arquivo foi enviado.');
		}, 350);
	};

	return (
		<div className="demo-page">
			<div className="demo-shell">
				<AdsTypography as="h1" variant="heading1">
					Importação de arquivos
				</AdsTypography>
				<p>Exemplo fictício de importação CSV/JSON, sem rede ou backend.</p>
				<Link className="demo-action-link" href="/componentes">
					Voltar ao catálogo
				</Link>
				<AdsSurface className="demo-panel mt-4" variant="raised">
					<AdsButton
						onClick={() => {
							setNotice('');
							setOpen(true);
						}}
					>
						Abrir importação
					</AdsButton>
					{notice ? (
						<p className="mt-3 text-sm" role="status">
							{notice}
						</p>
					) : null}
				</AdsSurface>
				<AdsDialog
					closeOnBackdrop={!busy}
					closeOnEscape={!busy}
					description="Selecione um arquivo de dados fictício para simular a importação."
					onOpenChange={(next) => {
						if (!next) close();
					}}
					open={open}
					showCloseButton={!busy}
					title="Importar arquivo de dados"
				>
					<div className="flex flex-col gap-4">
						<AdsFileUpload
							accept=".csv,.json,application/json,text/csv"
							files={files}
							isLoading={busy}
							label="Arquivo de dados"
							maxSizeBytes={2_000_000}
							onFilesChange={setFiles}
						/>
						<div className="flex flex-wrap justify-end gap-2">
							<AdsButton disabled={busy} onClick={close} variant="secondary">
								Cancelar
							</AdsButton>
							<AdsButton disabled={files.length !== 1} isLoading={busy} onClick={simulate}>
								Simular importação
							</AdsButton>
						</div>
					</div>
				</AdsDialog>
			</div>
		</div>
	);
}
