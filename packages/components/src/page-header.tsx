import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from './class-names.js';
import { AdsTypography } from './typography.js';

export interface AdsPageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	/** Text or inline content; an H1 is provided automatically. */
	title: ReactNode;
	/** Optional text or inline content, rendered as a paragraph. */
	description?: ReactNode;
	/** Optional links and buttons, supplied by the application. */
	actions?: ReactNode;
}

/** Semantic, responsive header independent from routing, shell and cards. */
export function AdsPageHeader({
	title,
	description,
	actions,
	className,
	...props
}: AdsPageHeaderProps) {
	return (
		<header
			{...props}
			className={classNames(
				'ads-page-header flex min-w-0 flex-wrap items-start justify-between gap-4',
				className,
			)}
		>
			<div className="ads-page-header__intro min-w-0 flex-[1_1_18rem]">
				<AdsTypography as="h1" className="ads-page-header__title" variant="heading1">
					{title}
				</AdsTypography>
				{description != null && (
					<AdsTypography as="p" className="ads-page-header__description mt-2" variant="muted">
						{description}
					</AdsTypography>
				)}
			</div>
			{actions != null && (
				<div className="ads-page-header__actions flex min-w-0 max-w-full flex-wrap items-center gap-2">
					{actions}
				</div>
			)}
		</header>
	);
}
