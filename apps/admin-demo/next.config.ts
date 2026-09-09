import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1', '10.70.0.129'],
	devIndicators: false,
	transpilePackages: ['@admin-ds/components', '@admin-ds/tokens'],
};

export default nextConfig;
