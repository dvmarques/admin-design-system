import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalogEntries } from '../../../catalogo/catalog-data';
import { HighlightedCodeApi } from '../../../catalogo/highlighted-code-api';
import { CatalogPreview } from '../../../catalogo/catalog-preview';
import snippets from '../../../catalogo/catalog-snippets.json';

export const dynamicParams = false;
export function generateStaticParams() {
	return catalogEntries.map(({ slug }) => ({ slug }));
}
export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const entry = catalogEntries.find((entry) => entry.slug === slug);
	if (!entry) notFound();
	const composition = catalogEntries.filter((item) => item.demo === entry.demo);
	return (
		<div className="demo-page demo-shell demo-catalog-page">
			<Link href="/catalogo">Voltar ao catálogo</Link>
			<p>{entry.group}</p>
			<h1>{entry.name}</h1>
			<p>{entry.description}</p>
			<h2>Exemplos e variações</h2>
			<CatalogPreview demo={entry.demo} source={snippets[entry.demo]} />
			{entry.slug === 'highlighted-code-snippet' ? <HighlightedCodeApi /> : null}
			<h2>Composição e orientações</h2>
			<p>
				Use os exports públicos e o CSS compilado dos pacotes. Preserve os rótulos e as relações
				ARIA do exemplo ao adaptar para sua aplicação.
			</p>
			<ul>
				{composition.map((item) => (
					<li key={item.name}>
						<Link href={item.href} aria-current={item.name === entry.name ? 'page' : undefined}>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
