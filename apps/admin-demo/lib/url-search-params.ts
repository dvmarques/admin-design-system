export type SearchParams = Record<string, string | string[] | undefined>;

/** Parte dos parâmetros atuais e troca só as chaves informadas (`null` apaga a chave). */
export function withParams(params: SearchParams, changes: Record<string, string | null>) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		for (const item of [value].flat()) if (item !== undefined) query.append(key, item);
	}
	for (const [key, value] of Object.entries(changes)) {
		if (value === null) query.delete(key);
		else query.set(key, value);
	}
	return formatReadableSearchQuery(query.toString());
}

/** Mantém a codificação do `URLSearchParams`, exceto `:` legível em valores como `ordem=nome:asc`. */
export function formatReadableSearchQuery(serialized: string) {
	if (!serialized) return '';
	return serialized.replace(/%3A/gi, ':');
}

export function hrefWithParams(
	pathname: string,
	params: SearchParams,
	changes: Record<string, string | null>,
) {
	const query = withParams(params, changes);
	return query ? `${pathname}?${query}` : pathname;
}
