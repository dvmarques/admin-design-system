import type { NextConfig } from 'next';

// GitHub Pages build: a static export served under the repository path (see docs/github-pages.md).
const isPages = process.env.GITHUB_PAGES === 'true';
const pagesBasePath = '/admin-design-system';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1'],
	devIndicators: false,
	transpilePackages: ['@admin-ds/admin', '@admin-ds/components', '@admin-ds/tokens'],
	...(isPages
		? {
				output: 'export' as const,
				basePath: pagesBasePath,
				trailingSlash: true,
				images: { unoptimized: true },
				env: { NEXT_PUBLIC_STORYBOOK_URL: `${pagesBasePath}/storybook/` },
			}
		: {}),
};

export default nextConfig;
