import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-transform-typescript-metadata',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-transform-class-properties',
          '@babel/plugin-proposal-explicit-resource-management',
        ],
      },
    }),
  ],
});
