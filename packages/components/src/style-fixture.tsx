import type { HTMLAttributes } from 'react';

export const fixtureVariants = {
	neutral: 'border-border bg-surface text-text',
	primary: 'border-primary bg-primary text-[var(--ads-color-on-primary)]',
	danger: 'border-danger bg-danger text-[var(--ads-color-on-primary)]',
} as const;

export type FixtureVariant = keyof typeof fixtureVariants;

export interface StyleFixtureProps extends HTMLAttributes<HTMLDivElement> {
	variant?: FixtureVariant;
}

/** Internal visual fixture used to validate compiled design-system styles. */
export function StyleFixture({ className, variant = 'neutral', ...props }: StyleFixtureProps) {
	const classes = ['rounded-md border p-4 shadow-sm', fixtureVariants[variant], className]
		.filter(Boolean)
		.join(' ');
	return <div className={classes} {...props} />;
}
