// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        process: false,
        Buffer: false,
      },
    }),
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
      '@OCPP2_0_1': path.resolve(__dirname, 'src/util/ocpp2_0_1_dependencies'),
      '@OCPP1_6': path.resolve(__dirname, 'src/util/ocpp1_6_dependencies'),
    },
  },
});
