/**
 * Simulação de deficiências de visão de cor e distância entre cores, usadas para verificar que as
 * cores categóricas de gráfico continuam distinguíveis. Método: matrizes de Machado et al. (2009)
 * com severidade 1,0 aplicadas em RGB linear, e distância ΔE (CIE76) no espaço CIELAB.
 */
const matrices = {
	normal: [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
	],
	protanopia: [
		[0.152286, 1.052583, -0.204868],
		[0.114503, 0.786281, 0.099216],
		[-0.003882, -0.048116, 1.051998],
	],
	deuteranopia: [
		[0.367322, 0.860646, -0.227968],
		[0.280085, 0.672501, 0.047413],
		[-0.01182, 0.04294, 0.968881],
	],
	tritanopia: [
		[1.255528, -0.076749, -0.178779],
		[-0.078411, 0.930809, 0.147602],
		[0.004733, 0.691367, 0.3039],
	],
};

export const visionModes = Object.keys(matrices);

const toLinear = (channel) =>
	channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
const linearRgb = (hex) =>
	[1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
const clamp = (value) => Math.min(1, Math.max(0, value));

function toLab([r, g, b]) {
	const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
	const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
	const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
	return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export function simulatedLab(hex, mode) {
	const rgb = linearRgb(hex);
	return toLab(
		matrices[mode].map((row) => clamp(row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2])),
	);
}

/** Menor ΔE entre qualquer par de cores sob o modo de visão informado. */
export function minimumDistance(colors, mode) {
	let minimum = Number.POSITIVE_INFINITY;
	for (let i = 0; i < colors.length; i++)
		for (let j = i + 1; j < colors.length; j++) {
			const a = simulatedLab(colors[i], mode);
			const b = simulatedLab(colors[j], mode);
			minimum = Math.min(minimum, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
		}
	return minimum;
}
