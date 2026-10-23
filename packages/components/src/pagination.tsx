'use client';

import { useEffect, useRef, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from './class-names.js';
import { AdsButton, adsButtonClassName } from './button.js';

/** Props the consumer must spread on the link it renders for a page, so the item keeps the library look and `aria-current`. */
export interface AdsPaginationLinkProps {
	'aria-current'?: 'page' | undefined;
	'aria-label'?: string | undefined;
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
	previous: 'Página anterior', next: 'Próxima página', first: 'Primeira página', last: 'Última página',
	page: (page) => `Página ${page}`, jump: 'Ir para página', jumpButton: 'Ir',
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

/** Layout mínimo: conserva primeira, atual e última; expande somente quando há espaço. */
export function getAdsResponsivePaginationItems(
 page: number, pageCount: number, siblingCount: number, slots: number,
): AdsPaginationPage[] {
 if (pageCount <= 0) return [];
 const current = Math.min(Math.max(1, page), pageCount);
 const mandatory = new Set([1, current, pageCount]);
 const selected = new Set(mandatory);
 const capacity = Math.max(mandatory.size, slots);
 for (let offset = 1; offset <= pageCount && selected.size < capacity; offset++) {
  for (const candidate of [current - offset, current + offset]) {
   if (candidate > 1 && candidate < pageCount && Math.abs(candidate - current) <= siblingCount && selected.size < capacity) selected.add(candidate);
  }
 }
 const sorted = [...selected].sort((a,b) => a-b);
 const result: AdsPaginationPage[] = [];
 for (let i=0; i<sorted.length; i++) {
  const value=sorted[i]!;
  if (i && value - sorted[i-1]! > 1) {
   const gap=value-sorted[i-1]!-1;
   if (gap===1 && result.length+sorted.length-i+1 <= slots) result.push(value-1);
   else result.push('ellipsis');
  }
  result.push(value);
 }
 return result;
}

export function AdsPagination({
 page, pageCount, onPageChange, renderPage, renderPageLink, siblingCount = 1,
 navigationMode = 'text', previousContent, nextContent, showFirstLast = false,
 showPageJump = false, loading = false, labels: labelOverrides,
 className, 'aria-label': ariaLabel = 'Paginação', ...props
}: AdsPaginationProps) {
 const labels = { ...defaultLabels, ...labelOverrides };
 const safePage = Math.min(Math.max(1, page), Math.max(1, pageCount));
 const containerRef = useRef<HTMLElement>(null);
 const [width, setWidth] = useState<number | null>(null);
 const [jumpValue, setJumpValue] = useState(String(safePage));
 const [jumpError, setJumpError] = useState(false);
 useEffect(() => {
  const node=containerRef.current;
  if (!node || typeof ResizeObserver === 'undefined') return;
  const observer=new ResizeObserver(entries => {
   const next=entries[0]?.contentRect.width;
   if (next !== undefined) setWidth(previous => previous === next ? previous : next);
  });
  observer.observe(node);
  return () => observer.disconnect();
 }, []);
 useEffect(() => { setJumpValue(String(safePage)); setJumpError(false); }, [safePage]);
 const change=(next:number) => {
  if (!loading && next >= 1 && next <= pageCount && next !== safePage) onPageChange?.(next);
 };
 const jump=(event:FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const next=Number(jumpValue);
  if (!jumpValue.trim() || !/^\\d+$/.test(jumpValue.trim()) || !Number.isSafeInteger(next) || next < 1 || next > pageCount) {
   setJumpError(true); return;
  }
  setJumpError(false); change(next);
 };
 const button=(content:ReactNode,target:number,disabled=false,label?:string) =>
  renderPageLink && !disabled && !loading ? renderPageLink(target,{
   'aria-current':target===safePage?'page':undefined,
   'aria-label':label,children:content,
   className:classNames(adsButtonClassName(target===safePage?'primary':'secondary','sm'),
    'ads-pagination-item min-h-10 min-w-10 px-2 tabular-nums no-underline',
    target===safePage?'border-transparent':undefined),
  }) : <AdsButton aria-label={label} aria-current={target===safePage?'page':undefined}
   className={classNames('ads-pagination-item min-h-10 min-w-10 px-2 tabular-nums',target===safePage?'border-transparent':undefined)}
   disabled={disabled || loading} onClick={() => change(target)} size="sm"
   variant={target===safePage?'primary':'secondary'}>{content}</AdsButton>;
 // The fallback keeps every mandatory page visible, with horizontal scrolling only when unavoidable.
 // A conservative minimum button width avoids resize feedback from the contents.
 const controlsWidth=(navigationMode==='arrows'?88:176)+(showFirstLast?88:0);
 const slots=width===null ? siblingCount*2+5 : Math.max(3,Math.floor((width-controlsWidth-32)/48));
 const items=width===null?getAdsPaginationItems(safePage,pageCount,siblingCount):
  getAdsResponsivePaginationItems(safePage,pageCount,siblingCount,slots);
 return <nav {...props} ref={containerRef} aria-label={ariaLabel} aria-busy={loading || undefined}
  className={classNames('ads-pagination flex max-w-full min-w-0 flex-wrap items-center gap-2',className)}>
  <div className="max-w-full min-w-0 overflow-x-auto py-2">
   <ul className="m-0 flex min-w-max list-none items-center gap-1 px-1 py-1" role="list">
    {showFirstLast?<li>{button('«',1,safePage<=1,labels.first)}</li>:null}
    <li>{button(previousContent ?? (navigationMode==='arrows'?'‹':'Anterior'),safePage-1,safePage<=1,labels.previous)}</li>
    {items.map((item,index)=><li key={`${item}-${index}`}>{item==='ellipsis'?
     <span aria-hidden="true" className="px-1 text-text-muted">…</span>:
     renderPage && !renderPageLink ? renderPage(item,button(item,item,false,labels.page(item))):
     button(item,item,false,labels.page(item))}</li>)}
    <li>{button(nextContent ?? (navigationMode==='arrows'?'›':'Próxima'),safePage+1,safePage>=pageCount,labels.next)}</li>
    {showFirstLast?<li>{button('»',pageCount,safePage>=pageCount,labels.last)}</li>:null}
   </ul>
  </div>
  {showPageJump?<form className="flex min-w-0 flex-wrap items-center gap-2" onSubmit={jump}>
   <label className="text-sm" htmlFor="ads-pagination-jump">{labels.jump}</label>
   <input id="ads-pagination-jump" aria-invalid={jumpError || undefined}
    aria-describedby={jumpError?'ads-pagination-jump-error':undefined}
    className="min-h-10 w-20 rounded-md border border-border bg-surface px-2 text-text"
    inputMode="numeric" type="number" min={1} max={Math.max(1,pageCount)} step={1}
    disabled={loading || pageCount<=0} value={jumpValue}
    onChange={event=>{setJumpValue(event.target.value);setJumpError(false);}} />
   <AdsButton size="sm" variant="secondary" type="submit" disabled={loading || pageCount<=0}>{labels.jumpButton}</AdsButton>
   {jumpError?<span id="ads-pagination-jump-error" role="alert" className="text-sm text-danger">{labels.jumpError}</span>:null}
  </form>:null}
 </nav>;
}
