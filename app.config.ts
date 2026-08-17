import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'NXTSET',
  slug: config.slug ?? 'nxtset',
  experiments: {
    ...config.experiments,
    ...(process.env.GITHUB_PAGES === 'true' ? { baseUrl: '/Muscle' } : {}),
  },
});

