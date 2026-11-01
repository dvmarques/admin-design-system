import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogEntries } from '../../../catalogo/catalog-data';
import {
	catalogFamilyForName,
	catalogFamilyMembers,
	catalogFamilyRoot,
	catalogMemberAnchor,
	catalogMemberHref,
} from '../../../catalogo/catalog-families';
import { catalogMemberReference } from '../../../catalogo/catalog-member-reference';
import { HighlightedCodeApi } from '../../../catalogo/highlighted-code-api';
import { MaskedInputApi } from '../../../catalogo/masked-input-api';
import { CatalogPreview } from '../../../catalogo/catalog-preview';
import snippets from '../../../catalogo/catalog-snippets.json';

export const dynamicParams = false;
export function generateStaticParams() {
	// Materializar todos os slugs históricos permite abrir e atualizar URLs no GitHub Pages.
	return catalogEntries.map(({ slug }) => ({ slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const entry = catalogEntries.find((item) => item.slug === slug);
	if (!entry) notFound();

	const composition = catalogEntries.filter((item) => item.demo === entry.demo);
	const family = catalogFamilyForName(entry.name);
	const familyRoot = catalogFamilyRoot(entry.name) ?? entry;
	const memberNames = catalogFamilyMembers(entry.name);

	return (
		<div className="demo-page demo-shell demo-catalog-page">
			<Link href="/catalogo">Voltar ao catálogo</Link>
			<p>{entry.group}</p>
			<h1>{entry.name}</h1>
			<p>{entry.description}</p>
			{family ? (
				<>
					<p>
						Família <strong>{family.title}</strong>. Todos os membros estão documentados nesta
						página.
						{entry.name !== familyRoot.name ? (
							<>
								{' '}
								Esta é uma rota legada;{' '}
								<Link href={catalogMemberHref(entry.name)}>
									abrir diretamente a seção de {entry.name}
								</Link>
								.
							</>
						) : null}
					</p>
					<h2>Componentes desta família</h2>
					<nav aria-label={`Subcomponentes de ${family.title}`}>
						<ul>
							{memberNames.map((name) => (
								<li key={name}>
									<Link href={catalogMemberHref(name)}>{name}</Link>
								</li>
							))}
						</ul>
					</nav>
				</>
			) : null}
			<h2>Exemplos e variações</h2>
			<CatalogPreview demo={entry.demo} source={snippets[entry.demo]} />
			{family ? (
				<section aria-labelledby="catalogo-membros">
					<h2 id="catalogo-membros">Componentes e APIs individuais</h2>
					{memberNames.map((name) => {
						const reference = catalogMemberReference(name);
						return (
							<section id={catalogMemberAnchor(name)} key={name} className="demo-catalog-member">
								<h3>{name}</h3>
								<p>{reference.description}</p>
								<p>
									<strong>API / propriedades:</strong> {reference.props}
								</p>
								<p>
									<strong>Exemplo de composição:</strong>
								</p>
								<pre>
									<code>{reference.usage}</code>
								</pre>
							</section>
						);
					})}
				</section>
			) : null}
			{entry.slug === 'highlighted-code-snippet' ? <HighlightedCodeApi /> : null}
			{entry.slug === 'masked-input' ? <MaskedInputApi /> : null}
			<h2>Composição e orientações</h2>
			<p>
				Use os exports públicos e o CSS compilado dos pacotes. Preserve os rótulos e as relações
				ARIA do exemplo ao adaptar para sua aplicação.
			</p>
			<ul>
				{composition.map((item) => (
					<li key={item.name}>
						<Link
							href={catalogMemberHref(item.name)}
							aria-current={
								item.name === entry.name && catalogMemberHref(item.name) === entry.href
									? 'page'
									: undefined
							}
						>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
