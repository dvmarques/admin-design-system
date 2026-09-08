import {
	AdsAvatar,
	AdsBadge,
	AdsButton,
	AdsCheckbox,
	AdsField,
	AdsInput,
	AdsRadio,
	AdsSelect,
	AdsSelectionGroup,
	AdsIcon,
	AdsLoadingIndicator,
	AdsSurface,
	AdsTypography,
	AdsSwitch,
	AdsTextarea,
} from '@admin-ds/components';
import { tokenValues } from '@admin-ds/tokens';
import { cookies } from 'next/headers';
import { resolveTheme } from '../lib/theme';
import { ThemeControl } from './theme-control';
import { OverlayShowcase } from './overlay-showcase';
import { NavigationShowcase } from './navigation-showcase';
import { EvaluationShowcase } from './evaluation-showcase';

export default async function HomePage() {
	const cookieStore = await cookies();
	const theme = resolveTheme(cookieStore.get('ads-theme')?.value);

	return (
		<main className="demo-page">
			<div className="demo-shell">
				<header className="demo-hero">
					<div className="demo-hero__intro">
						<p className="demo-kicker">Admin Design System</p>
						<AdsTypography as="h1" className="demo-title" variant="heading1">
							Primitivas para produtos que precisam permanecer claros em escala.
						</AdsTypography>
						<AdsTypography className="demo-lede" variant="muted">
							Uma referência viva para validar componentes, estados e interações antes de levá-los
							para a aplicação.
						</AdsTypography>
					</div>
					<div className="demo-hero__tools">
						<span className="demo-theme-label">Aparência</span>
						<ThemeControl initialTheme={theme} />
					</div>
				</header>

				<section aria-labelledby="foundations" className="demo-section">
					<div className="demo-section__heading">
						<div>
							<p className="demo-kicker">Fundamentos</p>
							<AdsTypography as="h2" id="foundations" variant="heading2">
								Estados essenciais, sem ruído visual
							</AdsTypography>
						</div>
						<AdsTypography className="demo-section__note" variant="muted">
							Ações, identidade e feedback em uma leitura rápida.
						</AdsTypography>
					</div>
					<div className="demo-foundations-grid">
						<AdsSurface className="demo-panel demo-panel--actions" variant="raised">
							<p className="demo-panel__eyebrow">Fluxo principal</p>
							<AdsTypography variant="heading3">Ações</AdsTypography>
							<AdsTypography className="demo-panel__copy" variant="muted">
								A ação mais importante tem contraste e precedência claros.
							</AdsTypography>
							<div className="demo-actions">
								<AdsButton>Salvar</AdsButton>
								<AdsButton variant="secondary">Cancelar</AdsButton>
							</div>
						</AdsSurface>
						<AdsSurface className="demo-panel" variant="neutral">
							<p className="demo-panel__eyebrow">Pessoa e contexto</p>
							<AdsTypography variant="heading3">Status</AdsTypography>
							<div className="demo-status">
								<AdsAvatar alt="Ana Silva" fallback="AS" />
								<div>
									<AdsTypography className="demo-status__name">Ana Silva</AdsTypography>
									<AdsBadge variant="success">Ativo</AdsBadge>
								</div>
								<AdsIcon name="check" label="Confirmado" />
							</div>
						</AdsSurface>
						<AdsSurface className="demo-panel" variant="outlined">
							<p className="demo-panel__eyebrow">Feedback do sistema</p>
							<AdsTypography variant="heading3">Carregamento</AdsTypography>
							<div className="demo-loading">
								<AdsLoadingIndicator label="Atualizando dados" />
								<AdsTypography variant="muted">Atualizando dados</AdsTypography>
							</div>
						</AdsSurface>
					</div>
				</section>

				<section aria-labelledby="forms" className="demo-section demo-section--form">
					<div className="demo-section__heading">
						<div>
							<p className="demo-kicker">Entrada de dados</p>
							<AdsTypography as="h2" id="forms" variant="heading2">
								Controles de formulário
							</AdsTypography>
						</div>
						<AdsTypography className="demo-section__note" variant="muted">
							Rótulos, ajuda contextual e seleção com espaço para leitura.
						</AdsTypography>
					</div>
					<AdsSurface className="demo-form-surface" variant="raised">
						<div className="demo-form">
							<AdsField description="Usado para notificações da conta" label="E-mail">
								<AdsInput type="email" placeholder="nome@empresa.com" />
							</AdsField>
							<AdsField label="Status">
								<AdsSelect defaultValue="active">
									<option value="active">Ativo</option>
									<option value="inactive">Inativo</option>
								</AdsSelect>
							</AdsField>
							<AdsField className="demo-form__wide" label="Observações">
								<AdsTextarea rows={3} />
							</AdsField>
							<div className="demo-form__wide demo-preferences">
								<AdsCheckbox label="Enviar atualizações por e-mail" />
								<AdsSwitch defaultChecked label="Ativar notificações" />
								<AdsSelectionGroup legend="Periodicidade">
									<AdsRadio defaultChecked label="Diária" name="period" value="daily" />
									<AdsRadio label="Semanal" name="period" value="weekly" />
								</AdsSelectionGroup>
							</div>
						</div>
					</AdsSurface>
				</section>

				<EvaluationShowcase />

				<div className="demo-utility-grid">
					<section aria-labelledby="tokens" className="demo-section demo-section--compact">
						<AdsSurface className="demo-utility-panel" variant="neutral">
							<p className="demo-panel__eyebrow">Contrato público</p>
							<AdsTypography as="h2" id="tokens" variant="heading3">
								Tokens públicos
							</AdsTypography>
							<p className="demo-token-count">{Object.keys(tokenValues).length}</p>
							<AdsTypography variant="muted">tokens disponíveis pela API pública.</AdsTypography>
						</AdsSurface>
					</section>
					<section aria-labelledby="overlays" className="demo-section demo-section--compact">
						<AdsSurface className="demo-utility-panel" variant="raised">
							<AdsTypography as="h2" id="overlays" variant="heading3">
								Overlays públicos
							</AdsTypography>
							<OverlayShowcase />
						</AdsSurface>
					</section>
					<section aria-labelledby="navigation" className="demo-section demo-section--compact">
						<AdsSurface className="demo-utility-panel" variant="raised">
							<AdsTypography as="h2" id="navigation" variant="heading3">
								Navegação pública
							</AdsTypography>
							<NavigationShowcase />
						</AdsSurface>
					</section>
				</div>
			</div>
		</main>
	);
}
