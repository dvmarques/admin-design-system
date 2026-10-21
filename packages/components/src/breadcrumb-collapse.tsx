'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const expandButtonClassName =
	'ads-breadcrumb-collapse cursor-pointer rounded-sm border-0 bg-transparent px-1 text-inherit [font-family:inherit] text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export interface AdsBreadcrumbCollapseProps {
	/** The collapsed items, already rendered as `<li>` with `data-collapsed`. */
	children: ReactNode;
	expandLabel: string;
	separator: ReactNode;
}

/**
 * Client island of `AdsBreadcrumb`: it only holds the expanded state, so the breadcrumb itself stays a
 * Server Component and consumers can still pass `renderLink` functions from one.
 */
export function AdsBreadcrumbCollapse({
	children,
	expandLabel,
	separator,
}: AdsBreadcrumbCollapseProps) {
	const [expanded, setExpanded] = useState(false);
	const list = useRef<HTMLElement | null>(null);

	// The button leaves the document when expanded, so the focus moves to the first revealed item.
	useEffect(() => {
		if (!expanded) return;
		const first = list.current?.querySelector<HTMLElement>('[data-collapsed]');
		if (!first) return;
		const target = first.querySelector<HTMLElement>('a, button') ?? first;
		if (target === first) {
			first.tabIndex = -1;
			first.addEventListener('blur', () => first.removeAttribute('tabindex'), { once: true });
		}
		target.focus();
	}, [expanded]);

	if (expanded) return <>{children}</>;
	return (
		<li className="flex items-center gap-2">
			<span aria-hidden="true" className="text-text-muted">
				{separator}
			</span>
			<button
				aria-label={expandLabel}
				className={expandButtonClassName}
				onClick={(event) => {
					list.current = event.currentTarget.closest('ol');
					setExpanded(true);
				}}
				type="button"
			>
				<span aria-hidden="true">…</span>
			</button>
		</li>
	);
}
