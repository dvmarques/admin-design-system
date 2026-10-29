import referenceData from './catalog-member-reference.json';

/** Guias concisos; referência detalhada e tipos continuam nos exports e no Storybook. */
export interface CatalogMemberReference {
	description: string;
	props: string;
	usage: string;
}

const references = referenceData as Record<string, CatalogMemberReference>;

export function catalogMemberReference(name: string): CatalogMemberReference {
	return (
		references[name] ?? {
			description:
				'Parte pública da composição. Use em conjunto com os demais componentes da família.',
			props: 'Consulte os tipos públicos e o exemplo React/TSX desta página.',
			usage: `<${name}>…</${name}>`,
		}
	);
}
