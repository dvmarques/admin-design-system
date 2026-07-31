import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import { AdsButton } from './button.js';

export type AdsPaginationPage = number | 'ellipsis';
export interface AdsPaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
	page: number;
	pageCount: number;
	onPageChange?: (page: number) => void;
	renderPage?: (page: number, content: ReactNode) => ReactNode;
	siblingCount?: number;
	'aria-label'?: string;
}

export function getAdsPaginationItems(
	page: number,
	pageCount: number,
	siblingCount = 1,
): AdsPaginationPage[] {
	if (pageCount <= 0) return [];
	const total = siblingCount * 2 + 5;
	if (pageCount <= total) return Array.from({ length: pageCount }, (_, index) => index + 1);
	const left = Math.max(page - siblingCount, 2);
	const right = Math.min(page + siblingCount, pageCount - 1);
	const items: AdsPaginationPage[] = [1];
	if (left > 2) items.push('ellipsis');
	for (let value = left; value <= right; value += 1) items.push(value);
	if (right < pageCount - 1) items.push('ellipsis');
	items.push(pageCount);
	return items;
}

export function AdsPagination({
	page,
	pageCount,
	onPageChange,
	renderPage,
	siblingCount = 1,
	className,
	'aria-label': ariaLabel = 'Paginação',
	...props
}: AdsPaginationProps) {
	const safePage = Math.min(Math.max(1, page), Math.max(1, pageCount));
	const change = (next: number) => {
		if (next >= 1 && next <= pageCount && next !== safePage) onPageChange?.(next);
	};
	const button = (content: ReactNode, target: number, disabled = false, label?: string) => (
		<AdsButton
			aria-label={label}
			aria-current={target === safePage ? 'page' : undefined}
			className={classNames(
				'ads-pagination-item min-w-9 px-2',
				target === safePage ? 'border-transparent' : undefined,
			)}
			disabled={disabled}
			onClick={() => change(target)}
			size="sm"
			variant={target === safePage ? 'primary' : 'secondary'}
		>
			{content}
		</AdsButton>
	);
	return (
		<nav
			{...props}
			aria-label={ariaLabel}
			className={classNames(
				'ads-pagination flex max-w-full items-center gap-1 overflow-x-auto',
				className,
			)}
		>
			<ul className="m-0 flex min-w-max list-none items-center gap-1 p-0" role="list">
				<li>{button('Anterior', safePage - 1, safePage <= 1, 'Página anterior')}</li>
				{getAdsPaginationItems(safePage, pageCount, siblingCount).map((item, index) => (
					<li key={`${item}-${index}`}>
						{item === 'ellipsis' ? (
							<span aria-hidden="true" className="px-1 text-text-muted">
								…
							</span>
						) : renderPage ? (
							renderPage(item, button(item, item, false, `Página ${item}`))
						) : (
							button(item, item, false, `Página ${item}`)
						)}
					</li>
				))}
				<li>{button('Próxima', safePage + 1, safePage >= pageCount, 'Próxima página')}</li>
			</ul>
		</nav>
	);
}
