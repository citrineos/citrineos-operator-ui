// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { CrudFilter } from '@refinedev/core';

export const NEW_IDENTIFIER = 'new';

export const EMPTY_FILTER: CrudFilter[] = [
  {
    operator: 'or',
    value: [],
  },
];
