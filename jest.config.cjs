module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/tests/component/**/*.component.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-reanimated$': '<rootDir>/node_modules/react-native-reanimated/mock.js',
    '^react-native-worklets$': '<rootDir>/node_modules/react-native-worklets/src/mock.ts',
    '^react-native-webview$': '<rootDir>/tests/mocks/react-native-webview.tsx',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo|expo-.*|@expo/.*|expo-router|react-native-safe-area-context|react-native-reanimated|react-native-worklets|react-native-webview)/)',
  ],
};
