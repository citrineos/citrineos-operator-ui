// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { z } from 'zod';

export const AuthProviderTypeEnum = z.enum(['keycloak', 'generic']);

export type AuthProviderType = z.infer<typeof AuthProviderTypeEnum>;
