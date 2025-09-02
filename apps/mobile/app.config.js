export default {
  expo: {
    name: 'Slim Minder',
    slug: 'slim-minder',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.slimminder.app',
      buildNumber: '1'
    },
    android: {
      package: 'com.slimminder.app',
      versionCode: 1
    },
    web: {
      bundler: 'metro'
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-project-id'
      }
    },
    owner: 'slimminder',
    runtimeVersion: {
      policy: 'sdkVersion'
    }
  }
};
