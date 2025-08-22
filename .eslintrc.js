module.exports = {
  root: true,
  extends: [
    'expo',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',
    
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-expressions': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    node: true,
    es6: true,
    'react-native/react-native': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
