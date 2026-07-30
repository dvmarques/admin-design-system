import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1'],
	transpilePackages: ['@admin-ds/components', '@admin-ds/tokens'],
};

export default nextConfig;
