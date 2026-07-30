export interface AdminShellProps {
	children: unknown;
}

/** Composition boundary for future administrative layouts without router coupling. */
export function createAdminShell(props: AdminShellProps) {
	return props;
}
