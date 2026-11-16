import Link from 'next/link';
import { AdsPageHeader, AdsTypography } from '@dvmarques/admin-ds-components';

const scenarios = [
	{
		id: 'consulta',
		title: 'Consulta e dados',
		description: 'Filtros, tabela, paginação, ações por linha e estados locais de vazio, carregamento e erro.',
		href: '/exemplos/composicao-semantica/consulta',
		action: 'Abrir consulta',
	},
	{
		id: 'formulario',
		title: 'Formulário',
		description: 'Seções semânticas, validação, campo desabilitado e ações principais e secundárias.',
		href: '/exemplos/composicao-semantica/formulario',
		action: 'Abrir formulário',
	},
	{
		id: 'dashboard',
		title: 'Indicadores e resumos',
		description: 'Cards somente para métricas e resumos, sem envolver a página inteira em um card.',
		href: '/exemplos/composicao-semantica/dashboard',
		action: 'Abrir indicadores',
	},
] as const;

export default function IntegratedAdminPage() {
	return (
		<div className="demo-page">
			<div className="ads-layout-container ads-layout-stack demo-semantic-page">
				<AdsPageHeader
					title="Integração administrativa ADS"
					description="Cenários integrados com dados fictícios, APIs públicas e CSS compilado. O cabeçalho, a sidebar e o controle de tema pertencem ao shell compartilhado da aplicação."
				/>
				<nav aria-label="Cenários integrados">
					<ul className="ads-layout-stack">
						{scenarios.map((scenario) => (
							<li key={scenario.id}>
								<section
									aria-labelledby={`cenario-${scenario.id}`}
									className="ads-layout-stack"
								>
									<AdsTypography as="h2" id={`cenario-${scenario.id}`} variant="heading2">
										{scenario.title}
									</AdsTypography>
									<p>{scenario.description}</p>
									<div>
										<Link className="demo-action-link" href={scenario.href}>
											{scenario.action}
										</Link>
									</div>
								</section>
							</li>
						))}
					</ul>
				</nav>
				<section aria-labelledby="cenario-shell" className="ads-layout-stack">
					<AdsTypography as="h2" id="cenario-shell" variant="heading2">
						Shell, navegação e tema
					</AdsTypography>
					<p>
						Esta página já usa o shell administrativo compartilhado com sidebar normal,
						recolhida e mobile, menu da conta e troca de tema. A consulta demonstra o
						footer opcional.
					</p>
					<div>
						<Link className="demo-action-link" href="/catalogo-shell">
							Ver variantes isoladas do shell
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
