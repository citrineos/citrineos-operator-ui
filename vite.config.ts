import react from '@vitejs/plugin-react';
import * as path from 'path';
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
  resolve: {
    alias: {
      '@util': path.resolve(__dirname, 'src/util'),
      '@enums': path.resolve(__dirname, 'src/model/enums'),
      '@interfaces': path.resolve(__dirname, 'src/model/interfaces'),
    },
  },
});
