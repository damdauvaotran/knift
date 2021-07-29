module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'no-unused-vars': ['warn', { vars: 'local' }],
    quotes: [
      'error',
      'single',
      { avoidEscape: false, allowTemplateLiterals: true },
    ],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
