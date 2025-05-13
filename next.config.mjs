let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['uxnpmdeizkzvnevpceiw.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uxnpmdeizkzvnevpceiw.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // ✅ DejaVuSans.ttf gibi font dosyalarını server tarafında buffer olarak kullanmak için:
      config.module.rules.push({
        test: /\.ttf$/i,
        type: 'asset/source',
      });

      // pdfkit gibi native modüllerin client bundle'a girmesini engelle
      config.externals = config.externals || [];
      config.externals.push('pdfkit');
    }

    return config;
  },
};

// Kullanıcı konfigürasyonu ile birleştir
mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
