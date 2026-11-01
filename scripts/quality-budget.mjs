export function checkBudget(packageName, metric, actual, limit) {
	if (!Number.isInteger(limit) || limit < 0)
		throw new Error(`Orçamento inválido: ${packageName} / ${metric}`);
	console.log(`${packageName} / ${metric}: ${actual} bytes (limite ${limit})`);
	if (actual > limit)
		throw new Error(`${packageName} / ${metric} excedeu o orçamento: ${actual} > ${limit} bytes`);
}
