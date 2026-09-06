'use client';

import { useRef, useState } from 'react';
import {
	AdsButton,
	AdsDialog,
	AdsField,
	AdsInput,
	AdsLoadingIndicator,
	AdsSelect,
	AdsSkeleton,
	AdsSurface,
	AdsTextarea,
	AdsToast,
	AdsTypography,
	type AdsToastVariant,
} from '@admin-ds/components';

const feedbackCopy: Record<AdsToastVariant, string> = {
	info: 'As alterações estão sendo processadas.',
	success: 'Registro removido com sucesso.',
	warning: 'Atenção: revise os dados antes de continuar.',
	error: 'Não foi possível concluir a operação.',
};

export function EvaluationShowcase() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [toastVariant, setToastVariant] = useState<AdsToastVariant | null>(null);
	const destructiveActionRef = useRef<HTMLButtonElement>(null);

	function showFeedback(variant: AdsToastVariant) {
		setToastVariant(variant);
	}

	return (
		<section aria-labelledby="evaluation" className="demo-section demo-section--evaluation">
			<div className="demo-section__heading">
				<div>
					<p className="demo-kicker">Estados e fluxos</p>
					<AdsTypography as="h2" id="evaluation" variant="heading2">
						Avaliação de uso administrativo
					</AdsTypography>
				</div>
				<p className="demo-section__note">
					Cenários compactos para conferir carregamento, validação e feedback com os componentes
					públicos.
				</p>
			</div>

			<div className="demo-evaluation-grid">
				<AdsSurface className="demo-evaluation-panel" variant="raised">
					<p className="demo-panel__eyebrow">Carregamento estruturado</p>
					<AdsTypography as="h3" variant="heading4">
						Resumo da conta
					</AdsTypography>
					<p className="demo-panel__copy">
						Skeleton preserva a forma conhecida; o indicador comunica uma espera sem duração
						definida.
					</p>
					<div aria-label="Carregando resumo da conta" className="demo-loading-preview">
						<div className="demo-skeleton-stack">
							<AdsSkeleton className="h-3 w-24" />
							<AdsSkeleton className="h-8 w-40" />
							<AdsSkeleton className="h-3 w-full" />
						</div>
						<AdsLoadingIndicator label="Sincronizando dados" />
					</div>
				</AdsSurface>

				<AdsSurface className="demo-evaluation-panel" variant="outlined">
					<p className="demo-panel__eyebrow">Ação destrutiva</p>
					<AdsTypography as="h3" variant="heading4">
						Remover registro
					</AdsTypography>
					<p className="demo-panel__copy">
						Confirmação explícita, retorno de foco e notificação acessível após a ação.
					</p>
					<div className="demo-actions demo-evaluation-actions">
						<AdsButton
							ref={destructiveActionRef}
							variant="danger"
							onClick={() => setDialogOpen(true)}
						>
							Excluir registro
						</AdsButton>
						<AdsButton variant="secondary" onClick={() => showFeedback('info')}>
							Salvar rascunho
						</AdsButton>
					</div>
					<div className="demo-feedback-actions" aria-label="Variantes de feedback">
						<AdsButton size="sm" variant="ghost" onClick={() => showFeedback('info')}>
							Informação
						</AdsButton>
						<AdsButton size="sm" variant="ghost" onClick={() => showFeedback('warning')}>
							Aviso
						</AdsButton>
						<AdsButton size="sm" variant="ghost" onClick={() => showFeedback('error')}>
							Erro
						</AdsButton>
					</div>
				</AdsSurface>
			</div>

			<AdsSurface className="demo-evaluation-form" variant="outlined">
				<div className="demo-panel__heading">
					<div>
						<p className="demo-panel__eyebrow">Estados de formulário</p>
						<AdsTypography as="h3" variant="heading4">
							Validação e disponibilidade
						</AdsTypography>
					</div>
					<p className="demo-section__note">
						Os mesmos controles permanecem legíveis ao alternar tema e largura.
					</p>
				</div>
				<div className="demo-state-grid">
					<AdsField description="Pronto para edição." label="Normal">
						<AdsInput defaultValue="contato@empresa.com" />
					</AdsField>
					<AdsField error="Informe um e-mail válido." label="Erro" validationState="error">
						<AdsInput defaultValue="contato@" />
					</AdsField>
					<AdsField description="Formato verificado." label="Sucesso" validationState="success">
						<AdsInput defaultValue="financeiro@empresa.com" />
					</AdsField>
					<AdsField description="Valor preservado para consulta." label="Somente leitura">
						<AdsInput defaultValue="ID-2048" readOnly />
					</AdsField>
					<AdsField description="Indisponível neste contexto." label="Desabilitado">
						<AdsInput defaultValue="Aguardando aprovação" disabled />
					</AdsField>
					<AdsField error="Escolha uma opção." label="Seleção com erro" validationState="error">
						<AdsSelect defaultValue="" aria-label="Seleção com erro">
							<option value="">Selecione...</option>
							<option value="active">Ativo</option>
							<option value="paused">Pausado</option>
						</AdsSelect>
					</AdsField>
				</div>
				<AdsField
					className="demo-form__wide"
					description="Campo opcional para contexto adicional."
					label="Observações"
				>
					<AdsTextarea rows={3} placeholder="Adicione uma observação" />
				</AdsField>
			</AdsSurface>

			<AdsDialog
				description="Esta ação não pode ser desfeita."
				onOpenChange={setDialogOpen}
				open={dialogOpen}
				title="Excluir registro?"
			>
				<div className="demo-dialog-actions">
					<AdsButton variant="secondary" onClick={() => setDialogOpen(false)}>
						Cancelar
					</AdsButton>
					<AdsButton
						variant="danger"
						onClick={() => {
							setDialogOpen(false);
							setToastVariant('success');
							destructiveActionRef.current?.focus();
						}}
					>
						Confirmar exclusão
					</AdsButton>
				</div>
			</AdsDialog>

			<AdsToast
				open={toastVariant !== null}
				variant={toastVariant ?? 'info'}
				onClose={() => setToastVariant(null)}
			>
				{toastVariant ? feedbackCopy[toastVariant] : ''}
			</AdsToast>
		</section>
	);
}
