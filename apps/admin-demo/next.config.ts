import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1'],
	devIndicators: false,
	transpilePackages: ['@admin-ds/components', '@admin-ds/tokens'],
};

export default nextConfig;
