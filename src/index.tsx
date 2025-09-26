// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import 'reflect-metadata';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App, { authProvider } from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const init = async () => {
  const initialized = await authProvider.getInitialized();
  if (!initialized) {
    root.render(
      <div>Oops something went wrong during auth initialization</div>,
    );
  }
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

init().finally();
