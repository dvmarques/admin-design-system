/** Injective and selector-safe: every character outside `[A-Za-z0-9-]`, `_` included, becomes `_<hex>_`. */
export function encodeIdKey(value: string) {
	return value.replace(/[^A-Za-z0-9-]/g, (char) => `_${char.codePointAt(0)?.toString(16)}_`);
}

/** `useId` yields characters such as `:` that break CSS selectors. */
export function sanitizeId(id: string) {
	return id.replace(/[^A-Za-z0-9_-]/g, '');
}
