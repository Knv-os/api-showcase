// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-parameter-properties': 0,
      '@typescript-eslint/interface-name-prefix': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
