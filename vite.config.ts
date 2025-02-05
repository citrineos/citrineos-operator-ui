import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills(),
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
      '@dtos': path.resolve(__dirname, 'src/dtos'),
      '@util': path.resolve(__dirname, 'src/util'),
      '@enums': path.resolve(__dirname, 'src/model/enums'),
      '@interfaces': path.resolve(__dirname, 'src/model/interfaces'),
    },
  },
});
