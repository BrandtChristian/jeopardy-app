import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

const eslintConfig = [
  {
    extends: ['next'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
]

export default eslintConfig
