export type ClassNameValue = string | false | null | undefined;

/** Combines statically declared classes without adding a runtime dependency. */
export function classNames(...values: ClassNameValue[]) {
	return values.filter(Boolean).join(' ');
}
