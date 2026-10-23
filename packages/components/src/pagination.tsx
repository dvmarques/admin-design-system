'use client';

import {
	useEffect,
	useLayoutEffect,
	useId,
	useRef,
	useState,
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames } from './class-names.js';
import { AdsButton, adsButtonClassName } from './button.js';

/** Props the consumer must spread on the link it renders for a page, so the item keeps the library look and `aria-current`. */
export interface AdsPaginationLinkProps {
	'aria-current'?: 'page' | undefined;
	'aria-label'?: string | undefined;
	'aria-disabled'?: boolean | undefined;
	children: ReactNode;
	className: string;
}

export type AdsPaginationPage = number | 'ellipsis';
export interface AdsPaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
	page: number;
	pageCount: number;
	onPageChange?: (page: number) => void;
	/** @deprecated Receives a ready-made button; wrapping it in a link nests interactive content. Prefer `renderPageLink`. */
	renderPage?: (page: number, content: ReactNode) => ReactNode;
	/** Renders the consumer's link (for example `next/link`) for an enabled page, previous or next target. */
	renderPageLink?: (page: number, props: AdsPaginationLinkProps) => ReactNode;
	siblingCount?: number;
	/** Texto (padrão) ou setas para os controles de navegação. */
	navigationMode?: 'text' | 'arrows';
	previousContent?: ReactNode;
	nextContent?: ReactNode;
	showFirstLast?: boolean;
	showPageJump?: boolean;
	loading?: boolean;
	labels?: Partial<AdsPaginationLabels>;
	'aria-label'?: string;
}

export interface AdsPaginationLabels {
	previousText: string;
	nextText: string;
	scrollRegion: string;
	previous: string;
	next: string;
	first: string;
	last: string;
	page: (page: number) => string;
	jump: string;
	jumpButton: string;
	jumpError: string;
}

const defaultLabels: AdsPaginationLabels = {
	previousText: 'Anterior',
	nextText: 'Próxima',
	scrollRegion: 'Controles de paginação roláveis',
	previous: 'Página anterior',
	next: 'Próxima página',
	first: 'Primeira página',
	last: 'Última página',
	page: (page) => `Página ${page}`,
	jump: 'Ir para página',
	jumpButton: 'Ir',
	jumpError: 'Informe uma página válida.',
};

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

/** Capacidade em itens, incluindo reticências; o mínimo obrigatório prevalece. */
export function getAdsResponsivePaginationItems(
	page: number,
	pageCount: number,
	siblingCount: number,
	slots: number,
): AdsPaginationPage[] {
	const count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
	if (!count) return [];
	const current = Number.isFinite(page) ? Math.min(Math.max(1, Math.floor(page)), count) : 1;
	const siblings = Number.isFinite(siblingCount) ? Math.max(0, Math.floor(siblingCount)) : 1;
	const capacity = Number.isFinite(slots) ? Math.max(0, Math.floor(slots)) : 0;
	if (count <= siblings * 2 + 5 && count <= capacity)
		return Array.from({ length: count }, (_, i) => i + 1);
	const selected = new Set([1, current, count]);
	const build = (pages: Set<number>): AdsPaginationPage[] => {
		const sorted = [...pages].sort((a, b) => a - b);
		const result: AdsPaginationPage[] = [];
		sorted.forEach((value, i) => {
			const previous = sorted[i - 1];
			if (previous !== undefined && value - previous > 1)
				result.push(value - previous === 2 ? previous + 1 : 'ellipsis');
			result.push(value);
		});
		return result;
	};
	for (let offset = 1; offset <= Math.min(siblings, count, capacity); offset++) {
		for (const candidate of [current - offset, current + offset]) {
			if (candidate <= 1 || candidate >= count) continue;
			const trial = new Set(selected).add(candidate);
			if (build(trial).length <= capacity) selected.add(candidate);
		}
	}
	const result = build(selected);
	return result.length <= capacity ? result : [...selected].sort((a, b) => a - b);
}

export function AdsPagination({
	page,
	pageCount,
	onPageChange,
	renderPage,
	renderPageLink,
	siblingCount = 1,
	navigationMode = 'text',
	previousContent,
	nextContent,
	showFirstLast = false,
	showPageJump = false,
	loading = false,
	labels: labelOverrides,
	className,
	'aria-label': ariaLabel = 'Paginação',
	onClickCapture,
	onAuxClickCapture,
	onFocusCapture,
	...props
}: AdsPaginationProps) {
	const labels = { ...defaultLabels, ...labelOverrides };
	const jumpId = useId();
	const count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
	const safePage = Number.isFinite(page)
		? Math.min(Math.max(1, Math.floor(page)), Math.max(1, count))
		: 1;
	const containerRef = useRef<HTMLElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const jumpLinkRef = useRef<HTMLSpanElement>(null);
	const focusedRef = useRef<HTMLElement | null>(null);
	const repairFocus = useRef(false);
	const correctionRef = useRef<string | null>(null);
	const [layout, setLayout] = useState<{ slots: number; overflow: boolean } | null>(null);
	const measuredLayout = useRef<typeof layout>(null);
	const [jumpValue, setJumpValue] = useState(String(safePage));
	const [jumpError, setJumpError] = useState(false);

	useLayoutEffect(() => {
		const viewport = scrollRef.current;
		const list = listRef.current;
		if (!viewport || !list) return;
		const view = viewport.ownerDocument.defaultView;
		if (!view) return;
		let frame: number | null = null;
		const measure = (fromResize = false) => {
			frame = null;
			const available = viewport.clientWidth;
			const cells = Array.from(list.children) as HTMLElement[];
			const number = cells.find((cell) => cell.dataset.page !== undefined);
			const scale = viewport.offsetWidth
				? viewport.getBoundingClientRect().width / viewport.offsetWidth
				: 1;
			const itemWidth = (number?.getBoundingClientRect().width ?? 0) / (scale || 1);
			// DOM without layout (SSR/JSDOM) must not replace the deterministic initial list.
			if (!available || !itemWidth) return;
			const style = view.getComputedStyle(list);
			const gap = parseFloat(style.columnGap) || 0;
			const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
			const controls = cells.filter((cell) => cell.dataset.navigation !== undefined);
			const reserved = controls.reduce(
				(sum, cell) => sum + cell.getBoundingClientRect().width / (scale || 1) + gap,
				0,
			);
			const slots = Math.max(
				0,
				Math.floor((available - padding - reserved + gap) / (itemWidth + gap)),
			);
			const minimum = getAdsResponsivePaginationItems(safePage, count, 0, 0).length;
			const overflow = slots < minimum;
			if (measuredLayout.current?.slots === slots && measuredLayout.current.overflow === overflow)
				return;
			const next = { slots, overflow };
			measuredLayout.current = next;
			if (fromResize) repairFocus.current = true;
			setLayout(next);
		};
		const schedule = () => {
			if (frame === null) frame = view.requestAnimationFrame(() => measure(true));
		};
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
		observer?.observe(viewport);
		observer?.observe(list);
		view.addEventListener('resize', schedule);
		measure();
		return () => {
			observer?.disconnect();
			view.removeEventListener('resize', schedule);
			if (frame !== null) view.cancelAnimationFrame(frame);
		};
	}, [
		safePage,
		count,
		navigationMode,
		previousContent,
		nextContent,
		showFirstLast,
		labels.previousText,
		labels.nextText,
	]);

	useLayoutEffect(() => {
		if (!repairFocus.current) return;
		repairFocus.current = false;
		const node = containerRef.current;
		const focused = focusedRef.current;
		if (
			node &&
			focused &&
			(!focused.isConnected || focused.matches(':disabled')) &&
			(node.ownerDocument.activeElement === node.ownerDocument.body ||
				node.ownerDocument.activeElement === focused)
		) {
			node.querySelector<HTMLElement>('[data-page] [aria-current="page"]')?.focus();
		}
	});
	useEffect(() => {
		setJumpValue(String(safePage));
		setJumpError(false);
	}, [safePage, count]);
	useEffect(() => {
		if (!count || page === safePage) {
			correctionRef.current = null;
			return;
		}
		if (loading || !onPageChange) return;
		const key = `${page}:${count}`;
		if (correctionRef.current !== key) {
			correctionRef.current = key;
			onPageChange(safePage);
		}
	}, [page, count, safePage, loading, onPageChange]);
	const change = (next: number) => {
		if (!loading && next >= 1 && next <= count && next !== safePage) {
			repairFocus.current = true;
			onPageChange?.(next);
		}
	};
	const jumpTarget = Number(jumpValue);
	const validJump =
		/^\d+$/.test(jumpValue.trim()) &&
		Number.isSafeInteger(jumpTarget) &&
		jumpTarget >= 1 &&
		jumpTarget <= count;
	const jump = () => {
		if (loading || !count) return;
		if (!validJump) {
			setJumpError(true);
			return;
		}
		setJumpError(false);
		if (jumpTarget === safePage) return;
		if (renderPageLink) jumpLinkRef.current?.querySelector<HTMLElement>('a,button')?.click();
		else change(jumpTarget);
	};
	const button = (
		content: ReactNode,
		target: number,
		disabled = false,
		label?: string,
		numeric = false,
	) => {
		const current = numeric && target === safePage;
		const itemClass = classNames(
			'ads-pagination-item min-h-10 min-w-10 px-2 tabular-nums',
			numeric ? 'ads-pagination-number' : undefined,
			current ? 'border-transparent' : undefined,
		);
		return renderPageLink && !disabled ? (
			renderPageLink(target, {
				'aria-current': current ? 'page' : undefined,
				'aria-label': label,
				'aria-disabled': loading || undefined,
				children: content,
				className: classNames(
					adsButtonClassName(current ? 'primary' : 'secondary', 'sm'),
					itemClass,
					'no-underline',
				),
			})
		) : (
			<AdsButton
				aria-label={label}
				aria-current={current ? 'page' : undefined}
				aria-disabled={loading || undefined}
				className={itemClass}
				disabled={disabled}
				onClick={() => change(target)}
				size="sm"
				variant={current ? 'primary' : 'secondary'}
			>
				{content}
			</AdsButton>
		);
	};
	const items =
		layout === null
			? getAdsPaginationItems(safePage, count, siblingCount)
			: getAdsResponsivePaginationItems(safePage, count, siblingCount, layout.slots);
	return (
		<nav
			{...props}
			ref={containerRef}
			aria-label={ariaLabel}
			aria-busy={loading || undefined}
			style={
				{
					'--ads-pagination-digits': Math.max(2, String(count).length),
					...props.style,
				} as CSSProperties
			}
			onFocusCapture={(event) => {
				focusedRef.current = event.target as HTMLElement;
				onFocusCapture?.(event);
			}}
			onClickCapture={(event) => {
				if (loading) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				onClickCapture?.(event);
				if (!event.defaultPrevented) repairFocus.current = true;
			}}
			onAuxClickCapture={(event) => {
				if (loading) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				onAuxClickCapture?.(event);
			}}
			className={classNames(
				'ads-pagination flex max-w-full min-w-0 flex-wrap items-center gap-2',
				className,
			)}
		>
			<div
				ref={scrollRef}
				className="ads-pagination-scroll"
				role={layout?.overflow ? 'region' : undefined}
				aria-label={layout?.overflow ? labels.scrollRegion : undefined}
				tabIndex={layout?.overflow ? 0 : undefined}
			>
				<ul
					ref={listRef}
					className="ads-pagination-list flex min-w-max list-none items-center gap-1"
					role="list"
				>
					{showFirstLast ? (
						<li data-navigation="first">{button('«', 1, safePage <= 1 || !count, labels.first)}</li>
					) : null}
					<li data-navigation="previous">
						{button(
							previousContent ?? (navigationMode === 'arrows' ? '‹' : labels.previousText),
							safePage - 1,
							safePage <= 1 || !count,
							labels.previous,
						)}
					</li>
					{items.map((item, index) => (
						<li
							data-page={item === 'ellipsis' ? undefined : item}
							key={item === 'ellipsis' ? `gap-${items[index + 1]}` : item}
						>
							{item === 'ellipsis' ? (
								<span aria-hidden="true" className="ads-pagination-ellipsis text-text-muted">
									…
								</span>
							) : renderPage && !renderPageLink ? (
								renderPage(item, button(item, item, false, labels.page(item), true))
							) : (
								button(item, item, false, labels.page(item), true)
							)}
						</li>
					))}
					<li data-navigation="next">
						{button(
							nextContent ?? (navigationMode === 'arrows' ? '›' : labels.nextText),
							safePage + 1,
							safePage >= count || !count,
							labels.next,
						)}
					</li>
					{showFirstLast ? (
						<li data-navigation="last">
							{button('»', count, safePage >= count || !count, labels.last)}
						</li>
					) : null}
				</ul>
			</div>
			{showPageJump ? (
				<div className="ads-pagination-jump" role="group" aria-labelledby={`${jumpId}-label`}>
					<label id={`${jumpId}-label`} htmlFor={jumpId}>
						{labels.jump}
					</label>
					<input
						id={jumpId}
						aria-invalid={jumpError || undefined}
						aria-describedby={jumpError ? `${jumpId}-error` : undefined}
						inputMode="numeric"
						type="number"
						min={1}
						max={Math.max(1, count)}
						step={1}
						readOnly={loading}
						disabled={!count}
						value={jumpValue}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								jump();
							}
						}}
						onChange={(event) => {
							setJumpValue(event.target.value);
							setJumpError(false);
						}}
					/>
					{renderPageLink && validJump && jumpTarget !== safePage ? (
						<span ref={jumpLinkRef}>
							{button(labels.jumpButton, jumpTarget, false, labels.jumpButton)}
						</span>
					) : (
						<AdsButton
							size="sm"
							variant="secondary"
							aria-disabled={loading || undefined}
							disabled={!count}
							onClick={jump}
						>
							{labels.jumpButton}
						</AdsButton>
					)}
					{jumpError ? (
						<span id={`${jumpId}-error`} role="alert">
							{labels.jumpError}
						</span>
					) : null}
				</div>
			) : null}
		</nav>
	);
}
