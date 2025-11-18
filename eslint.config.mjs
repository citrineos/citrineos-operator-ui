// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat();
const nextConfigs = compat.extends('next/core-web-vitals').map((config) => {
  const { useEslintrc, extensions, ...rest } = config;
  return rest;
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfigs,
  eslintPluginPrettierRecommended,
  pluginCypress.configs.recommended,
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.next/**'],
  },
);
