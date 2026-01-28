// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { authProvider } from '@lib/providers/auth-provider';

const LoginPage = authProvider.getLoginPage();

export default function Login() {
  return <LoginPage />;
}
