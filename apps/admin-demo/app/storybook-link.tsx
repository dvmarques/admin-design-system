/**
 * Link to the published Storybook. It only exists in builds that configure the catalog address
 * (GitHub Pages), so local development and the E2E suite render the header unchanged. A plain
 * anchor, not `next/link`: the destination is another static site and does not get the `basePath`.
 */
export function StorybookLink() {
	const href = process.env.NEXT_PUBLIC_STORYBOOK_URL;
	if (!href) return null;

	return (
		<a
			aria-label="Storybook (abre em nova aba)"
			className="demo-action-link demo-storybook-link"
			href={href}
			rel="noopener"
			target="_blank"
		>
			Storybook
		</a>
	);
}
