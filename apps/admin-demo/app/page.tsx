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

export default async function HomePage() {
	const cookieStore = await cookies();
	const theme = resolveTheme(cookieStore.get('ads-theme')?.value);

	return (
		<main style={{ margin: '0 auto', maxWidth: '72rem', padding: '2rem' }}>
			<header
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '1rem',
				}}
			>
				<div>
					<AdsTypography variant="muted">Admin Design System</AdsTypography>
					<AdsTypography as="h1" variant="heading1">
						Aplicação de referência
					</AdsTypography>
				</div>
				<ThemeControl initialTheme={theme} />
			</header>

			<section aria-labelledby="foundations" style={{ marginTop: '2rem' }}>
				<AdsTypography as="h2" id="foundations" variant="heading2">
					Primitivas públicas
				</AdsTypography>
				<div
					style={{
						display: 'grid',
						gap: '1rem',
						gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
					}}
				>
					<AdsSurface>
						<AdsTypography variant="heading3">Ações</AdsTypography>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
							<AdsButton>Salvar</AdsButton>
							<AdsButton variant="secondary">Cancelar</AdsButton>
						</div>
					</AdsSurface>
					<AdsSurface variant="raised">
						<AdsTypography variant="heading3">Status</AdsTypography>
						<div
							style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}
						>
							<AdsAvatar alt="Ana Silva" fallback="AS" />
							<AdsBadge variant="success">Ativo</AdsBadge>
							<AdsIcon name="check" label="Confirmado" />
						</div>
					</AdsSurface>
					<AdsSurface variant="outlined">
						<AdsTypography variant="heading3">Carregamento</AdsTypography>
						<div
							style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}
						>
							<AdsLoadingIndicator label="Atualizando dados" />
							<AdsTypography variant="muted">Atualizando dados</AdsTypography>
						</div>
					</AdsSurface>
				</div>
			</section>

			<section aria-labelledby="forms" style={{ marginTop: '2rem' }}>
				<AdsTypography as="h2" id="forms" variant="heading2">
					Controles de formulário
				</AdsTypography>
				<AdsSurface>
					<div style={{ display: 'grid', gap: '1rem', maxWidth: '32rem' }}>
						<AdsField description="Usado para notificações da conta" label="E-mail">
							<AdsInput type="email" placeholder="nome@empresa.com" />
						</AdsField>
						<AdsField label="Status">
							<AdsSelect defaultValue="active">
								<option value="active">Ativo</option>
								<option value="inactive">Inativo</option>
							</AdsSelect>
						</AdsField>
						<AdsField label="Observações">
							<AdsTextarea rows={3} />
						</AdsField>
						<AdsCheckbox label="Enviar atualizações por e-mail" />
						<AdsSwitch defaultChecked label="Ativar notificações" />
						<AdsSelectionGroup legend="Periodicidade">
							<AdsRadio defaultChecked label="Diária" name="period" value="daily" />
							<AdsRadio label="Semanal" name="period" value="weekly" />
						</AdsSelectionGroup>
					</div>
				</AdsSurface>
			</section>

			<section aria-labelledby="tokens" style={{ marginTop: '2rem' }}>
				<AdsTypography as="h2" id="tokens" variant="heading2">
					Tokens públicos
				</AdsTypography>
				<AdsTypography>
					{Object.keys(tokenValues).length} tokens estão disponíveis pela API pública.
				</AdsTypography>
			</section>
		</main>
	);
}
