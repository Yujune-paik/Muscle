module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/tests/component/**/*.component.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo|expo-.*|@expo/.*|expo-router|react-native-safe-area-context)/)',
  ],
};
