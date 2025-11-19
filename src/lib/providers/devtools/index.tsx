// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  DevtoolsPanel,
  DevtoolsProvider as DevtoolsProviderBase,
} from '@refinedev/devtools';
import React from 'react';

export const DevtoolsProvider = (props: React.PropsWithChildren) => {
  return (
    <DevtoolsProviderBase>
      {props.children}
      <DevtoolsPanel />
    </DevtoolsProviderBase>
  );
};
