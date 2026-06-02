// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { randomUUID } from 'node:crypto';

const E2E_PREFIX = 'e2e-';

export function shortId(): string {
  return `${E2E_PREFIX}${randomUUID().slice(0, 8)}`;
}

export function shortIdWithSuffix(suffix: string): string {
  return `${shortId()}-${suffix}`;
}

export function isE2eId(id: string): boolean {
  return id.startsWith(E2E_PREFIX);
}
